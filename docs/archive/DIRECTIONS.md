# Phase 3 directions (PLAYBOOK v3)

Written 2026-11-08 for the owner's pick. The owner picks one direction or a mix at the gate, and the pick is then locked into `IDENTITY.md` as exact tokens. Style tiles for all three are in the Design artifact (link in HANDOFF). Taglines: `research/raw/taglines-2026-11-08.md`. Names and fonts: `research/raw/names-fonts-2026-11-08.md`.

## Step 0: context profile

- **Who:** (1) hackathon judges on a laptop, 5 to 10 minutes each, scoring against a rubric; (2) crypto and prediction-market people arriving from X on a phone to make one pick; (3) AI agents, which only read the API, so they have no visual surface.
- **Device and setting:** a 1440 laptop for judges, a 390 phone for pickers, and 1920 by 1080 for the video and the deck.
- **Session:** short, from one glance to five minutes. Two jobs: see the live state (which window is open, who called what, who is trusted), and check the proof (Walrus receipts, payments, the learning numbers).
- **Density:** medium on the board, higher on Receipts. The first viewport stays low density.
- **Cost of a mistake:** low (a pick costs nothing). The cost of distrust is high: every number has to look checkable.
- **Motion budget:** measured. Live numbers change every few seconds, so nothing decorative moves near them. One signature moment, when a window resolves.
- **Interaction model:** glanceable, plus one touch action (a pick: up or down and a confidence). Receipts is exploratory: open a blob, run the memory check.

## Step 1: defaults we refuse

(a) What any AI makes for a crypto prediction dashboard: a near-black navy page, neon green and red for up and down, glass cards, Inter or Space Grotesk, candlestick charts, an "AI" gradient badge, a row of three rounded stat cards.

(b) What it makes after reading section 6: a warm cream "paper" page, a serif display (Newsreader, Fraunces), a red-pencil or terracotta accent, hairline rules and tracked mono labels. That is the retired Grudge Book, so it is spent. Its fallback, neobrutalism (flat yellow, thick black borders, offset shadows), is spent too.

## How the three differ

| | Ground | Dominant hue | Leads with | Layout signature |
|---|---|---|---|---|
| 1 Formline | bright cool white (the one light ground) | cerise | condensed grotesk | a race card: one runner row per source |
| 2 Hindcast | saturated cobalt (the ground is the dominant) | cobalt blue | monospace | a verification chart: a drum-chart band over time, with station plots |
| 3 Grudge | painted scoreboard green (tinted dark, coloured) | scoreboard green | fat-face slab | a manual scoreboard: a fixed grid of hung number plates |

---

## 1. Formline

**Taglines:** "Every source has a form line." · "Four runners. A form line each." · "Back the source with the record."
**Motto:** Formline weighs each source by how it has actually run.

**World** (from the domain: betting). Race cards and the form pages of racing papers, where each runner's past results are printed as a row of figures, and jockey silks, which identify a runner by colour and pattern at a distance. Reference objects (mood only): a race-day card, a form guide's past-performance block, jockey silks on a rail, a saddle cloth with its number, the results board at the winning post.

**Emotion:** "I can read who is in form at a glance." **Voice:** a paddock tipster, short and specific. Sample: "Polymarket called 78% up and Bitcoin fell. Its form line takes the miss."

**Palette** (area: about 55 ground, 30 cerise, 10 ink, 5 silks)
| Token | Hex | Role |
|---|---|---|
| ground | `#F7F8FA` | page; race cards are printed on bright white so the silks read (cool, not cream) |
| ink | `#14161C` | text, rules, saddle-cloth numbers |
| cerise | `#C8185F` | dominant: the header band, the trusted runner's row, the posted result |
| primrose | `#F5D20F` | accent: the open window, focus |
| silks | royal `#1F3FBF`, emerald `#0B8457`, plus cerise and primrose | one two-colour silks pattern per source |
Contrast: ink on ground 17.0:1; white on cerise 5.6:1; cerise text on ground 5.3:1; ink on primrose 12.2:1.

**Type:** display **Sofia Sans Extra Condensed** 800 (Lettersoup; OFL; fonts.google.com/specimen/Sofia+Sans+Extra+Condensed). Form guides set dense runner data in condensed sans so a whole field fits one column. Text: **Sofia Sans** 300 and 400 (same foundry). Scale: form figures at 96 px against a 15 px body, with weights 800 against 300.

**Signature move:** the page is a race card. Each source is a full-width runner row: saddle-cloth number, silks, name, its form figures for the last ten windows (1 = right, 0 = wrong, S = split), and its trust shown as its share of the field. The open window is the next race; the result is posted in finishing order.

**Art medium:** bold flat shapes, made from silks geometry (hoops, diamonds, quarters, chevrons, sash, stars). The logo is a silks jacket built from those shapes.
**Icons:** a 24 px grid, filled shapes with no strokes and square corners. Metaphors come from the course: cap, saddle cloth, winning post, rail.
**Motion:** measured. Rows never move while you read them. **Signature motion:** when a window resolves, each runner's new figure drops into the front of its form line and the older figures step one place left (250 ms ease-out, 80 ms stagger in finishing order).
**Category test:** nobody guesses race-card silks from "crypto prediction app", and silks are neither cream nor neon.

---

## 2. Hindcast

**Taglines:** "Markets get graded like forecasts." · "Every call scored when the window ends." · "Four sources, graded every five minutes."
**Motto:** Hindcast grades each source with the Brier score, invented in 1950 to grade weather forecasters.

**World** (unexpected, and the deepest link to how the product works). Weather-forecast verification: the Brier score that Grudge uses was published in 1950 to grade weather forecasters. Reference objects (mood only): a weather station's barograph drum chart, the station-model plots on a synoptic chart (the okta circle filled by eighths), cold and warm front symbols, a wind sock in international orange, a radiosonde balloon release.

**Emotion:** "This is measured, not guessed." **Voice:** a duty forecaster's log, plain and numeric. Sample: "Kalshi said 81% up. Bitcoin finished lower. Brier 0.656."

**Palette** (area: about 60 cobalt, 30 chart, 10 orange and ink)
| Token | Hex | Role |
|---|---|---|
| cobalt | `#2B54C9` | ground and dominant: the cold-front blue of a synoptic chart |
| chart | `#D9ECE6` | surface: the pale grid paper of a barograph drum, for data panels |
| ink | `#0F1B44` | text on chart panels |
| white | `#FFFFFF` | text on cobalt |
| orange | `#FF6A2B` | accent: wind-sock orange; the open window and the pick action (with ink text, never as text on cobalt) |
Contrast: white on cobalt 6.5:1; ink on chart 13.6:1; cobalt on chart 5.3:1; ink on orange 5.8:1. Orange on cobalt is 2.3:1, so orange is only ever a fill.

**Type:** display **Martian Mono** at 200 and 800, across its width axis (Evil Martians; OFL; fonts.google.com/specimen/Martian+Mono). Weather reports (METAR, TAF) and station plots are fixed-width codes. Text: **Atkinson Hyperlegible Next** (Braille Institute; OFL), built for legibility the way public weather notices must be. Scale: the Grudge line at 120 px wide-800 against a 15 px body.

**Signature move:** the page is a verification chart. A full-width drum-chart band runs along the top: time left to right, each source's call as a trace, and each resolved window as an outcome tick. Below it, each source is a station plot, an okta-style circle filled to its call with its Brier score beside it. Disagreements are drawn as a front line between two stations.

**Art medium:** data as image and technical drawing. The traces, okta circles, front symbols and wind barbs are the art. The logo is a station plot.
**Icons:** a 20 px grid, 1.5 px strokes with round terminals, glyph-like, from WMO weather symbols.
**Motion:** near-still. The trace extends only when new data arrives. **Signature motion:** when a window resolves, every station's circle snaps to the outcome and the front between the two that disagreed is drawn along its length (400 ms ease-out).
**Category test:** a weather chart is not what a crypto app looks like, and the cobalt ground is neither slate nor black.

---

## 3. Grudge

**Taglines:** "Every miss stays on the board." · "Wrong once, marked down until earned back." · "Markets forget. Grudge keeps the book."
**Motto:** Grudge keeps a score for each source and takes nothing off until the source earns it back.

**World** (unexpected: sport scoring, not betting). A hand-operated cricket scoreboard: a big board painted green, with numbers on separate metal plates that a scorer hangs by hand, and lamps that show changes. Reference objects (mood only): a painted wooden scoreboard at a county ground, black number plates with white numerals on hooks, the scorer's hatch, the "last wicket" line, an indicator lamp.

**Emotion:** "Everyone can see the score, and it stays up." **Voice:** a scorer, dry and literal. Sample: "The Crowd called 64% up. Bitcoin fell. Its weight drops until it is right again."

**Palette** (area: about 65 green, 20 plates, 15 yellow and white)
| Token | Hex | Role |
|---|---|---|
| green | `#1D4B35` | ground and dominant: the painted board |
| plate | `#151718` | number plates (small units, never the page) |
| white | `#F2F3EE` | numerals and text |
| yellow | `#F4C430` | accent: the latest change, the open window, the pick action |
| signal | `#E8553E` | a wrong call; only as a fill or a lamp, never as text on green (2.8:1) |
Contrast: white on green 8.9:1; yellow on green 6.1:1; white on plate 16.1:1.

**Type:** display **Ultra** (Astigmatic; OFL; fonts.google.com/specimen/Ultra), a fat-face slab with the weight of painted ground signage and wood type. Text: **Schibsted Grotesk** (Bakken & Bæck; OFL), made for a newspaper group's pages. Scale: plate numerals at 112 px against a 15 px body.

**Signature move:** the page is a manual scoreboard: a fixed grid of plates on the green board. Columns are sources; rows are right, wrong, trust and the last call. Every number sits on its own plate, and a "last window" line runs along the bottom like "last wicket".

**Art medium:** type as image. The numeral plate is the unit of every graphic, and all of it is drawn flat (no wood grain, rust or shadows, per section 6).
**Icons:** a 24 px grid, 3 px strokes with square ends and stencil-like breaks. Metaphors: plate, hook, lamp, hatch.
**Motion:** measured. **Signature motion:** when a window resolves, the scorer re-hangs the changed numbers: each old plate drops out (180 ms ease-in), the new plate drops in (220 ms ease-out), 60 ms stagger by column, and one lamp lights for a second.
**Category test:** a green cricket scoreboard is not a crypto look, and it is neither cream paper nor neon on black.

---

## Name check (Haiku, 2026-11-08)

- **Formline, Racecard, Grudge:** low risk; no conflict found in prediction, betting or crypto.
- **Hindcast:** medium; a 2026 arXiv framework replays prediction markets to evaluate LLM forecasters under that idea.
- **Brier:** high; `Noisyxl/brier` (116 stars) is a prediction ledger with proper scoring rules, close to ours. Dropped as an alternative.
- The `.app` and `.xyz` domains resolve for all five, so none is free; the submission needs no domain.
- **Fonts:** all six are on Google Fonts. Licences are assumed OFL (Google's metadata carries no licence field), so confirm each family's licence before the lock. Ultra is a slab serif and is the only serif-led direction.

## Gate question

Pick one, or mix them (for example, Hindcast's world with Grudge's name). The name decides whether the repo, docs and UI copy get renamed: Formline and Hindcast mean a rename, Grudge does not.
