# Grudge: Brand Guidelines v2.0 ("Grudge Book")

> Last updated: 2026-11-07 · Status: Locked for hackathon
> v2 replaces the dark/neon v1 look. Name, motto, voice and copy are unchanged.

## Quick Reference

| Element                             | Value                                                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                                | **Grudge**                                                                                                                                            |
| Motto                               | **Markets forget. Grudge doesn't.**                                                                                                                   |
| One-liner                           | Grudge watches DeepBook, Polymarket, Kalshi and you call the same Bitcoin move, remembers every wrong call on Walrus, and trusts whoever's earned it. |
| Visual world                        | **Grudge Book**: an accountant's ledger where every wrong call is written down in red pencil                                                          |
| Paper / Ink                         | #F4EFE4 / #1E1A16                                                                                                                                     |
| Red pencil / Stamp green / Ink blue | #C2361F / #2E6A4C / #22385C                                                                                                                           |
| Voice                               | Petty, deadpan, precise                                                                                                                               |
| Emotion                             | The satisfying feeling of "I told you so", backed by receipts                                                                                         |

---

## 1. Idea

Every forecaster is wrong sometimes. Most apps forget it by the next refresh. Grudge writes it down.

- A **grudge** is a remembered wrong call. It lives on Walrus Memory (mainnet), and it lowers that voice's pull on the Grudge line.
- **Forgiveness** is earned: a voice that keeps being right sees its grudge decay (`L ← 0.98·L`).
- The **Grudge line** is the trust-weighted consensus, shown as the needle on the gauge.
- Grudges are portable. Wipe the server and they survive, because they live on Walrus.

### Product vocabulary (use these words everywhere, in UI and in code)

| Term        | Meaning                                                      | Never say                      |
| ----------- | ------------------------------------------------------------ | ------------------------------ |
| Voice       | One source of calls: DeepBook, Polymarket, Kalshi, the Crowd | "source", "oracle", "feed"     |
| Call        | A voice's probability at lock time                           | "prediction datapoint"         |
| Grudge      | A remembered wrong call / a voice's accumulated loss         | "penalty", "negative score"    |
| Grudge line | Trust-weighted consensus probability                         | "aggregate", "ensemble output" |
| Forgiven    | A voice whose trust recovered                                | "rehabilitated"                |
| Ledger      | The feed of resolved windows                                 | "history table"                |
| Receipt     | A Walrus blob or Sui digest link proving a record            | "proof artifact"               |

---

## 2. The world: Grudge Book

A well-kept ledger on a desk. Warm paper, ruled lines, fountain-pen ink. A red pencil corrects. A rubber stamp settles it. The product and the look are the same idea, so nothing here borrows from crypto dashboards.

### Palette (light-first; no dark theme in v1)

| Role        | Hex     | Contrast on paper | Use                                                     |
| ----------- | ------- | ----------------- | ------------------------------------------------------- |
| Paper       | #F4EFE4 | —                 | Page background                                         |
| Ink         | #1E1A16 | 15.1 : 1          | Text, numerals, rules that matter                       |
| Red pencil  | #C2361F | 4.8 : 1           | Wrong calls, strike-throughs, tally marks, disagreement |
| Stamp green | #2E6A4C | 5.6 : 1           | Right calls, FORGIVEN stamps, settled payments          |
| Ink blue    | #22385C | 10.2 : 1          | Memory, Walrus receipts, links                          |
| Ledger rule | #B9C7D3 | 1.5 : 1           | Hairlines and row dividers only, never text             |

(Ratios computed against #F4EFE4 on 2026-11-07.)

**Rule: color means right or wrong, never direction.** Up and Down are always the glyphs ▲ / ▼ in Ink. Red = wrong / held against. Green = right / forgiven. Blue = memory.

Derived tints (paper shadow for raised rows, hover fills) are mixed from these colors in tokens. No new hues.

### Banned

- Near-black backgrounds with neon accents, purple-to-blue gradients, glows, glassmorphism, blurred blobs.
- Emoji as UI icons.
- Default shadcn-style card grids.
- Centered hero with three feature cards.
- Stock 3D renders or illustration packs.
- Inter, Space Grotesk, Poppins as primary faces; handwriting fonts.

---

## 3. Typography

Final faces are chosen when `impeccable shape` records the direction, within these constraints:

| Role                                   | Constraint                                                | Candidates to test                          |
| -------------------------------------- | --------------------------------------------------------- | ------------------------------------------- |
| Display + window calls                 | A ledger or book serif with real character at large sizes | Newsreader, Literata, Source Serif 4        |
| Numbers (every %, Brier, USDC, digest) | Tabular figures; monospace or old-style tabular           | IBM Plex Mono, Commit Mono, JetBrains Mono  |
| UI text                                | Plain and readable at 14–15 px                            | Public Sans, Source Sans 3, Instrument Sans |

- All numerals use `font-variant-numeric: tabular-nums`.
- Small caps column heads, tracked +0.06em.
- Fonts are self-hosted (`next/font`) with `display: swap`.

| Element               | Size                 | Weight             |
| --------------------- | -------------------- | ------------------ |
| Gauge value           | 64 px                | display serif, 600 |
| H1                    | 40 px / 30 px mobile | display serif, 600 |
| H2                    | 24 px                | display serif, 600 |
| Body                  | 15 px                | 400                |
| Numbers               | inherit              | 500, tabular       |
| Caption / column head | 12 px                | 500, small caps    |

---

## 4. Marks (drawn, not typed)

Everything below is hand-built SVG for this project. No icon packs.

| Mark              | Meaning                                                                                 | Spec                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Red-pencil strike | A wrong call                                                                            | A single slightly wavy line through the call, in Red pencil, 2 px, round caps. Draws in over 250 ms.           |
| Tally marks       | Grudges held (one stroke each, the fifth crosses the four)                              | Red pencil, 2 px, per voice card                                                                               |
| Stamps            | NOTED (wrong, held), FORGIVEN (trust recovered), SPLIT (venues disagreed about reality) | Square-cornered outline (2 px radius at most) with a double rule, uppercase serif, rotated 1–3°. Presses in: scale 1.06 → 1 over 180 ms |
| Receipt tick      | A Walrus blob or Sui digest exists for this row                                         | Small ink-blue check inside a bracket, linking out                                                             |
| Ink texture       | Paper grain and slight ink spread on large type                                         | A subtle SVG turbulence filter. Never a stock raster.                                                          |

### Logo

The G-gauge mark redrawn in ink: a ring open at the upper right, with a Red-pencil needle as the crossbar of the G. Logotype is `grudge` in the display serif, lowercase. Files: `assets/logo-mark.svg`.
Don't: recolor the needle, add gradients or glows, or put the walrus mascot in the mark.

---

## 5. Voice & Tone

**Personality:** a petty but meticulous bookkeeper. Deadpan. Never mean to _people_, only to _bad calls_. Backs every claim with a number or a receipt.

| We are                      | We are not                     |
| --------------------------- | ------------------------------ |
| Petty about calls           | Mean to users                  |
| Deadpan, dry                | Memey, emoji-spam              |
| Precise (numbers, receipts) | Vague hype                     |
| Short                       | Explaining the math unprompted |

### Copy bank

| Context         | Copy                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Hero            | **Markets forget. Grudge doesn't.**                                                                                     |
| Sub-hero        | Four voices call the same Bitcoin move. Grudge writes down who was wrong, on Walrus, and trusts the rest a little more. |
| Wrong call      | `Polymarket said 71% ▲. It went ▼. Noted.`                                                                              |
| Right call      | `Kalshi called it. Grudge reduced by 0.04.`                                                                             |
| Forgiven        | `DeepBook: forgiven. Nine right in a row.`                                                                              |
| Disagreement    | `DeepBook and Polymarket disagree by 11 pts. The last 31 times, DeepBook was closer.`                                   |
| Crowd wrong     | `The Crowd said 80% ▲. It went ▼. Noted.`                                                                               |
| Empty state     | `No grudges yet. Give it five minutes.`                                                                                 |
| Amnesia         | `Server wiped. 212 grudges restored from Walrus. Nothing forgiven.`                                                     |
| Paid API (402)  | `This memory costs 0.012 USDC. Grudges aren't free.`                                                                    |
| Payment success | `Paid. Settled on Sui. Receipt ↗`                                                                                       |
| Source down     | `Lost a voice. Grudge will hold it against them.`                                                                       |
| 404             | `Grudge doesn't remember this page. Unusual.`                                                                           |
| Footer          | `Every grudge is a Walrus blob. Receipts ↗`                                                                             |

### Writing rules

- **Banned words and shapes:**
  - "revolutionary", "seamless", "leverage", "unlock", "game-changer", "delve", "AI-powered", "web3-native", "to the moon"
  - "not just X, but Y"
  - triple-adjective lists
  - em-dash chains
  - emoji bullet walls
  - "honest about…" sections
  - "In conclusion" endings
- **Show, don't claim.** Use real numbers and real moments from the build.
- Claude drafts in this voice; the user does the final pass in their own words.

---

## 6. Signature UI (ledger language)

The board is an _Operate_ surface: scanability and consistency outrank expression. The brand lives in the details.

1. **The Gauge (hero).** A semicircle instrument printed on the page, 0–100%, with engraved ticks in Ink. The needle is the Grudge line. Each voice is a small labeled pin on the track at its call, sized by trust; when a voice takes a grudge its pin visibly shrinks.
2. **Voice entries (the ledger rows).** Each voice has a ruled row: name in small caps, its call, its trust, and a tally-mark row of recent grudges. A FORGIVEN stamp sits beside it when trust has recovered.
3. **The Ledger (feed).** A left margin column holds the window time. Each resolved window is one ruled row with ✓ / strike-through per voice and an ink-blue receipt tick. The page number is the scoreboard sequence ("p. 412").
4. **Disagreement entry.** A red-pencil bracket around the two voices that disagree, the recalled lesson set in the serif italic, and a receipt link.
5. **Proof strip** (top of `/`): grudges on Walrus · paid agent calls · Tatum calls · resolutions. Live numbers only.

Radius: 2 px (paper, not pills). Borders: 1 px Ledger rule. Separate layers with a paper-shadow tint, never a drop shadow.

### Motion

- Needle: eases over 600 ms `cubic-bezier(.2,.8,.2,1)`.
- Pencil strike and tally marks draw in over 250 ms.
- Stamp presses in over 180 ms.
- Respect `prefers-reduced-motion` (no draw-in, no press; states change instantly).

---

## 7. Social / Blog

- Blog title: **"I built an app that holds grudges, on mainnet"**
- X hook: `Markets forget. I built one that doesn't. Grudge reads DeepBook, Polymarket and Kalshi on the same BTC window, writes every wrong call to @WalrusFoundation, and reads the chain through @Tatum_io. Agents pay it in USDC to borrow its memory.`
- Hashtags: none. Tagging is enough.
- Visuals: the gauge on paper, the red-pencil strike, a stamp. One hero visual reused everywhere.
