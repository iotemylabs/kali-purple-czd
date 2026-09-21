# live-build overlay

This directory is copied on top of a fresh clone of Kali's
[live-build-config](https://gitlab.com/kalilinux/build-scripts/live-build-config) by `build.sh`.
Only files that differ from Kali's tree live here.

- `kali-config/variant-czd/` — the CZD variant: package lists, chroot hooks, chroot includes.
  `build.sh` adds `packages.chroot/*.deb` (the eight packages) and `includes.chroot/etc/czd-build`
  (the build string) at build time; neither is committed.
- `kali-config/common/` — only if something must change for every variant. Empty by design.

Why an overlay and not our own `lb config`: Kali's `auto/config` carries a dozen non-obvious
options (kali-rolling symlink into live-build's debian-cd data, the last-snapshot rewrite,
firmware, keyring, `--debian-installer live`). Reproducing them is how a respin drifts from
Kali. We inherit them and add a variant, the way Kali's own `kde` variant does.
