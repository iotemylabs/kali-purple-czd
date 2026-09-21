# Releasing CZD Purple

Everything here is literal. If a step is not in `build.sh` it does not happen at release time.

## Who

| Role | Person | Backup |
| --- | --- | --- |
| Signing key holder (IoTemy Labs, ED25519, fingerprint `3F81 0C4A 9B22 D5E7`, offline stick) | **TBC** | **TBC** |
| Sign-off on the gate | one named person, not a committee | — |

The key is never in the repo, never on a build host, never in CI. There is no CI on purpose.

## The build

```bash
sudo apt install live-build debootstrap squashfs-tools xorriso devscripts debhelper grub-common python3 python3-pil librsvg2-bin   # 2 min
git clone https://github.com/iotemylabs/kali-purple-czd && cd kali-purple-czd                  # 1 min
git checkout czd-2026-10-231                                                                    # the tag, not main
python3 tokens/generate.py                                                                      # 20 s
sudo ./build.sh --clean --tag czd-2026-10-231                                                   # 45–70 min, unattended
cd out && sha256sum *.iso > *.iso.sha256 && gpg --detach-sign *.iso                             # 3 min, offline stick
gh release create czd-2026-10-231 --draft *.iso *.sha256 *.sig RELEASE-NOTES.md                 # 10 min
```

- Failures are almost always a debootstrap mirror timeout. Rerun `build.sh`; the cache survives.
- `--clean` before any release cut. Anything less is a stale chroot.
- The release is a **draft** until every row below is green.

## Release assets

Four, every time: `kali-purple-czd-2026.iso`, `.sha256`, `.sig`, `RELEASE-NOTES.md`.
Release body: what changed, the checksum in full, the Secure Boot line, and the sentence that the
image is live bootable and installable.

## The gate — all eight rows must pass

| # | Surface | The check | Passes when |
| --- | --- | --- | --- |
| 01 | Live boot | USB on four machines: UEFI, legacy BIOS, AMD laptop, NVIDIA desktop | desktop reaches the panel with no black frame |
| 02 | Install to disk | erase-and-encrypt on a spare NVMe, then manual mode once | reboots into LUKS prompt, then the installed desktop |
| 03 | Boot chain | GRUB, Plymouth, LUKS, SDDM in order | one plate throughout, no upstream logo, no flash |
| 04 | Menu numbering | open Kickoff, read 01–13, then CZD at 14 | nothing of Kali's moved or was renamed |
| 05 | Toolkit sweep | Konsole, Dolphin, Wireshark, Burp, raw xterm side by side | scrollbars match; no Breeze blue, no Metal grey |
| 06 | Token drift | `make check-drift` | returns nothing; every hex came from `tokens/` |
| 07 | Removability | `apt purge 'czd-*'` on the installed system, reboot | boots to stock Kali Purple, no orphaned theme |
| 08 | Checksum and sig | verify published assets from a second machine, cold | `OK` and `Good signature` against the published key |

Two people, one afternoon. The install test is the long pole at about 40 minutes.

## The yearly respin — nine edits, then one build

1. Dates and build string: `tokens/czd-purple-tokens.json` (`$meta.version_string`, `event.*`)
2. Event wallpaper date block: regenerates from the token dates, nothing to redraw
3. Welcome app schedule: `packages/czd-welcome/static/usr/share/czd-welcome/schedule.json`
4. Kali base rebase: new Kali Purple release; check the menu still numbers 01–13
5. Plasma version drift: Aurorae and Kvantum break on majors; budget a day
6. Defensive tooling list: `live-build/kali-config/variant-czd/package-lists/czd.list.chroot`, menu 14 and up
7. Slideshow slide 04: `installer/branding/czd-purple/slide-04.qml`
8. Release notes and mirrors: campus mirror stays `TBC` until somebody hosts it
9. Signing key holder: the table at the top of this file

**Never changes:** gold on near-black with one accent hue · Archivo + IBM Plex Mono only · zero
radius, shadow, gradient · Kali's numbering 01–13 untouched · panel at the bottom, 56px · eight
packages, all removable.

**If you only have an hour:** do edits 1 and 2, rebuild, reverify the boot chain.
