#!/usr/bin/env python3
"""
generate.py — the only place a CZD colour becomes a file.

Reads tokens/czd-purple-tokens.json and writes build products into
packages/<name>/generated/…  (git-ignored). Two mechanisms:

  1. Templates.  Any file under packages/<name>/templates/** is copied to
     packages/<name>/generated/** with {{ token.path }} placeholders replaced.
     Placeholders may carry filters:  {{ trace.gold | rgba:0.26 }}
     Committed sources therefore contain no hex — that is repo rule 2, and
     `make check` proves it with a grep.

  2. Generators.  The toolkit files whose structure is a loop over the sixteen
     ANSI slots (Konsole, GTK, Xresources, vim, Kvantum, KDE colour scheme) are
     produced by the functions at the bottom of this file. They read tokens
     by path; there is no colour literal anywhere in this script.

Usage:
  python3 tokens/generate.py                 # uses $meta.version_string as the build string
  python3 tokens/generate.py --tag czd-2026-10-231
  python3 tokens/generate.py --list          # show every output path and exit
  python3 tokens/generate.py --clean         # remove packages/*/generated

The --tag value must equal $meta.version_string (case-insensitive) unless
--force is given; rule 4 says the tag is the build string and nothing sets it
by hand, so a mismatch is a stop.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "tokens" / "czd-purple-tokens.json"
PACKAGES = ROOT / "packages"

PLACEHOLDER = re.compile(r"\{\{\s*([\w$][\w.$-]*)\s*((?:\|\s*[\w]+(?::[^|}\s]+)?\s*)*)\}\}")


# ----------------------------------------------------------------------------
# token access
# ----------------------------------------------------------------------------
class Tokens:
    def __init__(self, data: dict, build_tag: str):
        self.data = data
        self.flat: dict[str, str] = {}
        self._flatten("", data)
        self.flat["build.tag"] = build_tag
        self.flat["build.tag_upper"] = build_tag.upper()
        self.flat["build.year"] = str(data["event"]["year"])
        self.flat["event.date_line"] = self.date_line()
        self.flat["event.date_line_short"] = self.date_line(short=True)
        self.flat["event.dates_iso"] = f'{data["event"]["start"]} – {data["event"]["end"]}'

    def _flatten(self, prefix: str, node):
        if isinstance(node, dict):
            if "hex" in node:
                self.flat[prefix] = node["hex"]
            for k, v in node.items():
                key = f"{prefix}.{k}" if prefix else k
                self._flatten(key, v)
        elif isinstance(node, list):
            self.flat[prefix] = " ".join(str(x) for x in node)
            for i, v in enumerate(node):
                self._flatten(f"{prefix}.{i}", v)
        else:
            self.flat[prefix] = str(node)

    def __getitem__(self, path: str) -> str:
        try:
            return self.flat[path]
        except KeyError:
            raise KeyError(f"unknown token path: {path}") from None

    def hex(self, path: str) -> str:
        v = self[path]
        if not re.fullmatch(r"#[0-9A-Fa-f]{6}", v):
            raise ValueError(f"{path} is not a hex colour: {v!r}")
        return v.upper()

    def rgb(self, path: str) -> tuple[int, int, int]:
        h = self.hex(path).lstrip("#")
        return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)

    def date_line(self, short: bool = False) -> str:
        """FRI OCT 02 – SAT OCT 03, 2026  (design-system date format)."""
        s = dt.date.fromisoformat(self.data["event"]["start"])
        e = dt.date.fromisoformat(self.data["event"]["end"])
        f = lambda d: d.strftime("%a %b %d").upper()
        if short:
            return f"{f(s)} – {f(e)}"
        return f"{f(s)} – {f(e)}, {e.year}"


# ----------------------------------------------------------------------------
# filters for templates
# ----------------------------------------------------------------------------
def apply_filter(tokens: Tokens, path: str, name: str, arg: str | None) -> str:
    if name == "raw":
        return tokens[path]
    if name == "rgb":                       # 224,168,46
        return ",".join(map(str, tokens.rgb(path)))
    if name == "rgb_css":                   # rgb(224,168,46)
        return "rgb(%d,%d,%d)" % tokens.rgb(path)
    if name == "rgba":                      # rgba(224,168,46,0.26)
        return "rgba(%d,%d,%d,%s)" % (*tokens.rgb(path), arg or "1")
    if name == "floats":                    # 0.878, 0.659, 0.180   (plymouth script)
        return ", ".join("%.3f" % (c / 255) for c in tokens.rgb(path))
    if name == "qrgba":                     # Qt.rgba(0.878,0.659,0.180,0.26)  (QML)
        r, g, b = (c / 255 for c in tokens.rgb(path))
        return "Qt.rgba(%.3f,%.3f,%.3f,%s)" % (r, g, b, arg or "1")
    if name == "argb":                      # #42E0A82E  (QML/Qt hex with alpha, arg = 0..1)
        a = round(float(arg or "1") * 255)
        return "#%02X%s" % (a, tokens.hex(path).lstrip("#"))
    if name == "lower":
        return tokens[path].lower()
    if name == "upper":
        return tokens[path].upper()
    if name == "nohash":
        return tokens.hex(path).lstrip("#")
    if name == "int":                       # strip px/em units
        return re.sub(r"[^\d.-]", "", tokens[path])
    raise ValueError(f"unknown filter {name!r}")


def render(text: str, tokens: Tokens, where: str) -> str:
    def sub(m: re.Match) -> str:
        path, chain = m.group(1), m.group(2) or ""
        value = tokens[path]
        for f in re.findall(r"\|\s*([\w]+)(?::([^|}\s]+))?", chain):
            value = apply_filter(tokens, path, f[0], f[1] or None) if f[0] != "raw" else value
        return value

    try:
        return PLACEHOLDER.sub(sub, text)
    except (KeyError, ValueError) as e:
        raise SystemExit(f"{where}: {e}")


# ----------------------------------------------------------------------------
# file helpers
# ----------------------------------------------------------------------------
class Out:
    def __init__(self, dry: bool):
        self.dry = dry
        self.written: list[Path] = []

    def write(self, pkg: str, rel: str, content: str, mode: int = 0o644):
        p = PACKAGES / pkg / "generated" / rel
        self.written.append(p)
        if self.dry:
            return
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8", newline="\n")
        os.chmod(p, mode)

    def write_bytes(self, pkg: str, rel: str, data: bytes):
        p = PACKAGES / pkg / "generated" / rel
        self.written.append(p)
        if self.dry:
            return
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)

    def copy(self, pkg: str, rel: str, src: Path):
        p = PACKAGES / pkg / "generated" / rel
        self.written.append(p)
        if self.dry:
            return
        p.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, p)


def render_templates(tokens: Tokens, out: Out):
    for pkg in sorted(p for p in PACKAGES.iterdir() if p.is_dir()):
        tdir = pkg / "templates"
        if not tdir.is_dir():
            continue
        for src in sorted(tdir.rglob("*")):
            if src.is_dir():
                continue
            rel = src.relative_to(tdir).as_posix()
            if src.suffix.lower() in {".png", ".jpg", ".ttf", ".otf", ".woff2", ".pf2", ".gz"}:
                out.copy(pkg.name, rel, src)
                continue
            text = src.read_text(encoding="utf-8")
            out.write(pkg.name, rel, render(text, tokens, str(src)), src.stat().st_mode & 0o777 or 0o644)


# ----------------------------------------------------------------------------
# generators — the six toolkit files, the KDE colour scheme, the token drop
# ----------------------------------------------------------------------------
SLOTS = [f"{i:02d}" for i in range(16)]


def gen_tokens_package(t: Tokens, out: Out):
    out.copy("czd-purple-tokens", "usr/share/czd/czd-purple-tokens.json", TOKENS)
    out.write("czd-purple-tokens", "usr/share/czd/build-string", t["build.tag"] + "\n")
    # Shell-sourceable and CSS forms, for scripts and any web surface that must match.
    sh = ["# generated by tokens/generate.py — do not edit"]
    css = [":root {"]
    for path, val in sorted(t.flat.items()):
        if re.fullmatch(r"#[0-9A-Fa-f]{6}", val) and not path.endswith(".hex"):
            name = re.sub(r"[^A-Za-z0-9]+", "_", path).upper()
            sh.append(f"CZD_{name}={val}")
            css.append(f"  --czd-{re.sub(r'[^A-Za-z0-9]+', '-', path).lower()}: {val};")
    sh.append(f"CZD_BUILD_TAG={t['build.tag']}")
    css.append("}")
    out.write("czd-purple-tokens", "usr/share/czd/tokens.sh", "\n".join(sh) + "\n")
    out.write("czd-purple-tokens", "usr/share/czd/tokens.css", "\n".join(css) + "\n")


def gen_konsole(t: Tokens, out: Out):
    rgb = lambda p: ",".join(map(str, t.rgb(p)))
    L = []
    L += ["[Background]", f"Color={rgb('ansi.background')}", ""]
    L += ["[BackgroundIntense]", f"Color={rgb('ansi.background')}", ""]
    L += ["[BackgroundFaint]", f"Color={rgb('ansi.background')}", ""]
    for i in range(8):
        L += [f"[Color{i}]", f"Color={rgb(f'ansi.{i:02d}')}", ""]
        L += [f"[Color{i}Intense]", f"Color={rgb(f'ansi.{i + 8:02d}')}", ""]
        L += [f"[Color{i}Faint]", f"Color={rgb(f'ansi.{i:02d}')}", ""]
    L += ["[Foreground]", f"Color={rgb('ansi.foreground')}", ""]
    L += ["[ForegroundIntense]", f"Color={rgb('text.primary')}", ""]
    L += ["[ForegroundFaint]", f"Color={rgb('text.secondary')}", ""]
    L += ["[General]",
          "Description=CZD Purple",
          "Opacity=1",
          "Blur=false",
          "Wallpaper=",
          "ColorRandomization=false",
          "Anchor=0.5,0.5",
          "FillStyle=Tile", ""]
    out.write("czd-terminal-profiles", "usr/share/konsole/czd-purple.colorscheme", "\n".join(L))

    pt = t["terminal.font_pt"]
    lh = float(t["terminal.line_height"])
    px = float(pt) * 96 / 72
    extra = max(0, round(px * lh - px))
    P = [
        "[Appearance]",
        "ColorScheme=czd-purple",
        f"Font={t['font.mono.family']},{pt},-1,5,400,0,0,0,0,0,0,0,0,0,0,1",
        f"LineSpacing={extra}",
        "UseFontLineChararacters=false",
        "",
        "[Cursor Options]",
        "CursorShape=0",
        "BlinkingCursor=false",
        "UseCustomCursorColor=true",
        f"CustomCursorColor={rgb('ansi.cursor')}",
        "",
        "[General]",
        "Name=CZD",
        "Parent=FALLBACK/",
        f"TerminalMargin={t['terminal.padding_px']}",
        "TerminalCenter=false",
        "ShowTerminalSizeHint=false",
        "DimWhenInactive=false",
        "",
        "[Scrolling]",
        "ScrollBarPosition=1",
        "HistoryMode=1",
        "",
        "[Terminal Features]",
        "BellMode=2",
        "BlinkingTextEnabled=false",
        "FlowControlEnabled=false",
        "",
    ]
    out.write("czd-terminal-profiles", "usr/share/konsole/CZD.profile", "\n".join(P))


def gen_gtk(t: Tokens, out: Out):
    gold = t.hex("trace.gold")
    rgba = lambda p, a: "rgba(%d,%d,%d,%s)" % (*t.rgb(p), a)
    defs = {
        # GTK3 Adwaita / GTK4 libadwaita named colours
        "window_bg_color": t.hex("surface.base"),
        "window_fg_color": t.hex("text.primary"),
        "view_bg_color": t.hex("surface.inset"),
        "view_fg_color": t.hex("text.primary"),
        "headerbar_bg_color": t.hex("surface.raised"),
        "headerbar_fg_color": t.hex("text.primary"),
        "headerbar_border_color": rgba("trace.gold", 0.26),
        "headerbar_backdrop_color": t.hex("surface.inset"),
        "popover_bg_color": t.hex("surface.overlay"),
        "popover_fg_color": t.hex("text.primary"),
        "dialog_bg_color": t.hex("surface.raised"),
        "dialog_fg_color": t.hex("text.primary"),
        "card_bg_color": t.hex("surface.raised"),
        "card_fg_color": t.hex("text.primary"),
        "sidebar_bg_color": t.hex("surface.raised"),
        "sidebar_fg_color": t.hex("text.primary"),
        "accent_bg_color": t.hex("selection.bg.emphasis"),
        "accent_fg_color": t.hex("selection.fg.emphasis"),
        "accent_color": gold,
        "destructive_bg_color": gold,
        "destructive_fg_color": t.hex("selection.fg.emphasis"),
        "destructive_color": gold,
        "success_bg_color": t.hex("state.success"),
        "success_fg_color": t.hex("surface.base"),
        "success_color": t.hex("state.success"),
        "warning_bg_color": t.hex("state.warning"),
        "warning_fg_color": t.hex("surface.base"),
        "warning_color": t.hex("state.warning"),
        "error_bg_color": t.hex("state.error"),
        "error_fg_color": t.hex("text.primary"),
        "error_color": t.hex("state.error"),
        "borders": rgba("trace.gold", 0.26),
        "unfocused_borders": rgba("trace.gold", 0.13),
        # legacy GTK3 names
        "theme_bg_color": t.hex("surface.base"),
        "theme_fg_color": t.hex("text.primary"),
        "theme_base_color": t.hex("surface.inset"),
        "theme_text_color": t.hex("text.primary"),
        "theme_selected_bg_color": t.hex("selection.bg"),
        "theme_selected_fg_color": t.hex("selection.fg"),
        "theme_unfocused_bg_color": t.hex("surface.base"),
        "theme_unfocused_fg_color": t.hex("text.secondary"),
        "theme_unfocused_base_color": t.hex("surface.inset"),
        "theme_unfocused_text_color": t.hex("text.secondary"),
        "theme_unfocused_selected_bg_color": t.hex("selection.bg"),
        "theme_unfocused_selected_fg_color": t.hex("selection.fg"),
        "insensitive_bg_color": t.hex("surface.base"),
        "insensitive_fg_color": t.hex("text.disabled"),
        "insensitive_base_color": t.hex("surface.inset"),
        "link_color": gold,
        "visited_link_color": t.hex("trace.gold.dim"),
        "wm_title": t.hex("text.primary"),
        "wm_unfocused_title": t.hex("text.disabled"),
        "wm_bg": t.hex("surface.raised"),
        "wm_unfocused_bg": t.hex("surface.inset"),
        "wm_border": rgba("trace.gold", 0.26),
        "wm_unfocused_border": rgba("trace.gold", 0.13),
    }
    head = ["/* czd-purple — generated by tokens/generate.py from czd-purple-tokens.json. Do not edit. */", ""]
    head += [f"@define-color {k} {v};" for k, v in defs.items()]
    sb = t["terminal.scrollbar.width_px"]
    body = f"""
/* --- geometry: zero radius, zero shadow, hairline borders --------------- */
* {{
  border-radius: 0;
  -gtk-outline-radius: 0;
  outline-offset: 2px;
  outline: 1px solid {gold};
  outline-width: 0;
  box-shadow: none;
  text-shadow: none;
  -gtk-icon-shadow: none;
}}
*:focus-visible, *:focus {{ outline-width: 1px; }}

window, .background {{ background-color: @window_bg_color; color: @window_fg_color; }}
headerbar, .titlebar {{
  min-height: {t['shell.titlebar_height_px']}px;
  padding: 0 12px;
  background: @headerbar_bg_color;
  color: @headerbar_fg_color;
  border-bottom: 1px solid @headerbar_border_color;
  box-shadow: none;
}}
headerbar:backdrop, .titlebar:backdrop {{ background: @headerbar_backdrop_color; color: @insensitive_fg_color; }}
button {{
  background: @window_bg_color; color: @window_fg_color;
  border: 1px solid @borders; padding: 4px 12px; transition: none;
}}
button:hover {{ background: {rgba('trace.gold', 0.05)}; color: @window_fg_color; }}
button:active, button:checked {{ background: {rgba('trace.gold', 0.05)}; border-color: {gold}; }}
button.suggested-action, button.default {{ background: @accent_bg_color; color: @accent_fg_color; border-color: @accent_bg_color; }}
button.suggested-action:hover {{ background: {t.hex('trace.gold.surge')}; }}
button:disabled {{ color: @insensitive_fg_color; background: @window_bg_color; }}
entry {{ background: @view_bg_color; color: @view_fg_color; border: 1px solid @borders; padding: 6px 8px; }}
entry:focus {{ border-color: {gold}; }}
entry selection, textview text selection, treeview.view:selected, list row:selected, row:selected {{
  background-color: @theme_selected_bg_color; color: @theme_selected_fg_color;
}}
treeview.view, list, textview, textview text, .view {{ background: @view_bg_color; color: @view_fg_color; }}
treeview.view:hover, list row:hover, row:hover {{ background: {rgba('trace.gold', 0.05)}; }}
treeview.view header button {{ background: @headerbar_bg_color; border-bottom: 1px solid @borders; border-right: 1px solid @unfocused_borders; font-weight: 600; }}
separator {{ background: @unfocused_borders; min-width: 1px; min-height: 1px; }}
menu, .menu, popover, popover.background, .popup, tooltip, tooltip.background {{
  background: @popover_bg_color; color: @popover_fg_color; border: 1px solid @borders; box-shadow: none;
}}
menuitem:hover, modelbutton:hover {{ background: {rgba('trace.gold', 0.05)}; color: @window_fg_color; }}
notebook > header {{ background: @window_bg_color; border-bottom: 1px solid @borders; }}
notebook > header > tabs > tab {{ padding: 8px 16px; border-bottom: 1px solid transparent; }}
notebook > header > tabs > tab:checked {{ background: {rgba('trace.gold', 0.05)}; border-bottom: 1px solid {gold}; color: @window_fg_color; }}
checkbutton check, radiobutton radio {{
  background: @view_bg_color; border: 1px solid {gold}; min-width: 14px; min-height: 14px; -gtk-icon-source: none; color: transparent;
}}
checkbutton check:checked, radiobutton radio:checked {{ background: {gold}; box-shadow: inset 0 0 0 3px @view_bg_color; }}
switch {{ background: @view_bg_color; border: 1px solid {gold}; min-height: 24px; }}
switch:checked {{ background: {rgba('trace.gold', 0.05)}; }}
switch slider {{ background: {gold}; border: none; min-width: 20px; min-height: 20px; margin: 2px; }}
scale trough {{ background: {rgba('trace.gold', 0.26)}; min-height: 2px; border: none; }}
scale highlight {{ background: {gold}; min-height: 2px; }}
scale slider {{ background: {gold}; border: none; min-width: 16px; min-height: 16px; margin: -7px; }}
progressbar trough {{ background: {t.hex('trace.gold.deep')}; min-height: 2px; border: none; }}
progressbar progress {{ background: {gold}; min-height: 2px; border: none; }}
spinner {{ -gtk-icon-source: none; }}

/* --- scrollbars: the tell ---------------------------------------------- */
scrollbar {{ background: @view_bg_color; border: none; }}
scrollbar button {{ min-width: 0; min-height: 0; padding: 0; -gtk-icon-source: none; }}
scrollbar slider {{
  min-width: {sb}px; min-height: {sb}px; margin: 0; border: none; border-radius: 0;
  background: {rgba('trace.gold', 0.26)};
}}
scrollbar slider:hover {{ background: {rgba('trace.gold', 0.5)}; }}
scrollbar slider:active {{ background: {gold}; }}
scrollbar.vertical slider {{ min-width: {sb}px; }}
scrollbar.horizontal slider {{ min-height: {sb}px; }}
scrollbar.overlay-indicator {{ opacity: 1; }}

/* --- motion: none -------------------------------------------------------- */
* {{ transition: none; animation: none; }}
"""
    css = "\n".join(head) + body
    out.write("czd-terminal-profiles", "usr/share/themes/czd-purple/gtk-3.0/gtk.css", css)
    out.write("czd-terminal-profiles", "usr/share/themes/czd-purple/gtk-4.0/gtk.css", css)
    out.write("czd-terminal-profiles", "usr/share/themes/czd-purple/index.theme",
              "[Desktop Entry]\nType=X-GNOME-Metatheme\nName=CZD Purple\nComment=Charleston Zero Day GTK theme, generated from tokens\nEncoding=UTF-8\n\n[X-GNOME-Metatheme]\nGtkTheme=czd-purple\nMetacityTheme=czd-purple\nIconTheme=czd-purple\nCursorTheme=breeze_cursors\nButtonLayout=:minimize,maximize,close\n")
    # GTK4/libadwaita reads only the per-user gtk.css. The override lives in the CZD XDG tree and
    # /etc/profile.d/zz-czd-purple.sh (czd-purple-tokens) symlinks it into ~/.config once.
    out.write("czd-terminal-profiles", "etc/xdg/xdg-czd-purple/gtk-4.0/gtk.css", css)
    out.write("czd-terminal-profiles", "etc/xdg/xdg-czd-purple/gtk-3.0/gtk.css", css)


def gen_xresources(t: Tokens, out: Out):
    L = ["! czd-purple — generated by tokens/generate.py. Do not edit.",
         f"*.background: {t.hex('ansi.background')}",
         f"*.foreground: {t.hex('ansi.foreground')}",
         f"*.cursorColor: {t.hex('ansi.cursor')}",
         f"*.highlightColor: {t.hex('selection.bg')}",
         f"*.highlightTextColor: {t.hex('selection.fg')}"]
    for i, s in enumerate(SLOTS):
        L.append(f"*.color{i}: {t.hex(f'ansi.{s}')}")
    L += ["",
          f"XTerm*faceName: {t['font.mono.family']}",
          f"XTerm*faceSize: {t['terminal.font_pt']}",
          "XTerm*scrollBar: false",
          "XTerm*cursorBlink: false",
          "XTerm*visualBell: true",
          "XTerm*internalBorder: 24",
          "XTerm*termName: xterm-256color",
          f"URxvt*font: xft:{t['font.mono.family']}:size={t['terminal.font_pt']}",
          "URxvt*scrollBar: false",
          "URxvt*cursorBlink: false",
          "URxvt*internalBorder: 24",
          ""]
    out.write("czd-terminal-profiles", "etc/X11/Xresources/czd-purple", "\n".join(L))


def gen_vim(t: Tokens, out: Out):
    H = lambda p: t.hex(p)
    a = lambda s: t.hex(f"ansi.{s}")
    bg, fg = H("ansi.background"), H("ansi.foreground")
    base, raised, overlay = H("surface.base"), H("surface.raised"), H("surface.overlay")
    gold, dim, surge, deep = H("trace.gold"), H("trace.gold.dim"), H("trace.gold.surge"), H("trace.gold.deep")
    sec, dis = H("text.secondary"), H("text.disabled")

    def hi(group, guifg="NONE", guibg="NONE", gui="NONE", ctermfg="NONE", ctermbg="NONE"):
        return f"hi {group:<16} guifg={guifg:<8} guibg={guibg:<8} gui={gui:<10} ctermfg={ctermfg:<4} ctermbg={ctermbg:<4} cterm={gui}"

    L = [f'" czd-purple — generated by tokens/generate.py. Do not edit.',
         '" Sixteen slots from the batch-07 instrument palette; chrome from the surface and gold ramps.',
         "set background=dark",
         "hi clear",
         'if exists("syntax_on") | syntax reset | endif',
         'let g:colors_name = "czd-purple"',
         "",
         hi("Normal", fg, bg, "NONE", "15", "0"),
         hi("NonText", dis, "NONE", "NONE", "8"),
         hi("SpecialKey", dis, "NONE", "NONE", "8"),
         hi("Comment", a("08"), "NONE", "NONE", "8"),
         hi("Constant", a("05"), "NONE", "NONE", "5"),
         hi("String", a("02"), "NONE", "NONE", "2"),
         hi("Character", a("02"), "NONE", "NONE", "2"),
         hi("Number", a("13"), "NONE", "NONE", "13"),
         hi("Boolean", a("13"), "NONE", "NONE", "13"),
         hi("Identifier", a("04"), "NONE", "NONE", "4"),
         hi("Function", a("12"), "NONE", "NONE", "12"),
         hi("Statement", gold, "NONE", "NONE", "3"),
         hi("Keyword", gold, "NONE", "NONE", "3"),
         hi("Operator", sec, "NONE", "NONE", "7"),
         hi("PreProc", a("06"), "NONE", "NONE", "6"),
         hi("Type", a("14"), "NONE", "NONE", "14"),
         hi("Special", a("05"), "NONE", "NONE", "5"),
         hi("Delimiter", sec, "NONE", "NONE", "7"),
         hi("Underlined", gold, "NONE", "underline", "3"),
         hi("Todo", surge, "NONE", "bold", "11"),
         hi("Error", a("09"), "NONE", "NONE", "9"),
         hi("ErrorMsg", a("09"), "NONE", "NONE", "9"),
         hi("WarningMsg", gold, "NONE", "NONE", "3"),
         hi("Question", gold, "NONE", "NONE", "3"),
         hi("MoreMsg", a("10"), "NONE", "NONE", "10"),
         hi("Directory", a("12"), "NONE", "NONE", "12"),
         hi("Title", H("text.primary"), "NONE", "bold", "15"),
         hi("LineNr", dis, "NONE", "NONE", "8"),
         hi("CursorLineNr", gold, "NONE", "NONE", "3"),
         hi("CursorLine", "NONE", base, "NONE", "NONE", "0"),
         hi("CursorColumn", "NONE", base, "NONE", "NONE", "0"),
         hi("ColorColumn", "NONE", base, "NONE", "NONE", "0"),
         hi("SignColumn", dis, bg, "NONE", "8", "0"),
         hi("Visual", H("selection.fg"), H("selection.bg"), "NONE", "15", "3"),
         hi("Search", base, surge, "NONE", "0", "11"),
         hi("IncSearch", base, gold, "NONE", "0", "3"),
         hi("CurSearch", base, gold, "NONE", "0", "3"),
         hi("MatchParen", surge, "NONE", "bold", "11"),
         hi("StatusLine", H("text.primary"), raised, "NONE", "15", "0"),
         hi("StatusLineNC", dis, base, "NONE", "8", "0"),
         hi("VertSplit", dim, "NONE", "NONE", "3"),
         hi("WinSeparator", dim, "NONE", "NONE", "3"),
         hi("TabLine", sec, base, "NONE", "7", "0"),
         hi("TabLineSel", H("text.primary"), raised, "NONE", "15", "0"),
         hi("TabLineFill", "NONE", base, "NONE", "NONE", "0"),
         hi("Pmenu", H("text.primary"), overlay, "NONE", "15", "0"),
         hi("PmenuSel", H("selection.fg"), H("selection.bg"), "NONE", "15", "3"),
         hi("PmenuSbar", "NONE", bg, "NONE", "NONE", "0"),
         hi("PmenuThumb", "NONE", dim, "NONE", "NONE", "3"),
         hi("Folded", sec, base, "NONE", "7", "0"),
         hi("FoldColumn", dis, bg, "NONE", "8", "0"),
         hi("DiffAdd", a("02"), base, "NONE", "2", "0"),
         hi("DiffDelete", a("01"), base, "NONE", "1", "0"),
         hi("DiffChange", "NONE", base, "NONE", "NONE", "0"),
         hi("DiffText", surge, base, "bold", "11", "0"),
         hi("diffAdded", a("02"), "NONE", "NONE", "2"),
         hi("diffRemoved", a("01"), "NONE", "NONE", "1"),
         hi("SpellBad", a("09"), "NONE", "undercurl", "9"),
         hi("Conceal", dis, "NONE", "NONE", "8"),
         hi("Cursor", bg, gold, "NONE", "0", "3"),
         hi("lCursor", bg, gold, "NONE", "0", "3"),
         hi("QuickFixLine", "NONE", base, "NONE", "NONE", "0"),
         hi("WildMenu", H("selection.fg"), H("selection.bg"), "NONE", "15", "3"),
         hi("NormalFloat", H("text.primary"), overlay, "NONE", "15", "0"),
         hi("FloatBorder", gold, overlay, "NONE", "3", "0"),
         hi("DiagnosticError", a("09"), "NONE", "NONE", "9"),
         hi("DiagnosticWarn", gold, "NONE", "NONE", "3"),
         hi("DiagnosticInfo", a("12"), "NONE", "NONE", "12"),
         hi("DiagnosticHint", a("14"), "NONE", "NONE", "14"),
         "",
         '" Terminal palette (vim :terminal and neovim)',
         "let g:terminal_ansi_colors = [" + ", ".join(f'"{a(s)}"' for s in SLOTS) + "]",
         "if has('nvim')"]
    for i, s in enumerate(SLOTS):
        L.append(f'  let g:terminal_color_{i} = "{a(s)}"')
    L += ["endif", ""]
    text = "\n".join(L)
    out.write("czd-terminal-profiles", "usr/share/vim/vimfiles/colors/czd-purple.vim", text)
    out.write("czd-terminal-profiles", "usr/share/nvim/site/colors/czd-purple.vim", text)


def gen_kvantum(t: Tokens, out: Out):
    H = lambda p: t.hex(p)
    sb = t["terminal.scrollbar.width_px"]
    L = [
        "[%General]",
        "author=Charleston Zero Day",
        "comment=CZD Purple — generated by tokens/generate.py from czd-purple-tokens.json",
        "x11drag=all",
        "alt_mnemonic=true",
        "left_tabs=false",
        "attach_active_tab=true",
        "mirror_doc_tabs=true",
        "group_toolbar_buttons=false",
        "toolbar_item_spacing=0",
        "toolbar_interior_spacing=2",
        "spread_progressbar=true",
        "composite=true",
        "menu_shadow_depth=0",
        "tooltip_shadow_depth=0",
        "splitter_width=1",
        f"scroll_width={sb}",
        "scroll_arrows=false",
        "scroll_min_extent=36",
        "slider_width=2",
        "slider_handle_width=16",
        "slider_handle_length=16",
        "center_toolbar_handle=true",
        "check_size=16",
        "textless_progressbar=true",
        "progressbar_thickness=2",
        "menubar_mouse_tracking=true",
        "toolbutton_style=0",
        "double_click=false",
        "translucent_windows=false",
        "blurring=false",
        "popup_blurring=false",
        "vertical_spin_indicators=false",
        "spin_button_width=16",
        "fill_rubberband=false",
        "merge_menubar_with_toolbar=false",
        "small_icon_size=16",
        "large_icon_size=32",
        "button_icon_size=16",
        "toolbar_icon_size=22",
        "combo_as_lineedit=true",
        "animate_states=false",
        "button_contents_shift=false",
        "combo_menu=true",
        "hide_combo_checkboxes=true",
        "groupbox_top_label=true",
        "inline_spin_indicators=true",
        "joined_inactive_tabs=false",
        "layout_spacing=4",
        "layout_margin=8",
        "scrollbar_in_view=false",
        "transient_scrollbar=false",
        "transient_groove=false",
        "submenu_overlap=0",
        "tooltip_delay=-1",
        "tree_branch_line=true",
        "no_window_pattern=true",
        "opaque=kaffeine,kmplayer,subtitlecomposer,kdenlive,vlc,smplayer,smplayer2,avidemux,avidemux2_qt4,avidemux3_qt4,avidemux3_qt5,kamoso,QtCreator,VirtualBox,trojita,dragon,digikam",
        "reduce_window_opacity=0",
        "reduce_menu_opacity=0",
        "respect_DE=true",
        "scrollable_menu=true",
        "submenu_delay=0",
        "no_inactiveness=false",
        "click_behavior=0",
        "contrast=1.00",
        "dialog_button_layout=0",
        "drag_from_buttons=false",
        "shadowless_popup=true",
        "",
        "[GeneralColors]",
        f"window.color={H('surface.base')}",
        f"base.color={H('surface.inset')}",
        f"alt.base.color={H('surface.base')}",
        f"button.color={H('surface.base')}",
        f"light.color={H('surface.overlay')}",
        f"mid.light.color={H('surface.raised')}",
        f"dark.color={H('surface.inset')}",
        f"mid.color={H('surface.raised')}",
        f"highlight.color={H('selection.bg')}",
        f"inactive.highlight.color={H('trace.gold.deep')}",
        f"text.color={H('text.primary')}",
        f"window.text.color={H('text.primary')}",
        f"button.text.color={H('text.primary')}",
        f"disabled.text.color={H('text.disabled')}",
        f"tooltip.text.color={H('text.primary')}",
        f"highlight.text.color={H('selection.fg')}",
        f"link.color={H('trace.gold')}",
        f"link.visited.color={H('trace.gold.dim')}",
        f"progress.indicator.text.color={H('selection.fg.emphasis')}",
        "",
        "[Hacks]",
        "transparent_ktitle_label=true",
        "transparent_dolphin_view=false",
        "transparent_pcmanfm_sidepane=true",
        "blur_translucent=false",
        "transparent_menutitle=true",
        "respect_darkness=true",
        "kcapacitybar_as_progressbar=true",
        "force_size_grip=false",
        "iconless_pushbutton=false",
        "iconless_menu=false",
        "disabled_icon_opacity=100",
        "lxqtmainmenu_iconsize=22",
        "normal_default_pushbutton=false",
        "single_top_toolbar=true",
        "tint_on_mouseover=0",
        "transparent_arrow_button=true",
        "middle_click_scroll=false",
        "no_selection_tint=true",
        "centered_forms=false",
        "kinetic_scrolling=false",
        "scroll_jump_workaround=false",
        "",
    ]
    out.write("czd-plasma-theme", "usr/share/Kvantum/czd-purple/czd-purple.kvconfig", "\n".join(L))


def kde_color_blocks(t: Tokens) -> list[str]:
    """The [Colors:*], [ColorEffects:*] and [WM] sections shared by the .colors file, the Plasma
    desktop theme's colors file and the XDG kdeglobals override."""
    rgb = lambda p: ",".join(map(str, t.rgb(p)))
    gold, surge, dim = rgb("trace.gold"), rgb("trace.gold.surge"), rgb("trace.gold.dim")
    pri, sec, dis = rgb("text.primary"), rgb("text.secondary"), rgb("text.disabled")
    ok, warn, err = rgb("state.success"), rgb("state.warning"), rgb("state.error")

    def block(name, bg, alt, fg=pri, inactive=sec, active=gold):
        return [f"[Colors:{name}]",
                f"BackgroundNormal={bg}", f"BackgroundAlternate={alt}",
                f"ForegroundNormal={fg}", f"ForegroundInactive={inactive}", f"ForegroundActive={active}",
                f"ForegroundLink={gold}", f"ForegroundVisited={dim}",
                f"ForegroundNegative={err}", f"ForegroundNeutral={warn}", f"ForegroundPositive={ok}",
                f"DecorationFocus={gold}", f"DecorationHover={surge}", ""]

    L = []
    L += block("View", rgb("surface.inset"), rgb("surface.base"))
    L += block("Window", rgb("surface.base"), rgb("surface.raised"))
    L += block("Button", rgb("surface.base"), rgb("surface.raised"))
    L += block("Selection", rgb("selection.bg"), rgb("trace.gold.deep"), fg=rgb("selection.fg"), inactive=rgb("selection.fg"), active=surge)
    L += block("Tooltip", rgb("surface.overlay"), rgb("surface.raised"))
    L += block("Complementary", rgb("surface.raised"), rgb("surface.inset"))
    L += block("Header", rgb("surface.raised"), rgb("surface.inset"))
    L += ["[Colors:Header][Inactive]",
          f"BackgroundNormal={rgb('surface.inset')}", f"BackgroundAlternate={rgb('surface.base')}",
          f"ForegroundNormal={dis}", f"ForegroundInactive={dis}", f"ForegroundActive={dis}",
          f"ForegroundLink={dim}", f"ForegroundVisited={dim}",
          f"ForegroundNegative={err}", f"ForegroundNeutral={warn}", f"ForegroundPositive={ok}",
          f"DecorationFocus={dim}", f"DecorationHover={dim}", ""]
    L += ["[ColorEffects:Disabled]",
          "Color=" + rgb("surface.base"), "ColorAmount=0", "ColorEffect=0",
          "ContrastAmount=0", "ContrastEffect=0", "IntensityAmount=0", "IntensityEffect=0", ""]
    L += ["[ColorEffects:Inactive]",
          "ChangeSelectionColor=false", "Color=" + rgb("surface.base"), "ColorAmount=0", "ColorEffect=0",
          "ContrastAmount=0", "ContrastEffect=0", "Enable=false", "IntensityAmount=0", "IntensityEffect=0", ""]
    L += ["[WM]",
          f"activeBackground={rgb('surface.raised')}", f"activeForeground={pri}", f"activeBlend={gold}",
          f"inactiveBackground={rgb('surface.inset')}", f"inactiveForeground={dis}", f"inactiveBlend={dim}",
          f"frame={gold}", f"inactiveFrame={dim}", ""]
    return L


def gen_kdeglobals(t: Tokens, out: Out):
    """The XDG override that makes a fresh Plasma session CZD without touching any user file.
    Kali Purple does exactly this from /etc/xdg/xdg-kali-purple/kdeglobals."""
    ui, mono = t["font.ui.family"], t["font.mono.family"]
    qfont = lambda fam, pt, w=400: f"{fam},{pt},-1,5,{w},0,0,0,0,0,0,0,0,0,0,1"
    L = ["# czd-purple — generated by tokens/generate.py. Do not edit; edit the token file.", ""]
    L += ["[KDE]",
          "LookAndFeelPackage=org.czd.purple.desktop",
          "widgetStyle=Breeze",
          "AnimationDurationFactor=0",
          "SingleClick=false",
          "ShowDeleteCommand=false",
          "contrast=4",
          "",
          "[General]",
          "ColorScheme=CZDPurple",
          f"AccentColor={','.join(map(str, t.rgb('trace.gold')))}",
          "accentColorFromWallpaper=false",
          f"font={qfont(ui, 11)}",
          f"fixed={qfont(mono, 11)}",
          f"menuFont={qfont(ui, 11)}",
          f"toolBarFont={qfont(ui, 10)}",
          f"smallestReadableFont={qfont(ui, 9)}",
          "XftAntialias=true",
          "XftHintStyle=hintslight",
          "XftSubPixel=rgb",
          "shadeSortColumn=true",
          "BrowserApplication=default-browser.desktop",
          "TerminalApplication=konsole",
          "TerminalService=org.kde.konsole.desktop",
          "",
          "[Icons]",
          "Theme=czd-purple",
          "",
          "[KScreen]",
          "ScaleFactor=1",
          "",
          "[KFileDialog Settings]",
          "Show hidden files=false",
          "Show Preview=false",
          "",
          "[WM]"]
    # [WM] comes from the shared blocks; drop the placeholder header we just added.
    L.pop()
    L += kde_color_blocks(t)
    out.write("czd-plasma-theme", "etc/xdg/xdg-czd-purple/kdeglobals", "\n".join(L))


def gen_kde_colors(t: Tokens, out: Out):
    """CZDPurple.colors (System Settings > Colors) and the Plasma desktop theme's colors file."""
    gold = ",".join(map(str, t.rgb("trace.gold")))
    head = ["[General]", "ColorScheme=CZDPurple", "Name=CZD Purple", "shadeSortColumn=true",
            f"AccentColor={gold}", "TitleBarColorScheme=CZDPurple", "", "[KDE]", "contrast=4", ""]
    text = "\n".join(head + kde_color_blocks(t))
    out.write("czd-plasma-theme", "usr/share/color-schemes/CZDPurple.colors", text)
    out.write("czd-plasma-theme", "usr/share/plasma/desktoptheme/czd-purple/colors", text)


def gen_wireshark(t: Tokens, out: Out):
    """Wireshark colorfilters: foreground-only protocol colouring on the row's own surface.
    Format: @name@filter@[bg-r,bg-g,bg-b][fg-r,fg-g,fg-b]  with 16-bit components."""
    def c16(p):
        return "[%d,%d,%d]" % tuple(v * 257 for v in t.rgb(p))
    bg = c16("surface.inset")
    rules = [
        ("Bad TCP", "tcp.analysis.flags && !tcp.analysis.window_update && !tcp.analysis.keep_alive && !tcp.analysis.keep_alive_ack", "ansi.09"),
        ("Retransmission", "tcp.analysis.retransmission", "ansi.09"),
        ("HSRP State Change", "hsrp.state != 8 && hsrp.state != 16", "ansi.09"),
        ("Spanning Tree Topology Change", "stp.type == 0x80", "ansi.09"),
        ("OSPF State Change", "ospf.msg != 1", "ansi.09"),
        ("ICMP errors", "icmp.type in { 3, 4, 5, 11 } || icmpv6.type in { 1, 2, 3, 4 }", "ansi.09"),
        ("ARP", "arp", "ansi.05"),
        ("ICMP", "icmp || icmpv6", "ansi.13"),
        ("TCP RST", "tcp.flags.reset eq 1", "ansi.01"),
        ("SCTP ABORT", "sctp.chunk_type eq ABORT", "ansi.01"),
        ("TTL low or unexpected", "( ! ip.dst == 224.0.0.0/4 && ip.ttl < 5 && !pim && !ospf) || (ip.dst == 224.0.0.0/24 && ip.dst != 224.0.0.251 && ip.ttl != 1 && !(vrrp || carp))", "ansi.01"),
        ("Checksum Errors", "eth.fcs.status==\"Bad\" || ip.checksum.status==\"Bad\" || tcp.checksum.status==\"Bad\" || udp.checksum.status==\"Bad\" || sctp.checksum.status==\"Bad\"", "ansi.01"),
        ("TLS", "tls || ssl", "ansi.13"),
        ("HTTP", "http || tcp.port == 80 || http2", "ansi.12"),
        ("DNS", "dns || mdns", "ansi.14"),
        ("SMB", "smb || nbss || nbns || netbios", "ansi.05"),
        ("IPX", "ipx || spx", "ansi.05"),
        ("DCERPC", "dcerpc", "ansi.05"),
        ("Routing", "hsrp || eigrp || ospf || bgp || cdp || vrrp || carp || gvrp || igmp || ismp", "ansi.06"),
        ("TCP SYN/FIN", "tcp.flags & 0x02 || tcp.flags.fin == 1", "ansi.07"),
        ("TCP", "tcp", "ansi.04"),
        ("UDP", "udp", "ansi.06"),
        ("Broadcast", "eth[0] & 1", "ansi.08"),
        ("System Event", "systemd_journal || sysdig", "ansi.08"),
    ]
    L = ["# czd-purple — generated by tokens/generate.py. Foreground-only colouring on the inset surface."]
    for name, flt, fg in rules:
        L.append(f"@{name}@{flt}@{bg}{c16(fg)}")
    L.append("")
    # Wireshark global configuration profiles live under the data dir; users pick "CZD" from
    # Edit > Configuration Profiles, and the CZD XDG tree's wireshark preferences select it.
    out.write("czd-terminal-profiles", "usr/share/wireshark/profiles/CZD/colorfilters", "\n".join(L))


def png_solid(width: int, height: int, rgba: tuple[int, int, int, int]) -> bytes:
    """A minimal PNG encoder for flat rectangles (GRUB 9-slice pixmaps, Plymouth tracks).
    No PIL dependency, so generate.py runs on any Python 3."""
    import struct
    import zlib

    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    row = b"\x00" + bytes(rgba) * width
    raw = row * height
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))


def gen_boot_pixmaps(t: Tokens, out: Out):
    """GRUB selection 9-slice (batch 03, grub-menu · 02): 0.05 gold tint centre, 2px gold rules
    top and bottom, nothing at the sides. Plus flat placeholders for the boot plates until the
    trace-field renderer (stage 4) replaces them."""
    gold = t.rgb("trace.gold")
    base = t.rgb("surface.base")
    deep = t.rgb("trace.gold.deep")
    tint = (*gold, 13)            # 0.05 × 255
    solid = (*gold, 255)
    clear = (0, 0, 0, 0)
    G = "usr/share/grub/themes/czd-purple/"
    slices = {
        "select_c": (8, 8, tint), "select_n": (8, 2, solid), "select_s": (8, 2, solid),
        "select_e": (1, 8, tint), "select_w": (1, 8, tint),
        "select_nw": (1, 2, solid), "select_ne": (1, 2, solid), "select_sw": (1, 2, solid), "select_se": (1, 2, solid),
    }
    for name, (w, h, c) in slices.items():
        out.write_bytes("czd-boot-theme", G + name + ".png", png_solid(w, h, c))
    # progress rule: gold on gold.deep (the track), 2px
    out.write_bytes("czd-boot-theme", G + "progress_bg.png", png_solid(8, 2, (*deep, 255)))
    out.write_bytes("czd-boot-theme", G + "progress_fg.png", png_solid(8, 2, solid))
    out.write_bytes("czd-boot-theme", G + "progress_hl.png", png_solid(8, 2, solid))
    # placeholder plates (stage 4 renders the real trace field): flat base surface
    if not (PACKAGES / "czd-boot-theme" / "generated" / G / "background.png").exists() or True:
        out.write_bytes("czd-boot-theme", G + "background.png", png_solid(1920, 1080, (*base, 255)))
    P = "usr/share/plymouth/themes/czd-purple/"
    out.write_bytes("czd-boot-theme", P + "background.png", png_solid(1920, 1080, (*base, 255)))
    out.write_bytes("czd-boot-theme", P + "track.png", png_solid(640, 2, (*deep, 255)))
    out.write_bytes("czd-boot-theme", P + "fill.png", png_solid(640, 2, solid))
    out.write_bytes("czd-boot-theme", P + "well.png", png_solid(640, 72, (*t.rgb("surface.inset"), 255)))
    out.write_bytes("czd-boot-theme", P + "well-border.png", png_solid(642, 74, solid))
    out.write_bytes("czd-boot-theme", P + "caret.png", png_solid(2, 34, solid))
    out.write_bytes("czd-boot-theme", P + "clear.png", png_solid(1, 1, clear))


WALLPAPERS = {
    # name: (plasma package id, description)
    "default":  ("czd-purple-default",  "CZD Purple. Dateless; the desk-stick wallpaper."),
    "event":    ("czd-purple-event",    "CZD Purple, conference week. Carries the event dates from the token file."),
    "sponsors": ("czd-purple-sponsors", "CZD Purple with the sponsor row."),
    "lock":     ("czd-purple-lock",     "CZD Purple lock plate. Reserves 720 × 460 at x600 y310 for the SDDM form."),
}


def gen_wallpapers(t: Tokens, out: Out):
    """Plasma wallpaper packages for the four plates (batch 02). The images come from the
    trace-field renderer (stage 4); until it lands, each is a flat base-surface plate so every
    consumer (desktop, lock screen, SDDM, boot plates) has a real file at the right path."""
    base = (*t.rgb("surface.base"), 255)
    for key, (pid, desc) in WALLPAPERS.items():
        root = f"usr/share/wallpapers/{pid}/"
        meta = json.dumps({
            "KPlugin": {
                "Authors": [{"Email": "brett@iotemylabs.com", "Name": "Charleston Zero Day"}],
                "Description": desc,
                "Id": pid,
                "License": "MIT",
                "Name": f"CZD Purple ({key})",
                "Version": t["build.tag"],
            },
        }, indent=4) + "\n"
        out.write("czd-wallpapers", root + "metadata.json", meta)
        img = PACKAGES / "czd-wallpapers" / "rendered" / f"wallpaper-{key}.png"
        if img.exists():
            out.copy("czd-wallpapers", root + "contents/images/1920x1080.png", img)
        else:
            out.write_bytes("czd-wallpapers", root + "contents/images/1920x1080.png", png_solid(1920, 1080, base))


GENERATORS = [gen_tokens_package, gen_konsole, gen_gtk, gen_xresources, gen_vim, gen_kvantum,
              gen_kde_colors, gen_kdeglobals, gen_wireshark, gen_boot_pixmaps, gen_wallpapers]


# ----------------------------------------------------------------------------
def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--tag", help="build string from the git tag (default: $meta.version_string)")
    ap.add_argument("--force", action="store_true", help="allow --tag to differ from $meta.version_string")
    ap.add_argument("--list", action="store_true", help="list output paths without writing")
    ap.add_argument("--clean", action="store_true", help="delete packages/*/generated and exit")
    a = ap.parse_args(argv)

    if a.clean:
        for g in PACKAGES.glob("*/generated"):
            shutil.rmtree(g)
            print(f"removed {g.relative_to(ROOT)}")
        return 0

    data = json.loads(TOKENS.read_text(encoding="utf-8"))
    canonical = data["$meta"]["version_string"]
    tag = a.tag or canonical
    if tag.lower() != canonical.lower() and not a.force:
        raise SystemExit(f"--tag {tag!r} does not match $meta.version_string {canonical!r} in tokens JSON. "
                         f"Edit the token file (respin edit 01) or pass --force.")
    tokens = Tokens(data, tag)
    out = Out(dry=a.list)

    render_templates(tokens, out)
    for g in GENERATORS:
        g(tokens, out)

    for p in out.written:
        print(p.relative_to(ROOT).as_posix())
    print(f"# {len(out.written)} files, build string {tag}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
