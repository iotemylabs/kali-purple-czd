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

Verified on `czd-build` (2026-09-21):

- `make check` passes. All eight packages build with `dpkg-buildpackage`; lintian reports only
  `empty-binary-package` for the five packages that have no content yet.
- Installed `czd-purple-tokens`, `czd-terminal-profiles`, `czd-plasma-theme` on the VM. A login
  shell shows `XDG_CONFIG_DIRS=/etc/xdg/xdg-czd-purple:/etc/xdg` and `~/.config/gtk-4.0/gtk.css`
  is the expected symlink.
- `apt purge 'czd-*'` removes everything, including the XDG tree and the profile.d activator.
  Release gate row 07 holds for these three packages.
- Lintian caught two things that were fixed before commit: files in `/etc/skel` (moved to the
  XDG tree and Wireshark's global `profiles/` dir) and hand-rolled `fc-cache` calls (dropped;
  fontconfig's dpkg trigger does it).

## 2026-09-21 · Stage 3a — Plasma theme package

- `czd-plasma-theme` now carries: look-and-feel package `org.czd.purple.desktop` (defaults +
  first-start panel layout: bottom, 56px, opaque, kickoff / pager / text task manager / tray /
  mono clock), Plasma desktop theme `czd-purple` (panel, popup, dialog, tooltip SVG templates on
  the raised and overlay surfaces with 26% gold hairlines, falls back to breeze-dark), Aurorae
  decoration `czd-purple` (48px title strip, 1px frame at 26% active / 13% inactive, three
  1px-stroke glyphs in 24px boxes, no shadow), the KDE colour scheme, and the XDG override tree
  `/etc/xdg/xdg-czd-purple/` (generated kdeglobals with fonts and all colour sections; static
  kwinrc with every animation effect off, plasmarc, ksplashrc none, kscreenlockerrc, kcminputrc,
  klaunchrc).
- `czd-purple-tokens` ships Archivo (from the design bundle at build time) and a fontconfig alias
  file making Archivo `sans-serif` and IBM Plex Mono `monospace`.
- `czd-icon-theme` has its `index.theme` inheriting breeze-dark; glyphs are still to draw.
- Aurorae SVG geometry is drawn at literal pixel sizes so nothing is scaled and the hairline stays
  1px. Mask elements use the `black` keyword, not a hex, so the drift grep stays clean.
- VM fix: the Kali cloud kernel has no DRM drivers, so SDDM started but never got a display.
  Installed `linux-image-amd64`; `create-czd-build-vm.sh` now does that in cloud-init and runs
  the KDE install as a systemd unit. SDDM autologin for `czd` is enabled on the VM so a Plasma
  session exists to screenshot over SSH with `spectacle -b`.

## 2026-09-21 · Stage 3b — SDDM, boot theme, wallpapers (committed, not yet verified)

- `czd-sddm-theme`: Qt6 QML greeter (`Main.qml` template) drawn on a 1920 × 1080 plate and
  scaled uniformly, so the form lands at x600 y310 on any screen. No user list, no avatar.
  Failed login swaps the PASSWORD label to `state.error` and names caps lock; nothing moves.
  `theme.conf` points at the lock wallpaper package; `/etc/sddm.conf.d/20-czd-purple.conf`
  selects the theme and is removed with the package.
- `czd-boot-theme`: GRUB `theme.txt` template on the 112px grid with 9-slice selection pixmaps
  (0.05 tint, 2px gold caps) and a 2px timeout rule; PF2 fonts built by `grub-mkfont` in
  `debian/rules` from the design bundle; Plymouth script theme (stepped progress, LUKS field,
  attempt counter); `grub.d` fragment; initramfs hook that copies the fonts in. `generate.py`
  gained a dependency-free PNG writer for the flat pixmaps and placeholder plates.
  Known limit: GRUB `boot_menu` items are single-line, so the two-line token + subtitle rows
  from the plate fold into one entry title (set in the live-build bootloader config later).
- `czd-wallpapers`: four Plasma wallpaper packages with metadata; images are flat base-surface
  placeholders until the stage-4 renderer writes `packages/czd-wallpapers/rendered/*.png`.
- VM: purging the running cloud kernel left `/boot/vmlinuz-7.1.5+kali-cloud-amd64` behind and
  GRUB listed it first; the VM did not come back on SSH after reboot. Needs a console pick of
  the `7.1.5+kali-amd64` entry, then delete the leftover cloud files and `update-grub`.

## 2026-09-21 · Stage 3 verification on czd-build (standard kernel, real Plasma session)

Screenshots taken over SSH with `spectacle -b` inside the autologin session.

- **Plasma, first login, no user config:** CZD colour scheme, `czd-purple` desktop theme
  (56px opaque panel with the hairline), Aurorae `czd-purple` decoration with gold 1px-stroke
  glyphs, gold task highlight, mono clock, animations at Instant. System Settings, Dolphin and
  Konsole all on the dark surfaces with Archivo. `~/.config/kdedefaults/package` reads
  `org.czd.purple.desktop`, so startplasma applied our look-and-feel unaided.
- **SDDM greeter in `--test-mode`:** matches the sddm-login plate: wordmark block, clock,
  the 720 × 460 form, filled-gold SIGN IN, event lines, power row. Session name was empty
  (wrong role lookup); fixed with a hidden ComboBox bound to `sessionModel` by `name`.
- **Precedence fixes found by this pass:** Kali ships `/etc/default/grub.d/kali-themes.cfg` and
  `/etc/sddm.conf.d/kde_settings.conf`; both sort after files named `czd-*`. Ours are now
  `zz-czd-purple.cfg` / `zz-czd-purple.conf` and GRUB's generated config points at the CZD
  theme at 1920×1080. `plasma-welcomerc` in the XDG tree stops Kali's welcome tour.
- **Pitfall recorded:** reading KDE config over SSH (`kreadconfig6`) without the session's
  `XDG_CONFIG_DIRS` shows Kali's values, not the session's. Read the env from a session
  process first, or launch test apps with `systemd-run --user` so they inherit it.
- **Gaps, deliberately left:**
  - Kickoff (stock widget) cannot hide icons, start on a custom category, or drop the avatar.
    The plasma-kickoff plate needs either a forked applet or acceptance of the stock layout.
    Decision for the board; the rest of the shell does not depend on it.
  - `dpkg -i` on the VM does not pull `breeze-icon-theme`, so category icons showed as
    generic files there. Irrelevant in the ISO, where apt resolves the dependency.
  - GRUB menu rows are single-line; the token column from the plate folds into the title.

## 2026-09-21 · Stage 4 — trace-field renderer

- Decision: **Pillow port, not a browser.** `tokens/render_plates.py` re-implements
  `design/plates/TraceField.dc.html` (its paths, vias, pads, active runs, surge gradients and both
  vignettes are transcribed verbatim) plus the wordmark, event, sponsor and lock blocks from the
  batch-02 plates. Deterministic, ~2 s on the VM, no numpy, no Chromium. The Build Handoff says
  `generate.py` produces the wallpapers and boot plates, and now it does.
- Outputs land in `packages/czd-wallpapers/rendered/` (ignored) and feed the four Plasma
  wallpaper packages, the GRUB background and the Plymouth background. Without Pillow the
  generator falls back to flat plates and says so; `build.sh` refuses to build without
  `python3-pil` and `librsvg2-bin`.
- The Kali dragon: `kali-menu.svg` is a gradient plate with the dragon knocked out in white, so
  "recolour every fill" would have produced a gold square. The renderer strips the `<rect>`
  plate and the translucent highlight paths and paints the remaining path in `trace.gold.dim`.
  It only exists on a Kali host; on Debian the slot stays empty with a note.
- Sponsors: the two SVG marks (Segra, UC tower) need `rsvg-convert`; a tier with no marks
  collapses as the plate specifies. Segra's brand blue is barely visible on the field, exactly
  as the plate warns; that is a sponsor-supplied-asset question, not a build one.
- Verified on `czd-build` at a real 1920 × 1080: desktop wallpaper with dragon and panel strip
  clear; renders match `design/png/02-wallpapers` to the eye.
- SDDM: the lock plate carries the corner text, so the greeter now draws only the clock, the
  form and the power row. A stale QML disk cache (`~/.cache/sddm-greeter-qt6`) had been hiding a
  load failure: `SddmComponents` exports its own `ComboBox`, which shadowed Qt's and broke the
  session-name lookup. Fixed by importing `QtQuick.Controls as QQC`. Test greeters must run
  with `QML_DISABLE_DISK_CACHE=1` or they can show the previous build.

## 2026-09-22 · Stage 3c — welcome app and Calamares

- `czd-welcome` is a PyQt6 script at `/usr/bin/czd-welcome`, 1280 × 760, five sections, the
  label-plus-content rows from the plate. It reads `/usr/share/czd/czd-purple-tokens.json` and
  the build string at runtime, so the script has no hex and never needs regenerating.
  Yearly content is `/usr/share/czd-welcome/schedule.json` (respin edit 03; unknowns are TBC).
  Autostart from `/etc/xdg/autostart`; closing without the checkbox writes a `Hidden=true`
  override into `~/.config/autostart` (a user cannot delete a system .desktop file, and this is
  the freedesktop way to say the same thing). A menu launcher exists for people who closed it
  too fast; the plate left that open, and a launcher costs nothing.
- Calamares: `calamares-settings-debian` stays in the image for its helper modules
  (`bootloader-config`, `sources-media`, `dpkg-unsafe-io`); `installer/` overrides
  `settings.conf`, the module configs and the branding through `includes.chroot`. Erase-and-
  encrypt (LUKS2) is the initial choice, swap small, 28 GB and 8 GB requirements with only
  storage and root as hard stops, sddm as the display manager, live-only packages removed
  after install. Branding: 1400 × 860, sidebar on `surface.raised`, current step on
  `trace.gold.deep`, a QSS with the gold NEXT and hairlines, five slides that cut every 8 s.
- Verified on `czd-build` in the session: welcome window renders as the plate; Calamares
  loads the CZD branding and stylesheet (window size, sidebar, mark, gold controls). Its
  requirement checks fail there because it ran without root on a full disk, as expected.
- Gaps: Calamares draws its own sidebar labels (Welcome, Location …); Qt stylesheets cannot
  uppercase or number them, so the zero-padded mono labels from the plate need a Calamares
  patch or acceptance. Locale and keyboard stay separate steps; the plate's own sidebar lists
  seven steps that way, so that is consistent.

## 2026-09-22 · Stage 3d — icon theme

- The Icon Theme plate carries every glyph's SVG geometry inline, so the 33 cuts were
  transcribed, not redrawn: `packages/czd-icon-theme/glyphs.json` holds the paths, the filled
  squares (as token names) and the freedesktop icon names each glyph answers to. The generator
  writes one SVG per name into `scalable/<context>/`, plus the two hand-cut folder sizes the
  plate supplied (16 and 22). 122 files; `index.theme` still inherits breeze-dark.
- Mimetype "icons" are plates: a 1px gold box with a mono 700 label (PCAP, JSON, SH, KEY) mapped
  to the real MIME names, so Dolphin shows the extension as type, as the plate argues.
- Down and muted states use `text.disabled` plus the 45° strike; level glyphs (wireless, volume)
  use `trace.gold.deep` for the empty step. Nothing in the tray can turn red.
- Verified on `czd-build`: a contact sheet of all 39 files matches the inventory plate; Dolphin's
  places, toolbar and the tray resolve the CZD cuts on the running session.
- Pitfall recorded: deleting `~/.cache/icon-cache.kcache` and `~/.cache/plasma_theme*` inside a
  running session left plasmashell with a black desktop and Dolphin with an empty view until the
  session was restarted (`systemctl restart sddm` with autologin). Do not clear those caches
  live; restart the session after installing an icon theme.
- Dolphin in situ: PCAP, SH and JSON plates render; a `.key` file lands on Breeze's generic icon
  because its detected MIME type depends on content, not extension.
- Gaps: the plate promises hand-cut 16 and 22 grids for all 33 (66 files); only the folder cuts
  were supplied, so the rest scale from 24 and go slightly soft at 16. Aurorae still carries its
  own copies of minimize/maximize/close (Aurorae cannot pull from an icon theme); they are the
  same geometry.

## 2026-09-22 · Live boot menus and the first ISO build

- live-build overlays copy per file over its defaults (`cp -af config/bootloaders/grub-pc/*`),
  and `@LINUX_LIVE@` is only expanded if present, so `grub.cfg` now writes the rows from the
  grub-menu plate explicitly on `@KERNEL_LIVE@ / @APPEND_LIVE@ / @INITRD_LIVE@`: LIVE, PERSIST
  (LUKS, label `czd-persistence`), INSTALL (adds `czd.install=1`), ADVANCED submenu (failsafe,
  forensic, plain persistence, verify, Kali's debian-installer, memtest), FIRMWARE. Titles carry
  the token column as leading text because GRUB rows are one line.
- The live GRUB theme is the installed one: `build.sh` unpacks the built `czd-boot-theme` .deb
  and stages the theme dir (PF2 fonts, 9-slice, plate) and `splash.png` into the overlay, and
  scales a 640 × 480 isolinux splash. `config.cfg` sets 1080p, an 8 s menu timeout and drops
  Kali's boot beep.
- BIOS: `syslinux_common/live.cfg.in`, `menu.cfg`, `advanced.cfg`; the isolinux `stdmenu.cfg`
  is a token template (syslinux wants AARRGGBB) rendered into `live-build/generated`.
- live-config hardcodes the live password in `0030-user-setup`; a CZD component
  `0035-czd-user` (in `includes.chroot`) sets `czd / czd` and the capture groups right after it.
  `username=czd hostname=czd-purple` ride on every kernel line.
- INSTALL row: an autostart entry checks `/proc/cmdline` for `czd.install=1` and launches
  Calamares through Debian's pkexec wrapper; otherwise it exits.
- Kali's `build.sh` has no `--verbose`; removed. First full build started on `czd-build` as
  `czd-iso-build.service` (`iso-build.out` and `build.log` in the repo dir on the VM).

## 2026-09-22 · First ISO built; VNC review fixes

- `czd-iso-build` finished: live-build succeeded first time (55 min). `build.sh` looked for the
  ISO in `images/`; Kali's script writes `output/`. Fixed. Output: `out/kali-purple-czd-2026.iso`,
  8.7 GB (the release sheet assumed 4.1 GB: `kali-linux-default` plus the five Purple tool menus
  plus KDE; a package-list decision for the board). Served to Proxmox with `python3 -m http.server`
  from `out/`; `boot-czd-iso-vm.sh` (outside the repo) creates the `czd-test` VM.
- Root-owned files: the ISO build runs as root and leaves `out/`, `build/` and the generated
  trees root-owned; `chown -R` before running the generator as the user again.
- Brett's VNC review of the build VM, three fixes:
  1. Dragon cut off: the console was not 16:9 and `FillMode=2` (crop) lost the right edge.
     Wallpaper and lock screen now use `FillMode=1` (fit) with a `surface.base` letterbox colour.
  2. Launcher button was Kali's blue/white dragon. Kali's shell `updates/kali-panel-customizations.js`
     forces the Kickoff icon to `kali-panel-menu-large`, so the icon theme now provides that name
     (and `czd-launcher`, `start-here-*`) as Kali's own SVG recoloured: gold plate, dragon in
     `surface.base`. Same recolour-not-redraw rule as the wallpaper dragon.
  3. The "text buttons" beside the launcher were the virtual-desktop pager showing names.
     Plasma 6.7's `displayedText` is 0 number / 1 name / 2 nothing (not what the enum order
     suggests). Now 0, with four desktops from the XDG `kwinrc`.

- Pitfall: Kali's `build.sh` probes localhost:8000 and, finding anything there, assumes a
  squid-deb-proxy and routes the mirror through it. The ISO HTTP share on 8000 made `lb config`
  fail with wget status 8. The share now runs on 8080. Rebuild with the review fixes is running.

### Next

- Stage 5: first ISO build on `czd-build` (`sudo ./build.sh --tag czd-2026-10-231`), then boot
  the ISO as a second Proxmox VM: live boot, GRUB and Plymouth plates, SDDM, Calamares end to
  end, removability check.
