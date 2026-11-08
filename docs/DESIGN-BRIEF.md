# Grudge: design brief

Written for Claude Design. Claude Code builds the product and does not design: every screen and every graphic below is yours, and Claude Code implements what you draw. The same file sits on the Design canvas as `DESIGN-BRIEF.md`. Numbers were taken from the live service at 15:22 UTC on 2026-11-08 (`data/board-sample.json`).

## 1. Rules from the owner

- No black or near-black backgrounds with neon accents. No rounded boxes. Nothing that reads as generic AI output.
- Start from the Grudge Book direction in `brand-guidelines.md` (the owner chose it): paper, ink, red pencil, ruled ledger rows, stamps, tally marks, hand-built SVG marks. Push it further; do not replace it. Typefaces are open within section 3 of that file, from Google Fonts only.
- Voice: petty, deadpan, precise. The owner does a final pass on all prose.
- No invented numbers. Where something does not exist yet, design an honest empty state (section 11).

## 2. What to lead with

Grudge asks the same Bitcoin question of an onchain Sui market (DeepBook), Polymarket, Kalshi and the visitors, then remembers who was right. The first screen should show a disagreement and its record, because that is what no other entry shows.

The real result today: on the 5-minute question, across the 75 resolved windows behind the latest lesson, DeepBook and Polymarket were 7 or more points apart 54 times. DeepBook was closer 72% of the time. With 93 windows resolved, Grudge now gives DeepBook 84% of the line and Polymarket 16%. The price of reading that consensus has risen from 0.010 USDC to 0.039 USDC as confidence grew. Design a place where a sentence like this is readable in two seconds: "[voice] was closer [n]% of the time over [n] disagreements." The numbers change; the sentence shape stays.

Another entry in this hackathon also uses a paper-and-pencil look with stamps. Ours has to read as ours at a glance, through marks that are hand-built and specific to this product: the G-gauge ring with the red pencil needle, tally marks that cross on the fifth stroke, the red-pencil strike through a wrong call, and the stamps NOTED, FORGIVEN and SPLIT. Do not use a generic parchment texture or a stock handwriting font.

## 3. The first 10 seconds, in the owner's order

1. The markets disagree about the same Bitcoin move, and Grudge keeps score of who is right.
2. It learns: the record lives on Walrus and survives a wipe.
3. It is live right now: a real window is counting down, with real numbers.

Agents paying for the consensus matters but comes after these. The first viewer is a hackathon judge with about five minutes. Add a quiet "Judges: start here" link that leads to the receipts page.

## 4. Surfaces

**Batch 1, design now.** Each at desktop (1280 to 1440) and phone (390), plus the states in section 11.
- `/` Board: header, proof strip, category tabs (15m default), the gauge with a countdown, one entry per voice, pick bar, disagreement entry with the recalled lesson, the ledger of the last 20 windows. The gauge shows each window's locked calls only; nothing moves before the lock.
- `/receipts`: memory on Walrus with Walruscan links, the memory-check button and its result, amnesia history, payments, Tatum counters, the learning chart.
- `/agents`: the x402 flow, the price now, request and response blocks as real code, paid calls so far.

**Batch 2, after batch 1 is approved.**
- Logo mark and favicon from `assets/logo-mark.svg` at 16, 32, 180 and 512 px, with a maskable version.
- A social image of 1200 by 630 that the server renders from live data (it shows the current Grudge line), so design it as a template with variable slots.
- README banner 1280 by 400, X image 1200 by 675, blog cover 1000 by 420, video thumbnail 1280 by 720.
- Video title cards at 1920 by 1080: the hook ("Markets forget. Grudge doesn't."), "Four voices, one question", "Nothing forgiven", and a closing card with the motto and the names Walrus and Tatum set as text.
- The learning chart as a hand-built figure: the Grudge line against the equal-weight average and against the best single voice, by rolling Brier score, with an interval. It must look right with few points.

## 5. The magic moment

This is the 30 seconds of the demo video, so choreograph it. A locked window ends and resolves:
1. The result arrives: the outcome glyph, ▲ or ▼, is set in the ledger row.
2. Each wrong call gets a red-pencil strike drawn through it (250 ms). Right calls get the green check.
3. The wrong voice gains one tally mark (250 ms); every fifth crosses the four.
4. Its pin on the gauge shrinks and its trust share eases to the new value; the needle moves to the next window's line (600 ms).
5. If a voice has recovered, a FORGIVEN stamp presses in beside it (180 ms).
6. On a disagreement, the entry shows the recalled lesson in the serif italic with a receipt tick; clicking it opens the Walruscan page for that memory.

With reduced motion, every state changes at once with no drawing or pressing.

## 6. Motion

Needle: 600 ms, `cubic-bezier(.2,.8,.2,1)`. Strike and tally draw-in: 250 ms. Stamp: scale 1.06 to 1 over 180 ms. The page polls every 5 seconds; numbers change in place without flashing. Nothing loops, glows or pulses. Every motion has a reason and respects `prefers-reduced-motion`.

## 7. Layout language

A ledger on a desk: ruled rows, a left margin column for times, small-caps column heads, tabular numerals. Radius is 2 px at most. Layers separate by a paper-shadow tint, never a drop shadow. No card grid, no pills, no centered hero over three feature cards, no icon in a rounded square. The gauge is printed on the page like an instrument, not dropped in a box.

## 8. Accessibility floor

Text 4.5 to 1 against paper (the ledger-rule blue is for hairlines only). Up and down are always the glyphs ▲ and ▼, never colour alone. Real buttons and links, a visible focus ring, a logical tab order. The confidence chips (55, 65, 80, 95) are one radio group. Touch targets 44 px or more. No horizontal scroll at 390 px, including the ledger; how it reflows is yours to design.

## 9. Bans

Black or near-black backgrounds with neon. Cyberpunk or hacker styling. Rounded-card grids, pill buttons everywhere, soft-shadow SaaS boxes. Purple-blue gradients, glass, glowing orbs, blobs. Icon-in-a-rounded-square rows. Emoji as icons. Inter, Roboto, Space Grotesk, Poppins or system UI as the identity. Handwriting fonts. Stock photos or generic AI imagery. Words such as "revolutionary", "seamless", "unleash", "AI-powered", "empower", "elevate". Cloning any other project's layout, text or artwork.

## 10. Copy

Draft copy for each screen, in the brand voice. The owner will rewrite where it does not sound like them.

**Board**
- Hero: Markets forget. Grudge doesn't.
- Sub-hero: Four voices call the same Bitcoin move. Grudge writes down who was wrong, on Walrus, and trusts the rest a little more.
- Proof strip labels: grudges on Walrus · resolutions · paid agent calls · Tatum calls.
- Status: "Live. Last pass 2 s ago." / when stale: "Lost the worker. These numbers are old."
- Countdown: "locks in 03:12" · "ends in 05:12".
- Pick bar: "Your call, before the lock." After a pick: "You said 80% ▲. Locked at 15:27." After the lock: "Locked. Waiting for the result."
- Disagreement: "DeepBook and Polymarket disagree by 28 pts. Over 54 disagreements, DeepBook was closer 72% of the time."
- No lesson yet: "No lesson yet. Grudge writes one every 25 windows."
- Wrong call: "Polymarket said 71% ▲. It went ▼. Noted." Right call: "Kalshi called it. Grudge reduced by 0.04." Forgiven: "DeepBook: forgiven. Nine right in a row."
- Ledger heads: Window ends · Result · each voice · Receipt. Void row: "Void. The venues disagreed about what happened." with the SPLIT stamp. Queued receipt: "Receipt queued."
- Empty: "No grudges yet. Give it five minutes." Voice missing: "Lost a voice. Grudge will hold it against them." Crowd with no picks: "The Crowd hasn't called."
- Footer: Every grudge is a Walrus blob. Receipts ↗

**Receipts**
- Title: Receipts. Line under it: "Everything Grudge remembers is on Walrus. Check it yourself."
- Button: "Rebuild from Walrus and compare". Waiting: "Reading Walrus. This takes a few seconds." Result: "Rebuilt from snapshot #106 and 99 records. Largest gap against the live weights: 0."
- Amnesia: "Server wiped. 5 grudges restored from Walrus. Nothing forgiven." Never wiped: "Never wiped. Yet."
- Payments empty: "No paid calls yet." Learning chart thin: "Needs about 100 windows a category. 93 so far on 5m, 35 on 15m."

**Agents**
- Title: Agents. Line: "This memory costs 0.039 USDC. Grudges aren't free."
- Steps: ask, get a 402 with the price, pay on Sui, ask again with the payment, get the consensus.
- Success: "Paid. Settled on Sui. Receipt ↗". Empty: "No paid calls yet."

**Elsewhere:** 404: "Grudge doesn't remember this page. Unusual."

## 11. What does not exist yet

Design these as honest states; do not show numbers for them. The agent endpoint and its payments are not live yet. Tatum call counters and amnesia history are not served yet. There are no visitor picks so far, so the Crowd has not called. The learning chart has about 90 windows on 5m and 35 on 15m.

States to draw: empty (no grudges), a voice missing from a window, the Crowd absent, locked and waiting for the result, resolved with a wrong call, a right call, forgiven, void, split, stale data or offline, the memory check waiting and done.

## 12. Technical constraints

It will be built in Next.js with real text and inline SVG marks; no pictures of text. Tabular numerals on every number. Fonts are self-hosted from Google Fonts. Colours are CSS custom properties from the palette. Times arrive in UTC and display in the visitor's time. The page polls every 5 seconds. Ship a phone layout at 390 px for every screen.

## Files on the canvas

`brand-guidelines.md` (palette, type constraints, marks, voice, copy bank), `assets/logo-mark.svg`, `data/board-sample.json` (a real board response), `data/verify-memory-sample.json` (a real memory check).
