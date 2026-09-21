"""
render_plates.py — the trace field, ported from design/plates/TraceField.dc.html to Pillow.

Renders the four wallpapers (batch 02) and the two boot plates (batch 03) at 1920 × 1080
from the token file and the design assets. No browser, no numpy: Pillow only, so the build
host needs python3-pil and nothing else. rsvg-convert is used when present for the two SVG
sponsor marks and the recoloured Kali dragon; without it those slots stay empty and a note is
printed.

Geometry is the plate's, verbatim: paths from the SVG, 112px margins, the 827 × 290 wordmark
block at x981 y336, the 720 × 460 SDDM reserve on the lock plate, the sponsor column at
x760–1808. Every colour is a token; the only literals in this file are positions and sizes.

Called by generate.py; can also run standalone:  python3 tokens/render_plates.py
"""
from __future__ import annotations

import glob
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DESIGN = ROOT / "design" / "plates"
OUT = ROOT / "packages" / "czd-wallpapers" / "rendered"

W, H = 1920, 1080
SS = 2                      # supersample factor for the line work
PANEL_Y = 1024              # every trace terminates here; the 56px strip is pure surface

# --- the trace field geometry, from TraceField.dc.html --------------------------------------
FAR_FIELD = [   # 1px, trace.gold.deep — the quiet zone
    "M 0 180 H 300 l 30 30 H 760", "M 0 420 H 180 l 30 -30 H 520 l 30 30 H 900",
    "M 0 660 H 420 l 30 30 H 700", "M 0 900 H 240 l 30 -30 H 640",
    "M 120 0 V 260 l 30 30 V 520", "M 380 1024 V 820 l -30 -30 V 560",
    "M 560 0 V 140 l 30 30 V 400", "M 0 300 H 90", "M 0 780 H 160 l 30 30 H 340",
    "M 700 1024 V 960 l 30 -30 H 880", "M 820 0 V 200",
]
LATTICE = [     # 1.5px, trace.gold.dim (full) or trace.gold.deep (dim level)
    "M 980 140 H 1400 l 28 28 H 1920", "M 1060 220 H 1520 l 28 -28 H 1920",
    "M 900 300 H 1180 l 28 28 H 1660 l 28 28 H 1920", "M 1240 380 H 1920",
    "M 1000 460 H 1320 l 28 28 H 1580 V 620 l 28 28 H 1920", "M 1140 540 H 1460",
    "M 880 620 H 1120 l 28 -28 H 1360", "M 1300 700 H 1700 l 28 28 H 1920",
    "M 960 780 H 1240 l 28 28 H 1520", "M 1420 860 H 1920",
    "M 1080 940 H 1380 l 28 -28 H 1640", "M 1180 0 V 240 l 28 28 V 480",
    "M 1340 1024 V 780 l -28 -28 V 560", "M 1500 60 V 300", "M 1620 1024 V 900",
    "M 1760 140 V 420 l 28 28 V 700", "M 1040 0 V 120", "M 1900 300 V 560", "M 1460 940 V 1024",
]
VIAS = [(1400, 140), (1520, 220), (1180, 300), (1660, 328), (1320, 460), (1580, 620), (1120, 620),
        (1700, 700), (1240, 780), (1380, 940), (1180, 240), (1760, 420)]          # r=4
PADS = [(1494, 294), (1614, 894), (1034, 114), (1894, 554), (1454, 934)]          # 12 × 12
ACTIVE = ["M 1160 360 H 1500 l 28 28 H 1840", "M 1020 1000 H 1300 l 28 -28 H 1560",
          "M 1720 480 V 720", "M 1240 620 H 1420"]                                 # 2px gold
ACTIVE_VIAS = [(1500, 360), (1840, 388), (1720, 480), (1420, 620), (1300, 1000)]  # r=5
SURGE_A = ("M 1160 360 H 1500 l 28 28 H 1840", 1160, 1840, 1.0)                    # 3px, gradient A
SURGE_B = ("M 1020 1000 H 1300 l 28 -28 H 1560", 1020, 1560, 0.85)                 # 3px, gradient B
SURGE_POSITION = 0.55

SPONSOR_TIERS = [   # (eyebrow, row height, [(file, mark height)])
    ("// TITLE SPONSOR", 124, [("segra.svg", 84)]),
    ("// ELITE PARTNER", 104, [("bizsolutions-trim.png", 72), ("kde-trim.png", 52), ("uc-tower-warm.svg", 68), ("vanguard-trim.png", 72)]),
    ("// SUPPORTING SPONSOR", 120, [("cavg-trim.png", 112), ("hcai-trim.png", 116), ("iotemy-trim.png", 116), ("mcw-trim.png", 116)]),
    ("// COMMUNITY ADVOCATE", 100, [("hcc-trim.png", 96), ("prov-trim.png", 96), ("wvbf-trim.png", 72), ("wvng-trim.png", 96)]),
]


def parse_path(d: str) -> list[tuple[float, float]]:
    """M/H/V/l subset used by the plate → one polyline."""
    toks = d.replace(",", " ").split()
    pts: list[tuple[float, float]] = []
    x = y = 0.0
    i = 0
    while i < len(toks):
        c = toks[i]
        if c == "M":
            x, y = float(toks[i + 1]), float(toks[i + 2]); i += 3
        elif c == "H":
            x = float(toks[i + 1]); i += 2
        elif c == "V":
            y = float(toks[i + 1]); i += 2
        elif c == "l":
            x += float(toks[i + 1]); y += float(toks[i + 2]); i += 3
        else:
            raise ValueError(f"unsupported path command {c!r} in {d!r}")
        pts.append((x, y))
    return pts


class Renderer:
    def __init__(self, tokens):
        try:
            from PIL import Image, ImageChops, ImageDraw, ImageFont  # noqa: F401
        except ImportError as e:
            raise RuntimeError("Pillow (python3-pil) is required to render the plates") from e
        self.t = tokens
        self.notes: list[str] = []
        self.fonts_dir = self._find_fonts()
        self.rsvg = shutil.which("rsvg-convert")
        if not self.rsvg:
            self.notes.append("rsvg-convert not found: SVG sponsor marks and the Kali dragon are left empty")

    # --- helpers -------------------------------------------------------------------------------
    def _find_fonts(self) -> Path:
        hits = glob.glob(str(DESIGN / "_ds" / "*" / "assets" / "fonts"))
        if not hits:
            raise RuntimeError("design font bundle not found under design/plates/_ds/*/assets/fonts")
        return Path(hits[0])

    def rgb(self, path): return self.t.rgb(path)

    def font(self, family: str, size: int, weight: int):
        from PIL import ImageFont
        if family == "ui":
            f = ImageFont.truetype(str(self.fonts_dir / "Archivo-Variable.ttf"), size)
            try:
                f.set_variation_by_axes([weight])
            except Exception:
                pass
            return f
        name = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold"}[weight]
        return ImageFont.truetype(str(self.fonts_dir / f"IBMPlexMono-{name}.ttf"), size)

    def text_width(self, font, text: str, tracking: float) -> float:
        return sum(font.getlength(ch) for ch in text) + tracking * max(0, len(text) - 1)

    def draw_text(self, draw, xy, text, font, fill, tracking=0.0, align="left"):
        """Per-glyph placement so letter-spacing matches the CSS em tracking."""
        x, y = xy
        w = self.text_width(font, text, tracking)
        if align == "right":
            x -= w
        elif align == "center":
            x -= w / 2
        for ch in text:
            draw.text((x, y), ch, font=font, fill=fill)
            x += font.getlength(ch) + tracking
        return w

    def svg_png(self, svg: Path, height: int, recolor: str | None = None):
        """Rasterise an SVG to a given height with rsvg-convert; None when unavailable."""
        from PIL import Image
        if not self.rsvg or not svg.exists():
            return None
        src = svg
        tmp = None
        if recolor:
            # kali-menu.svg is a gradient-filled rounded plate with the dragon knocked out in
            # white. The design wants the dragon alone: drop the plate (<rect>) and the
            # translucent highlight paths, then paint what is left in the recolour.
            text = svg.read_text(encoding="utf-8", errors="replace")
            text = re.sub(r"<rect\b[^>]*/>", "", text)
            text = re.sub(r"<(path|circle|ellipse|polygon)\b[^>]*opacity:\s*0?\.\d+[^>]*/>", "", text)
            text = re.sub(r'(fill|stroke)="(?!none)[^"]*"', rf'\1="{recolor}"', text)
            text = re.sub(r'(fill|stroke):\s*(?!none)[^;"]+', rf"\1:{recolor}", text)
            tmp = tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False, encoding="utf-8")
            tmp.write(text); tmp.close()
            src = Path(tmp.name)
        out = tempfile.NamedTemporaryFile(suffix=".png", delete=False); out.close()
        try:
            subprocess.run([self.rsvg, "-h", str(height), "-o", out.name, str(src)], check=True, capture_output=True)
            img = Image.open(out.name).convert("RGBA")
            img.load()
            return img
        except Exception as e:  # pragma: no cover
            self.notes.append(f"rsvg-convert failed on {svg.name}: {e}")
            return None
        finally:
            os.unlink(out.name)
            if tmp:
                os.unlink(tmp.name)

    def raster(self, path: Path, height: int):
        from PIL import Image
        if path.suffix.lower() == ".svg":
            return self.svg_png(path, height)
        if not path.exists():
            self.notes.append(f"missing asset {path.name}")
            return None
        img = Image.open(path).convert("RGBA")
        w = round(img.width * height / img.height)
        return img.resize((w, height), Image.LANCZOS)

    # --- the field ----------------------------------------------------------------------------
    def field(self, level: str, vignette: str, surge: bool):
        """The trace field on surface.base: far field, lattice, vias/pads, active runs, surge, vignette."""
        from PIL import Image, ImageChops, ImageDraw
        base = self.rgb("surface.base")
        deep = self.rgb("trace.gold.deep")
        dim = self.rgb("trace.gold.dim")
        gold = self.rgb("trace.gold")
        surge_c = self.rgb("trace.gold.surge")
        lattice = dim if level == "full" else deep

        big = Image.new("RGBA", (W * SS, H * SS), (*base, 255))
        d = ImageDraw.Draw(big)
        s = lambda pts: [(x * SS, y * SS) for x, y in pts]

        for p in FAR_FIELD:
            d.line(s(parse_path(p)), fill=(*deep, 255), width=1 * SS, joint="curve")
        for p in LATTICE:
            d.line(s(parse_path(p)), fill=(*lattice, 255), width=round(1.5 * SS), joint="curve")
        for cx, cy in VIAS:
            r = 4 * SS
            d.ellipse([cx * SS - r, cy * SS - r, cx * SS + r, cy * SS + r], fill=(*lattice, 255))
        for x, y in PADS:
            d.rectangle([x * SS, y * SS, (x + 12) * SS, (y + 12) * SS], outline=(*lattice, 255), width=round(1.5 * SS))

        if level == "full":
            for p in ACTIVE:
                d.line(s(parse_path(p)), fill=(*gold, 255), width=2 * SS, joint="curve")
            for cx, cy in ACTIVE_VIAS:
                r = 5 * SS
                d.ellipse([cx * SS - r, cy * SS - r, cx * SS + r, cy * SS + r], fill=(*gold, 255))

        if surge and level == "full":
            for path, x1, x2, peak in (SURGE_A, SURGE_B):
                layer = Image.new("RGBA", big.size, (0, 0, 0, 0))
                ld = ImageDraw.Draw(layer)
                ld.line(s(parse_path(path)), fill=(*surge_c, 255), width=3 * SS, joint="curve")
                # gradient stops from the plate: centre p (or 1 - 0.85p), half-width 0.14 (0.18)
                if path is SURGE_A[0]:
                    c, hw = SURGE_POSITION, 0.14
                else:
                    c, hw = 1 - SURGE_POSITION * 0.85, 0.18
                a, b, cc = max(0, c - hw), c, min(1, c + hw)
                mask_row = []
                for px in range(W * SS):
                    u = (px / SS - x1) / (x2 - x1)
                    if u <= a or u >= cc:
                        v = 0.0
                    elif u <= b:
                        v = (u - a) / (b - a) if b > a else 1.0
                    else:
                        v = (cc - u) / (cc - b) if cc > b else 1.0
                    mask_row.append(int(255 * peak * v))
                mask = Image.new("L", (W * SS, 1))
                mask.putdata(mask_row)
                mask = mask.resize(big.size, Image.NEAREST)
                layer.putalpha(ImageChops.multiply(layer.getchannel("A"), mask))
                big.alpha_composite(layer)

        img = big.resize((W, H), Image.LANCZOS)

        # vignette: rgba(surface.inset, a) as a radial ellipse — computed at 1/4 scale, then upscaled
        inset = self.rgb("surface.inset")
        if vignette == "standard":
            cx, cy, rx, ry = 0.66, 0.46, 0.70, 0.75
            stops = [(0.0, 0.0), (0.62, 0.45), (1.0, 0.90)]
        else:
            cx, cy, rx, ry = 0.50, 0.46, 0.52, 0.58
            stops = [(0.0, 0.35), (0.55, 0.78), (1.0, 0.97)]
        sw, sh = W // 4, H // 4
        vals = []
        for py in range(sh):
            for px in range(sw):
                u = ((px + 0.5) / sw - cx) / rx
                v = ((py + 0.5) / sh - cy) / ry
                r = min(1.0, math.hypot(u, v))
                for (r0, a0), (r1, a1) in zip(stops, stops[1:]):
                    if r <= r1:
                        a = a0 + (a1 - a0) * (r - r0) / (r1 - r0)
                        break
                else:
                    a = stops[-1][1]
                vals.append(int(255 * a))
        vmask = Image.new("L", (sw, sh))
        vmask.putdata(vals)
        vmask = vmask.resize((W, H), Image.BICUBIC)
        overlay = Image.new("RGBA", (W, H), (*inset, 255))
        overlay.putalpha(vmask)
        img.alpha_composite(overlay)

        # the panel strip: pure surface.base below y=1024 on every wallpaper
        ImageDraw.Draw(img).rectangle([0, PANEL_Y, W, H], fill=(*base, 255))
        return img

    # --- blocks ---------------------------------------------------------------------------------
    def wordmark_block(self, img, top: int, dated: bool):
        """Right-aligned block, 827 wide, x981→1808: lockup 76 → 2px rule → Archivo 700 136 → mono sub."""
        from PIL import ImageDraw
        d = ImageDraw.Draw(img)
        left, right = 981, 1808
        gold, pri, sec = self.rgb("trace.gold"), self.rgb("text.primary"), self.rgb("text.secondary")
        y = top
        lockup = self.raster(DESIGN / "assets" / "czd-lockup-gold.png", 76)
        if lockup is not None:
            img.alpha_composite(lockup, (right - lockup.width, y))
        y += 76 + 24
        d.rectangle([left, y, right, y + 1], fill=(*gold, 255))
        y += 2 + 24
        f = self.font("ui", 136, 700)
        self.draw_text(d, (right, y - 14), self.t["$meta.wordmark_spelling"], f, (*pri, 255), tracking=-0.035 * 136, align="right")
        y += round(136 * 0.86) + 24
        f = self.font("mono", 24, 600)
        self.draw_text(d, (right, y), "A KALI PURPLE RESPIN · KDE PLASMA 6", f, (*gold, 255), tracking=0.14 * 24, align="right")
        y += 24
        if dated:
            y += 32
            rule = (*gold, round(255 * 0.26))
            d.rectangle([left, y, right, y], fill=rule)
            y += 1 + 32
            f = self.font("mono", 32, 700)
            self.draw_text(d, (right, y), self.t["event.date_line"], f, (*pri, 255), tracking=0.14 * 32, align="right")
            y += 32 + 16
            f = self.font("mono", 22, 400)
            self.draw_text(d, (right, y), self.t["event.venue"].upper(), f, (*sec, 255), tracking=0.14 * 22, align="right")
            y += 22 + 12
            self.draw_text(d, (right, y), f"{self.t['event.site'].upper()} · {self.t['event.hashtag']}", f, (*gold, 255), tracking=0.14 * 22, align="right")
        return img

    def dragon(self, img):
        """Kali's dragon, recoloured to trace.gold.dim, 64px at right 112 / bottom 132. Never redrawn."""
        src = Path("/usr/share/icons/hicolor/scalable/apps/kali-menu.svg")
        if not src.exists():
            self.notes.append("kali-menu.svg not on this host: dragon slot left empty (build on Kali to fill it)")
            return img
        mark = self.svg_png(src, 64, recolor=self.t.hex("trace.gold.dim"))
        if mark is not None:
            img.alpha_composite(mark, (1808 - mark.width, 1080 - 132 - 64))
        return img

    def corner_identity(self, img, x=112, y=112, size=56):
        from PIL import ImageDraw
        d = ImageDraw.Draw(img)
        gold, pri = self.rgb("trace.gold"), self.rgb("text.primary")
        f = self.font("ui", size, 700)
        self.draw_text(d, (x, y - 6), self.t["$meta.wordmark_spelling"], f, (*pri, 255), tracking=-0.015 * size)
        ry = y + size + 8
        d.rectangle([x, ry, x + 420, ry + 1], fill=(*gold, 255))
        f = self.font("mono", 24, 600)
        self.draw_text(d, (x, ry + 2 + 24), "A KALI PURPLE RESPIN · KDE PLASMA 6", f, (*gold, 255), tracking=0.14 * 24)

    def lock_corners(self, img):
        from PIL import ImageDraw
        d = ImageDraw.Draw(img)
        gold, sec = self.rgb("trace.gold"), self.rgb("text.secondary")
        self.corner_identity(img)
        mark = self.raster(DESIGN / "assets" / "czd-mark-gold.png", 40)
        if mark is not None:
            img.alpha_composite(mark, (112, 1080 - 112 - 40 - 10))
        f = self.font("mono", 24, 500)
        tx = 196
        self.draw_text(d, (tx, 1080 - 112 - 24 - 34), f"CHARLESTON ZERO DAY · {self.t['event.date_line']}", f, (*sec, 255), tracking=0.14 * 24)
        self.draw_text(d, (tx, 1080 - 112 - 24), self.t["event.site"].upper(), f, (*gold, 255), tracking=0.14 * 24)
        self.draw_text(d, (1808, 1080 - 112 - 24 - 34), f"BUILD {self.t['build.tag_upper']} · KALI-PURPLE", f, (*sec, 255), tracking=0.14 * 24, align="right")
        self.draw_text(d, (1808, 1080 - 112 - 24), "NO PASSWORD. ASSUME IT IS HOSTILE.", f, (*sec, 255), tracking=0.14 * 24, align="right")

    def sponsors(self, img):
        from PIL import ImageDraw
        d = ImageDraw.Draw(img)
        gold, pri = self.rgb("trace.gold"), self.rgb("text.primary")
        # identity, top-left, with the support line
        f = self.font("ui", 56, 700)
        self.draw_text(d, (112, 112 - 6), self.t["$meta.wordmark_spelling"], f, (*pri, 255), tracking=-0.015 * 56)
        f = self.font("mono", 24, 600)
        self.draw_text(d, (112, 112 + 56 + 16), f"BUILT WITH SUPPORT FROM · {self.t['event.hashtag']}", f, (*gold, 255), tracking=0.14 * 24)
        left, right = 760, 1808
        y = 88
        fe = self.font("mono", 24, 700)
        rule = (*gold, round(255 * 0.26))
        for eyebrow, row_h, marks in SPONSOR_TIERS:
            imgs = [m for m in (self.raster(DESIGN / "assets" / "sponsors" / fn, h) for fn, h in marks) if m is not None]
            if not imgs:
                continue                                    # a tier with zero marks drops entirely
            self.draw_text(d, (left, y), eyebrow, fe, (*gold, 255), tracking=0.14 * 24)
            y += 24 + 16
            d.rectangle([left, y, right, y], fill=rule)
            y += 1 + 20
            # marks spread across the full column, centred in the row
            total = sum(m.width for m in imgs)
            gap = (right - left - total) / (len(imgs) + 1)
            x = left + gap
            for m in imgs:
                img.alpha_composite(m, (round(x), round(y + (row_h - m.height) / 2)))
                x += m.width + gap
            y += row_h + 18
        if y > PANEL_Y:
            self.notes.append(f"sponsor stack ends at y={y}, below the panel line")

    # --- plates ---------------------------------------------------------------------------------
    def render_all(self, dated_default: bool = False) -> dict[str, Path]:
        OUT.mkdir(parents=True, exist_ok=True)
        out: dict[str, Path] = {}

        img = self.field("full", "standard", surge=True)
        self.wordmark_block(img, 336, dated=False)
        self.dragon(img)
        out["wallpaper-default"] = self._save(img, "wallpaper-default.png")

        img = self.field("full", "standard", surge=True)
        self.wordmark_block(img, 236, dated=True)
        self.dragon(img)
        out["wallpaper-event"] = self._save(img, "wallpaper-event.png")

        img = self.field("full", "standard", surge=False)
        self.sponsors(img)
        out["wallpaper-sponsors"] = self._save(img, "wallpaper-sponsors.png")

        img = self.field("dim", "heavy", surge=False)
        self.lock_corners(img)
        out["wallpaper-lock"] = self._save(img, "wallpaper-lock.png")

        # boot plates: the same family, no type — GRUB and Plymouth draw their own
        out["plate-grub"] = self._save(self.field("dim", "standard", surge=False), "plate-grub.png")
        out["plate-plymouth"] = self._save(self.field("dim", "heavy", surge=False), "plate-plymouth.png")
        return out

    def _save(self, img, name: str) -> Path:
        p = OUT / name
        img.convert("RGB").save(p, "PNG", optimize=True)
        return p


def render(tokens) -> dict[str, Path]:
    r = Renderer(tokens)
    out = r.render_all()
    for n in r.notes:
        print(f"render_plates: {n}", file=sys.stderr)
    return out


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import json
    from generate import TOKENS, Tokens
    data = json.loads(TOKENS.read_text(encoding="utf-8"))
    for k, v in render(Tokens(data, data["$meta"]["version_string"])).items():
        print(k, v.relative_to(ROOT).as_posix())
