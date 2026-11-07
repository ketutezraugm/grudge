# Decision log

Append-only. One entry per decision that changes what we build or how. Newest at the bottom. Format: date · decision · why · alternatives rejected.

---

**2026-11-07 · Track 1 concept "Grudge": onchain DeepBook Predict vs Polymarket vs Kalshi vs the Crowd on BTC 5m/15m up/down markets.**
Why: no competitor among ~150 uses an onchain Sui odds source, which the Track 1 brief literally asks for. Fast-resolving markets make learning visible live (≈400 resolutions a day).
Rejected: "Pager" (Track 2 escalation agent; less consumer-friendly), "One Memory" (Track 3 shared memory; too much scope for 3 days).

**2026-11-07 · Prize stack: Track 1 + Best Walrus Memory + Best Agent Payments, with AI Builder as a secondary chance.**
Why: one project, four awards. AI Builder costs about an hour.

**2026-11-07 · Brand: "Grudge — Markets forget. Grudge doesn't."** Bruise #7B5CFF = memory, orange = wrong, mint = right. Color never encodes direction.
Why: a memorable concept for the creativity score; a grudge is literally a memory that changes the product.
Rejected: Tusk (too close to the Tusky Walrus app), Needle (tasteful but emotionally flat).

**2026-11-07 · Hand-rolled x402 v2 `exact` on `sui:mainnet`, self-facilitated, settled via Tatum gRPC.**
Why: spec-compliant, counts as Tatum integration, avoids the unmerged `@x402/sui` PR. `@suimpp/mpp` can't pass Tatum's API key.
Fallback: `@suimpp/mpp` on the public fullnode, disclosed in the README.

**2026-11-07 · Gasless USDC (`0x2::balance::send_funds`) for payments; the server holds no private key.**
Why: the payer needs no SUI, the executor pays nothing, and the security story is strong.

**2026-11-07 · One Render web service with the worker loop in `instrumentation.ts`; Supabase Postgres; Walrus Memory as the durable learning state.**
Why: one deploy and a shared in-memory snapshot. Postgres holds working state; Walrus is what survives amnesia.
Rejected: a separate worker service (extra cost, no benefit at this scale).

**2026-11-07 · Memory writes go through a `memories` outbox table and a bulk flusher (≤ 20 items, every ≤ 5 min).**
Why: the relayer rate limit (500 weighted/h; bulk = 10), restart safety, and stored blob IDs for receipts.

**2026-11-07 · Learning = discounted Brier loss (λ 0.98) + Hedge softmax (η 2) + logit pooling. Templated lessons in P0, no LLM.**
Why: deterministic, testable, explainable in the blog.

**2026-11-07 · Canonical outcome = majority of venue results; a 1–1 split is void.**
Why: venues settle on different feeds (Pyth, Chainlink TWAP, BRTI), and this is honest about basis risk.

**2026-11-07 · Stack pins: Next 16.4.5, React 19.3.1, TypeScript 5.9.3, Tailwind 4.3, Biome 2.6, Drizzle 0.45, postgres.js 4.1, Vitest 5.1, zod 4.6, `@mysten/sui` 2.39.1, `@mysten/deepbook-v3` 2.11.1, memwal 0.1.13.**
Why: latest stable releases, mutually compatible (checked peer dependencies), and what `create-next-app` expects.

**2026-11-07 · No AI co-author trailers on any commit, PR or doc.**
Why: user requirement.

**2026-11-07 · "Grudge Book" replaces the dark/neon look.** Paper #F4EFE4, ink #1E1A16, red pencil #C2361F, stamp green #2E6A4C, ink blue #22385C. Light-first.
Why: the user wants nothing that reads as generic AI or crypto-dashboard output. The look comes from the concept (a bookkeeper's ledger), so the product and the visuals are one idea.
Rejected: Instrument (calm but at odds with the voice), Newsprint (strong, but dense columns fight a live board).

**2026-11-07 · Authenticity standard applies to code, design and writing** (PRD §15): domain vocabulary, no generic modules, no AI-tell phrasing, drawn SVG marks instead of icon packs, and a user pass over all prose.

**2026-11-07 · Packaging outranks P1 features.** A packaging kit K1–K18 with a Must / Should / Could cut line (PRD §15.4). "Ask Grudge" is built only after K1–K17.
Why: judges meet the link preview, the first 10 seconds of the site, the README and the video thumbnail before any code.

**2026-11-07 · AI Builder award dropped.**
Why: it needs the app to be "built primarily with ai.tatum.io", which contradicts the authenticity standard. Saves about an hour.

**2026-11-07 · 15m questions lock at T−480 s, not T−600 s.**
Why: the 5m DeepBook market expiring at T is listed only about 6.5–10 minutes ahead (verified), so T−600 would race its creation.

**2026-11-07 · Pin postgres.js 3.4.9, not 4.1.0.**
Why: 4.x was published days earlier; Drizzle is proven on 3.4.

**2026-11-07 · Render Frankfurt + Supabase eu-central-1.**
Why: Polymarket geo-restricts the US. Fallback: switch the Render region if reads fail.

**2026-11-07 · x402 verification checks the treasury's USDC balance change _equals_ `amount`.**
Why: that is the spec's wording for the `exact` scheme; "≥" would accept overpayments the spec doesn't define.

**2026-11-07 · Public non-destructive `POST /api/verify-memory`; the destructive amnesia stays admin-only.**
Why: judges can check the Walrus rebuild themselves without any way to wipe production.

**2026-11-07 · A paying agent runs continuously (`agent.ts --loop`) from Day 1 through Nov 16**, paying only when the board shows a disagreement ≥ 7 pts.
Why: live mainnet payments accumulating on `/receipts` are stronger evidence for the Agent Payments award than one demo transaction.
