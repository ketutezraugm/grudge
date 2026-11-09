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

**2026-11-07 · Hedge rate 0.5, not 2.**
Why: the loss is a discounted sum that settles near 50 times the mean Brier score. At a rate of 2, a 0.03 Brier gap becomes a 20x weight ratio and one voice runs the board. 0.5 sits next to the textbook sqrt(8 ln K / T) = 0.47 for 4 voices over about 50 windows, and gives 2.1x.

**2026-11-07 · All Tatum access lives in `src/server/tatum/`; venue readers live in `src/server/voices/`.**
Why: gRPC and the Data API draw on one 3 rps budget, so one folder owns it. "Voice" is the product's word for a source, so the code uses it too. This replaces the `sui/` and `sources/` folders in the first PRD layout.

**2026-11-07 · Scripts are `.mts` and run through `tsx --conditions=react-server --env-file-if-exists=.env.local`.**
Why: `.ts` resolves to CommonJS here and has no top-level await; the condition lets `server-only` load outside Next; the optional env file lets the same scripts run on Render with plain variables.

**2026-11-07 · Palette tokens live in `src/app/globals.css`; `assets/` keeps only the logo.**
Why: one place for the colors, and Tailwind reads them there.

**2026-11-07 · pnpm's 24-hour release-age policy excludes three Mysten packages at exact versions** (`@mysten/bcs@2.1.4`, `@mysten/sui@2.39.1`, `@mysten/deepbook-v3@2.11.1`).
Why: the SDK versions we pin require them and Mysten published them within the last day. Each exclusion names one version, so nothing newer slips in.

**2026-11-07 · `protobufjs` and `esbuild` install scripts stay blocked.**
Why: protobufjs's script only prepares an optional CLI, and esbuild gets its binary from its platform package.

**2026-11-07 · One env file: `.env`. No `.env.local`.**
Why: two files that both set the same variable already blanked a real Tatum key once (an empty placeholder in `.env.local` overrode the value in `.env`). Everything lives in `.env`, which git ignores; `.env.example` lists the names.

**2026-11-08 · The GitHub repo `ketutezraugm/grudge` starts private and goes public on submission day (Nov 10, before the form).**
Why: the hackathon needs a public repo only at submission, and about 150 competitor repos are visibly reading each other. Staying private keeps the approach to ourselves while we build. History carries over unchanged when it flips. Before flipping, review `docs/RESEARCH.md` and PRD §1, which name competitors.

**2026-11-08 · The git remote uses HTTPS with the `gh` credential helper (repo-local), not SSH.**
Why: SSH to github.com failed host-key verification on this machine, and trusting a host key blindly is not something to do silently. The helper is set in the repo's own git config only.

**2026-11-08 · Row-level security is on for every table, with no policies.**
Why: Supabase serves the `public` schema over a REST API, and the `anon` and `authenticated` roles had full privileges on all seven tables, `payments` included. With no policies the API sees nothing. The server connects as `postgres`, which bypasses row-level security (checked), so nothing changes for the app. Declared in the schema with `.enableRLS()` so new tables inherit the habit.

**2026-11-08 · Hosting is Render Starter via a Blueprint (`render.yaml`); the user's DigitalOcean droplet is ruled out.**
Why: the droplet has 1 vCPU, about 320 MB of free memory and runs a paper trader whose uninterrupted record is the point of another project, so co-hosting was refused by the session that manages it. Secrets marked `sync: false` are typed into the Render dashboard, so they never pass through the repository or the chat; `QUOTE_SECRET` and `ADMIN_TOKEN` are generated by Render; `AGENT_PRIVATE_KEY` is never set on the server. The `bot` host in the user's `~/.ssh/config` (`167.71.197.78`) is not that droplet and its host key changed, so nobody connects to it.

**2026-11-08 · A window with fewer than two voices is voided, never guessed.**
Why: seen live. With the VPN off only DeepBook answered, and the worker voided both windows rather than invent a comparison. Nothing was scored or written to Walrus. A lock more than 30 s late is voided for the same reason: it would no longer be a simultaneous call.

**2026-11-08 · The Tatum transport retries transient failures (HTTP 429, `ECONNRESET`, gRPC `UNAVAILABLE`) after 1 s then 3 s.**
Why: a long-lived gRPC connection that died while idle fails the first call that uses it. That cost the 06:12 window before the fix.

**2026-11-08 · Records carry `resolvedAt`; scoreboard snapshots carry `through`; restoring replays records by resolution order.**
Why: a snapshot can already count a window whose own record is still queued, so restoring needs to know exactly which records it covers. `through` is the resolution time of the newest window the snapshot counts. It is read together with the grudges in one repeatable-read transaction, so a window settling mid-read cannot be counted twice or never. The first two memories on Walrus (06:27 UTC) predate this and use the old format. They still count on mainnet, and the next snapshot supersedes what they held.

**2026-11-08 · The flusher runs in the background and never blocks the 5-second loop.**
Why: a Walrus write takes 20 to 90 seconds. It flushes every 5 minutes, or at 15 waiting memories, in batches of at most 20, and queues a scoreboard snapshot only when new records arrived since the last one.

**2026-11-08 · Amnesia refuses to wipe unless Walrus alone already reproduces the live weights.**
Why: wiping is only safe if nothing is lost. `forget()` pauses the worker, writes every waiting memory, rebuilds from Walrus into a scratch board, and stops with a 409 if that board differs from the live one by more than 1e-9. It keeps `scoreboard` memories so snapshot numbering continues, and deletes only `record` memories, which come back with their blob ids. First live run: 5 grudges before, 5 after, gap 0, 4 ledger windows restored.

**2026-11-08 · An empty recall is asked again, up to four times, 2 s apart.**
Why: measured. A fresh process gets empty answers from the relayer for roughly its first 2 seconds (empty at 1.3 s and 1.7 s, full at 6 s) even though the memories exist. Without the wait, the first `verify-memory` after a restart reported a gap of 1, and a real cold boot could have restored nothing and started from zero.

**2026-11-08 · `POST /api/verify-memory` is public, and everyone shares one check per minute.**
Why: each check reads Walrus twice and the relayer's budget is shared with the writes. A cached check (and one in flight, shared) caps the cost at two reads a minute however often it is called.

**2026-11-08 · Claude does not design; every screen is designed in Claude Design and Claude only implements it.**
Why: the user's call. They want no generic AI look (no black neon, no rounded boxes). Before each design handoff Claude asks the user questions, then builds a Design artifact seeded with the brief, copy, brand guidelines and real data. This supersedes the PRD's "run `impeccable` for UI work" (§12, §15).

**2026-11-08 · Lessons are counted, not written: one sentence per 25 resolved windows per category, from a template.**
Why: over the windows where voices were 7+ pts apart, it reports how often each voice was closest to the outcome. A tie credits nobody. Fewer than 5 such windows writes nothing and waits for the next 25. Streak and split lessons from the PRD are left out until the board needs them. Queueing runs in a savepoint so a failed lesson cannot stop a window from settling; the database path was checked once in a rolled-back transaction.

**2026-11-08 · Picks are capped at 3 per address per window, and the address is the second-to-last `X-Forwarded-For` entry.**
Why: the Crowd voice is the mean of picks, and a cookie alone lets one person stuff it. Measured on the live service: a spoofed `6.6.6.6` arrived as `6.6.6.6,<real address>, <Cloudflare edge>`, so the last entry is a shared edge that changes per request and the second to last is the visitor. With fewer than two entries the cap is skipped. The slot is reserved before the database write and given back if the insert conflicts or fails, so simultaneous requests cannot all pass. The count lives in memory (one instance); a restart only forgives. The spoofed-header measurement was a bad-body request, so no pick was written to production; the cap itself is covered only by the header unit test.

**2026-11-08 · Design scope settled with the user: three screens in one Design canvas, Grudge Book as the starting look, locked calls only on the gauge.**
Why: the user chose, from options, (1) board, `/receipts` and `/agents` together so they share one system; (2) the Grudge Book direction from `brand-guidelines.md`, which Claude Design may push but not replace; (3) three things a judge must get in 10 seconds, in order: markets disagree and Grudge keeps score, it learns from Walrus memory, it is live right now; (4) no live odds before the lock, so the gauge shows each window's frozen calls and a countdown, which avoids a refresher that would spend free-plan Tatum credits. The brief on the canvas is plain on purpose and carries real samples, so Claude Design draws from real numbers and designs honest empty states for what does not exist yet (payments, Tatum counters, amnesia history).

**2026-11-08 · The btc-5m tie-break is not adopted, reversing the default the user accepted at 15:00 UTC.**
Why: letting DeepBook's settlement decide a 1–1 split would score Polymarket against DeepBook's own feed on every tied window, so the ensemble would favour one of the voices it grades. The void rate that would have justified it also fell from 4 of 20 (08:18 UTC) to 2 of 20 (15:14 UTC), under PRD §10.5's 15% trigger. Splits stay void and are shown as SPLIT.

**2026-11-08 · After the red-team review (`docs/REVIEW.md`), five boosters lead the remaining work: the UI from Claude Design, mainnet x402 through Tatum, lessons recalled from Walrus at view time, an honest learning comparison, and packaging.**
Why: Presentation scores near zero with no UI at T−47 h, Best Agent Payments needs x402, and the competitor scan found Sibyl (same core, testnet, no demo) and Tuition (an honest null result on memory). The shipped score estimate rises from 5.9 to 8.1 out of 10. PRD §1's claims of being the "only" onchain-odds entry and of four Tatum surfaces were corrected to match what exists.

**2026-11-08 · The Claude Design handoff follows the playbook's Phase 7: a full `docs/DESIGN-BRIEF.md` on the canvas, surfaces in two batches.**
Why: the first brief covered three screens. Phase 7 also asks for every surface, a motion spec with the magic-moment choreography, an accessibility floor, the full ban list and copy for each screen. Batch 1 stays the user's three screens; batch 2 (favicon, social image, README banner, X image, blog cover, thumbnail, video cards, learning chart) waits for batch 1's approval. The brief now leads with the real result (DeepBook closer 72% over 54 disagreements, 84% of the line) and tells Claude Design to push the hand-built marks, because another entry also uses a paper-and-pencil look. Layout decisions, such as how the ledger reflows on a phone, stay with Claude Design.

**2026-11-08 · x402 is verified and settled through Tatum; the payment checks run in a tested function that takes the chain and the ledger as arguments.**
Why: this is the money path, so `acceptPayment` (`x402/verify.ts`) is written test-first against a real recorded payment, with the chain and ledger passed in because they are the boundaries. It refuses, in order: a malformed header, a bad or expired quote, terms that differ from the offer (including a lowered price or another category), a signature that does not match, a simulation that fails, any amount other than exactly the quote paid to the treasury in USDC (under and over are both refused), and a digest already claimed. Nothing is claimed or executed before the amount is simulated. The quote is an HMAC-signed price, category and expiry, so the server keeps no state between the 402 and the payment. First live run: 0.038 USDC, settled on mainnet, replay refused.

**2026-11-08 · Payment attempts that reach simulation are capped at 20 a minute across all callers.**
Why: each attempt spends Tatum calls from the same 3 rps budget the worker uses to lock windows, and anyone can fetch a free quote and sign junk. A flood can lock honest buyers out of the paid API for a minute but cannot delay the worker. A per-address cap is the upgrade if it happens.

**2026-11-08 · "Zero gas" is not claimed.**
Why: the settled transaction's gas summary shows computation cost 1,322,268 and a storage rebate of 1,322,268. What was verified is that the payer holds no SUI and the payment still settled. The two PRD lines that said "0 gas" were corrected.

**2026-11-08 · The learning result is published as measured: memory beats equal-weight averaging on 5m, and does not beat the best single voice.**
Why: the stored lock-time line is a genuine out-of-sample forecast, so scoring it is fair. Over the last 100 resolved windows per category, Grudge's Brier is 0.1747 against 0.1825 for equal weights on 5m (gain 0.0078 ± 0.0065, 95%), but DeepBook alone scores 0.1690. On 15m the gain over equal weights is 0.0018 ± 0.0035, not significant. The weights are still concentrating on DeepBook (0.84 on 5m), so the gap to DeepBook may close; that is a hypothesis, not a claim. The hedge rate stays at 0.5 (PRD §5.3): picking a different rate after seeing these windows would be tuning on the test data. Competitors set the bar here: one entry published a null result on memory and was credited for it.

**2026-11-08 · Correction: the learning gain over equal weights is not statistically clear on either category.**
Why: the entry above said the 5m gain's interval excluded zero. That was true at 96 windows (+0.0078 ± 0.0065) and false one window later (97 windows: +0.0061 ± 0.0072). It was borderline and I over-read it. The claim for the README, pitch and video is now: slightly ahead of an equal-weight average on both categories, interval includes zero, DeepBook alone scores better. The numbers will keep moving as windows resolve; recompute before writing them anywhere public.

**2026-11-08 · The playbook is the master guideline, and its design rules replace three earlier choices.**
Why: the owner said the playbook overrides any earlier decision or prompt. Audit against it (2026-11-08 15:47 UTC): (1) `impeccable` is reinstated, but only to implement Claude Design's returned output faithfully and to write DESIGN.md afterwards, as Phase 7 and section 4 say; I had ruled it out entirely. (2) The brand guidelines specified stamps as a "rounded-rect outline", which contradicts the no-rounded-boxes rule and the section 6 ban; it now reads "square-cornered, 2 px radius at most". (3) `docs/IDENTITY.md` now exists as the locked-identity record (the three-direction step was not run; the owner chose Grudge Book directly). Still open from the audit: the Slides artifact for the pitch deck (the PRD's cut line had it as a "Could"; the playbook lists it as a deliverable), the rest of the Phase 7 package, a Design System artifact once the UI exists, and a name-availability check.

**2026-11-08 · The design brief goes to a separate Claude Design project as an uploaded bundle, and the designs come back as an export.**
Why: the Design artifact is private to the user's account, so a separate Claude Design chat saw only an empty shell when given its link, and the chat inside the artifact is a normal Claude chat. `design-handoff.zip` (gitignored) holds the brief, brand guidelines, identity record, logo and three real data samples; the user uploads it and exports the result to `design-from-claude/`, which Claude reads and implements. The artifact stays as a copy of the same files.

**2026-11-08 · Playbook v3 replaces v2 and overrides every earlier rule and decision; all design restarts at Phase 3.**
Why: the owner was not satisfied with the Claude Design batch 1 (Grudge Book) and replaced `docs/PLAYBOOK.md` with v3, which they said overrides everything in this project. v3's section 6 bans, by default, almost everything Grudge Book was built on: the warm "paper" ground with a serif display (cluster 2), broadsheet pastiche (hairline rules, tracked uppercase mono labels), faked materials (CSS grain, stamps), and the faces Newsreader and IBM Plex. Phase 3 now needs three directions built from concrete worlds, with different grounds, hues, type genres and layout signatures, and style tiles in a Design artifact; then IDENTITY.md as exact tokens, a Design System artifact, and three first-viewport compositions before full screens. Grudge Book, `brand-guidelines.md` visual sections, `IDENTITY.md`, `DESIGN-BRIEF.md` and the batch 1 export are superseded for visuals. The name, voice, copy rules, the backend, the API and the Phase 7 text drafts stand. The batch 1 export stays local in `design-from-claude/` (gitignored) as a record of what was turned down.

**2026-11-08 · Identity locked: the Hindcast world under the name Grudge.**
Why: of the three Phase 3 directions, Hindcast is the only one whose world is how the product works (the Brier score was made to grade weather forecasters), and it shows learning over time, which "Best Walrus Memory" asks for ("memories that visibly change the product"). The owner was open to a rename, but Grudge stands apart from both clusters of prediction-project names (oracle myths such as Sibyl, Delphi and Augur; forecasting terms such as Brier and Hindcast, both with conflicts found), costs nothing, and suits "Total Recall". Formline's one-glance record survives as a row of ten station marks per source. Rejected: Formline (needs a rename, reads as gambling) and the green manual scoreboard (a retro sports pastiche, and it shows only totals, not change over time). Tokens: `IDENTITY.md`. Font licences verified OFL from Google Fonts METADATA.

**2026-11-08 · Records and snapshots are written to one Walrus namespace per UTC hour.**
Why: found when the public memory check stopped returning gap 0 (gap 0.81, nothing waiting). Walrus Memory's `recall` returns the most similar memories and `sort: "recent"` only orders that set, so asking for the newest 100 returns a sample of the whole day once a namespace holds more than 100 (187 records at 18:21 UTC: the recall spanned 06:27 to 18:21, the newest snapshot returned was #133 while #141 existed). Rebuilding from Walrus was therefore silently wrong past 100 records; amnesia's pre-check refused to wipe, which is what it is for. An hour holds about 16 records and 12 snapshots, so a bucket is always read in full. Memories already written stay in the old namespaces and are a fallback until the first hourly snapshot. Lessons are unchanged. Risk accepted: the relayer's recall also timed out during Seal decryption (`RECALL_TIMEOUT`, 13 s) on large recalls at 18:20 UTC; smaller buckets should help but that is unverified.

**2026-11-09 · The Board is built client-side from the approved export; choices the design left open.**
Why: the page fetches `GET /api/board` in the browser every 5 s and renders nothing from the server except the cobalt ground, because the layout (desk, tab, phone) picks different markup and times must show in the visitor's zone, so a server render would mismatch on hydration. The ledger is a native table and the confidence choice native radios (Biome's a11y rules, and better semantics). Per-source Brier is `loss / samples`, computed in the browser, so the API stays unchanged. The page is capped at 1440 and centred, because only 1440 and below were drawn and the 1920 video would otherwise stretch. Stations and call columns appear only for sources that have a market in the category (no Kalshi on 5 minutes). `GRUDGE_WORKER=off` skips the worker in `instrumentation.ts` so UI work does not start a second worker. All of these are listed under "Not yet sent to Claude Design" in HANDOFF.md.
