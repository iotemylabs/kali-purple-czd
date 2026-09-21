# Handoff: CZD Purple — a Kali Purple respin for Charleston Zero Day

Build string: **CZD-2026-10-231** · Base: **Kali Purple** (Kali Linux, defensive flavour) · Desktop: **KDE Plasma 6** · Theme: **dark only**

---

## Overview

CZD Purple is a themed respin of Kali Purple for the Charleston Zero Day conference (University of
Charleston, October 2026). It is **eight removable Debian packages on stock Kali Purple** — not a
fork, not a new distro. No tool is added, removed, renamed or renumbered.

The design work is complete and specified across nine deliverables (batches 01–09). This package
is the implementation brief: what to build, to what values, in what order, and how to verify it
before an ISO ships.

The artefact publishes as a **GitHub release** — live bootable *and* installable to disk.

## About the design files

The files in `plates/` are **design references authored in HTML**. They are prototypes showing
intended look, geometry and behaviour — they are **not** production code and nothing in them should
be copied into the build.

The implementation targets are real Linux theming formats. Each plate names the file format it
specifies (Aurorae SVG + rc, Plasma `.desktop`/QML, SDDM QML, Plymouth script, GRUB theme.txt,
Kvantum `.kvconfig`, GTK `gtk.css`, Konsole `.colorscheme`, `.Xresources`, Calamares `branding.desc`
+ QML slideshow, freedesktop icon theme). Recreate the designs **in those formats**, reading the
plate for values and the token JSON for colour.

Every colour, size and spacing value in this package traces to `tokens/czd-purple-tokens.json`.
That file is the single source; the build generates the six toolkit files from it.

## Fidelity

**High fidelity.** Every plate is drawn at 1920 × 1080, sRGB, at real pixel geometry with final
colours, type, spacing and copy. Positions quoted in the plates (`x600 y310`, `720 × 460`, `56px
panel`) are literal and were chosen to line up across surfaces — e.g. the SDDM login form lands
exactly in the empty reserve the lock wallpaper cut. Treat the numbers as spec, not suggestion.

Where something is genuinely unknown it is marked with a gold mono `TBC` or drawn as a **1px dashed
gold placeholder** labelled with what is missing. Those are honest gaps, not decoration — keep them
as gaps.

---

## Design tokens

Canonical file: `tokens/czd-purple-tokens.json`. Summary:

### Surfaces (four, within 19 levels of each other)

| Token | Hex | Use |
| --- | --- | --- |
| `surface.base` | `#0A0A0A` | desktop root, GRUB field, window background, terminal background |
| `surface.raised` | `#0B0A07` | panel, SDDM card, Calamares sidebar, welcome-app panes |
| `surface.overlay` | `#181307` | Kickoff menu, tooltips, popups, warning wells |
| `surface.inset` | `#050505` | input wells, list backgrounds, full-bleed vignette core |

A plane change is a surface change. There are **no cards** — what looks like a card is a region of
`#0B0A07` or `#050505` bounded by hairlines.

### Gold ramp (one accent hue, four steps)

| Token | Hex | Use |
| --- | --- | --- |
| `trace.gold` | `#E0A82E` | brand gold, all hairlines at alpha, primary stroke |
| `trace.gold.dim` | `#8A6318` | background trace lattice, deep display type, selection fill |
| `trace.gold.surge` | `#FFE9A8` | hover and peak emphasis only — rationed |
| `trace.gold.deep` | `#4A320B` | barely-there fills, far-field circuit density |

`accent.purple.*` exists as a **declined alias** to gold. Purple was rejected; the keys exist so
consumers can reference them without introducing a second hue. Do not add purple.

### Ink

| Token | Hex | Contrast on `#0A0A0A` | Use |
| --- | --- | --- | --- |
| `text.primary` | `#F4F0E6` | 17.42:1 | headings, titles, active labels |
| `text.secondary` | `#A99C83` | 7.33:1 | body copy, menu items, captions |
| `text.disabled` | `#6B6152` | 3.26:1 | disabled controls **only** — never body text |

Never pure white.

### State (the only non-gold hues in the system)

| Token | Hex | Use |
| --- | --- | --- |
| `state.success` | `#4FC26B` | quoted tool output only (`sha256sum` OK, apt success, ANSI green) |
| `state.warning` | `#E0A82E` | caution — brand gold *is* the warning colour |
| `state.error` | `#E5484D` | ANSI red anchor, apt error |
| `state.info` / HOLD | `#8A93A0` | nothing-live / not-selectable state |
| STALE | `#6E7681` | stale board content |

**There is no red panic state in CZD UI.** A failed login, a destructive partition screen and a
warning well are all gold. `state.error` exists so a terminal can render ANSI red honestly.

### Selection and focus

- Selection fill `#8A6318`, text on it `#F4F0E6` (4.75:1).
- **Emphasis fill** `#E0A82E` with `#0A0A0A` text — the loudest element in the system. **One per
  screen**, never two.
- Focus: `1px solid #E0A82E`, `2px` offset, solid. Never removed.

### Borders and rules

| Name | Value | Use |
| --- | --- | --- |
| rule | `1px rgba(224,168,46,0.26)` | separators |
| rule.soft | `1px rgba(224,168,46,0.13)` | panel dividers, stacked rows |
| rule.bold | `2px solid #E0A82E` | page caps, section caps, QR blocks |
| tint | `rgba(224,168,46,0.05)` | hover fill, emphasis rows, current item |
| placeholder | `1px dashed #E0A82E` | unsupplied asset slots only |

Nothing is ever 3px, dotted, double, or grey. Hairlines are **always gold at low alpha**.

### Type

- **Archivo** (400/500/600/700, variable, OFL) — Plasma UI, window titles, session titles,
  wordmarks, Calamares, welcome app. fontconfig alias: `sans-serif`.
- **IBM Plex Mono** (400/500/600/700, OFL) — Konsole, every eyebrow, label, time, URL, direction,
  body caption. fontconfig alias: `monospace`.
- Tracking: display-xl `-0.035em`, display `-0.015em`, eyebrow `0.14em`, eyebrow-wide `0.20em`.
- Eyebrows are mono 700 uppercase gold, usually prefixed `//`.
- Only sanctioned pairing: Archivo title over a mono sub-line. Never the reverse.
- Floors: **24px** on 1920 × 1080 surfaces, 8px mono in print, 7px for dashed slot labels.
- Both families are OFL Google Fonts releases and are redistributable inside the ISO.

### Geometry

- `border-radius: 0` everywhere. `box-shadow: none`. No gradient (the wallpaper vignette and trace
  surge falloff are luminance-only ramps of one hue).
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Signage overscan 4%. Plate margins 112px; document plates 64px × 96px.
- Motion: max **90ms linear**; most state changes are `0ms` instant value swaps. No fades, slides,
  bounces, spinners or scroll reveals. `prefers-reduced-motion` needs no special case.

### Iconography

There is **no icon set to import** — the icon theme in batch 05 is a 33-glyph set drawn on a
24-unit grid with a 14-unit live area, 1px stroke, gold. Direction is a Unicode arrow appended to a
gold mono label (`LUNCH →`), separation is a middot `·`, bullets are a gold middot, status is a word
in a 1px box. **Emoji: never.** The CZD logo is the only artwork.

---

## Deliverables and surfaces

29 plates across nine deliverables. `plates/` holds the live HTML; `png/` holds flat exports of
every 1920 × 1080 plate.

### 01 · Token Map — `plates/Token Map.dc.html`
The colour, type and geometry contract, with contrast ratios and per-token usage. Four extensions
are flagged where CZD needed something the design system does not define (`state.success`,
`state.error`, Archivo promoted to a UI body role, `surface.overlay` reassigned to the menu plane).
No PNG — read the JSON, it is canonical.

### 02 · Wallpapers — `plates/Wallpapers.dc.html`
Four 1920 × 1080 plates sharing one trace-field component: `wallpaper-default`, `wallpaper-event`
(dated, conference-week ISO only), `wallpaper-sponsors`, `wallpaper-lock`.
Key geometry: wordmark block 827 × 290 at x981→1808 / y336→626; 112px margins; Kali dragon slot
64px bottom-right in `#8A6318` (recolour the upstream SVG, never redraw); `wallpaper-lock`
deliberately reserves an empty **720 × 460 hole at x600 y310** for the SDDM form.

### 03 · Boot Chain — `plates/Boot Chain.dc.html`
`grub-menu`, `plymouth-splash`, `plymouth-unlock` (LUKS), `sddm-login`. One plate throughout — GRUB
and Plymouth consume flattened exports of the same trace field, and `plymouth quit
--retain-splash` hands off to SDDM painting the same plate, so there is no black frame.

### 04 · Plasma Shell — `plates/Plasma Shell.dc.html`
`plasma-desktop`, `plasma-kickoff`, `plasma-window`. Panel **56px at the bottom** (Kali's default
position, settled). Desktop icon cells 160px from x64 y64 down the quiet zone the wallpaper
reserves. Ships as an Aurorae decoration (SVG frame parts, no blur), a Plasma style, a Qt colour
scheme and a Kvantum theme.

### 05 · Icon Theme — `plates/Icon Theme.dc.html`
`icon-construction`, `icon-inventory`, `icons-in-situ`. 33 glyphs, 24-unit grid, 14-unit live area,
1px stroke, four mimetype plates. Sizes in use: desktop 64px, tray 32px, titlebar 24px, list 22px.
Replaces every dashed slot batch 04 left open.

### 06 · First Run — `plates/First Run.dc.html`
`plymouth-timing` (the whole boot animation as a timing sheet — seven progress steps, no tweens, no
easing), `sddm-refused` (failed login: nothing moves, no red, a block grows downward into space
that was already empty), `czd-welcome` (first boot only, self-disabling, 1280 × 760 Qt6 widget),
`osd-and-notifications`.
CZD's defensive tooling opens the menu at **14**, after Kali's 01–13. Nothing of Kali's moves.

### 07 · Terminal and Toolkit — `plates/Terminal and Toolkit.dc.html`
`konsole-czd`, `ansi-16` (the sixteen-slot instrument palette), `gtk-wireshark`,
`toolkit-coverage`. Six generated files from one token source: Konsole colorscheme, Konsole
profile, Kvantum kvconfig, GTK theme, `.Xresources`, vim/neovim colorscheme. Scrollbar spec: **8px,
no arrows, square, 26% gold thumb on the inset surface** — the fastest tell of an unthemed app.
Coverage is stated honestly: Qt/KDE and X11 `THEMED`, GTK `PARTIAL`, Electron/browser `NONE`.
Vendor web UIs (Arkime, Velociraptor) keep their own brand; CZD themes the window, not the content.

### 08 · Installer and Delivery — `plates/Installer and Delivery.dc.html`
`calamares-welcome`, `calamares-partitions`, `calamares-slideshow`, `czd-delivery`.
Installer window 1400 × 860 at x260 y110, sidebar 340px, action bar 88px, seven steps (locale and
keyboard collapse onto the welcome screen). Partition screen is the only destructive screen and
earns its weight from 2px rules, the `#181307` well and copy that names the consequence — the boot
USB stays listed but unselectable, marked `IN USE` in `#8A93A0`. Slideshow: five slides, 8s hold,
**cut never fade**, 40s loop. Erase-and-encrypt (LUKS2, unencrypted /boot so GRUB can theme
itself) is the default; manual is one click away and unvalidated.

### 09 · Build Handoff — `plates/Build Handoff.dc.html`
`czd-repo`, `czd-build`, `czd-respin`, `czd-verify`. The repo layout, the six-command build, the
nine yearly respin edits, and the eight-row release gate. Details below.

---

## The eight packages

| Package | Version | Contents |
| --- | --- | --- |
| `czd-purple-tokens` | 1.0.0 | the single source + `generate.py` |
| `czd-plasma-theme` | 1.0.0 | Aurorae decoration, Plasma style, colour scheme, Kvantum |
| `czd-icon-theme` | 1.0.0 | 33 glyphs, freedesktop icon theme |
| `czd-boot-theme` | 1.0.0 | GRUB theme + Plymouth script and plates |
| `czd-sddm-theme` | 1.0.0 | SDDM 0.21 Qt6 QML |
| `czd-terminal-profiles` | 1.0.0 | Konsole colorscheme + profile, GTK, Xresources, vim |
| `czd-wallpapers` | 1.0.0 | four 1920 × 1080 plates (~33 MB) |
| `czd-welcome` | 1.0.0 | first-boot Qt6 widget, autostart, self-disabling |

Total added: ~41 MB. `apt purge 'czd-*'` must return a working stock Kali Purple desktop — that is
a release check, not an aspiration.

## Repository layout

```
czd-purple/
build.sh                  one entry point
tokens/
  czd-purple-tokens.json  the single source
  generate.py           → six toolkit files
packages/                 the eight package trees
live-build/
  auto/config           → the invocation
  config/package-lists/
  config/includes.chroot/
installer/
  branding/czd-purple/  → calamares + slideshow
design/                   batches 01–09, as built
RELEASING.md              the checklist, in text
```

Four rules that keep it honest:
1. **Nothing generated is committed** — toolkit files, wallpapers and flattened boot plates are
   build products. Edit the token JSON, rerun, diff.
2. **One colour lives in one file** — a hex outside `tokens/` is a bug.
   `grep -rn "#E0A82E" packages/` must return nothing.
3. **Eight packages, no more** — a ninth means a new surface, which means a design batch first.
4. **Tags are the build string** — tag `czd-2026-10-231` and the same string appears in
   `czd-welcome`, on every wallpaper and in the ISO name. It is never set by hand.

## The build (live-build on a laptop, by hand — no CI)

Root, wired, Kali or Debian 13 amd64, 40 GB free. 55–80 minutes end to end.

```
1  apt install live-build debootstrap squashfs-tools xorriso        2 min
2  git clone github.com/iotemylabs/czd-purple && cd czd-purple      1 min   (check out the tag, not main)
3  python3 tokens/generate.py                                      20 sec
4  ./build.sh --tag czd-2026-10-231                             45–70 min  (unattended; logs to build.log)
5  sha256sum *.iso > *.iso.sha256 && gpg --detach-sign *.iso         3 min
6  gh release create czd-2026-10-231 --draft *.iso *.sha256 *.sig   10 min
```

- Failures are almost always a debootstrap mirror timeout — rerun step 4, the cache survives.
- `./build.sh --clean` before any release cut.
- No CI on purpose: a hosted runner would need the signing key to produce a signed image.
- **The release is created as a draft** and publishes only after the gate below is green.

## Release assets

Four, every time: `kali-purple-czd-2026.iso`, `.sha256`, `.sig`, `RELEASE-NOTES.md`.
Signing key: ED25519, **IoTemy Labs**, fingerprint `3F81 0C4A 9B22 D5E7`, held on an offline stick,
never in the repo. Release body carries what changed, the checksum in full, the Secure Boot line,
and the statement that the image is live bootable and installable.

Mirrors: `01` the GitHub release; `02` campus mirror **TBC**; `charlestonzeroday.com` links out
rather than hosting.

## The release gate — all eight rows must pass

| Surface | Check | Passes when |
| --- | --- | --- |
| Live boot | USB on four machines: UEFI, legacy BIOS, AMD laptop, NVIDIA desktop | desktop reaches the panel with no black frame |
| Install to disk | erase-and-encrypt on a spare NVMe, then manual once | reboots into LUKS prompt, then the installed desktop |
| Boot chain | GRUB, Plymouth, LUKS, SDDM in order | one plate throughout, no upstream logo, no flash |
| Menu numbering | Kickoff reads 01–13, CZD at 14 | nothing of Kali's moved or was renamed |
| Toolkit sweep | Konsole, Dolphin, Wireshark, Burp, raw xterm side by side | scrollbars match; no Breeze blue, no Metal grey |
| Token drift | `grep -rn "#" packages/ --include=*.qml --include=*.css` | returns nothing |
| Removability | `apt purge 'czd-*'`, reboot | boots to stock Kali Purple, no orphaned theme |
| Checksum and sig | verify published assets from a second machine, cold | `OK` and `Good signature` against the published key |

Two people, one afternoon; the install test is the long pole at ~40 minutes. Sign-off is one named
person, not a committee.

## The yearly respin — nine edits, ~4 hours, then one build

1. Dates and build string — `tokens/czd-purple-tokens.json`
2. Event wallpaper date block — regenerates from the token dates
3. Welcome app schedule — one JSON of sessions
4. Kali base rebase — check the menu still numbers 01–13
5. Plasma version drift — Aurorae and Kvantum break on majors; budget a day
6. Defensive tooling list — menu 14 and up
7. Slideshow slide 04 — the conference-bits slide
8. Release notes and mirrors
9. Signing key holder in `RELEASING.md`

**Never changes:** gold on near-black with one accent hue · Archivo + IBM Plex Mono only · zero
radius, shadow, gradient · Kali's numbering 01–13 untouched · panel at the bottom, 56px · eight
packages, all removable.

**If you only have an hour:** do edits 1 and 2, rebuild, reverify the boot chain.

---

## Interactions and state

Motion is near-none by design; state changes are instant value swaps.

- **Link hover:** `#E0A82E` → `#FFE9A8`; 26%-alpha underline goes solid gold.
- **Row hover:** background picks up the 0.05 gold tint; top hairline soft → standard; title ink
  goes `#F4F0E6`. No lift, no scale.
- **Press:** drops back to `#E0A82E` — a press reads as the surge going away.
- **Current/selected:** gold tint fill plus a 1px gold border (nav, installer step) or a filled gold
  chip. One filled-gold element per screen.
- **Disabled:** `#6B6152` ink, no fill change, no opacity trick.
- **Boot splash:** redraws only on a real `boot_progress` callback — seven jumps on a typical boot,
  never interpolated. ESC still drops to the systemd log, untrapped.
- **Failed login:** no shake, no flash, no red. Fields do not move; a gold-capped block appears
  below them naming the attempt, the caps-lock state and the lockout.
- **Installer slideshow:** 8s hold then cut. No transition of any kind.
- **Completion:** not a dialog — the headline swaps, the rule fills, the trace field takes one
  surge pass, and the action bar grows a single filled-gold restart.

## Voice (applies to every string you implement)

Second person, plain, a little dry. State the useful fact and stop. No "journey", "exciting",
"dive into", "cutting-edge", "thrilled to announce", no first-person plural. Sentence case for
titles; UPPERCASE only for mono structural type (eyebrows, tags, chips, room lines, dates).
Unknowns get a gold mono `TBC`, never "coming soon". Dates `FRI OCT 02 – SAT OCT 03, 2026`; times
`9:25 AM`; middot `·` separates inline facts; `//` prefixes eyebrow labels. Emoji never.

## Assets

- `assets/czd-lockup-gold.png`, `czd-mark-gold.png`, `czd-wordmark-gold.png` — gold on
  transparency, cropped from the supplied lockup. No recolour, outline, plate, container or shadow.
  Minimums: 28px tall for the lockup, 40px for the mark.
- Kali dragon: **not included and not redrawn.** The build recolours the upstream SVG
  (`/usr/share/icons/hicolor/scalable/apps/kali-menu.svg` from `kali-menu`, or `kali-dragon.svg`
  from `kali-themes`) by overriding every fill/stroke to `#8A6318`.
- Fonts: Archivo and IBM Plex Mono, OFL, from `google/fonts`.
- Missing on purpose: campus map artwork, QR images, sponsor marks, speaker photography — all are
  dashed gold placeholders labelled with what is missing.

## Files in this package

```
README.md                  this file
tokens/
  czd-purple-tokens.json   the canonical token contract
plates/
  Token Map.dc.html        01
  Wallpapers.dc.html       02
  Boot Chain.dc.html       03
  Plasma Shell.dc.html     04
  Icon Theme.dc.html       05
  First Run.dc.html        06
  Terminal and Toolkit.dc.html   07
  Installer and Delivery.dc.html 08
  Build Handoff.dc.html    09
  TraceField.dc.html       shared trace-field component used by the plates
  support.js               runtime the plates need to render
  _ds/                     Charleston Zero Day design system bundle + tokens
  assets/                  logo crops used by the plates
png/                       flat 1920 × 1080 export of every plate, by deliverable
```

Open any `plates/*.dc.html` directly in a browser. The plates carry a few tweak controls (disk
mode, install state, respin year, matrix state) used to show alternate frames of the same surface.

## Still open

1. **Who physically holds the signing stick** — IoTemy Labs owns the key; `RELEASING.md` needs the
   individual plus a backup, or a release stalls the week that person is away.
2. **Campus mirror** — stays `TBC` until somebody hosts it.
