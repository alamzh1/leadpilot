---
name: LeadPilot
description: AI research workspace — scattered public noise turned into one verifiable company dossier.
colors:
  graphite: "#0b0f14"
  panel: "#141a21"
  panel-raised: "#1b232c"
  paper-white: "#f4f7f8"
  slate-muted: "#97a4ae"
  verified-lime: "#c6f56b"
  lime-ink: "#0b0f14"
  unverified-cyan: "#7dc8d8"
  hairline: "#222b35"
  hairline-strong: "#34414e"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, min(6.65cqi, 7.4svh), 4.5rem)"
    fontWeight: 650
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 1.75vw, 2.875rem)"
    fontWeight: 650
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  statement:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title-latin:
    fontFamily: "Space Grotesk, Inter, ui-sans-serif, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "0.04em"
rounded:
  none: "0"
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "16px"
  2xl: "20px"
  3xl: "28px"
spacing:
  unit: "4px"
  nav: "64px"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 3rem)"
  section: "clamp(5rem, 3.5rem + 6vw, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.verified-lime}"
    textColor: "{colors.lime-ink}"
    rounded: "{rounded.lg}"
    padding: "14px 28px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#cdf57f"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "14px 28px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.panel}"
  button-lg:
    padding: "20px clamp(1.5rem, 0.5rem + 3.5vw, 3.5rem)"
    height: "60px"
  button-sm:
    padding: "12px 20px"
    height: "40px"
  button-disabled:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.slate-muted}"
  chip:
    backgroundColor: "color-mix(in srgb, #1b232c 72%, transparent)"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "10px 15px"
    height: "36px"
  chip-hover:
    backgroundColor: "{colors.panel-raised}"
  chip-selected:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.graphite}"
  chip-lg:
    padding: "12px 20px"
    height: "44px"
  field:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "0 18px"
    height: "52px"
  icon-tile:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    size: "48px"
  inline-badge:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.verified-lime}"
    width: "1.2em"
    height: "0.82em"
  connector:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    size: "28px"
  tile:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  segment-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.3xl}"
    padding: "28px"
  plate:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.3xl}"
  nav:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.slate-muted}"
    height: "{spacing.nav}"
  profile-cell:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
---

# Design System: LeadPilot

## Overview

**Creative North Star: "The Research Desk"**

LeadPilot is a working desk, not a brochure. Every surface reads as an instrument panel at night: graphite ground, flat panels and hairlines, data set in mono, and colour reserved for the state of information. The page's one visual idea is the passage from noise to dossier: cold cyan fragments that are not yet checked resolve, in stepped frames, into lime fields that are.

Two layers share the desk. The **object layer** — buttons, chips, fields, cards, tiles and image plates — is soft and calm: rounded corners on one scale (14px controls, 16–20px cards, 28px plates), solid fills, smooth eased hovers. The **data layer** sits on a strict 4px grid inside those objects and stays hard-edged: 4px data squares, square stage and rail markers, authored 8×8 pixel icons, a blinking block caret, and state animation that moves in `steps()` rather than easing. Type stays Inter / Space Grotesk / IBM Plex Mono. Atmosphere (glass, glow, luminous lime) lives only inside the raster plates; the built UI never borrows it.

Composition is large and quiet: big statements (often centred), generous section air (5–10rem), rounded tiles with their caption beneath or centred inside, and everything shown at once — steps as one connected pipeline, segments side by side — rather than paged behind tabs or carousels. The confirmed rejections come from the product brief: purple gradients, glowing orbs, meaningless particles, heavy shadows, rows of identical cards.

**Key Characteristics:**
- Rounded objects, square data: controls 14px, cards 16–20px, plates 28px; every pixel element stays square.
- Colour is state: cyan = unverified, lime = verified and the one primary action.
- Pixel grammar on a 4px grid: 4px fragments, state squares, 8×8 icons, block caret.
- Data-state motion runs in discrete steps; control hovers ease; reduced motion shows the final frame instantly.
- Mono only for data: field keys, sources, dates, statuses, paths.

## Colors

A near-black graphite field with two cool neutrals and exactly two signal colours, each bound to a meaning.

### Primary
- **Verified Lime** (verified-lime): verified profile fields (dot, outline flash, check), completed stages, the logo mark, text selection, the input caret, the check badge, and the single primary action per view. Text on it is always Lime Ink.

### Secondary
- **Unverified Cyan** (unverified-cyan): data that is still being checked — 4px fragments, pending-cell outlines (55% mix), skeleton blocks (35% mix), the active stage, demo notices, focused fields, and the global focus ring.

### Neutral
- **Graphite** (graphite): page ground, nav, footer, field fill, workspace and mini-window bodies; text on selected chips.
- **Panel** (panel): first-level surfaces — tiles, process and segment cards, profile cells, schema boards.
- **Panel Raised** (panel-raised): chip fill (72% mix), icon tiles, pipeline connectors, inline badges, disabled button; the highest tonal step.
- **Paper White** (paper-white): primary text and the fill of a selected chip.
- **Slate Muted** (slate-muted): secondary text, captions, nav links, mono field keys, placeholders, hover border on ghost buttons and fields.
- **Hairline** (hairline): section dividers, panel separators inside cards, dot-grid and fallback grids.
- **Hairline Strong** (hairline-strong): control and data-card borders, ghost-button frame, pending stage markers, rail and pipeline connector lines, scrollbar thumb.
- **Lime Ink** (lime-ink): text on lime; same value as Graphite.

### Named Rules
**The Colour-Is-State Rule.** Cyan and lime never decorate. Cyan means "not yet verified" (or focus); lime means "verified" or "the one primary action here." Selection is a neutral inversion (Paper White chip), not a colour. No third accent exists — the theme resets `--color-*` so none can be added by accident.

**The One Lime Button Rule.** At most one lime primary button per viewport zone; every other action is ghost, chip or a plain link.

## Typography

**Display Font:** Inter (with ui-sans-serif, system-ui)
**Latin Label Font:** Space Grotesk (with Inter fallback for Cyrillic)
**Data Font:** IBM Plex Mono (with ui-monospace)

**Character:** Inter carries every Russian headline at a dense 650 weight and tight −0.035em tracking, so Cyrillic stays first-class. Space Grotesk appears only on Latin product names — the logo, Discover / Verify / Qualify, module names, demo company names on chips — because it has no Cyrillic. Plex Mono is the voice of the data.

### Hierarchy
- **Display** (650, 1.04): the hero H1 only. It clamps by both column width and viewport height (`min(cqi, svh)`; phone floor 1.625rem, ≥1024px `clamp(2.5rem, min(6.65cqi, 7.4svh), 4.5rem)`) so the hero always fits one screen; each phrase on its own line.
- **Headline** (650, clamp 2→2.875rem, 1.06): section H2s. The closing statement is a one-off at up to 4.25rem, centred, max 18ch.
- **Statement** (650, clamp 1.75→2.25rem, −0.03em): segment names on «Для кого» cards; Space Grotesk 600 on the Latin pipeline step names (Discover / Verify / Qualify) at the same size, with a muted Russian one-word label beside.
- **Title** (650, 1.375rem, −0.02em): H3s under problem tiles.
- **Title Latin** (Space Grotesk 600, 1.5rem, −0.025em; the lead module grows to clamp 1.75→2.5rem): Latin module names, centred in capability cards.
- **Lead** (400, clamp 1.0625→1.25rem, 1.55): hero subtitle and section intros, max 46ch, Slate Muted.
- **Body** (400, 1rem, 1.6): running text; secondary copy and captions 0.9375rem; small captions 0.8125rem; descriptions held at 34–44ch.
- **Data** (Plex Mono 400): paths, sources, dates, step numbers ("01"), statuses, field tags.
- **Label** (Plex Mono 400, 0.6875rem / 0.625rem compact, +0.04em, uppercase): profile field keys only, preceded by a 4px state square.

### Named Rules
**The Mono-Is-Data Rule.** IBM Plex Mono is used only for machine-shaped content: field keys, sources, dates, statuses, file and workspace paths. Never for headings, buttons or marketing copy.

**The Latin-Only Grotesk Rule.** Space Grotesk is assigned per element to Latin strings only; any Cyrillic heading uses Inter.

## Layout

A 1280px page container (80rem) with a fluid gutter (1→3rem) and a 4px spacing unit. Sections stack full-bleed, each separated by a single bottom hairline, with fluid vertical padding (5→10rem). The sticky nav is 64px — logo left, links grouped on the right beside the small lime CTA; anchored sections offset by it.

Recurring arrangements:
- **Hero (one viewport):** the hero is exactly `100svh − nav` tall (min 33rem) and never scrolls internally. A column: H1 + lead with the four demo facts (one inline text line on phones, four filled tiles at 640px, a right-aligned column with icon tiles from 1024px); then the workspace plate takes all remaining height (`flex-1 min-h-0`), its window fading out at the bottom under a soft mask with the company chips on that edge; the last row is the action bar above a hairline (caption · "Как это работает" mini-link · large lime CTA; on phones a full-width CTA with the link beneath). Vertical gaps and paddings are `svh`-clamped so the whole stack fits from 667px tall phones to 900px desktops.
- **Connected pipeline:** three step cards in one row from 1024px (stacked below), each linked to the next by a connector — a 1px Hairline Strong line through a 28px arrow tile — sitting in the gap (below the card when stacked). Every card shows its own mini window on demo data and ends with an «На выходе:» line above a hairline. No tabs, no paging.
- **Segments at once:** three segment cards side by side from 1024px, rows aligned across cards with `grid-rows-subgrid` (name + task · Кто · Что смотрит в профиле + mini profile · Результат · scenario); stacked below 1024px. Each card carries a different mini profile.
- **Header with media:** section heading and lead left, a small rounded image plate right (80px square on phones, 224–288px 4:3 above).
- **Tiles with caption beneath:** rounded tile carries the schema; title and muted text sit below it, outside any frame.
- **Centred statement:** a large centred headline with inline icon badges, one lime button under it, a wide rounded image plate below.
- **Footer:** a formal column footer — brand (mark, wordmark, "AI Research Workspace", a 44ch muted description) over a 5fr column, then three 2fr link columns (Продукт, Для кого, Проект with external GitHub links) headed by small Inter 600 titles with 0.875rem muted links; below a hairline, the copyright left and the legal note right. Two columns on phones with the brand spanning both.

Capabilities keeps asymmetric spans (7 + 5 + 5 + 12) so the four modules are never equal. Data panels inside cards are `gap-px` grids on a hairline background, so cells read as one dossier cut by 1px lines.

Breakpoints in use: 640px (sm), 768px (md: nav links appear), 1024px (lg: pipeline and segment cards go three across, 12-col grids, hero facts move to a right column), 1280px (xl). Below 768px the nav collapses to a full-width panel with 48px hairline rows.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (Graphite → Panel → Panel Raised) and 1px hairlines. Shadows appear only where a UI object floats over a raster plate.

### Shadow Vocabulary
- **Desk lift** (`0 24px 60px -20px rgb(0 0 0 / 0.7)`): the hero workspace window over its plate.
- **Chip lift** (`0 8px 24px -12px rgb(0 0 0 / 0.8)`): the company chips overlapping the bottom edge of the hero plate.

### Named Rules
**The Hairline-Not-Shadow Rule.** Separate surfaces with a 1px Hairline or a tonal step. A new shadow needs the same reason the desk and its chips have: a UI object floating over a raster plate.

## Shapes

Two shape languages, assigned by layer.

**Objects are rounded on one scale:** 6px for tiny inline tags, 10px for mono field tags, small labels, row icon tiles and pipeline connectors, 14px for every control (buttons, chips, fields, icon tiles, search rows, nav links), 16px for compact cards, fact tiles and mini windows, 20px for tiles and cards (problem tiles, process cards, capability cards, profile card), 28px for plates and large containers (hero plate, image plates, demo workspace, segment cards). On phones the hero plate steps down to 20px and its window to 16px. Inline badges inside headlines scale with the type (0.24em). Rounded containers clip their contents (`overflow: hidden`), so inner hairline grids stay square-celled.

**Data is square:** 4px state squares and fragments, 16px stage and rail markers, 8px-pitch skeleton bars, dotted 8px schema grids, 8×8 pixel icons, the block caret, and dashed outlines for missing data never take a radius.

### Named Rules
**The Round-Object, Square-Pixel Rule.** If it is something you press or a surface that holds content, it takes a radius from the scale; if it is a unit of the pixel grammar, it stays square. Never mix inside one element.

## Components

### Buttons
Solid, rounded, calm: colours ease over 180ms (ease-out-expo) and a press drops the button 1px.
- **Primary:** Verified Lime fill, Lime Ink text, Inter 600 at 0.9375rem, 48px, 14px radius; may carry a trailing pixel arrow.
- **Large:** 60px, 1rem, fluid side padding — hero action bar (full-width, 52px on phones), closing statement, mobile nav panel.
- **Small:** 40px, 0.875rem — nav CTA and secondary inline actions.
- **Ghost:** transparent with a 1px Hairline Strong frame; hover fills Panel and the frame turns Slate Muted.
- **Focus:** the 2px cyan outline at 3px offset. **Disabled:** Panel Raised fill, Slate Muted text, no press.

### Chips
- **Style:** small rounded toggles — translucent Panel Raised fill, transparent 1px border, 14px radius, 36px, 0.8125rem 600; large variant 44px, 0.9375rem. Company names set in Space Grotesk. In the hero they are the company switcher sitting on the plate's faded bottom edge (first word only on phones, so three fit one line).
- **State:** hover fills Panel Raised with a Hairline Strong border; selected (`aria-pressed`) inverts to a Paper White fill with Graphite text (its sub-label mutes to a 70% mix).
- **Tags:** mono field tags in cards are 10px-radius Panel Raised or 1px-bordered pills, not interactive.

### Cards / Tiles / Plates
- **Tiles:** Panel fill, 20px radius, no border, 20–32px padding; the caption either sits beneath (problems) or is centred inside around a UI fragment (capabilities).
- **Process cards:** Panel, 20px radius, no border, 20–24px padding: mono step number ("01"), Space Grotesk step name with a muted Russian label, muted description, a mini window, and an «На выходе:» line (bold Paper White lead-in, muted text) above a hairline. All three are always visible; none is "active".
- **Mini windows:** Graphite body, 16px radius, 1px Hairline Strong border, clipped, a mono `company / step` path bar with a state mark. The content shows the data state for that step: Discover — loose, offset findings in square 55% cyan outlines; Verify — a hairline list with lime pixel checks, mono dates and a struck-through, dashed-marker outdated row; Qualify — lime-keyed profile cells in a `gap-px` grid under a 60% lime outline.
- **Segment cards:** Panel, 28px radius, 24–28px padding; Statement name and muted task, then three rows each led by a 28px Panel Raised icon tile (10px radius) — Кто, Что смотрит в профиле (with a mini profile window), Результат — and a hairline-topped scenario paragraph.
- **Data cards** (profile card, workspace window, mini windows, capability fragments): 16–20px radius, 1px Hairline Strong border, clipped; window chrome is a top bar with a mono path and status square over a hairline. The hero window additionally fades out at the bottom with a mask (`clamp(1.25rem, 22%, 4.5rem)`) instead of ending on a border.
- **Plates:** 28px radius image containers with a palette-only CSS grid fallback when the image fails.

### Icon Tiles and Inline Badges
Icon tiles are 44–48px Panel Raised squares rounded 14px holding a 16–24px pixel icon (hero fact column, hero mini-link); a compact 28px variant rounded 10px leads the rows on segment cards.

### Pipeline Connector
A 28px Panel Raised square, 10px radius, 1px Hairline Strong border, holding a 16px pixel arrow (rotated 90° when stacked), threaded on a 1px Hairline Strong line through the gap between step cards. Decorative (`aria-hidden`), never a button. Inline badges sit inside a large headline line as a small rounded Panel Raised plaque with a lime or white pixel glyph; a lime-filled badge is reserved for the verified check.

### Inputs / Fields
- **Style:** Graphite fill, 1px Hairline Strong border, 14px radius, 52px, 18px padding, lime caret, Slate Muted placeholder.
- **Focus:** border turns Unverified Cyan (outline offset 0).
- **Error:** border turns Paper White and the message is written out — error by text, never red.

### Navigation
Sticky 64px Graphite bar with a bottom hairline: pixel-mark logo + Space Grotesk wordmark left; on the right, four Inter 0.875rem links in Slate Muted (hover Paper White, 14px-rounded 40px hit areas) grouped directly beside the small lime CTA. Under 768px a toggle opens a full-width panel of 48px hairline-separated rows.

### Profile Cell (signature)
The dossier field. A 4px state square plus a mono uppercase key, then the value. Pending: cyan outline at 55% and rows of 4px cyan skeleton blocks holding the value's height. Verified: lime square and a 900ms three-step lime outline flash. Missing: dashed Hairline Strong outline. 4px cyan fragments converge on the cell in `steps(4)` as it resolves — the pixel-assembly signature. Cells are square and sit in a `gap-px` hairline grid inside a rounded card.

### Stage Rail
Four research stages as square 16px markers: pending is an outlined Graphite box, active is cyan and blinks in `steps(1)`, done is lime with a pixel check; connectors are 1px, lime at 70% behind done stages.

### Pixel Icons
Authored 8×8 grids rendered at integer multiples (16/24/32px) with currentColor; a secondary cell renders in cyan for unverified accents.

## Do's and Don'ts

### Do:
- **Do** use cyan only for unverified, pending and focused states, and lime only for verified data and one primary action per view.
- **Do** round every control at 14px, cards and tiles at 16–20px and plates at 28px — values from the scale only.
- **Do** keep pixel elements square and on the 4px grid: 4px fragments and state squares, 8px skeleton pitch, 16px markers, icons at 16/24/32px.
- **Do** separate surfaces with 1px Hairline lines and tonal steps, building data panels as `gap-px` grids inside clipped rounded cards.
- **Do** animate data state in `steps()`, ease control hovers, and show the final frame instantly under `prefers-reduced-motion`.
- **Do** set Russian headings in Inter 650 at −0.035em and reserve Space Grotesk for Latin names.
- **Do** keep raster atmosphere inside plates with a palette-only CSS grid fallback when the image fails.
- **Do** keep the hero to exactly one viewport (`100svh − nav`): the workspace plate absorbs the remaining height and the action bar is its last row.

### Don't:
- **Don't** add a third accent colour, gradients on UI surfaces, purple gradients, glowing orbs or meaningless particles.
- **Don't** round pixel elements, and don't bring back stepped or clipped corners on controls.
- **Don't** add shadows to panels, cards or buttons; only objects floating over a plate (the desk, its chips) get one.
- **Don't** use Plex Mono for headings, buttons or marketing copy.
- **Don't** signal errors with a red; state the error in text.
- **Don't** lay out rows of identical cards; feature modules vary spans, and every tile in a row carries its own schema or content.
- **Don't** hide steps or segments behind tabs, carousels or arrow paging; show all of them at once and connect or align them instead.
- **Don't** put tracked uppercase kicker lines above headings; uppercase mono is for data field keys only.
