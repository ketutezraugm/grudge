---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Board (`/`)

**Mode:** Operate. The visitor reads the live state and may make one pick. **Audience and job:** a judge with five minutes who must see, in ten seconds, that the sources disagree and Grudge keeps score, that it learns from Walrus, and that it is live; then a phone visitor making one pick. **Proof:** real windows from `GET /api/board`, per-source Brier from the ledger, blob links to Walruscan. **Constraints:** no live odds before the lock; times shown in the visitor's time; counts and claims exactly as the API returns them.

**Source of truth for the look:** the approved Claude Design export in `design-from-claude/` (Board, DrumBand, PickPanel and the Step B state canvases), locked by `docs/IDENTITY.md`. Claude Code adds no visual decisions.

**Unresolved (sent to Claude Design):** the empty chart paper right of the open-window band at 1440; the wordmark's custom lettering (Step C); how a front is drawn between non-adjacent stations; the layout above 1440.

## Direction contract

THESIS: the page is a verification chart. A source's call is a circle filled to its probability, never a dial; the record is dots, not digits. It refuses the trading-dashboard default of a dark page with neon up and down and candlesticks.

OWN-WORLD: cobalt `#2B54C9` ground; drum-chart paper `#D9ECE6` panels; ink `#0F1B44`; orange `#FF6A2B` as a fill for the open window and the chosen action; Martian Mono wide for numbers and the headline, Atkinson Hyperlegible Next for sentences; square corners; station circles, drum band, fronts with teeth.

STORY: the visitor sees that the sources disagree, that each has a record they can check, that the window is live, and picks up or down with a confidence.

FIRST VIEWPORT: 72 px header; headline and the lesson on the left; on the right the 120 px station circle beside the Grudge line at 120 px, the countdown, and the chart-coloured pick panel; the stations hang off the top edge of the drum band, which carries the last 20 windows and the orange open-window block.

FORM: composition 1b "Line first" from Claude Design Step A, built from Step B. Pinned by the owner, not rolled. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
