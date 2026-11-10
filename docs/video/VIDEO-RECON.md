# Video recon (Phase V1, 2026-11-10)

Sources: `docs/RESEARCH.md`, `docs/research/raw/judges-sponsors.md`, `docs/research/COMPETITORS.md`, gap fetch `docs/research/raw/video-rules-2026-11-10.md`, winners' videos `docs/research/raw/video-winners-2026-11-10.md`.

## Constraints

| Item | Rule | Source | Risk |
| --- | --- | --- | --- |
| Length | 2 to 3 min ("Short demo video (2 to 3 min)", a form field) | Event Rules, `judges-sponsors.md` | Over 3:00 or under 2:00 could count as non-compliant; sponsors "may disqualify incomplete or non-compliant submissions". Aim 2:30, hard ceiling 2:55 |
| Judging weight | 30% Walrus + Tatum integration, 30% technical quality, 20% creativity, 20% presentation | RESEARCH.md | The video carries presentation and is the fastest proof of integration |
| Host and visibility | Any http(s) URL ("YouTube or other link"; the form only checks it is a URL). Visibility not stated | repo `SubmitModal.tsx`, `submit.ts` | A private or login-walled link is the main way to lose the video. Default: YouTube unlisted, checked logged out |
| Required content | Not stated beyond "Clear documentation and a working demo" (Presentation, 20%) | repo `content.ts` | None |
| AI voice, music, AI media | Not stated | gap fetch | No rule against an AI voice; the licence point below still applies |
| Captions, file size, language | Not stated | gap fetch | None. Captions burned in anyway (judges watching muted) |
| Judges, counts | Sponsor-appointed panel, size not stated; registrant and submission counts not stated | repo `content.ts` | |
| Unverified | tatum.io/hackathon/total-recall is JS-rendered and could not be read; the Vercel site and repo were | gap fetch | Low: the repo is the rules' source |
| Live vs mocked | The checklist asks for a "working demo"; nothing says the video must be live | RESEARCH.md | Our own rule is stricter: everything on screen is the live product (playbook section 5) |
| Licence | Entering grants sponsors a royalty-free licence to demo and showcase the submission | `judges-sponsors.md` | Music and voice licences must allow that reuse, not only our own upload |
| Deadline | Submissions close 2026-11-10 17:00 UTC; our cutoff 14:00 UTC | CLAUDE.md | The video is the last blocker; the plain screen recording stays the fallback |

## Judge attention model

- About 150 entries across the tracks (40 to 50 per track, roughly 8 serious in Prediction), judged 11 to 16 Nov by a sponsor-appointed panel of unknown size.
- At 10 minutes per entry (video, repo, live link, blog) one judge needs about 25 hours to see every entry. A panel shares the work or a judge triages, so the likely pattern is: watch the first 20 to 40 seconds, then scrub or watch at 1.5x to 2x, often with the sound off.
- Design for that judge:
  - The first 20 seconds must hold the whole claim: a real wrong call, the grudge, and trust that survives a wipe.
  - Every later beat stands on its own, with a caption that carries the point without the voiceover.
  - Proof of each sponsor (a Walrus blob, Tatum reads, an x402 settlement on Suiscan) is shown as a real page, held long enough to read at 2x (about 3 s of screen time).
  - Nothing important sits only in the voiceover.

## Past winners' videos

Seven placed videos (Sui Overflow 2026 x4, Walrus Haulout 2025, Kite AI 2026 x2), timed from transcripts and chapters, so approximate. No Colosseum, ETHGlobal or Overflow 2025 videos could be found. Detail: `docs/research/raw/video-winners-2026-11-10.md`.

- **Medians:** length 4:53 (3:00 to 9:25), product on screen at 70 s, magic moment at 108 s (about 45% in), no logo card in 5 of 7, founder voice in 7 of 7 (no synthetic voice).
- **What the winners share:** the problem in 20 to 30 s, then one real end-to-end flow (not a feature tour); the sponsor tech is the plot, not a logo slide; an on-chain proof right after the magic moment; a human hook in the first 15 s; "live" said outright.
- **Clichés to refuse:** a founder-credentials preamble; a market-statistics opener; a closing "why this chain" or roadmap block (35% of one winner's video); tech-stack or feature-list tours; reading hashes aloud; dead air while a page loads.
- **What it means for us:** the winners are slow because nobody holds them to 3 minutes. Against a judge who triages, being on screen in the first second is an advantage nobody else in the sample takes.

## Recommendation

**Length 2:30** (hard ceiling 2:55). **Structure: one flow, told as a single grudge**, not a page tour:

| Time | Beat | Shot | Proves |
| --- | --- | --- | --- |
| 0:00-0:03 | Cold open on the live Board: Polymarket's record ends in an empty mark | F | Real product at frame 1 |
| 0:03-0:06 | Logo reveal, released from that empty mark | D | Brand |
| 0:06-0:28 | **Magic moment:** wipe the server, the Board clears, reads Walrus, comes back with the same trust and lesson | H | Walrus Memory (track) |
| 0:28-0:50 | Four voices, the lock, a window resolves, trust moves | H | Prediction (track) |
| 0:50-1:30 | Receipts: 1,000+ memories, a Walruscan blob, "Rebuild from Walrus" gap 0 | H + F | Walrus integration depth |
| 1:30-1:55 | Is it learning? Brier vs equal weight, said honestly | D (figure) + F | Creativity, honesty |
| 1:55-2:20 | An agent buys the consensus over x402; Suiscan settlement; reads via Tatum | H | Agent Payments (track), Tatum |
| 2:20-2:30 | Close: one line, the mark, the live URL | D | Recall |

This keeps `docs/launch/VIDEO-SCRIPT.md`'s order (it already opens on product and lands the wipe by 0:20 to 0:30), so V2 tightens it rather than starting over.
