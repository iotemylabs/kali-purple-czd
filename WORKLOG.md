# CZD Purple — work log

Running record of what was done, in order, so any engineer (or a fresh Claude session) can
pick up mid-stream. Newest entries at the bottom. Dates are absolute.

Spec source: `design/HANDOFF.md` and the plates under `design/plates/`. Token source:
`tokens/czd-purple-tokens.json`.

---

## 2026-09-21 · Environment

- Design handoff reviewed. Repo `iotemylabs/kali-purple-czd` was empty. The handoff calls the
  repo `czd-purple`; the real name is `kali-purple-czd` and all docs here use the real name.
- Build VM `czd-build` created on Proxmox from the Kali genericcloud image with
  `create-czd-build-vm.sh` (kept outside the repo, next to it on Brett's workstation).
  - Kali Rolling 2026.1, 4 vCPU, 8 GB, 100 GB, UEFI, at 192.168.8.210.
  - User `czd`, passwordless sudo, SSH key auth only. Alias `czd-build` in Brett's `~/.ssh/config`.
  - Installed: live-build, debootstrap, squashfs-tools, xorriso, devscripts, debhelper, lintian.
  - KDE Plasma 6.7.4 + SDDM 0.21 installed and enabled. Stock Kali look-and-feel
    `org.kali.kalipurpledark` and SDDM `debian-theme` present as upstream baselines.
  - `gh` is not in Kali's repos. Install from GitHub's apt repo when release drafting starts.
- Proxmox MCP connectors were unusable (Invalid IPv6 URL). Everything goes over SSH.

## 2026-09-21 · Stage 1 — repo skeleton

- Cloned the empty repo to `C:\Users\kaoti\Code Projects\czd kali purple\kali-purple-czd`.
- Laid down the tree from Build Handoff plate 01 (`czd-repo`):
  `build.sh`, `tokens/`, `packages/<eight>/`, `live-build/`, `installer/`, `design/`, `RELEASING.md`.
- `design/` holds the handoff as shipped: `plates/`, `png/`, and the handoff README renamed to
  `design/HANDOFF.md` so it does not collide with the repo README.
- `.gitignore` excludes every build product per repo rule 1.
- Decision: `live-build/` is an overlay on Kali's own `live-build-config` repo, not a raw
  `lb config`. Kali Purple is the `purple` variant of that repo; CZD is a `variant-czd` that
  starts from the purple package list and adds the eight `czd-*` packages via `packages.chroot`.
  `build.sh` clones live-build-config into `build/` (ignored) and copies the overlay in.
- Decision: the release-gate token-drift grep runs against `git ls-files packages/` so it tests
  committed sources, not the generated files that land in `packages/*/generated/` at build time.
- Decision: the ANSI-16 instrument palette from batch 07 was only on the plate, not in the token
  JSON. It is added to the JSON under `ansi` (flagged as a batch-07 extension) because rule 2
  says one colour lives in one file.

## 2026-09-21 · Stage 2 — generator, packaging, build script

Findings that changed the plan (verified against Kali's GitLab and the build VM):

- **Kali Purple is stock Kali plus two packages.** `kali-menu-purple` (a gschema override for
  the defensive menu layout) and `kali-themes-purple` (an `/etc/xdg/xdg-kali-purple` config
  tree selected through `XDG_CONFIG_DIRS` from `/etc/profile.d`), plus the five
  `kali-tools-{identify,protect,detect,respond,recover}` menus. There is no `purple` variant in
  Kali's `live-build-config` on `main`; the official Kali Purple ISO is an installer image.
- **Kali's live images install with debian-installer, not Calamares.** Calamares 3.4.2 and
  `calamares-settings-debian` are in Kali's repos, so the batch-08 design is honoured by
  shipping Calamares in the live image and launching it from the desktop. d-i stays reachable
  from the boot menu's advanced submenu.
- **CZD overrides Kali Purple the same way Kali Purple overrides Kali:** a higher-priority
  XDG config dir from `/etc/profile.d`. Removing the package removes the override. That is what
  makes gate row 07 (removability) mechanical rather than hopeful.
- The Kali dragon to recolour is `/usr/share/icons/hicolor/scalable/apps/kali-menu.svg`
  (package `kali-menu`), confirmed present.

What was built:

- `tokens/generate.py` — templates (`packages/*/templates/**` with `{{ token.path | filter }}`
  placeholders) plus generators for the toolkit files. Output goes to `packages/*/generated/`
  (ignored). Verified: 17 files, zero hex literals in committed sources.
  Currently generates: token drop (JSON, sh, css, build string), Konsole colorscheme + profile,
  GTK3/GTK4 theme + skel overrides, Xresources, vim/neovim colorscheme, Kvantum kvconfig,
  KDE colour scheme, Wireshark colouring rules (CZD profile).
- `tokens/czd-purple-tokens.json` gained `event`, `ansi` (batch-07 palette, flagged extension),
  `terminal` and `shell` sections. The frozen 1.0.0 map is unchanged above them.
- `packages/*/debian/` for all eight (native 3.0, dh 13, arch all). Each package = `static/`
  (committed, colour-free) + `templates/` (committed, placeholders) + `generated/` (build time).
  `debian/rules` refuses to build without `generated/` and fails the build on a hex in
  `static/` or `templates/`. Maintainer scripts: boot-theme registers/unregisters Plymouth and
  GRUB and restores the previous Plymouth theme on purge; tokens and icon-theme refresh caches.
- `build.sh` — tag check against `$meta.version_string`, generate, eight `dpkg-buildpackage`
  runs, clone Kali `live-build-config` into `build/`, overlay `live-build/kali-config/`, drop
  the `.deb`s into `packages.chroot`, run Kali's `build.sh --variant czd`, collect the ISO as
  `out/kali-purple-czd-<year>.iso` with its sha256.
- `Makefile` — `check` (json, drift, shell), `generate`, `packages`, `iso`, `clean`.
- `live-build/kali-config/variant-czd/` — package lists (Kali Purple set + Calamares + the
  eight), a small chroot hook, and a README explaining the overlay approach.
- `README.md`, `RELEASING.md` (gate table, respin edits with real file paths, key-holder table
  still `TBC`).

### Next

- Stage 3: package contents. Plasma (global theme, Aurorae SVG templates, kdeglobals, panel
  layout), SDDM QML, GRUB theme.txt + Plymouth script, XDG override dir, welcome app,
  Calamares settings + branding under `installer/` and `includes.chroot`.
- Stage 4: wallpaper and boot-plate rendering from the trace field. Needs a renderer decision:
  headless Chromium against `design/plates/TraceField.dc.html`, or a Python/Cairo port.
- Stage 5: first ISO build on `czd-build`, then boot it as a second Proxmox VM.
