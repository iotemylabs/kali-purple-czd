# Charleston Zero Day — Design System

Charleston Zero Day (CZD) is West Virginia's cybersecurity conference, held each October at the
University of Charleston. Two days, one main stage, a vendor floor, a lock lab, HAM radio testing,
and a CTF — run by the CZD Board with IoTemy Labs, the University of Charleston, and KDE
Technology.

The brand is a terminal: gold on near-black, monospace, hairline rules, no decoration. It reads
like something a practitioner made for other practitioners — confident, dense with real
information, and legible from across a lobby or folded in a back pocket. Every surface CZD
publishes — digital signage, printed program guides, room boards, wayfinding, the website —
shares one token contract, so the whole conference looks like one system.

## Sources

| Source | Notes |
| --- | --- |
| `uploads/czd-long.png` | The only supplied visual asset: the horizontal logo lockup (capitol-dome-and-circuitry mark + custom-cut wordmark) in gold on transparent, 1640×924. Copied to `assets/` and split into mark / wordmark / trimmed-lockup crops. |
| Written brand brief (chat) | Full color ramp, type rules, layout rules, component inventory, voice, and a do-not list. This is the authoritative specification; everything in this repo traces back to it. |
| `google/fonts` @ `main` | Archivo and IBM Plex Mono OFL releases, copied into `assets/fonts/`. |

No codebase, Figma file, deck, or live site was provided. There was no design-system definition to
import, so the tokens, components, and UI kits here are the first build of the system against the
written brief. **Session content in the UI kits is representative, not the real 2026 program.**

## Index

| Path | What's there |
| --- | --- |
| `styles.css` | The one file consumers link. `@import` list only. |
| `tokens/colors.css` | Surfaces, ink, gold ramp, hairlines, status, `.czd-paper` print inversion. |
| `tokens/typography.css` | Families, weights, tracking, leading, and the signage / screen / print size scales. |
| `tokens/spacing.css` | 4px scale, row rhythm, time-column widths, signage and print frame geometry. |
| `tokens/rules.css` | Rule widths and presets; radius `0`, shadow `none`. |
| `tokens/fonts.css` | `@font-face` for Archivo (variable) and IBM Plex Mono 400/500/600/700. |
| `tokens/base.css` | Minimal reset, body defaults, link colors, selection. |
| `assets/` | Logo crops, webfont files, OFL licences. |
| `components/structure/` | `EyebrowHeader`, `Rule`, `LogoSlot`, `Brandmark` |
| `components/schedule/` | `ScheduleRow`, `SessionTag`, `StatusChip` |
| `components/wayfinding/` | `WayfindingBlock`, `MapKeyItem`, `QRBlock` |
| `guidelines/*.card.html` | Foundation specimen cards (Colors, Type, Spacing, Brand). |
| `ui_kits/website/` | charlestonzeroday.com — home, schedule, venue, sponsors, tickets. |
| `ui_kits/signage/` | Four 1920×1080 boards: NOW/NEXT, room board, wayfinding, hold. |
| `ui_kits/program-guide/` | Letter landscape trifold, inside and outside, dark and paper modes. |
| `templates/` | Copy-and-fill starting points for consuming projects. |
| `SKILL.md` | Agent Skills entry point. |

## Components

Every component in this system comes from the inventory named in the brief. Each directory holds
`<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and one `@dsCard` HTML.

- **`EyebrowHeader`** — eyebrow label + a 1px gold rule that flexes to fill the line.
- **`Rule`** — hair (1px @26%), soft (1px @13%), bold (2px solid gold); horizontal or vertical.
- **`LogoSlot`** — 1px dashed gold box with a 7–7.5px centered mono label.
- **`Brandmark`** — the supplied logo, as lockup / mark / wordmark.
- **`ScheduleRow`** — the core time-plus-content row; variants `standard`, `emphasis`, `terminal`;
  scales `screen` / `print` / `signage`; `capTop` / `capBottom` for the 2px section caps.
- **`SessionTag`** — mono 700, 0.14em, gold, above the title. Never a pill.
- **`StatusChip`** — signage NOW / NEXT / HOLD / STALE.
- **`WayfindingBlock`** — arrow-suffixed gold label, Archivo destination, mono directions, mono time.
- **`MapKeyItem`** — gold numeral + all-caps mono place + detail.
- **`QRBlock`** — 2px gold rule, square QR slot at left, gold eyebrow + two mono lines at right.

### Intentional additions

- **`Brandmark`** — not named in the brief, but the supplied logo needs one sanctioned way in
  (fixed crops, no recolor, no container). Without it every surface hand-rolls an `<img>`.
- **`Rule` as a component** — the brief specifies rule treatments but not a component; making it
  one keeps gold-at-low-alpha the path of least resistance and keeps gray borders out.

---

# CONTENT FUNDAMENTALS

**Person and stance.** Second person, always. "So you've got your badge. What's next?" — not "How
attendees can get started." The reader is standing in a lobby holding this thing; write to them.
First person plural ("we're thrilled") is banned; the conference doesn't talk about itself.

**Register.** Plain, a little dry, occasionally deadpan. Sentences do work. A description states
the useful fact and stops: "Beginners welcome. Picks and practice locks provided." The joke, when
there is one, is a true statement delivered flat: "Hallway track — wherever you are standing.
Historically the best one." / "No password. Assume it is hostile."

**Nothing aspirational.** No "journey", "exciting", "dive into", "unlock your potential",
"cutting-edge", "thrilled to announce". If a sentence would survive being deleted, delete it.

**Uncertainty is marked, not softened.** An unknown fact gets a gold mono `TBC` tag inline —
"Speaker **TBC**", "Room **TBC**" — never "coming soon", "stay tuned", or a vague phrase that
hides the gap. The tag is honest and it is also a to-do list.

**Casing.** Sentence case for titles and headings: "Hiring out of a two-college state". UPPERCASE
is reserved for mono structural type — eyebrows, tags, status chips, room lines, dates. The
wordmark is uppercase because the artwork is. Never title-case a sentence.

**Numbers and tokens.** Sections are zero-padded two-digit: `01`, `02`, `03`. Repeated things get
underscore IDs: `PANEL_01`, `WORKSHOP_03`, `OV-3`. Numerals are tabular.

**Date and time format.**
- Dates: `FRI OCT 02 – SAT OCT 03, 2026` — uppercase, en dash, zero-padded day.
- Times: 12-hour with a single space before AM/PM — `9:25 AM`, `12:00 PM`.
- Ranges in a time column are two lines, start over end. Inline ranges use an en dash.
- The middot `·` separates inline facts: `Riggleman 204 · Both days · Badge required`.
- The `//` comment marker prefixes eyebrow labels: `// 01 · MAIN STAGE`.

**Fixed strings.** Hashtag `#CZD2026`. Site `charlestonzeroday.com`. Venue "University of
Charleston, 2300 MacCorkle Ave SE". Organizers listed as "The CZD Board · IoTemy Labs · University
of Charleston · KDE Technology".

**Emoji: never.** Not in copy, not in signage, not in the program guide, not as bullets. Bullets
are a gold middot or nothing.

**Length.** Signage: one clause. Schedule byline: one sentence, two at the outside. Web body: three
sentences per block. If it needs a fourth, it needs its own section.

---

# VISUAL FOUNDATIONS

**The one-line version.** Gold on near-black, two typefaces, hairlines instead of boxes, zero
radius, zero shadow, zero gradient. Depth comes from surface value shifts and rules only.

### Color

Dark is canonical; light is a print inversion, not a theme. Four surfaces sit within 19 levels of
each other — `#0A0A0A` base, `#050505` inset, `#0B0A07` raised, `#181307` warm well — so a panel
change reads as a plane change, not a card. Ink is warm off-white (`#F4F0E6`) and never pure white;
body is `#A99C83`. One accent hue, four steps: `#FFE9A8` surge (rationed — hover and peak
emphasis), `#E0A82E` the brand gold, `#8A6318` for deep display type and year marks, `#4A320B` for
barely-there fills. Hairlines are always gold at low alpha (0.26 / 0.13) and never gray. The only
non-gold hues in the whole system are `#8A93A0` HOLD and `#6E7681` STALE, and they exist only so a
signage board can admit it has nothing live.

### Type

Two families, nothing else. **Archivo** (500/600/700) for headlines, session titles, wordmarks, and
numerals; tracking tightens as size grows (−0.015em → −0.035em) and leading compresses to
0.84–1.02. **IBM Plex Mono** (400/500/600/700) for everything else — labels, times, body copy,
captions, URLs, directions — with `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
behind it. Eyebrows are mono 700, uppercase, 0.14–0.20em, gold, usually prefixed `//`. The only
pairing in the system is an Archivo title over a mono sub-line; never a mono headline over an
Archivo caption. Floors: 24px on 1920×1080 signage, 8px mono in print (8.5px body, 9px times), 7px
for the dashed logo-slot label.

### Layout

Rigid grids, generous rules, `border-radius: 0` everywhere. Layout is flex/grid with `gap` — never
margin-spaced inline siblings. The core pattern is the time-plus-content row: a fixed narrow left
column of gold mono times (two lines, start over end) beside a flexible content column with an
Archivo title and a mono sub-line. Rows touch — soft hairlines separate them, a section's first and
last row get a 2px standard-alpha rule, and emphasis rows (lunch, breaks) take the 0.05 gold tint
plus 2px rules top and bottom. Section headers are an eyebrow plus a 1px gold rule flexing to fill
the line. Panels divide with 1px soft hairlines and alternating panels may drop to the inset
surface. Signage is a fixed 1920×1080 frame with 4% overscan. Print is Letter landscape trifold,
three equal columns, 1px `#8A6318` fold ticks 12px tall at 33.3% and 66.6%, top and bottom.

### Backgrounds and imagery

Flat surface color. No photography, no stock imagery, no hero image, no illustration, no repeating
pattern, no texture, no noise, no grain. The only artwork in the system is the logo. A full-bleed
"image" in CZD is a full-bleed field of `#050505` with type on it. When a real photograph is
unavoidable (a speaker headshot, a venue shot), crop it hard, render it monochrome-warm, and give
it a 1px gold hairline — no radius, no shadow, no protection gradient. Placeholders are dashed gold
boxes with a mono label saying exactly what is missing ("CAMPUS MAP — ARTWORK PENDING"): an honest
empty slot beats a decorative fill.

### Cards, depth, shadows

There are no cards. What looks like a card is a region of `#0B0A07` or `#050505` bounded by
hairlines. No `box-shadow`, no inner shadow, no glow, no blur, no translucency, no backdrop-filter.
The system never uses transparency except in the gold hairline alphas (0.26 / 0.13 / 0.05) and the
`past` state's 45% row opacity. No protection gradients — there is no imagery to protect type from.

### Motion and state

Near-none, by design. State changes are instant value swaps, not transitions; the longest sanctioned
duration is a 90ms `linear` tick and most things use `0ms`. No fades, no slides, no bounces, no
easing curves with personality, no scroll-triggered reveals, no marquee animation. A board that
changes content cuts to it. Reduced motion is the default, so `prefers-reduced-motion` needs no
special case.

- **Hover (links):** color `#E0A82E` → `#FFE9A8`, and the 26%-alpha underline goes solid gold.
- **Hover (rows):** background picks up the 0.05 gold tint; the top hairline goes from soft to
  standard; title ink goes to `#F4F0E6`. No lift, no scale.
- **Active/press:** drop back to `#E0A82E` — a press reads as the surge going away. Never scale,
  never translate.
- **Selected/current:** gold tint fill plus a 1px gold bottom border (nav) or a filled gold chip
  (signage NOW). Filled gold is the loudest thing in the system; one per screen.
- **Focus:** 1px solid `#E0A82E` outline with a 2px offset. Never remove it.
- **Disabled:** `#6B6152` ink, no fill change, no opacity trick.

### Borders

1px or 2px, always. `--rule-standard` (1px gold @26%) separates; `--rule-soft` (1px @13%) divides
panels and stacks rows; `--rule-bold` (2px solid gold) caps a page, opens a QR block, and marks a
marquee. Dashed 1px gold is reserved for placeholders. Nothing is ever 3px, dotted, double, or gray.

### Spacing

4px grid: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128. Row padding is 12–14px vertical on screen,
5px in print, 22px on signage. Time columns are 92px screen / 52px print / 220px signage. Content
maxes out at 1180px with 32px gutters.

---

# ICONOGRAPHY

**There is no icon set, and that is the design.** The brief specifies no icon system, and nothing
in the supplied material contains one. CZD does the work icons usually do with type:

- **Direction** is a Unicode arrow appended to a gold mono label: `LUNCH →`, `CTF ↑`. Arrows
  attach to the label, never to the destination, and only `→ ← ↑ ↓` are sanctioned.
- **Separation** is the middot `·` between inline facts.
- **Bullets** are a gold middot in a flex row with an 7–8px gap, never a glyph or dash.
- **Section identity** is a zero-padded numeral (`01`) or an underscore ID (`PANEL_02`), in gold.
- **Comment markers** — the `//` prefix on eyebrow labels — are the closest thing the system has to
  a decorative glyph, and they are literally two slashes of body text.
- **Status** is a word in a 1px box (`NOW`, `HOLD`), never a dot, light, or symbol.

**Emoji are never used.** Not in copy, not as bullets, not on signage.

**If you genuinely need a pictogram** (a restroom marker, an accessibility symbol, a fire exit on a
wayfinding board), use the venue's statutory signage symbols or a 1px-stroke geometric set at 24px+
in `#E0A82E`, and add it to this section. Do not hand-draw SVG mascots, shields, locks, or circuit
motifs — the logo already carries all of that, and a second one dilutes it.

**The logo is the only artwork.** `assets/czd-lockup-gold.png` (full lockup), `czd-mark-gold.png`
(capitol dome, circuit traces and keyhole shield), `czd-wordmark-gold.png` (wordmark alone). All
three are gold on transparency, cropped programmatically from the supplied file — nothing was
redrawn. Use them through `Brandmark`. Minimum sizes: 28px tall for the lockup, 40px for the mark.
No recolor, no outline, no plate, no container, no shadow.

---

# Using this system

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { ScheduleRow, EyebrowHeader } = window.CharlestonZeroDayDesignSystem_182c31;
</script>
```

Copy `assets/` into the consuming project and point `Brandmark assetBase` at it. Read each
component's `.prompt.md` for usage and variants; the `.d.ts` is the props contract.

## Known gaps

- No campus map artwork, no QR images, no sponsor marks, no speaker photography — all are dashed
  placeholders labelled with what is missing.
- Session titles, speakers, times and room numbers in the UI kits are written in CZD voice as
  representative content. Replace before publishing.
- Archivo and IBM Plex Mono are the Google Fonts OFL releases, not licensed foundry files. If CZD
  holds different cuts (or the wordmark's custom letterforms exist as a font), swap
  `assets/fonts/` and `tokens/fonts.css`.
