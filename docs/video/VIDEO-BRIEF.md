# Video brief: motion language (Phase V3, 2026-11-10)

Extends `docs/IDENTITY.md` for the 2:30 demo video (`docs/video/SCRIPT.md`). The video may push further than the app, but it must feel like the same product: a verification chart, measured, near-still around live numbers, one signature moment. Where the HyperFrames guide (`HYPERFRAMES-CLAUDE-DESIGN.md`) disagrees (its fonts, bouncy `back.out`, "everything keeps moving", grain, vignette, glow), this brief and IDENTITY.md win.

## Locked tokens (exact, from IDENTITY.md)

- Colour: cobalt `#2B54C9` (ground, ~60%), chart `#D9ECE6` (panels), ink `#0F1B44` (text on chart and orange), white `#FFFFFF` (text on cobalt), white-muted `#DCE4FA`, ink-muted `#44507A`, orange `#FF6A2B` (**fill only**, ~5%: the open window, the pick, a disagreement front). Never orange as text or a line; never ink on cobalt.
- Type: **Martian Mono** for display and every number (big numbers `wdth` 112.5 at 800; secondary numbers `wdth` 75 at 200); **Atkinson Hyperlegible Next** for running text (300 body, 400 UI, 700 emphasis). Load: `https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@75..112.5,100..800&family=Atkinson+Hyperlegible+Next:wght@300;400;700&display=swap`. Video sizes: headline 88 to 120 px, captions 40 px, labels 24 px minimum.
- Shape: radius 0 everywhere; circles only as station marks; lines 1.5 px on cobalt (2 px at video scale), 3 px for the most trusted trace.
- Motion tokens: `instant` 100 ms, `quick` 200 ms, `deliberate` 400 ms, `moment` ≤ 900 ms. Eases: enter `cubic-bezier(0.2, 0, 0, 1)`, exit `cubic-bezier(0.4, 0, 1, 1)`, standard `cubic-bezier(0.2, 0, 0.2, 1)`. In GSAP use `CustomEase` (free since GSAP 3.13; load `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/CustomEase.min.js`) so these curves are exact. **No springs, no overshoot, no `back.out`, no bounce.** Animate only transform, opacity and SVG stroke offsets (plus Martian Mono's `wdth`/`wght` axes, below).
- Script pins (artifact previews need versions two weeks old): `gsap@3.15.0`, `@hyperframes/core@0.8.206`, `@hyperframes/shader-transitions@0.8.206`, player `@hyperframes/player@0.8.206/dist/hyperframes-player.js`.
- Logo: the Feathers mark, `mark.svg` (64x64 grid): a station circle r13 at (42,45) with a three-quarter okta fill, an angled staff to the upper left, two long barbs and one half barb, 4/64 strokes, butt ends. In the station model the circle is cloud cover in eighths, the staff the wind direction, a long barb 10 knots and a half barb 5. The paths are separable (circle, fill wedge, staff, barb 1, barb 2) and must stay so.

## Logo reveal (0:03 to 0:06, 90 frames at 30 fps)

**Clichés we refuse:** particles assembling, liquid splash, smoke, glitch, light sweep across the wordmark, 3D spin, a stroke draw followed by a fill as the whole idea, a lens flare or glow bloom. Every concept below comes from how the mark is built or from the forecast-verification world.

Each concept starts from the hook's last frame: Polymarket's record row has just taken an **empty mark** (a wrong call). Each ends on the same hold: mark left, wordmark right of it, motto beneath, on cobalt.

### Concept A: Plotted (the mark constructs itself the way a station is plotted)

The empty wrong-call mark grows into the station circle, then a duty forecaster's plot is entered on it, in the order a plotter enters a station model: cover, then wind direction, then speed.
- f0-12: the empty mark scales from record-row size to mark size and travels to centre-left (`deliberate`, ease enter).
- f12-30: the circle fills by eighths, six snaps of one eighth each (`steps`-like, one eighth per 3 frames), stopping at three-quarters.
- f30-42: the staff extends out of the circle along its angle (stroke offset, `quick`, ease enter).
- f42-54: barb, barb, half barb tick on, 4 frames apart, each a single `instant` snap.
- f54-72: the wordmark arrives beside it (Martian Mono, `wdth` from 75 to 112.5 and `wght` from 200 to 800 together, `deliberate`).
- f72-90: the motto sets under it (Atkinson 400, opacity only, `quick`); hold.
- Sound: one dry pen tick per eighth (six), a slightly heavier tick per barb (three), silence under the wordmark, music enters on the hold.

### Concept B: Collapse (the Board becomes the mark)

The live Board's own station circles and record marks leave the footage and assemble the mark, so the logo is visibly made of the product.
- f0-15: the footage dims to the ground colour around Polymarket's station (focus pull); the other station circles slide along the row into one circle, stacking (`deliberate`, ease standard).
- f15-36: the last ten record marks of the row lift off, three of them travel to become the barbs and the rest fold into the circle as its okta fill (6 of 8), arriving staggered by 2 frames (`quick` each).
- f36-48: the drum-chart trace straightens into the staff (stroke offset morph to the staff's angle).
- f48-72: wordmark arrives by axis change, as in A.
- f72-90: motto; hold.
- Sound: a short paper-drum stop at f15, soft ticks per arriving mark, nothing on the staff.

### Concept C: Width (the type resolves into the brand)

Martian Mono's variable axes are the move: the wrong call's caption resolves into the wordmark while the mark lands as its station.
- f0-18: the hook's on-screen word "Noted." sits at `wdth` 75 / `wght` 100, thin and narrow, white on cobalt.
- f18-48: it widens and thickens in three measured steps (75 to 87.5 to 100 to 112.5 `wdth`; 100 to 400 to 600 to 800 `wght`), each step `quick` with a 6-frame rest, as if a reading were being taken; on the last step the letters change to "Grudge" in one cut (no morph).
- f48-66: the mark drops into place left of the wordmark as a whole (opacity and a 24 px rise, `deliberate`, ease enter); its fill wedge snaps last.
- f66-90: motto; hold.
- Sound: three low clicks on the width steps, one tone when the word changes, music on the hold.

**Locked (owner, V3 gate, 2026-11-10 10:05 UTC): A, Plotted.** Built by Claude Design in the storyboard canvas (https://claude.ai/artifact/4DBC3oQD38AVTBU8ivs1Yh, `project/hf/reveal-a/`); a local copy renders clean (lint 0 errors, 1920x1080, 30 fps, real Martian Mono). Its frame 0 assumes the hook's 1.6x push-in puts Polymarket's station circle on the mark's circle and its newest record mark at (880.8, 708.8); if the take is framed differently, change the first tween's `x`, `y`, `scale`.

**Storyboard approved** (15 scene boards and a sheet in the same canvas), with Claude Design's departures accepted: on-screen text beats sit in a top strip above the H footage (the side strip holds too few characters at 88 px); scene 11 is a designed column beside a window onto the figure; the cursor shows at 40 px (drawn on the 20 px grid).

## Transition grammar

- **Hard cuts on the beat:** about 90% of cuts.
- **Match cuts** (named, with where):
  - `empty-mark`: hook footage → logo reveal (the wrong-call mark is the shared element; 0:03).
  - `refill-lesson`: the lesson line in the refilled Board → the 0:20 headline "Rebuilt from Walrus" (0:20).
  - `blob-click`: the click on a Receipts blob link → the Walruscan page in the same screen position (1:05).
  - `rebuild-zero`: the "gap 0" result → the learning figure's zero line (1:30).
  - `settle-click`: the terminal's settled digest → the Suiscan page (2:08).
  - `mark-close`: the Board's station circle → the closing mark (2:20).
- **Shader moments, at most two:** 1. the reveal's exit into 0:06, `sdf-iris` (a circular iris, which echoes the station circle), recoloured to cobalt; 2. optional at 1:30 (from proof to the learning question), `cross-warp-morph`. No shader ever touches the wipe or the refill footage (0:06 to 0:28), so nobody can read an effect as the product.

## Virtual camera on footage

- **Push-in** to the action: at most 1.6x, over 600 to 900 ms, ease standard; one push per beat at most.
- **Pan** that follows the cursor or the reading: at most 600 px/s, ease standard; never a pan and a push at once.
- **Focus pull:** dim everything except the subject to cobalt at 70% opacity over `deliberate`; release with ease exit.
- **No drift** on stills as filler (no Ken Burns). A held proof page (Walruscan, Suiscan) is held still, so it can be read at 2x.

## Designed cursor and click mark

- An original cursor drawn in the icon language (20 px grid, 2 px strokes, round caps, white with an ink edge), replacing the OS cursor; it moves on the timestamps and coordinates the V4 capture logs (`video/capture/<shot>.actions.json`).
- Click mark: a station circle that fills one eighth and fades (`quick` in, `deliberate` out). No ripple, no glow.

## Type in motion and captions

- **On-screen text beats** (max 7 words, `SCRIPT.md` column): Martian Mono 88 px, white on cobalt or ink on chart. Enter by axis (`wdth` 75 to 112.5, `wght` 200 to 800, `deliberate`, ease enter) with opacity; leave by opacity only (`quick`, ease exit). One beat on screen at a time.
- **Burned-in captions** (the VO, synced from `npx hyperframes transcribe`): Atkinson Hyperlegible Next 400 at 40 px, max 2 lines of 42 characters, bottom-centred 96 px above the frame's bottom edge, on a cobalt band (`#2B54C9`, radius 0) when over chart-paper footage, bare white when over cobalt. **Active word:** weight 400 to 700, no colour change (orange text is banned). Caption appears and leaves with the VO phrase, `instant`.

## Texture and effects

None. The identity bans grain, paper and imitated materials, so the guide's `.grain` and `.vignette` layers are removed, and so are glow, light leaks, lens flares, chromatic aberration and film grain. The art is the data: traces, station circles, fronts, barbs.

## Rhythm

- **Beat grid: 120 BPM** (beat 0.5 s, bar 2 s), chosen so every script timecode falls on a beat; the music track in V6 is picked or cut to 120 BPM.
- Cuts land on beats; the big hits land on bar lines: 0:06, 0:14 (music out), 0:20 (music in), 0:28, 0:38, 0:50, 1:12, 1:30, 1:56 (agent), 2:08, 2:20. 1:05 lands on a beat, not a bar.

## Sound design map

| Event | Sound |
| --- | --- |
| Hook wrong mark (0:02) | one dry tick |
| Logo reveal | per concept above |
| Wipe Enter (0:12) | a single key click |
| Board clears (0:14) | music cuts out; room tone only (the payoff gets silence) |
| Board refills (0:20) | music returns on the bar |
| Record marks at resolve (0:44) | one tick per mark, 60 ms apart, as the app's stagger |
| Blob click, rebuild click, agent Enter | one soft click each |
| Gap 0 lands (1:20) | silence, then the VO line |
| Settled (2:05) | one low settle tick |
| Close (2:20) | music resolves; ends on the cut |

No whoosh on any cut; no typing loops; music instrumental only, no vocals, never "epic trailer" drums.

## Footage grade and framing

- The footage is the live app, already in the identity colours: no grade, no LUT, no saturation change.
- **F shots:** full frame 1920x1080, captured at `deviceScaleFactor` 2 and scaled down, so text is sharp.
- **H shots:** footage at 1536x864 (80%) on the cobalt ground, radius 0, no shadow, no device frame, no browser chrome; offset left or right to leave room for an on-screen text beat. A 2 px white rule may frame it when the footage edge meets cobalt (the app's own top bar is cobalt).
- **Terminal shots:** recorded for real, then set in an ink (`#0F1B44`) panel with Martian Mono, radius 0, in the H frame.
