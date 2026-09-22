#!/usr/bin/env bash
# iso-boot-test.sh — boot the built ISO under QEMU on the build host and screenshot it.
#
#   scripts/iso-boot-test.sh [uefi|bios] [seconds...]
#
# Boots out/kali-purple-czd-2026.iso headless (KVM if available), takes a screendump at each
# listed second mark (default: 25 60 120 200) into build/boot-test/<mode>-<sec>.png, then quits.
# Keeps QEMU at 2 GB so an 8 GB build host does not thrash: the first test at 3 GB took the host
# down. Stops nothing else; if a desktop session is running on the host, stop it first
# (`sudo systemctl stop sddm`) to free memory.
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-uefi}"; shift || true
MARKS=("${@:-25 60 120 200}")
[[ ${#MARKS[@]} -eq 1 && "${MARKS[0]}" == *" "* ]] && read -r -a MARKS <<<"${MARKS[0]}"
ISO="${ISO:-out/kali-purple-czd-2026.iso}"
OUTDIR="build/boot-test"
MON="/tmp/czd-qemu-$MODE.mon"
mkdir -p "$OUTDIR"
[[ -f "$ISO" ]] || { echo "no ISO at $ISO" >&2; exit 1; }

accel=tcg; [[ -w /dev/kvm ]] && accel=kvm
args=(-accel "$accel" -m 2G -smp 2 -cdrom "$ISO" -vga std -display none
      -monitor "unix:$MON,server,nowait" -serial "file:$OUTDIR/$MODE-serial.log" -daemonize -pidfile "/tmp/czd-qemu-$MODE.pid")
if [[ "$MODE" == "uefi" ]]; then
  cp -f /usr/share/OVMF/OVMF_VARS_4M.fd "/tmp/czd-vars-$MODE.fd"
  args+=(-drive if=pflash,format=raw,readonly=on,file=/usr/share/OVMF/OVMF_CODE_4M.fd
         -drive "if=pflash,format=raw,file=/tmp/czd-vars-$MODE.fd")
fi
pkill -F "/tmp/czd-qemu-$MODE.pid" 2>/dev/null || true
rm -f "$MON"
qemu-system-x86_64 "${args[@]}"
echo "qemu up ($accel, $MODE)"

mon() { python3 - "$MON" "$1" <<'PY'
import socket, sys, time
s = socket.socket(socket.AF_UNIX); s.connect(sys.argv[1]); s.settimeout(3)
time.sleep(0.5)
try: s.recv(4096)
except Exception: pass
s.sendall((sys.argv[2] + "\n").encode()); time.sleep(1.5)
try: s.recv(4096)
except Exception: pass
s.close()
PY
}

t=0
for m in "${MARKS[@]}"; do
  sleep $(( m - t )); t=$m
  mon "screendump $OUTDIR/$MODE-$m.ppm"
  python3 -c "from PIL import Image; im=Image.open('$OUTDIR/$MODE-$m.ppm'); im.save('$OUTDIR/$MODE-$m.png'); print('$MODE-$m.png', im.size)"
  rm -f "$OUTDIR/$MODE-$m.ppm"
done
mon quit
sleep 1
pkill -F "/tmp/czd-qemu-$MODE.pid" 2>/dev/null || true
echo "done: $OUTDIR/$MODE-*.png"
