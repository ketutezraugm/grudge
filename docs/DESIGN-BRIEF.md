# Grudge: design brief (PLAYBOOK v3)

Written for Claude Design, 2026-11-08. Claude Code builds the product and does not design: every screen, graphic and motion below is yours to draw, and Claude Code implements exactly what you draw, adding nothing visual. The identity in section 2 is locked. Work inside it and push it, but do not swap it for another look. The data samples in `data/` are real responses from the live service at 18:00 UTC on Nov 8. Numbers change every few minutes, so design every number as a slot and use the samples only to fill it.

## 1. The product in four lines

Every 5 and 15 minutes, four sources give a probability that Bitcoin ends the window higher: **DeepBook** (an onchain market on Sui), **Polymarket**, **Kalshi** and **the Crowd** (visitors' picks). Grudge freezes their calls at a lock time and scores each source with the Brier score when the window ends. It trusts each source in proportion to how right it has been, and blends the calls into one line. That memory lives on **Walrus** mainnet and survives a full server wipe. AI agents can buy the line for a few cents in USDC on Sui (x402).

**The first 10 seconds, in this order:** (1) the sources disagree about the same Bitcoin move, and Grudge keeps score of who is right; (2) it learns, and the record lives on Walrus; (3) it is live now: a real window, real numbers, a countdown. Agent payments come after these. Add a quiet "Judges: start here" link to `/receipts`.

## 2. Identity (pasted from IDENTITY.md, exact)

The owner approved this at the PLAYBOOK v3 Phase 3 gate (~18:20 UTC): **the Hindcast world under the name Grudge**, with the per-source record row borrowed from Formline. Every later design step reads this file as the spec, not as inspiration. The three directions considered are in [archive/DIRECTIONS.md](archive/DIRECTIONS.md), and the style tiles are at https://claude.ai/artifact/NLRMhQgaFLEQsBfidcAtRR (artboard 2).

### Name and words

- **Name:** Grudge. **Motto:** "Markets forget. Grudge doesn't."
- **Tagline:** "Markets get graded like forecasts."
- **Voice:** a duty forecaster's log. Plain, numeric, dry. It says what was called, what happened and the score. Writing rules and banned words: `brand-guidelines.md` §5 (still in force).
- **Sample line:** "Kalshi said 81% up. Bitcoin finished lower. Brier 0.656."

### Context profile

- **Who:** judges on a 1440 laptop for 5 to 10 minutes; crypto and prediction-market people on a 390 phone, making one pick; AI agents (API only).
- **Session:** a glance (the live state) or a few minutes (the proof: Walrus receipts, payments, learning numbers).
- **Density:** medium on the board, higher on Receipts, low in the first viewport.
- **Motion budget:** measured, near-still around live data. One signature moment, when a window resolves.
- **Interaction:** glanceable, plus one touch action (a pick: up or down and a confidence). Receipts is exploratory.

### World

Weather-forecast verification. The Brier score that Grudge uses was published in 1950 to grade weather forecasters, so the page borrows the instruments of that trade: the barograph drum chart, the station-model plot (the okta circle, filled by eighths), front symbols, wind barbs and wind-sock orange. Colours come from those objects: cold-front blue, drum-chart paper, wind-sock orange.

### Colour tokens

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

### Type

| Role | Family | Setting | Source |
|---|---|---|---|
| Display and every number | **Martian Mono** (Roman Shamin, Evil Martians; OFL, verified in Google Fonts METADATA) | `wdth` 75 to 112.5, `wght` 100 to 800. Big numbers wide 112.5 at 800; secondary numbers narrow 75 at 200 | https://fonts.google.com/specimen/Martian+Mono |
| Text and UI | **Atkinson Hyperlegible Next** (Braille Institute, Applied Design Works; OFL, verified) | `wght` 300 body, 400 UI, 700 emphasis | https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next |

Load: `https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@75..112.5,100..800&family=Atkinson+Hyperlegible+Next:wght@300;400;700&display=swap` (in the app: `next/font/google` or self-hosted woff2, with `font-display: swap` and size-adjusted fallbacks so nothing shifts).

**Scale (px):** 12 · 14 · 15 (body) · 18 · 24 · 32 · 52 (headline) · 88 · 120 (the Grudge line). Contrast is extreme on purpose: 120 wide 800 against 15 at 300 (8x size). Mono is for numbers, codes and the display; running text is always Atkinson, so the page does not read as a developer tool.

### Space, shape, line

- **Spacing (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96. Desktop margin 56, gutter 24, 12 columns. Phone margin 16, gutter 16.
- **Radius:** 0 everywhere. Circles appear only as station marks.
- **Lines:** 1.5 px on cobalt (white), 1 px gridlines on chart, 3 px for a source's trace when it is the most trusted.
- **Focus ring:** 2 px solid `white` at 2 px offset on cobalt; 2 px solid `ink` on chart and on white. Never orange.
- **Touch targets:** 44 px or more.

### Icon language

A 20 px grid, 1.5 px strokes with round caps and joins, glyph-like and drawn from WMO weather symbols. Metaphors: the okta circle (a call), a front with teeth (a disagreement), a wind barb (a trust shift), a station plot (a source). Filled shapes appear only inside a station mark. No icon library, no redraws of library icons.

### Signature move

**The page is a verification chart.**
- A full-width drum-chart band: time runs left to right, each source's call at lock is a trace, and each resolved window is an outcome mark (filled = went up, empty = went down, half = split).
- Below it, each source is a station plot: a circle filled to its call, with its trust and score beside it.
- A disagreement of 7 or more points is drawn as a front between the two stations.
- **Record row** (borrowed from Formline): under each station, its last ten windows as ten small station marks, filled for right and empty for wrong, oldest to newest.
- **Last window line:** one plain line stating the last result, for example "15:00–15:15 · down · all three wrong."

### Art direction

Data as image and technical drawing. Traces, station circles, fronts and wind barbs are the art, drawn as original SVG. No textures, grain, paper or imitated materials. The logo is a station plot.

### Motion

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

### Not this

- Any AI's crypto dashboard: a near-black navy page, neon green and red, glass cards, Inter or Space Grotesk, candlesticks, gradient badges, rounded stat-card rows.
- The retired Grudge Book: a warm paper ground, a serif display, red pencil, stamps, hairline rules, tracked mono labels, Newsreader, IBM Plex.
- Neobrutalism: flat yellow, thick black borders, offset shadows.
- The directions turned down: Formline (a race card in cerise on white) and the green manual scoreboard (Ultra on plates).
- **Drift to watch for:** a slate or blue-black ground in place of cobalt; Sui's light brand blue; mono used for running text (it reads as a developer tool); orange used as text; gauges, dials or speedometers; any rounded card.

## 3. How we stand apart

- **From the field.** Crypto prediction entries look like trading dashboards: dark navy, neon up and down, candlesticks, rounded stat cards. One entry with the same core idea uses an oracle name and a mystical register; another uses paper and pencil. Ours reads as an instrument: weather-verification charts on a cobalt ground. Nobody else's page will look measured.
- **From our own past.** The retired look (warm paper, serif, red pencil, stamps, a gauge) must not come back in any form. No dials, gauges or speedometers: a call is a station circle filled to its probability.
- **The honest result is a feature.** Grudge is slightly ahead of an equal-weight average, not by a clear margin, and about level with the best single source. A verification chart can show that plainly, and it must: never draw Grudge winning.

## 4. Surfaces and order of work

**Step A, first, before any full screen:** three clearly different first-viewport compositions of the Board (`/`) at 1440 by 900, all inside section 2. The owner picks one. Vary the structure (where the drum-chart band sits, how big the line is, where the stations and the pick action go), not the identity.

**Step B, after the pick (batch 1):** full screens at 1440, 1280, 768 and 390, with every state in section 11:
- `/` Board: header with status, category switch (15 min default, 5 min), the drum-chart band, the station plots with record rows, the Grudge line with countdown, the disagreement front and its recalled lesson, the pick action, the last-window line, the history of the last 20 windows, footer.
- `/receipts`: memory totals and the latest blobs (each links to Walruscan), the memory check (button, waiting, result), amnesia history, payments, Tatum counters, the learning figure.
- `/agents`: the x402 flow as five steps, today's price, request and response as real code blocks, paid calls so far.
- 404.

**Step C (batch 2, after batch 1 is approved):** the asset artboards in section 6, the logo and favicon set, the social image template, the README banner, video title cards, and the learning figure as a standalone graphic. The pitch deck is a separate Slides artifact on the same Design System.

## 5. Layout language and first viewports

The signature move sets the structure: **the page is a verification chart.** Sections follow the argument (disagreement, record, proof, payment), not a landing-page order.

- **Board, first viewport (1440):** the cobalt page; the header on one line (logo, Board / Receipts / Agents, status, "Judges: start here"); the drum-chart band on `chart` across the full width or nearly so; the station plots for the four sources with their record rows; the Grudge line at 120 px wide-800 with its countdown; the pick action in orange, visible without scrolling. **The deliberate grid break:** at least one element breaks the 12-column grid, for example the drum band bleeding off the right edge, the Grudge line overlapping the band, or a station sitting astride the band's edge. Choose one per composition.
- **Board, phone (390):** the line and countdown first, then the pick action, then the stations as a vertical list with record rows, then the band, scrolling sideways inside its own box only. No page-level sideways scroll.
- **Receipts, first viewport:** the memory totals as the largest numbers on the page, the memory-check action beside them, then the latest blobs as a log. The learning figure follows.
- **Agents, first viewport:** the price now, in large numerals, and the five steps as a sequence. Code blocks sit on `chart`.
- Vary rhythm and density: dense logs against open bands. Not every section has the same spacing.

## 6. Asset inventory (all drawn here as original SVG, exported to the repo)

| Asset | Where | Sizes | Format and variants |
|---|---|---|---|
| Logo: a station plot built into a mark, plus the wordmark "Grudge" with custom drawing (not a plain font) | header, favicon, README, video, deck | mark 20, 32, 64; wordmark 24 and 48 high | SVG, white on cobalt and cobalt on white |
| Favicon set | browser, home screen | 16, 32, 180, 512, maskable 512 | SVG and PNG |
| Station mark (a circle filled to p, 0 to 100%) | stations, the line, record rows | 12 (record row), 48, 96, 120 | SVG component with fill angle as a parameter; on cobalt and on chart |
| Record-row mark: right (filled), wrong (empty), split (half), void (dashed) | under each station, history | 12 | SVG |
| Drum-chart band (gridlines, traces, outcome marks) | Board | full width, 200 to 260 high; phone version | SVG spec with stroke styles per source |
| Front with teeth (a disagreement) | Board, lesson, video | between two stations, any length | SVG path spec with tooth spacing |
| Wind barb (a trust shift up or down) | stations, receipts | 20 | SVG, two states |
| Source glyphs for DeepBook, Polymarket, Kalshi and the Crowd (in the icon language, not their brand logos) | stations, history, legend | 20 | SVG |
| UI icons: external link, copy, check, refresh, lock, clock | links, code blocks, memory check | 20 | SVG, 1.5 px stroke |
| Learning figure | Receipts, README, video, deck | 1200 by 600 and a phone version | SVG template with data slots |
| Loader (memory check, about 3 s) | Receipts | inline | a determinate progress line, not a spinner |
| Empty-state art: no windows yet, the Crowd silent, nothing paid | Board, Receipts, Agents | 120 | SVG, static |
| Social image template, with live slots for the line and the lesson | link previews | 1200 by 630 | SVG or HTML template |
| README banner, X image, blog cover, video thumbnail | outside | 1280×400, 1200×675, 1000×420, 1280×720 | PNG from SVG |
| Video title cards: the hook, "Four sources, one question", "Graded like forecasts", closing with the motto and the names Walrus and Tatum set as text | video | 1920×1080 | SVG or HTML, with an entry animation spec |
| Selection colour, focus ring, scrollbar styling | everywhere | | CSS spec |

## 7. Motion spec

Tokens and the signature motion are in section 2. Choreography:
- **Polling (every 5 s):** numbers change in place with no flash; a changed value cross-fades (`quick`). Traces extend by one segment when a new window locks.
- **Page changes:** content cross-fades (`deliberate`); the header stays put.
- **The magic moment, frame by frame (a window resolves, at most 900 ms):**
  1. 0 ms: the outcome mark sets on the band (filled or empty; `quick`).
  2. 100 ms: each station circle snaps to the outcome, full for up or empty for down (`quick`).
  3. 300 ms: the front between the two sources that disagreed draws along its length (`deliberate`, `ease-enter`); its teeth appear when it completes.
  4. 500 ms: each record row takes its new mark at the front, and the oldest drops off (`quick`, 60 ms stagger in station order).
  5. 700 ms: trust values and wind barbs update to the new weights; the line moves to the next open window (`quick`).
  6. Later, when you open the disagreement, its lesson is read from Walrus and shown with a link to the blob.
- **Ambient:** none near data. The 404 and the empty states may hold one slow, still drawing; nothing loops.
- **Restraint:** only transform, opacity and stroke offset; 60 fps; nothing blocks input; a repeated action is faster than its first run.
- **Reduced motion:** every state changes at once and the front appears already drawn.

## 8. Interaction spec

- **Pick action:** up or down (two buttons), then confidence 55 / 65 / 80 / 95 (one radio group), then "Log my call". States: rest, hover, focus-visible, pressed, disabled (window locked), loading (under 1 s; inline), done ("You said 80% ▲. Logged at 15:27."), limit reached ("Three calls from this address this window."), error ("Couldn't log that. Try again."). Feedback within 100 ms, optimistic where safe.
- **Category switch (15 min / 5 min):** a two-option tab set with the resolved count on each tab.
- **Memory check:** rest, running (a progress line for about 3 s with "Reading Walrus."), done (the gap and what was read), error ("Walrus didn't answer. Try again in a minute.").
- **Links to Walruscan and Suiscan:** an external-link icon, opening in a new tab.
- **Code blocks:** a copy button with "Copied" for 1.5 s.
- **Skeletons** shaped like the band and the stations for the first paint, never a spinner.
- **Phone:** 44 px targets, the pick action reachable with a thumb, no hover-only information.
- **Microinteractions to draw and time:** logging a pick, a new lock arriving, copying code, the memory check completing.

## 9. Accessibility floor

Text contrast 4.5:1 or better using only the verified pairs in section 2. Up and down are ▲ and ▼ glyphs; right and wrong are filled and empty marks plus words for screen readers. Every station circle has a text equivalent ("DeepBook, 66% up, trust 44%"). Real buttons and links, a visible focus ring as specified, a logical tab order (header, line, pick, stations, history), skip-to-content, and no information carried by colour alone. No page-level sideways scroll at 390.

## 10. Polish checklist (the designs cover these; the build must pass them)

- Every state in section 11, plus very long and very short values ($100,000.00 BTC, a 100% call, a 0% call, a source name at full length).
- Widths 390, 768, 1280, 1440 and 1920.
- Aligned baselines; optically centred glyphs; tabular figures everywhere (Martian Mono is monospaced); no widows in headlines.
- Favicon at every size, the social image, page titles, the 404, text selection colour, scrollbars, focus rings, and the first frame before data loads.
- A fast first paint, no layout shift when data arrives, fonts that don't flash.
- One system across the app, README, video, deck and social images.

## 11. States (all real; draw each one)

Board: loading (first paint); live (a window open, one locked); a window locked and waiting for its result (venues can take minutes to settle); resolved with a wrong call; resolved with all right; a split (the venues disagreed about the outcome; voided and not scored); a void (fewer than two sources); a source missing from a window; the Crowd silent (no visitor has picked yet, which is the case today); a disagreement of 7+ points with a lesson; a disagreement with no lesson yet ("Grudge writes one every 25 windows."); stale data or a lost worker; offline.
Receipts: memory check waiting, done and failed; amnesia history empty (the table is new, so it is empty even though a wipe and rebuild was done earlier); payments with one settled payment; Tatum counters, labelled as counted since the last deploy because they reset on each deploy; learning figure.
Agents: price now; no paid calls yet; one paid call.

## 12. Copy (draft; the owner does the final pass)

Voice: a duty forecaster's log, with the grudge in the name doing the joke. Plain, numeric, dry.

**Board**
- Hero: Markets forget. Grudge doesn't.
- Under it: Four sources call the same Bitcoin move. Grudge grades each call like a weather forecast, keeps the record on Walrus, and trusts the ones that verify.
- Status: "Live. Last pass 2 s ago." Stale: "Lost the worker. These numbers are old."
- Countdown: "locks in 03:12" · "ends in 05:12".
- Station: "DeepBook · 66% ▲ · trust 44%". Line: "Grudge line · 65% ▲ · weighted by record".
- Pick: "Your call, before the lock." Done: "You said 80% ▲. Logged at 15:27." Locked: "Locked. Waiting for the result."
- Disagreement: "Kalshi and Polymarket disagree by 20 pts. Over 22 disagreements, Kalshi was closer 45% of the time; DeepBook, 36%." Under it: "Recalled from Walrus ↗".
- Last window: "15:00–15:15 · ▼ down · all three wrong."
- Wrong call: "Polymarket said 71% ▲. It went ▼. Noted." Split: "Split. The venues disagreed about what happened, so nobody is scored."
- Empty: "No windows yet. Give it five minutes." Source missing: "Lost a source this window. Grudge will remember." Crowd silent: "The Crowd hasn't called."
- Footer: "Every grudge is a Walrus blob. Receipts ↗"

**Receipts**
- Title: Receipts. Under it: "Everything Grudge remembers is on Walrus. Check it yourself."
- Memory check: "Rebuild from Walrus and compare". Waiting: "Reading Walrus. This takes a few seconds." Result: "Rebuilt from snapshot #{n} and {n} records. Largest gap against the live weights: {gap}."
- Amnesia: "Server wiped. {n} records restored from Walrus. Nothing forgiven." Empty: "No wipes logged yet."
- Learning: "Brier score over the last {n} windows. Lower is better." Caption shape: "Grudge {a}, equal weights {b}, {best source} alone {c}. Slightly ahead of the average; the interval includes zero. {best source} alone is better (or no better, when Grudge's number is lower)."
- Tatum: "{n} gRPC calls · {n} Data API calls since the last deploy."

**Agents**
- Title: Agents. Under it: "This line costs {price} USDC. Grudges aren't free."
- Steps: Ask. Get a 402 with the price. Pay in USDC on Sui (no SUI needed). Ask again with the payment. Get the line.
- Success: "Paid. Settled on Sui. Receipt ↗". Empty: "No paid calls yet."

**404:** "Grudge doesn't remember this page. Unusual."

Never write "zero gas". Never claim Grudge beats the market or its best source.

## 13. Bans (PLAYBOOK v3 section 6, exact)

These bans mark what's already used up. They don't replace Phase 3's process: banning a look
only pushes the model to the next default. The four clusters below are the looks AI design keeps
landing on, and any of them is allowed only if I explicitly pick it at the Phase 3 gate.

**AI look clusters**
- Black or near-black backgrounds with neon accents and glowing edges; cyberpunk / "hacker"
  aesthetics
- Warm "old money" editorial: a cream, ivory, beige, parchment or "paper" ground with a
  high-contrast serif display (often italic) and a terracotta, clay, rust, sage or olive accent
- Broadsheet pastiche: hairline rules everywhere, an italic display serif, tiny tracked
  uppercase mono labels, "No. 01" / "§" / "Vol." ornaments
- Reflex neobrutalism: flat saturated ink, thick black borders, hard offset shadows, heavy
  condensed display type

**Color and surface**
- Purple-blue gradients, glassmorphism, glowing orbs, blob or mesh backgrounds
- Timid palettes: a neutral page with one small accent, where nothing owns the screen
- Faked materials: CSS paper grain, emboss, stamps, torn edges, chalk, or any imitation of a
  material we don't actually render

**Type**
- Default fonts as the identity (Inter / Roboto / Arial / Open Sans / Lato / system UI)
- Typefaces AI over-uses (allowed only with a reason no other face could meet; "it's a book
  app, so serif" doesn't count): Fraunces, Playfair Display, Cormorant, Lora, Crimson,
  Newsreader, Instrument Serif, DM Serif, EB Garamond, Space Grotesk, Space Mono, IBM Plex,
  DM Sans, Outfit, Plus Jakarta Sans, Instrument Sans, Syne, Geist, Manrope
- Timid hierarchy: 400 vs 600 weights, sizes only 1.5x apart

**Structure**
- The stock landing order: hero, logo strip, 3 features, testimonial, pricing, CTA band
- A centered hero with headline, subhead and two buttons; a 50/50 hero with text on the left
  and an image on the right; zigzag rows alternating image and text
- Equal-width card trios, a three-big-numbers stat row, a FAQ accordion with a closing CTA
  band used as filler
- An eyebrow or kicker label above every heading; numbered section prefixes (01 / 02 / 03)
- Everything centered in one max-width column with the same spacing between every section
- Generic rounded-card grids, pill buttons everywhere, soft-shadow "SaaS template" boxes
- Stock icon-in-a-rounded-square feature rows, emoji used as icons

**Originality** (every visual element is made in Claude Design for this project)
- Icon libraries of any kind (lucide, heroicons, Feather, Font Awesome, Material, Phosphor,
  Tabler, react-icons), and redrawing one of their icons
- Illustration libraries and kits (unDraw, Storyset, Humaaans, Blush, Open Peeps), clip art,
  stock photos and vectors, template or UI-kit visuals, Dribbble-style borrowed art
- Marketplace animations (LottieFiles, template motion presets) and AI image-generator output
- Logo or wordmark set in a plain font: it gets custom drawing or lettering
- Allowed exceptions: licensed typefaces, our own product screenshots, and code libraries
  that add behaviour without visuals (headless UI primitives, a chart renderer we fully
  restyle)

**Motion**
- Fade-up-on-scroll on every section, parallax for its own sake, and motion that delays
  reading or input
- Bouncy springs or playful overshoot in professional and monitoring tools
- Decorative loops near data the user is reading or watching
- Spinners where a skeleton or progress bar fits; animating width, height, top or left
- Motion that looks different on the landing page, app, video and deck

**Imagery and copy**
- Stock photos, uncredited assets, and generic imagery or illustration with no art direction
- Copy like "Revolutionize", "Seamless", "Unleash", "✨ AI-powered", "Empower", "Elevate"
- Mad-lib headlines ("The AI-powered X for modern Y", "Meet X"), "It's not X, it's Y" reveals,
  rule-of-three slogans, and benefit lines that could belong to any product
- Cloning any reference's or competitor's layout, text or artwork; references are for mood only
- Jarring or gratuitous animation; every motion has a purpose and respects reduced-motion

## 14. Technical constraints

Built in Next.js (App Router) with real text and inline SVG; no pictures of text. Colours, type, spacing and motion become CSS custom properties from section 2. Fonts are loaded from Google Fonts via `next/font`. Times arrive in UTC and show in the visitor's time. The page polls every 5 seconds. Every screen ships a 390 layout. No icon, illustration or animation libraries: every SVG comes from your export.

## Files on the canvas

`DESIGN-BRIEF.md` (this file), `IDENTITY.md`, `brand-guidelines.md` (§5 writing rules and the copy bank only; its visual sections are retired), `data/board.json`, `data/receipts.json` (live at 18:00 UTC Nov 8), `data/verify-memory.json`.
