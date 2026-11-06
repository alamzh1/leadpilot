---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface: LeadPilot landing (`app/page.tsx`)

Mode: **Persuade**. Audience: B2B sales leads, SDRs, IT-outsourcing founders and agencies; second reader is the employer reviewing a test task. Action: try the interactive demo (no form, no signup). Proof: the demo itself, run on three labelled fictional companies; no testimonials, logos or numbers exist and none are invented.

Constraints: palette, fonts and section copy pinned by `plan.md` §4–5; user answer «Смешать» adds pixel accents from `design-system.md` (graphical only — fonts stay Space Grotesk / Inter / IBM Plex Mono). Build path: code-led (no harness image tool; Higgsfield supplies three background plates only).

## Direction contract

THESIS: The page is a working research desk that turns scattered public noise into one verifiable dossier. It refuses the static dashboard screenshot in a fake browser frame and the row of three equal icon cards. The built UI stays flat and hairline-cut; the luminous glass-and-lime atmosphere is confined to the three Higgsfield plates, whose prompts plan.md §6 pins.

OWN-WORLD: Graphite #0B0F14 ground; flat panels #141A21 / #1B232C cut by 1px hairlines, almost no shadow. Colour is state: unverified data is cold cyan #7DC8D8 outline, verified data turns lime #C6F56B, and lime also marks the one primary action per view. Pixel grammar on a 4px grid: data fragments are 4px squares, buttons and tabs carry a one-pixel stepped corner notch, icons are authored 8px-grid SVG with crispEdges, the search caret is a blinking block, and stage indicators move in `steps()`. Space Grotesk display, tight; Inter body; IBM Plex Mono only for data (field keys, sources, dates, statuses).

STORY: In 10 seconds the visitor watches the hero desk turn «Vector Logistics» into a profile and reads the H1. Within 30 seconds they are in the demo choosing a company. Then they see why (problem), how (Discover → Verify → Qualify), what (four modules showing UI fragments), and who it is for, and the close sends them back to the demo.

FIRST VIEWPORT: A thin sticky nav: pixel-mark logo, four links and a lime «Попробовать демо». Left five columns: a mono workspace path line «leadpilot / AI RESEARCH WORKSPACE ▌» (the brief's eyebrow, set as window chrome rather than a tracked kicker), a three-line H1 up to ~5.25rem, the subtitle at 46ch, then the lime primary and a ghost secondary button. Right seven columns, bleeding off the right edge: a live autoplaying desk with a typed query, a four-stage rail and cyan fragments resolving into lime-verified fields of a result card, over the Higgsfield hero plate (CSS grid fallback). The demo heading starts at the fold.

FORM: Brief-pinned direction «Premium AI SaaS / Editorial Tech / Data Intelligence» fused with the pixel accents from design-system.md; position 1 of 1 (pinned). seed:c352c7478a49ffd9 (rolled after the build; the direction stays brief-pinned). Signature interaction: pixel assembly. During research, 4px cyan fragments converge in stepped frames into the profile fields, and each field flips cyan → lime as it is verified; under reduced motion this is instant.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Brief overrides recorded at finish review: (a) the three Higgsfield plates follow plan.md §6 prompts verbatim («translucent glass panels», «luminous lime») and stay, framed and toned down by layout rather than regenerated; (b) «AI RESEARCH WORKSPACE» stays as the hero eyebrow line because plan.md §5.2 pins it (craft-floor kicker ban yields to the brief).
- Live analysis on manual input is out of scope by brief (shows a «full version only» notice).
