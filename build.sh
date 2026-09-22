#!/usr/bin/env bash
# build.sh — the one entry point. Tokens -> eight .debs -> live-build -> ISO.
#
#   sudo ./build.sh --tag czd-2026-10-231        # full run, logs to build.log
#   sudo ./build.sh --tag czd-2026-10-231 --packages-only
#   sudo ./build.sh --clean                       # wipe build/ and out/ before a release cut
#
# Host: Kali or Debian 13 amd64, root, wired, 40 GB free. Nothing else is tested.
# Every step here is literal; if a step is not in this script it does not happen at
# release time (Build Handoff plate 01).

set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(pwd)

TAG=""
CLEAN=0
PACKAGES_ONLY=0
VARIANT="czd"
BRANCH="${BRANCH:-kali-rolling}"
LBC_URL="${LBC_URL:-https://gitlab.com/kalilinux/build-scripts/live-build-config.git}"
LBC_DIR="$ROOT/build/live-build-config"
OUT="$ROOT/out"

usage() { sed -n '2,12p' "$0"; exit "${1:-0}"; }
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag) TAG="$2"; shift 2 ;;
    --clean) CLEAN=1; shift ;;
    --packages-only) PACKAGES_ONLY=1; shift ;;
    --variant) VARIANT="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "unknown option $1" >&2; usage 1 ;;
  esac
done

log() { printf '\n==> %s\n' "$*"; }

if [[ $CLEAN -eq 1 ]]; then
  log "clean"
  python3 tokens/generate.py --clean
  rm -rf "$ROOT/build" "$OUT"
  [[ -n "$TAG" ]] || exit 0
fi

# Rule 4 — the tag is the build string. Take it from git when not given.
if [[ -z "$TAG" ]]; then
  TAG=$(git describe --tags --exact-match 2>/dev/null || true)
  [[ -n "$TAG" ]] || { echo "No --tag given and HEAD is not on a tag. Check out the tag you intend to ship." >&2; exit 1; }
fi
BUILD_STRING=$(python3 -c "import json;print(json.load(open('tokens/czd-purple-tokens.json',encoding='utf-8'))['\$meta']['version_string'])")
if [[ "${TAG,,}" != "${BUILD_STRING,,}" ]]; then
  echo "Tag '$TAG' does not match tokens \$meta.version_string '$BUILD_STRING'. Fix the token file (respin edit 01) and retag." >&2
  exit 1
fi

exec > >(tee -a "$ROOT/build.log") 2>&1
log "CZD Purple build · $TAG · $(date -u +%FT%TZ) · host $(hostname) · $(cat /etc/debian_version 2>/dev/null || echo '?')"

# ---------------------------------------------------------------- 1. tokens ---
log "1/4 tokens -> generated files (renders the wallpapers and boot plates)"
python3 -c "import PIL" 2>/dev/null || { echo "missing python3-pil (apt install python3-pil)" >&2; exit 1; }
command -v rsvg-convert >/dev/null || { echo "missing rsvg-convert (apt install librsvg2-bin)" >&2; exit 1; }
[ -f /usr/share/icons/hicolor/scalable/apps/kali-menu.svg ] || echo "note: kali-menu not installed on this host; the dragon slot stays empty (build on Kali for a release)"
python3 tokens/generate.py --tag "$TAG" >/dev/null

# --------------------------------------------------------------- 2. packages ---
log "2/4 eight packages"
mkdir -p "$OUT"
for cmd in dpkg-buildpackage dh; do command -v "$cmd" >/dev/null || { echo "missing $cmd (apt install devscripts debhelper)" >&2; exit 1; }; done
for p in packages/czd-*/; do
  p=${p%/}
  log "   $(basename "$p")"
  (cd "$p" && dpkg-buildpackage -us -uc -b --no-sign >/dev/null)
done
mv -f packages/*.deb "$OUT"/
rm -f packages/*.buildinfo packages/*.changes
ls -1 "$OUT"/*.deb
if [[ $PACKAGES_ONLY -eq 1 ]]; then log "packages only — done"; exit 0; fi

# ------------------------------------------------------------- 3. live-build ---
log "3/4 live-build (Kali live-build-config, variant $VARIANT)"
[[ $EUID -eq 0 ]] || { echo "live-build needs root" >&2; exit 1; }
for cmd in lb debootstrap mksquashfs xorriso; do command -v "$cmd" >/dev/null || { echo "missing $cmd (apt install live-build debootstrap squashfs-tools xorriso)" >&2; exit 1; }; done
if [[ ! -d "$LBC_DIR/.git" ]]; then
  git clone --depth 1 "$LBC_URL" "$LBC_DIR"
else
  git -C "$LBC_DIR" fetch --depth 1 origin && git -C "$LBC_DIR" reset --hard origin/HEAD >/dev/null
fi
# Overlay: our kali-config/ on top of theirs. variant-czd is ours; common/ additions merge in.
cp -a "$ROOT/live-build/kali-config/." "$LBC_DIR/kali-config/"
# Token-rendered bootloader files (isolinux colours) from live-build/generated.
[[ -d "$ROOT/live-build/generated/kali-config" ]] && cp -a "$ROOT/live-build/generated/kali-config/." "$LBC_DIR/kali-config/"
# The live GRUB menu wears the same theme as the installed one: stage the built theme (PF2 fonts,
# 9-slice pixmaps, background plate) out of the czd-boot-theme .deb into the bootloader overlay.
VAR="$LBC_DIR/kali-config/variant-$VARIANT"
rm -rf "$ROOT/build/boot-theme" && mkdir -p "$ROOT/build/boot-theme"
dpkg-deb -x "$OUT"/czd-boot-theme_*.deb "$ROOT/build/boot-theme"
mkdir -p "$VAR/bootloaders/grub-pc/theme" "$VAR/includes.binary/isolinux"
cp -a "$ROOT/build/boot-theme/usr/share/grub/themes/czd-purple/." "$VAR/bootloaders/grub-pc/theme/"
cp -f "$ROOT/build/boot-theme/usr/share/grub/themes/czd-purple/background.png" "$VAR/bootloaders/grub-pc/splash.png"
# isolinux wants a 640 × 480 splash; scale the GRUB plate.
python3 - "$ROOT/build/boot-theme/usr/share/grub/themes/czd-purple/background.png" "$VAR/includes.binary/isolinux/splash.png" <<'PYEOF'
import sys
from PIL import Image
Image.open(sys.argv[1]).convert("RGB").resize((640, 480), Image.LANCZOS).save(sys.argv[2], "PNG")
PYEOF
chmod +x "$VAR/includes.chroot/usr/lib/live/config/"* 2>/dev/null || true
# The eight .debs ride in as local packages for the chroot.
mkdir -p "$LBC_DIR/kali-config/variant-$VARIANT/packages.chroot"
cp -f "$OUT"/*.deb "$LBC_DIR/kali-config/variant-$VARIANT/packages.chroot/"
# Calamares: CZD settings, module configs and branding override calamares-settings-debian's.
mkdir -p "$LBC_DIR/kali-config/variant-$VARIANT/includes.chroot/etc/calamares"
cp -a "$ROOT/installer/static/." "$LBC_DIR/kali-config/variant-$VARIANT/includes.chroot/etc/calamares/"
cp -a "$ROOT/installer/generated/." "$LBC_DIR/kali-config/variant-$VARIANT/includes.chroot/etc/calamares/"
# Build string into the image for the welcome app and the ISO name.
mkdir -p "$LBC_DIR/kali-config/variant-$VARIANT/includes.chroot/etc"
echo "$TAG" > "$LBC_DIR/kali-config/variant-$VARIANT/includes.chroot/etc/czd-build"

ISO_VERSION="czd-${TAG#czd-}"
(cd "$LBC_DIR" && ./build.sh --variant "$VARIANT" --branch "$BRANCH" --version "$ISO_VERSION")

# ---------------------------------------------------------------- 4. collect ---
log "4/4 collect"
iso=$(find "$LBC_DIR/output" "$LBC_DIR/images" -maxdepth 1 -name '*.iso' 2>/dev/null | head -1)   # Kali's build.sh writes output/; find never fails pipefail
[[ -n "$iso" ]] || { echo "no ISO produced — see build.log and $LBC_DIR/build.log" >&2; exit 1; }
year=$(python3 -c "import json;print(json.load(open('tokens/czd-purple-tokens.json',encoding='utf-8'))['event']['year'])")
final="$OUT/kali-purple-czd-${year}.iso"
mv -f "$iso" "$final"
(cd "$OUT" && sha256sum "$(basename "$final")" > "$(basename "$final").sha256")
log "done: $final"
echo "next: gpg --detach-sign \"$final\"   (IoTemy Labs key, offline stick — never in the repo)"
