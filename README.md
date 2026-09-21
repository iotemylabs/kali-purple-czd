# CZD Purple

A themed respin of Kali Purple for the Charleston Zero Day conference. Eight removable Debian
packages on stock Kali Purple, KDE Plasma 6, dark only, gold on near-black. Not a fork, not a new
distro. No tool is added, removed, renamed or renumbered.

Build string for this cycle: `CZD-2026-10-231`. The git tag is the build string.

| Path | What it is |
| --- | --- |
| `build.sh` | The one entry point: tokens, eight `.deb`s, live-build, ISO. |
| `tokens/czd-purple-tokens.json` | The single source for every colour, size and spacing value. |
| `tokens/generate.py` | Renders the token file into every toolkit format the build needs. |
| `packages/czd-*/` | The eight package trees. `static/` and `templates/` are committed; `generated/` is not. |
| `live-build/` | Overlay on Kali's `live-build-config`: the `czd` variant. |
| `installer/` | Calamares branding and slideshow. |
| `design/` | The design handoff, batches 01–09, as built. Start with `design/HANDOFF.md`. |
| `RELEASING.md` | The release gate and the yearly respin, as a checklist. |
| `WORKLOG.md` | What was done, in order, with the decisions. Read this before changing anything. |

## Build

Root, wired, Kali or Debian 13 amd64, 40 GB free. 55–80 minutes end to end.

```bash
apt install live-build debootstrap squashfs-tools xorriso devscripts debhelper python3
git clone https://github.com/iotemylabs/kali-purple-czd && cd kali-purple-czd
git checkout czd-2026-10-231          # the tag you intend to ship, not main
python3 tokens/generate.py
sudo ./build.sh --tag czd-2026-10-231   # unattended; logs to build.log
```

Then sign, draft the release, and run the gate in `RELEASING.md`.

## Four rules

1. **Nothing generated is committed.** Edit the token JSON, rerun, diff.
2. **One colour lives in one file.** A hex outside `tokens/` is a bug. `make check` proves it.
3. **Eight packages, no more.** A ninth means a new surface, which means a design batch first.
4. **Tags are the build string.** It is never set by hand.

## Checks that run anywhere

```bash
make check       # token JSON parses, generator dry-runs, no hex outside tokens/, scripts parse
```
