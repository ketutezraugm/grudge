# Identity (locked 2026-11-08)

The owner approved this at the PLAYBOOK v3 Phase 3 gate (~18:20 UTC): **the Hindcast world under the name Grudge**, with the per-source record row borrowed from Formline. Every later design step reads this file as the spec, not as inspiration. The three directions considered are in [DIRECTIONS.md](DIRECTIONS.md), and the style tiles are at https://claude.ai/artifact/NLRMhQgaFLEQsBfidcAtRR (artboard 2).

## Name and words

- **Name:** Grudge. **Motto:** "Markets forget. Grudge doesn't."
- **Tagline:** "Markets get graded like forecasts."
- **Voice:** a duty forecaster's log. Plain, numeric, dry. It says what was called, what happened and the score. Writing rules and banned words: `brand-guidelines.md` §5 (still in force).
- **Sample line:** "Kalshi said 81% up. Bitcoin finished lower. Brier 0.656."

## Context profile

- **Who:** judges on a 1440 laptop for 5 to 10 minutes; crypto and prediction-market people on a 390 phone, making one pick; AI agents (API only).
- **Session:** a glance (the live state) or a few minutes (the proof: Walrus receipts, payments, learning numbers).
- **Density:** medium on the board, higher on Receipts, low in the first viewport.
- **Motion budget:** measured, near-still around live data. One signature moment, when a window resolves.
- **Interaction:** glanceable, plus one touch action (a pick: up or down and a confidence). Receipts is exploratory.

## World

Weather-forecast verification. The Brier score that Grudge uses was published in 1950 to grade weather forecasters, so the page borrows the instruments of that trade: the barograph drum chart, the station-model plot (the okta circle, filled by eighths), front symbols, wind barbs and wind-sock orange. Colours come from those objects: cold-front blue, drum-chart paper, wind-sock orange.

## Colour tokens

| Token | Hex | Role | Area |
|---|---|---|---|
| `cobalt` | `#2B54C9` | page ground and dominant colour (cold-front blue) | ~60% |
| `chart` | `#D9ECE6` | data panels (drum-chart paper) | ~30% |
| `ink` | `#0F1B44` | text and lines on `chart`; text on `orange` | |
| `white` | `#FFFFFF` | text and lines on `cobalt` | |
| `white-muted` | `#DCE4FA` | secondary text on `cobalt` | |
| `ink-muted` | `#44507A` | secondary text on `chart` | |
| `orange` | `#FF6A2B` | accent **fill only**: the open window, the pick action, disagreement fronts | ~5% |
| `grid` | `#0F1B44` at 18% opacity | chart gridlines on `chart` | |

Verified contrast: white on cobalt 6.53:1; white-muted on cobalt 5.14:1; ink on chart 13.56:1; ink-muted on chart 6.39:1; cobalt on chart 5.32:1; ink on orange 5.83:1; ink on white 16.66:1.
**Forbidden pairs:** orange as text or a line on cobalt (2.29:1) or on chart (2.33:1); ink on cobalt (2.55:1).
Up and down are always the glyphs ▲ and ▼, never colour alone. Right and wrong are a filled or an empty station mark, never red against green.

## Type

| Role | Family | Setting | Source |
|---|---|---|---|
| Display and every number | **Martian Mono** (Roman Shamin, Evil Martians; OFL, verified in Google Fonts METADATA) | `wdth` 75 to 112.5, `wght` 100 to 800. Big numbers wide 112.5 at 800; secondary numbers narrow 75 at 200 | https://fonts.google.com/specimen/Martian+Mono |
| Text and UI | **Atkinson Hyperlegible Next** (Braille Institute, Applied Design Works; OFL, verified) | `wght` 300 body, 400 UI, 700 emphasis | https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next |

Load: `https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@75..112.5,100..800&family=Atkinson+Hyperlegible+Next:wght@300;400;700&display=swap` (in the app: `next/font/google` or self-hosted woff2, with `font-display: swap` and size-adjusted fallbacks so nothing shifts).

**Scale (px):** 12 · 14 · 15 (body) · 18 · 24 · 32 · 52 (headline) · 88 · 120 (the Grudge line). Contrast is extreme on purpose: 120 wide 800 against 15 at 300 (8x size). Mono is for numbers, codes and the display; running text is always Atkinson, so the page does not read as a developer tool.

## Space, shape, line

- **Spacing (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96. Desktop margin 56, gutter 24, 12 columns. Phone margin 16, gutter 16.
- **Radius:** 0 everywhere. Circles appear only as station marks.
- **Lines:** 1.5 px on cobalt (white), 1 px gridlines on chart, 3 px for a source's trace when it is the most trusted.
- **Focus ring:** 2 px solid `white` at 2 px offset on cobalt; 2 px solid `ink` on chart and on white. Never orange.
- **Touch targets:** 44 px or more.

## Icon language

A 20 px grid, 1.5 px strokes with round caps and joins, glyph-like and drawn from WMO weather symbols. Metaphors: the okta circle (a call), a front with teeth (a disagreement), a wind barb (a trust shift), a station plot (a source). Filled shapes appear only inside a station mark. No icon library, no redraws of library icons.

## Signature move

**The page is a verification chart.**
- A full-width drum-chart band: time runs left to right, each source's call at lock is a trace, and each resolved window is an outcome mark (filled = went up, empty = went down, half = split).
- Below it, each source is a station plot: a circle filled to its call, with its trust and score beside it.
- A disagreement of 7 or more points is drawn as a front between the two stations.
- **Record row** (borrowed from Formline): under each station, its last ten windows as ten small station marks, filled for right and empty for wrong, oldest to newest.
- **Last window line:** one plain line stating the last result, for example "15:00–15:15 · down · all three wrong."

## Art direction

Data as image and technical drawing. Traces, station circles, fronts and wind barbs are the art, drawn as original SVG. No textures, grain, paper or imitated materials. The logo is a station plot.

## Motion

| Token | Value | Use |
|---|---|---|
| `instant` | 100 ms | press, hover |
| `quick` | 200 ms | UI changes, a value updating |
| `deliberate` | 400 ms | panels, page changes, a front drawing |
| `moment` | at most 900 ms in total | the resolve sequence |
| `ease-enter` | `cubic-bezier(0.2, 0, 0, 1)` | things arriving |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | things leaving |
| `ease-standard` | `cubic-bezier(0.2, 0, 0.2, 1)` | state changes |

No springs. Animate only `transform`, `opacity` and SVG stroke offsets. Traces extend only when new data arrives, and nothing loops near live numbers.
**Signature motion:** when a window resolves, every station's circle snaps to the outcome (`quick`), the front between the two that disagreed draws along its length (`deliberate`, `ease-enter`), then each record row takes its new mark at the front as the oldest drops off (`quick`, 60 ms stagger).
**Reduced motion:** all of it becomes an instant change; the front appears drawn.

## Not this

- Any AI's crypto dashboard: a near-black navy page, neon green and red, glass cards, Inter or Space Grotesk, candlesticks, gradient badges, rounded stat-card rows.
- The retired Grudge Book: a warm paper ground, a serif display, red pencil, stamps, hairline rules, tracked mono labels, Newsreader, IBM Plex.
- Neobrutalism: flat yellow, thick black borders, offset shadows.
- The directions turned down: Formline (a race card in cerise on white) and the green manual scoreboard (Ultra on plates).
- **Drift to watch for:** a slate or blue-black ground in place of cobalt; Sui's light brand blue; mono used for running text (it reads as a developer tool); orange used as text; gauges, dials or speedometers; any rounded card.
