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
    fontSize: "clamp(2.5rem, 1.35rem + 4.6vw, 4.75rem)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 1.75vw, 2.875rem)"
    fontWeight: 650
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 650
    lineHeight: 1.33
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
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "0.04em"
rounded:
  none: "0"
spacing:
  unit: "4px"
  nav: "64px"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 3rem)"
  section: "clamp(5rem, 3.5rem + 6vw, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.verified-lime}"
    textColor: "{colors.lime-ink}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#cdf57f"
  button-ghost:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.panel}"
  button-sm:
    padding: "0 14px"
    height: "36px"
  button-disabled:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.slate-muted}"
  chip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.panel-raised}"
  field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "48px"
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

LeadPilot is a working desk, not a brochure. Every surface reads as an instrument panel at night: graphite ground, flat panels cut by 1px hairlines, data set in mono, and colour reserved for the state of information. The page's one visual idea is the passage from noise to dossier: cold cyan fragments that are not yet checked resolve, in stepped frames, into lime fields that are.

A small pixel grammar sits on a strict 4px grid on top of the editorial-tech base: 4px data squares, a two-step notch cut from the top-right corner of every button, authored 8×8 pixel icons, a blinking block caret, and motion that moves in `steps()` rather than easing. The grammar is graphical only; type stays Inter / Space Grotesk / IBM Plex Mono. Atmosphere (glass, glow, luminous lime) lives only inside the three raster plates; the built UI never borrows it.

Density is medium: generous section air (5–10rem) around tightly packed data panels. The confirmed rejections come from the product brief: purple gradients, glowing orbs, meaningless particles, heavy shadows, rows of identical cards.

**Key Characteristics:**
- Flat graphite panels separated by 1px hairlines; zero corner radius everywhere.
- Colour is state: cyan = unverified, lime = verified and the one primary action.
- Pixel grammar on a 4px grid: stepped notch, 4px fragments, 8×8 icons, block caret.
- Motion runs in discrete steps; reduced motion shows the final frame instantly.
- Mono only for data: field keys, sources, dates, statuses, paths.

## Colors

A near-black graphite field with two cool neutrals and exactly two signal colours, each bound to a meaning.

### Primary
- **Verified Lime** (verified-lime): verified profile fields (dot, outline flash, check), completed stages, the logo block, text selection, the input caret, and the single primary action per view. Text on it is always Lime Ink.

### Secondary
- **Unverified Cyan** (unverified-cyan): data that is still being checked — 4px fragments, pending-cell outlines (55% mix), skeleton blocks (35% mix), the active stage, selected chips, focused fields, and the global focus ring.

### Neutral
- **Graphite** (graphite): page ground, nav, ghost-button face, the hero desk body.
- **Panel** (panel): first-level surfaces — profile cells, chips, fields, schema boards.
- **Panel Raised** (panel-raised): selected chip, disabled button; the highest tonal step.
- **Paper White** (paper-white): primary text.
- **Slate Muted** (slate-muted): secondary text, nav links, mono field keys, placeholders, hover border on chips/fields.
- **Hairline** (hairline): section dividers, panel separators, dot-grid and fallback grids.
- **Hairline Strong** (hairline-strong): control borders, ghost-button frame, pending stage segments, rail lines, scrollbar thumb.
- **Lime Ink** (lime-ink): text on lime; same value as Graphite.

### Named Rules
**The Colour-Is-State Rule.** Cyan and lime never decorate. Cyan means "not yet verified" (or focus/selection); lime means "verified" or "the one primary action here." No third accent exists — the theme resets `--color-*` so none can be added by accident.

**The One Lime Button Rule.** At most one lime primary button per viewport zone; every other action is ghost.

## Typography

**Display Font:** Inter (with ui-sans-serif, system-ui)
**Latin Label Font:** Space Grotesk (with Inter fallback for Cyrillic)
**Data Font:** IBM Plex Mono (with ui-monospace)

**Character:** Inter carries every Russian headline at a dense 650 weight and tight −0.035em tracking, so Cyrillic stays first-class. Space Grotesk appears only on Latin product names — the logo, Discover / Verify / Qualify, module names, demo company names — because it has no Cyrillic. Plex Mono is the voice of the data.

### Hierarchy
- **Display** (650, clamp 2.5→4.75rem, 1.02): the hero H1 only; in the hero it is sized from its column with container units, capped at 4.75rem.
- **Headline** (650, clamp 2→2.875rem, 1.06): section H2s, kept well below Display. The closing CTA headline is a one-off at up to 4.5rem.
- **Title** (650, 1.5rem, −0.02em): H3s within sections (problems, audiences).
- **Title Latin** (Space Grotesk 600, 1.5rem, −0.025em; the lead module grows to clamp 1.75→2.5rem): Latin module and stage names.
- **Lead** (400, clamp 1.0625→1.25rem, 1.55): hero subtitle and section intros, max 46ch, Slate Muted.
- **Body** (400, 1rem, 1.6): running text; secondary copy 0.9375rem; descriptions held at 36–40ch.
- **Data** (Plex Mono 400, 0.75rem): paths, sources, dates, stage counters ("02/04"), statuses.
- **Label** (Plex Mono 400, 0.6875rem / 0.625rem compact, +0.04em, uppercase): profile field keys only, preceded by a 4px state square.

### Named Rules
**The Mono-Is-Data Rule.** IBM Plex Mono is used only for machine-shaped content: field keys, sources, dates, statuses, file and workspace paths. Never for headings, buttons or marketing copy.

**The Latin-Only Grotesk Rule.** Space Grotesk is assigned per element to Latin strings only; any Cyrillic heading uses Inter.

## Layout

A 1280px page container (`max-w-page`, 80rem) with a fluid gutter (1→3rem) and a 4px spacing unit (`--spacing: 0.25rem`). Sections stack full-bleed, each separated by a single bottom hairline, with fluid vertical padding (5→10rem). The sticky nav is 64px; anchored sections offset by it.

Grids are 12-column and deliberately asymmetric: the hero is 5/7 from 1280px with the desk bleeding past the right viewport edge; Problem puts a sticky 4–5-column heading beside a 7-column list; Capabilities spans 7 + 5 + 5 + 12 so the four modules are never equal. Modules separate by air and one top hairline; only the inner UI fragment gets a frame. Data panels are composed as `gap-px` grids on a hairline background, so cells read as one dossier cut by 1px lines.

Breakpoints in use: 640px (sm), 768px (md: nav links appear), 1024px (lg: process rail turns horizontal, 12-col grids), 1280px (xl: hero splits and bleeds). Below 768px the nav collapses to a full-width panel with 48px rows.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (Graphite → Panel → Panel Raised) and 1px hairlines, never from stacked shadows. The only shadow in the build is one soft ambient drop under the hero desk to lift it off its background plate; behind it the plate image provides the atmosphere.

### Shadow Vocabulary
- **Desk lift** (`box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.7)`): the hero research desk over its plate, nowhere else.

### Named Rules
**The Hairline-Not-Shadow Rule.** Separate surfaces with a 1px Hairline or a tonal step. A new shadow needs the same reason the desk has: a UI panel floating over a raster plate.

## Shapes

Square everywhere: the theme resets the radius scale to a single `0`. The one silhouette is the **pixel notch** — a two-step 4px staircase cut from the top-right corner (8-vertex `clip-path` polygon in `--px-notch`), applied to every button face. Ghost buttons draw their 1px frame as an underlayer clipped by the same notch, so the border follows the steps. Other recurring forms: 4px state squares, 16px square stage markers, 8px-pitch dashed skeleton bars, dotted 8px schema grids, and dashed outlines for missing data.

## Components

### Buttons
Tactile and stepped: a press drops the face 2px and colour changes jump in two steps.
- **Shape:** square with the pixel notch at the top-right.
- **Primary:** Verified Lime face, Lime Ink text, Inter 600 at 0.9375rem, 44px min height, 20px side padding.
- **Ghost:** Graphite face inside a 1px Hairline Strong frame; hover lifts the face to Panel and the frame to Slate Muted.
- **Small:** 36px, 14px padding, 0.875rem — nav CTA and secondary inline actions.
- **Hover / Focus / Active:** primary hover mixes 14% Paper White into lime; focus is the 2px cyan outline at 4px offset on the outer element (the clipped face can't show it); active translates 2px down; all transitions use `steps(2, end)`.
- **Disabled:** Panel Raised face, Slate Muted text, no press.

### Chips
- **Style:** Panel background, 1px Hairline Strong border, square, 40px min height, 0.9375rem text; used for demo-company choice.
- **State:** hover border Slate Muted; selected (`aria-pressed`) border Unverified Cyan on Panel Raised. Small mono tags in data panels follow the same square 1px-border form.

### Cards / Containers
- **Corner Style:** square (0).
- **Background:** Panel cells on a Hairline grid (`gap-px`), Graphite for workspace bodies.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px Hairline or Hairline Strong; window chrome is a top bar with a mono path and status dot, separated by a hairline.
- **Internal Padding:** 16–20px (12px compact); large panels 20–28px.

### Inputs / Fields
- **Style:** Panel fill, 1px Hairline Strong border, square, 48px, 16px padding, lime caret, Slate Muted placeholder.
- **Focus:** border turns Unverified Cyan (outline offset 0).
- **Error:** border turns Paper White and the message is written out with a cyan 4px square — error by text, never red.

### Navigation
Sticky 64px Graphite bar with a bottom hairline: pixel-mark logo + Space Grotesk wordmark, four Inter 0.9375rem links in Slate Muted (hover Paper White), and a small lime CTA. Under 768px a toggle opens a full-width panel of 48px hairline-separated rows ending in a full-width primary button.

### Profile Cell (signature)
The dossier field. A 4px state square plus a mono uppercase key, then the value. Pending: cyan outline at 55% and two rows of 4px cyan skeleton blocks holding the value's height. Verified: lime square and a 900ms three-step lime outline flash. Missing: dashed Hairline Strong outline. Twelve (eight compact) 4px cyan fragments converge on the cell in `steps(4)` as it resolves — the pixel-assembly signature.

### Stage Rail
The demo rail shows four research stages as square 16px markers: pending is an outlined Graphite box, active is cyan and blinks in `steps(1)`, done is lime with a pixel check; connectors are 1px, lime at 70% behind done stages. Compact form: four 32×8px segments plus a mono "02/04" counter. The story process rail (Discover → Verify → Qualify) draws its line in `steps(12)` and lights markers 500ms apart; markers go cyan outline → half lime → full lime.

### Pixel Icons
Authored 8×8 grids rendered at integer multiples (16/24/32px) with currentColor; a secondary "+" cell renders in cyan for unverified accents.

## Do's and Don'ts

### Do:
- **Do** use cyan only for unverified, pending, focused or selected states, and lime only for verified data and one primary action per view.
- **Do** keep every corner square and give buttons the stepped top-right pixel notch (`--px-notch`).
- **Do** separate surfaces with 1px Hairline (#222b35) lines and tonal steps, building data panels as `gap-px` grids.
- **Do** align pixel elements to the 4px grid: 4px fragments and state squares, 8px skeleton pitch, icons at 16/24/32px.
- **Do** animate state in `steps()` and show the final frame instantly under `prefers-reduced-motion`.
- **Do** set Russian headings in Inter 650 at −0.035em and reserve Space Grotesk for Latin names.
- **Do** keep raster atmosphere inside plates with a palette-only CSS grid fallback when the image fails.

### Don't:
- **Don't** add a third accent colour, gradients on UI surfaces, purple gradients, glowing orbs or meaningless particles.
- **Don't** round corners or soften the notch.
- **Don't** add shadows to panels, cards or buttons; the desk lift is the only one.
- **Don't** use Plex Mono for headings, buttons or marketing copy.
- **Don't** signal errors with a red; state the error in text.
- **Don't** lay out rows of identical equal-width cards; vary spans.
- **Don't** put tracked uppercase kicker lines above headings; uppercase mono is for data field keys only.
