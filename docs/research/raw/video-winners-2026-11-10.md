# Winning hackathon demo videos: timing study (2026-11-10)

Purpose: calibrate the Grudge demo video (2:30 target, 1920x1080). Seven placed videos measured. Method: YouTube transcripts (youtube-transcript-api, ~1 s resolution) and creator-written chapter timestamps. **Every number is "approx" unless marked "chapter" (creator-written timestamp, exact).** Transcripts carry no visuals, so face cam, logo cards and on-screen explorer shots could not be observed; those cells say so.

Not done: the HyperFrames `/reverse-any-video` skill was skipped. It is a Pro-tier cloud feature that rebuilds a whole video (it needs an account and credits), and yt-dlp could not fetch any video stream here ("Requested format is not available", YouTube blocks it without a JS runtime/PO token), so no ffmpeg scene detection either. Scene timing below comes from chapters and transcript only. yt-dlp and youtube-transcript-api ran from a throwaway venv in the scratchpad; nothing was installed system-wide.

## Table

"Product" = first moment the real product is operated on screen. "Magic" = the core result lands (the thing that justifies the project).

| # | Project | Hackathon / place | URL | Length | Product at | Magic at | Intro / logo | VO style | Face cam | Sponsor tech shown | What dragged |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Sup Wallet (agent wallet) | Sui Overflow 2026, Agentic Web, **1st** | https://www.youtube.com/watch?v=qLdzc9zSlz8 | 5:12 (311 s) | ~95 s | ~108 s (agent plans and completes a swap; range 104-111) | none; starts "today I'm excited to introduce" | Founder voice, live narration over screen. Demo-day recording (host says "thank you Frederick" at 305 s) | unknown | Spoken only: Bluefin, DeepBook, Cetus adapters; Walrus appears as a "memory" toggle at ~250 s, last feature. No explorer shot heard | 90 s of security/adapter talk before any UI; 5 feature chapters back to back (swap, LP, trade, RWA, memory); 5 min total |
| 2 | Quay (QR crypto payments) | Sui Overflow 2026, DeFi & Payments, **1st** | https://www.youtube.com/watch?v=jQwb1_GypZM (title "quay Sui Overflow 2026", linked from quay.cash as "Watch the pitch") | 4:52 (292 s) | ~172 s ("here's how it works"; the transcript cannot confirm a live screen before this) | ~185 s (scan SGQR, pay in any token, one signature, merchant gets USDC) | 0 s logo. 13 s real-world skit hook ("do you accept Sui?" at a chicken-rice stall) | Founder voice, solo builder | unknown | Spoken only: "payment record lands on Walrus" at ~193 s; Scallop yield | ~100 s of problem, market stats and founder credentials (32 s of credentials alone at 13-45 s) before the product; business-model section 231-260 s; pitch-heavy, product is the last third |
| 3 | PIPS (gamified prediction console) | Sui Overflow 2026, DeepBook track, **1st** | https://www.youtube.com/watch?v=r2LVJFPAhZE | 3:28 (208 s) | ~5 s glimpse in the hook (inferred from "if Nintendo built a trading console, it'd look like this"); interactive gameplay at **70 s (chapter)** | ~80 s (first plays; gameplay chapter 70-102 s) | **10 s** motion-graphics intro (chapter 10-20 s) after a 10 s hook | Founder voice plus music | unknown | Spoken in a 33 s "Tech Stack" chapter (102-135): DeepBook Predict mint types, Pyth prices, zkLogin. No explorer shown that the transcript reveals | Last 73 s (35%) is "Why Sui" (36 s) and roadmap (37 s) after the gameplay ends; 28 s "why this matters" market framing |
| 4 | Flicky (swipe duel on DeepBook Predict) | Sui Overflow 2026, DeepBook track, **4th** | https://www.youtube.com/watch?v=ETUkybxZYSA | 4:53 (293 s) | ~66 s (zkLogin sign-in) | ~131 s (swipe mints a real on-chain position); payoff (settle, pool claim) ~231-263 s | ~42 s of music/silence before the first spoken line (approx) | Founder voice, hesitant live narration | unknown | Spoken: DeepBook Predict manager, oracle settlement, redeem. No explorer heard | 42 s music-only intro; 25 s explaining two currencies and a manager deposit before the first match; profile/leaderboard tour at the end (267-288 s) |
| 5 | Spectra (private content moderation) | Walrus Haulout 2025, AI x Data, **1st** (per walrus.xyz winners post) | https://www.youtube.com/watch?v=-XbQIA3A880 (channel "SideProjects"; the description matches Spectra, so the uploader is a team account, approx) | 3:00 (180 s) | ~61 s ("let's dive in", wallet connect at 64 s) | ~76-97 s (report a post, enclave runs the model, signed result verified on-chain, classified 18+) | none | Founder voice (Dan), plain, no music heard | unknown | **Best sponsor handling in the set:** Walrus and Seal named in the first 6 s as the problem setup; TEE signature verified in a Move tx; closing line "all actions verifiable on Sui Explorer" at 154 s | 28 s of problem statement; a spoken "CPU-only, this may take a moment" wait at ~84 s; 20 s "why Spectra" track pitch at the end |
| 6 | NEXUS (x402 agent economy) | Kite AI Global Hackathon 2026, winner (place not stated). Sponsor-channel "Winner Demo" re-cut | https://www.youtube.com/watch?v=lG29tc02QLo | 9:25 (565 s) | **94 s (chapter)** | ~116-166 s (query runs, two agents pay each other via x402, on-chain txs appear); full run walkthrough to ~224 s | none; 23 s verbal intro (chapter) | Founder voice, live narration | unknown | **Heaviest:** mandate ID, ECDSA signature, x402 payment hashes and explorer checks read out for ~170-340 s. Strong proof, but tedious | 94 s of "why agents sit alone" before the demo; 140 s of hash-by-hash audit walk; 9:25 total; a second "autonomous pulse" demo at 224-286 s |
| 7 | NegotiatorGrid (x402 procurement) | Kite AI Global Hackathon 2026, winner (place not stated). Sponsor-channel "Winner Demo" re-cut | https://www.youtube.com/watch?v=1eaj2EOllKQ | 3:36 (216 s) | ~35 s ("I'm going to click on our...") | ~98-118 s (two agents negotiate to a price, payment settles via x402) | none | Founder voice, live narration | unknown | On-chain deal-record smart contract and x402 settlement spoken at ~114-127 s; link to explorer promised at the end | 30 s of vision pitch up front; 60 s of dashboard/opponent-model explanation after the magic; trails off ("...much") |

## Not found (so not in the table)

No public video link could be located for: MCPay and Capitola (Colosseum Cypherpunk; the Colosseum Cohort 4 demo-day recording was the only candidate and was not measured), Delphi / KrillTube / TradeArena (Haulout), Suithetic / Magma / MoonBags (Overflow 2025), Kraterion / Skew / Yosuku (Overflow 2026), DIVE (ETHGlobal Cannes 2026 finalist; its showcase page, https://ethglobal.com/showcase/dive-5hxbp, lists 1st World MiniKit, 0G 2nd and "Finalist" but has no video link). Overflow 2025 demo days are 3:50 and 4:07 h live streams (https://www.youtube.com/watch?v=W0eBDO3raEI and https://www.youtube.com/watch?v=wzqaCwe37E0), not edited videos, so they were not measured. The ETHGlobal "Closing Ceremony and Finalist Demos" streams (e.g. https://www.youtube.com/watch?v=MXWrc94Zkf8, 1:16:46) are also live, not measured. This study has no ETHGlobal, Colosseum or Overflow 2025 data; the sample is skewed to Overflow 2026 (4 of 7) and Kite AI (2 of 7).

Format facts found along the way: Haulout required a demo video of **up to 3 minutes** (DeepSurge guide, https://mystenlabs.notion.site/How-to-Register-and-Submit-on-DeepSurge-2926d9dcb4e98043b297e60c440a840a, via search summary). Spectra, the Haulout 1st-place entry, is exactly 3:00. Sui Overflow 2026 winners ran 3:28 to 5:12, so Overflow had no tight cap.

## Summary

### Medians (7 videos, all approx)
- **Length:** 293 s (~4:53). Range 180-565 s. Our 150 s target is shorter than all seven; the shortest (Spectra, 180 s) was under a hard 3-minute Haulout cap.
- **Time to product:** **70 s** (values 35, 61, 66, 70, 94, 95, 172). In a 150 s video that would be 47% of the runtime; the winners got away with it because their videos are twice as long.
- **Time to magic moment:** **108 s** (values 80, 85, 100, 108, 131, 140, 185). As a share of runtime the median is **45%** (range 25-63%).
- **Logo/intro card:** 0 s in 5 of 7. The two exceptions are a 10 s motion-graphics intro (PIPS) and a 13 s real-world skit (Quay). Nobody opened with a logo sting.
- **Voice:** 7 of 7 founder or builder voice, none with a synthetic voice or music-only. Narration is often live and imperfect (hesitations, "this may take a moment") and still placed.

### Top 5 patterns among winners
1. **Problem in 20-30 s, then straight into a real flow with a wallet or login.** Spectra (61 s), NegotiatorGrid (35 s) and Flicky (66 s) all demonstrate one end-to-end action instead of a feature tour.
2. **The sponsor tech is the plot, not a logo slide.** Spectra states "Walrus and Seal let anyone upload anything" in the first 6 s, then proves the answer in an on-chain tx. NEXUS and NegotiatorGrid show x402 payments settling between agents. Placements track "the sponsor tech does the thing you came to see".
3. **A visible on-chain proof right after the magic moment**, usually spoken ("verifiable on Sui Explorer", tx hashes). The best version (Spectra) takes 5 s; the worst (NEXUS) spends 2+ minutes reading IDs.
4. **Hook with a human or playful image rather than a title:** Quay's chicken-rice stall skit, PIPS's "if Nintendo built a trading console" line. Both 1st places, both under 15 s to the idea.
5. **Live-ness is claimed explicitly:** "we're live on mainnet" (Sup Wallet), "testnet live, play at playpips.fun" (PIPS), "live on Kite" (NEXUS). This matches the earlier past-winners note that "live" is the strongest recurring signal.

### Clichés judges are likely tired of (evidence from these videos; the "tired" part is inferred)
1. **Founder-credentials preamble** ("I'm X, founder of Y, we won Z before"): 32 s in Quay, a 1st place that won despite it.
2. **Market-size or macro-stat opening** ("one in four Singaporeans hold crypto", "attention spans are shrinking") ahead of any product.
3. **The closing "Why [chain]" / roadmap / "we need your support" block**: PIPS spends the last 73 s (35%) on it.
4. **Tech-stack and feature-list tours** (Sup Wallet's five chapters, Flicky's profile/leaderboard tour) that bury the one moment that mattered.
5. **Reading hashes, mandate IDs and signatures aloud** (NEXUS) and **dead air while something loads** (Spectra's "CPU only, may take a moment", Flicky's 42 s music intro). Also the generic "trade like it's a game", "agent wallet", "AI agent economy" taglines, which repeat across the set.

### What this means for a 150 s Grudge video (recommendation, not measured)
- Winners' median 70 s to product is too slow for 150 s. Target the first live screen by ~20-25 s and the magic moment (a resolved call changing a voice's weight, backed by a Walrus memory record) by ~55-65 s, which is the 25-45% band the winners hit.
- Spend zero seconds on logo or credentials; use a one-line hook.
- Show the Walrus blob / tx and the x402 payment as a 3-5 s proof shot each, not a read-out.
- Founder voice is the norm; no winner used a synthetic voice. Pre-run anything slow so there is no loading wait.

## Sources
- Transcripts and chapters: YouTube via youtube-transcript-api / yt-dlp metadata for the seven URLs in the table (fetched 2026-11-10).
- Winner lists and places: https://www.sui.io/blog/2025-sui-overflow-hackathon-winners, https://www.sui.io/blog/sui-overflow-2026-winners, https://blog.walrus.xyz/haulout-hackathon-winners-2025/ (Spectra 1st AI x Data, via `past-winners.md`), Kite AI Global Hackathon 2026 winner demos on the KITE AI YouTube channel (place not given in the video description).
- Quay video link: https://www.quay.cash/ ("Watch the pitch", video ID taken from the thumbnail URL, not from an href).
- Haulout video limit: DeepSurge submission guide (link above), via web-search summary, not read directly.
- ETHGlobal DIVE page: https://ethglobal.com/showcase/dive-5hxbp
- Context: `docs/research/raw/past-winners.md`.
