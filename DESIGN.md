---
name: Grudge
description: Markets forget. Grudge doesn't. A verification chart for four sources calling the same Bitcoin move.
colors:
  cold-front-cobalt: "#2B54C9"
  drum-chart-paper: "#D9ECE6"
  forecaster-ink: "#0F1B44"
  white: "#FFFFFF"
  white-muted: "#DCE4FA"
  ink-muted: "#44507A"
  wind-sock-orange: "#FF6A2B"
  chart-grid: "rgb(15 27 68 / 0.18)"
typography:
  display:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "7.5rem"
    fontWeight: 800
    lineHeight: 1
    fontStretch: "112.5%"
  headline:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "3.25rem"
    fontWeight: 800
    lineHeight: 1.1
    fontStretch: "100%"
  title:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 300
    lineHeight: 1.45
  label:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  figure:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    fontStretch: "75%"
  display-phone:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "5.5rem"
    fontWeight: 800
    lineHeight: 1
    fontStretch: "112.5%"
  headline-phone:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.1
    fontStretch: "100%"
  stat:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1
    fontStretch: "112.5%"
  lead:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 300
    lineHeight: 1.45
  panel-title:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  caption:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
  5xl: "96px"
components:
  panel:
    backgroundColor: "{colors.drum-chart-paper}"
    textColor: "{colors.forecaster-ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  pick-direction:
    backgroundColor: "transparent"
    textColor: "{colors.forecaster-ink}"
    rounded: "{rounded.none}"
    height: "48px"
    width: "96px"
  pick-direction-selected:
    backgroundColor: "{colors.wind-sock-orange}"
    textColor: "{colors.forecaster-ink}"
  button-solid:
    backgroundColor: "{colors.forecaster-ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 20px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.forecaster-ink}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "0 16px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "0 14px"
  tab-selected:
    backgroundColor: "{colors.drum-chart-paper}"
    textColor: "{colors.forecaster-ink}"
  nav-link:
    textColor: "{colors.white-muted}"
    padding: "12px 0"
  nav-link-current:
    textColor: "{colors.white}"
---

# Design System: Grudge

## Overview

**Creative North Star: "The Verification Chart"**

The page is a weather-forecast verification sheet. The Brier score Grudge uses was published in 1950 to grade weather forecasters, so the interface borrows that trade's instruments: the barograph drum chart, the station-model circle filled by eighths, front symbols with teeth, wind barbs and wind-sock orange. A forecaster's log is plain, numeric and dry. This is the same voice: it says what was called, what happened, and the score.

Cold-front cobalt is the ground and drum-chart paper holds the data. Numbers carry the display: a 120px mono figure against 15px light text, an eight-fold jump on purpose. Everything is square. Circles exist only as station marks, and a mark is a fact (filled, empty, half), not decoration.

Density is medium on the Board, higher on Receipts and low in the first viewport. Motion is measured and near-still around live numbers, with one signature moment when a window resolves.

**Key Characteristics:**
- Cobalt ground (about 60%), chart paper panels (about 30%), orange fill (about 5%).
- Martian Mono for every number and the display, Atkinson Hyperlegible Next for every sentence.
- Zero radius. Hairline 1.5px ink or white strokes, never shadows.
- Up and down are the glyphs ▲ and ▼; right and wrong are filled and empty marks. Never colour alone, never red against green.
- Every graphic has a text equivalent, and every claim links to a blob or a transaction.

## Colors

Cold blue ground, pale green-grey paper, dark navy ink, and one hot orange used rarely.

### Primary
- **Cold-Front Cobalt** (#2B54C9): the page ground, header and anything that is not a data panel. White text on it is 6.53:1.

### Secondary
- **Wind-Sock Orange** (#FF6A2B): an accent that is only ever a fill. It marks the open window on the drum chart, the chosen pick direction and confidence, an enabled "Log my call", and the teeth of a disagreement front. Ink on it is 5.83:1.

### Neutral
- **Drum-Chart Paper** (#D9ECE6): every data panel, table, code block and card. Text on it is Forecaster Ink.
- **Forecaster Ink** (#0F1B44): text and lines on paper, and text on orange. Never text on cobalt (2.55:1).
- **White** (#FFFFFF): text and 1.5px lines on cobalt.
- **White Muted** (#DCE4FA): secondary text on cobalt (5.14:1): nav, status, notes.
- **Ink Muted** (#44507A): secondary text on paper (6.39:1): column heads, captions.
- **Chart Grid** (ink at 18% opacity): gridlines, row rules and the track behind a progress bar on paper.

### Named Rules
**The Fill-Only Orange Rule.** Orange is a fill, never text and never a line: it is 2.29:1 on cobalt and 2.33:1 on paper. Keep it to about 5% of a screen; its rarity is how the open window and the pick action are found.

**The Ground Rule.** The ground is cobalt, not slate and not blue-black. A near-black navy page is the crypto-dashboard look this system exists to avoid.

## Typography

**Display Font:** Martian Mono (with ui-monospace fallback), using its width axis
**Body Font:** Atkinson Hyperlegible Next (with system-ui fallback)

**Character:** a technical drawing's lettering beside a highly legible text face. Mono carries numbers, codes and the display so the figures line up and read as measurements. Running text is never mono, so the page does not read as a developer tool.

### Hierarchy
- **Display** (800, 120px at 88px on a phone, line-height 1, width 112.5): the Grudge line, the one big number.
- **Headline** (800, 52px at 32px on a phone, line-height 1.1, width 100): page titles and the motto.
- **Title** (700, 24px): section heads. **Panel title** (700, 18px): the head inside a panel.
- **Body** (300, 15px, line-height 1.45): sentences. Keep lines short and use `text-wrap: pretty`. **Lead** (300, 18px): the one sentence under a page title.
- **Label** (400, 14px): notes and status. **Caption** (700, 12px): column heads and figure captions.
- **Figure** (mono, 400, 14px, width 75): secondary numbers, times, codes and addresses. Big numbers are wide, small numbers are narrow. **Stat** (mono, 800, 32px, width 112.5): a counter such as Tatum's call count.
- **Phone sizes:** the display drops to 88px (`display-phone`) and the headline to 32px (`headline-phone`).

Scale in px: 12, 14, 15, 18, 24, 32, 52, 88, 120.

### Named Rules
**The Number Is Mono Rule.** Every number, time, address and code is Martian Mono; every sentence is Atkinson. Mixing them mid-sentence is fine when a figure is quoted in prose.

## Layout

A 12-column grid with a 24px gutter, a 56px side margin at 1200 and wider, 32px from 600 to 1199, and 16px under 600. The page is capped at 1440 and centred. Three layouts are drawn, not stretched: desk (1200 and up), tab (600 to 1199) and phone (under 600), and each swaps markup, not just widths.

Spacing steps are 4, 8, 12, 16, 24, 32, 48, 64 and 96. Section gaps run 48 to 72 on desk and 48 on a phone. The first viewport is kept light: motto, line and pick; the drum chart and the ledger follow.

The drum chart is full width on desk and tab. On a phone it keeps its 720px width and scrolls sideways inside its own box, opening on the newest windows. Nothing else scrolls sideways.

Tables are real tables. The ledger and the blob log keep their rows at 36px on desk and 44px on a phone so a finger can reach them.

## Elevation & Depth

There is no elevation. Depth is tonal: a pale paper panel sits on the cobalt ground, and that is the whole stack. No shadows, no blur, no glass, no gradients.

State is carried by fill and line style instead: a chosen pick fills orange, an unavailable control turns to a dashed border, a disagreement is a drawn front.

### Named Rules
**The Flat Rule.** If a surface needs to stand out, change its fill or its stroke. Never add a shadow.

## Shapes

Radius is 0 everywhere. Panels, buttons, tabs and inputs are rectangles with 1.5px strokes. Circles appear only as station marks: an okta circle for a call (filled by eighths), a ring for a record, a dashed ring for "no record". The 404 and empty states use that dashed ring as their mark.

Lines are 1.5px on cobalt (white), 1px gridlines on paper, and 3px for a source's trace when it is the most trusted. Icons sit on a 20px grid with 1.5px round-capped strokes and are drawn from weather-symbol language; there is no icon library.

### Named Rules
**The Square Rule.** A rounded card, pill or badge is a defect. The only round shape is a station mark, and it always means something.

## Components

### Buttons
- **Shape:** square, 1.5px ink stroke (0px radius).
- **Pick direction (▲ Up, ▼ Down):** 48px high, 96px wide (flex on a phone, 52px high), transparent with ink text. Selected fills orange; unavailable turns to a dashed border with muted text.
- **Confidence (55, 65, 80, 95):** 48px squares, mono at width 75, native radio inputs wrapped in labels. Selected fills orange.
- **Log my call:** 48px, outline until a direction is chosen, then an orange fill. A thin ink bar runs across it while logging.
- **Solid:** ink fill, white text, 48px high, padding 0 20px: "Rebuild from Walrus and compare".
- **Outline / small:** transparent, 1.5px ink stroke, 44px high: "Run again", "Try again".
- **Focus:** 2px solid white at 2px offset on cobalt, 2px solid ink on paper. Never orange.

### Tabs
Two category tabs (15 min, 5 min), 44px high, 1.5px white stroke, white text on cobalt. The selected tab fills paper with ink text and bold weight.

### Navigation
Board, Receipts, Agents in Atkinson 15px, white-muted at rest, white and bold with a 1.5px white underline when current. A "Judges: start here" link sits at the end of the header. The header is 72px on desk; on tab and phone it stacks into a brand row and a status row. The status is a live region: in alert (stale or offline) it gets a 1.5px white border and bold text.

### Panels and Tables
A panel is drum-chart paper with ink text, 24px padding on desk and 16px on a phone. Tables have 12px bold ink-muted column heads, 1px grid rules between rows and mono for times and numbers.

### Drum Chart (signature)
A full-width band: time left to right, one trace per source at its call at lock, hour gridlines, a shaded lock column and an orange open-window block. Above it a row of outcome marks (filled up, empty down, half split). Beneath each source name sits its station circle, trust and Brier score, and a record row of ten marks, oldest to newest.

### Station Mark
A circle filled to a probability, drawn with a 1.5px stroke. Empty and dashed means no record. It is the logo, the call, and the empty state.

### Disagreement Front
When two sources are 7 or more points apart, a line with orange teeth is drawn between their stations and a sentence says by how much and who was closer in the past.

## Do's and Don'ts

### Do:
- **Do** use cobalt `#2B54C9` as the ground and paper `#D9ECE6` for every data panel.
- **Do** use orange only as a fill, on about 5% of a screen.
- **Do** set every number in Martian Mono and every sentence in Atkinson Hyperlegible Next.
- **Do** show up and down as ▲ and ▼, and right and wrong as filled and empty marks.
- **Do** keep every touch target at 44px or more and every focus ring visible.
- **Do** show missing, stale or empty data as such: a dashed ring and a plain sentence.
- **Do** draw the layout for each of desk, tab and phone.
- **Do** keep motion to 100, 200 and 400 ms, animating only transform, opacity and stroke offset.

### Don't:
- **Don't** use a near-black navy page, neon green and red, glass cards, Inter or Space Grotesk, candlesticks or gradient badges: that is the generic crypto dashboard.
- **Don't** use a warm paper ground, a serif display, stamps or red pencil: that is the retired Grudge Book.
- **Don't** use flat yellow, thick black borders or offset shadows: that is neobrutalism.
- **Don't** round a corner, add a shadow, or draw a gauge, dial or speedometer.
- **Don't** set orange as text or as a line, or ink as text on cobalt.
- **Don't** set running text in mono.
- **Don't** claim Grudge beats its best source; the learning figures are shown as they are, with the interval.
