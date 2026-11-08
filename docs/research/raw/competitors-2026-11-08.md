# Competitor scan, delta since Nov 7

Snapshot: 2026-11-08 ~15:05 UTC (agent clock; the original line said 15:10). Deadline is Nov 10 17:00 UTC (our cutoff 14:00 UTC).
Method: public `gh api` / `gh search` only, plus curl of public demo URLs. No contact, stars, forks or issues.
Baseline: `docs/RESEARCH.md` "Competitive landscape". Not repeated here. Commit counts come from the Link header of `/commits?per_page=1`, so they are exact.

Gallery: recall-tatum-walrus.vercel.app is a static event site (loads, 200) with no entries list. github.com/tatummarketing/total-recall-hackathon has 0 PRs, 0 issues, last push Nov 4. There is no public gallery to enumerate; entries are found only by repo search.
Coverage: `gh search repos` with created>=2026-10-18 over 10 terms gave 69 unique repos, 30 pushed since Nov 6. `gh search code "@mysten-incubation/memwal"` returns only MystenLabs/walrus-memory (code search does not index the hackathon repos). This is a sample, not a census.

## 1. Headline change: Sibyl is a near-clone of Grudge

**nancy197/sibyl** https://github.com/nancy197/sibyl
- Created 2026-11-07, 4 commits (all Nov 7, 06:34-07:10 UTC), 1 contributor, account from 2021 with 6 repos, 0 stars, no releases, no homepage or demo URL. Repo is 36 MB (blog images, SPEC.md, AGENTS.md).
- Idea: "A BTC forecasting council that remembers who was right." Same 5m/15m (also 1m) BTC above-K events. Voices: DeepBook Predict (mainnet, via Tatum gRPC), Kalshi, three paid AI analysts. Polymarket exists but is off by default (geo-block).
- Track: Prediction + Best Walrus Memory + Best Agent Payments (its code map table is keyed to the judging criteria).
- Stack: TypeScript, pnpm, Node 22.5+, SQLite, Move package `sibyl::ledger`, `@protobuf-ts/grpc-transport`, Hedge ensemble, Merkle anchoring.
- Walrus Memory: learning state, not a log. Namespaces: `sibyl:trust` (Hedge weights per horizon x vol x session, versioned), `sibyl:lessons` (paired tests, Bonferroni, promote/retire), `sibyl:policy`, `sibyl:payments`, `sibyl:episodes` (recalled at every lock; the record in the 10 most similar situations moves the trade threshold by -2 to +4 pt), `analyst:<name>`. Outbox with bulk writes and a daily budget. **Wipe and rebuild: `pnpm restore-test` and a dashboard "Amnesia test" button** that checkpoints, wipes local beliefs, restores from Walrus and diffs the next decisions. A no-memory baseline ensemble is scored alongside.
- Tatum: native gRPC for all Sui traffic, shared 3 rps limiter, `SubscribeCheckpoints` streams (DeepBook `MarketSettled` on mainnet, its own `Anchored` on testnet; notes Tatum blocks `SubscribeEvents`). Settlement is seen about 2.5 s after expiry.
- Payments: MPP on Sui via `@suimpp/mpp`. The buyer pays analysts per signal only when value of information exceeds the price; price is `0.01 x (0.5 + trust)`. Own verification, replay protection in SQLite, caps. **Testnet by default** (Circle testnet USDC); the example payment and anchor digests are testnet. It buys signals from AI analysts; it does not sell consensus. No x402.
- Progress risk: README says it "works with no keys: mock memory, dry payments". Mainnet Move anchors and live payments are config switches, not shown done. A 568-event Kalshi backfill on Nov 7 produced 7 promoted lessons. No evidence of a running deployment.
- Packaging: long README with mermaid diagram, rubric-to-code map, illustrated blog (`blog/sibyl-forecasting-council.md`, DEV.to images), detailed dashboard description. No video link, no live URL, no screenshots in the README.
- Strengths vs rubric: hits integration (30%) and technical quality (30%) hard: memory drives decisions, Tatum streams, Merkle commit before expiry, paired-test lessons, amnesia test. Maps directly onto the Best Walrus Memory wording.
- Weaknesses: 4 commits and one day of history (looks like a single large drop, possibly built before the window); testnet payments and anchors; no live demo; DeepBook has no price history so it is absent from backfill; Polymarket off. Paying analysts is a different story from selling consensus.
- Vs Grudge: same core (DeepBook Predict + Kalshi + BTC 5m/15m + Brier + rebuild trust from Walrus after a wipe). In our favour: Polymarket as a live source, visitor picks as a fourth source, x402 on Sui as seller of consensus, mainnet payments if we ship them, a hand-built identity. Against us: Merkle pre-expiry anchor, paired-test lessons, episodic recall, a decision-changing policy, an amnesia button, a blog. If it deploys and moves to mainnet in the next two days, it is the main rival in Prediction, Best Walrus Memory and Best Agent Payments at once. It is the first entry found that uses DeepBook Predict (the Nov 7 scan said none did).

## 2. Other serious competitors

### 2.1 UyLeQuoc/walrus-session-10-remora (carried over; T2 + Memory + Payments)
https://github.com/UyLeQuoc/walrus-session-10-remora
- Created 2026-10-18, 363 commits, 2 contributors, last push 2026-11-06 08:00 (3 commits since Nov 6, so slowing). No homepage. README 36 KB.
- Memory: about 360 memories (Nov 7 scan), allowances, own x402 facilitator (x402 18 mentions, MPP 5), Tatum gRPC. README mentions testnet 17 times vs mainnet 12: payments still mostly testnet.
- Weakness: no live URL; placeholder video and blog per the Nov 7 scan. Not a prediction entry. Threat is to the Payments special and T2.
- Vs Grudge: heavier build and more commits; ours has a sharper single story and (planned) mainnet x402.

### 2.2 ramakrishnanhulk20/ellai (T2 + Payments)
https://github.com/ramakrishnanhulk20/ellai
- Created 2026-10-20, 131 commits, 1 contributor, last push 2026-11-06 04:40 (2 since Nov 6). Live app https://ellai-pay.vercel.app with Docs and Proof pages (the repo homepage field points to ellai-theta.vercel.app, which 404s; the README link is the correct one). README 44 KB, 35 test mentions, 23 mainnet mentions.
- Sui-native allowance object (1.00 USDC total, 0.50 per 24 h), Walrus Memory delegate key, "questions asked" chart falling, mainnet USDC. x402 9 mentions, MPP 2.
- Strength: most credible mainnet payment evidence I found, plus a proof page. Weakness: not prediction; payments are on the spend side. Stalled since Nov 6.
- Vs Grudge: stronger Agent Payments evidence today; we sell via x402 as the server, a different side.

### 2.3 neromtoobad/hindsight (T1, with x402)
https://github.com/neromtoobad/hindsight, live https://hindsight.nerom.site (200). Not Automationbot24x7/hindsight (created Nov 7, 6 commits) or the other "Hindsight" pick journals.
- Created 2026-10-29, 33 commits, 1 contributor, last push 2026-11-06. 2:15 demo video (https://youtu.be/YHwSbraCYCA), screenshots in the README, CI badge.
- Idea: parimutuel markets on Sui mainnet for football, politics, crypto. Five Claude house agents plus Polymarket and DraftKings lines plus real players stand on one line. Each bet mints a Ticket with a hash of the reasoning. Brier scoring, trust-weighted "trust line", per-agent lessons.
- Memory: scorecards, lessons in per-agent notebooks, credibility, all written to Walrus and recalled before the next pick. Live `/api/state` (checked 15:10 UTC): 2,598 memories, 231 markets, 136 resolved, 680 picks, 7.16 SUI staked. Mainnet Move package.
- Tatum: gRPC gateway to open, resolve and fund markets and to read events. x402 on mainnet: an agent bought the "sharp line" for 0.01 SUI (SUI, not USDC); `curl -i https://hindsight.nerom.site/api/sharp/<market-key>` shows the 402.
- Strengths: real money staked, live, most memories, video, mainnet x402, polish. Weaknesses: no DeepBook Predict, no BTC short windows; football-centred, 10-minute worker; x402 amount is tiny and in SUI.
- Vs Grudge: the best-packaged live Prediction entry. They win on being live with real activity; we win on comparing onchain vs offchain sources on the same window and on rebuild-after-wipe if we show it.

### 2.4 nikola0x0/kdace (T1)
https://github.com/nikola0x0/kdace, live https://kdace-zeta.vercel.app (200)
- Created 2026-10-21, 248 commits (3 since Nov 6, last push Nov 8 11:17), 1 contributor. README 13 KB, no video link found, no x402/MPP.
- Idea: five AI analysts pick each LoL Worlds series blind; picks committed on Sui via Tatum before the game; after each series they debate and write a lesson to Walrus Memory (mainnet). Play-money AXP parimutuel, fan sign-in with Google zkLogin. `npm run verify` re-checks every commit, result, lesson and payout.
- Strengths: commit depth, script-verifiable, fan layer. Weaknesses: README still describes a testnet run with a `go-mainnet.ts` script to execute; esports niche; no payments.
- Vs Grudge: different domain; a contender for the track prize on polish and depth. No overlap on Brier or odds comparison.

### 2.5 edycutjong/rimba (T1 + Best Walrus Memory)
https://github.com/edycutjong/rimba, live https://rimba.edycu.dev (200, replay mode)
- Created 2026-11-06, 92 commits all since Nov 6, 2 contributors, last push Nov 8 03:39. CI, release tag, animated SVG hero, MIT. Paper-and-ink "field card" look (pencilled ochre card, green RESOLVED stamp).
- Idea: forecaster for big Sui wallet flow ("moves again within 15 min? YES 72%"), frozen before the answer, graded by checkpoint, Brier vs base rate and the wallet's own habit.
- **Its README admits the headline count is 0 rounds**: as of the Nov 8 01:02 UTC freeze memory was a local stand-in until the Walrus Memory delegate key exists; the Tatum key only went live Nov 7 15:39 UTC.
- Weaknesses: no real Walrus writes yet; the live page is a replay. Strength: tone and visuals are the closest to ours in authenticity.
- Vs Grudge: aesthetic competitor (also paper and pencil). Behind on the mandatory Walrus requirement; if it fixes that it is a Best Walrus Memory contender.

### 2.6 valeriusxix/Tuition (T1 + Best Walrus Memory)
https://github.com/valeriusxix/Tuition
- Created 2026-10-31, 36 commits, 2 contributors, last push Nov 8 06:10. No demo ("to be added"), no video, blog pending.
- Idea: LLM crypto forecaster writing lessons to Walrus Memory, with a controlled memory ON vs OFF experiment. Published: Brier 0.267 off, 0.258 on, 95% CI spans zero, "not statistically significant"; plain base rate 0.259. 485 mainnet memories. Tatum RPC + OHLCV Data API.
- Strength: the most honest learning-loop evidence in the field. Weakness: its own result says memory did not clearly help; no demo, no payments.
- Vs Grudge: a rigour benchmark. Our wipe-and-rebuild result has to show an effect that is not noise.

### 2.7 maixuancanh/thesisbreak (T1)
https://github.com/maixuancanh/thesisbreak
- Created 2026-10-26, 29 commits, 1 contributor, last push Nov 7 20:37. https://thesisbreak.vercel.app returned HTTP 402 to curl at 15:10 UTC (likely a suspended Vercel deployment); treat as down until rechecked.
- Idea: prediction research journal with a chat partner, Kalshi outcomes, reviewed lessons with Walrus consent, durable outbox. README cites 112 receipt-backed forecast/result blobs and 12 NBA memories matched by blob ID and hash on Nov 8. Tatum is only configured; the README says that does not prove a comparison.
- Weakness: demo 402, no x402, thin Tatum. Not a head-on rival.

### 2.8 ALIPHATICHYD/RECEIPTS and RaYYeR220/quits (mainnet payments)
- RECEIPTS https://github.com/ALIPHATICHYD/RECEIPTS: created Oct 21, 51 commits, 2 contributors, live on Render free (https://receipts-adf6.onrender.com). Pick journal, trust per source and league, "how Receipts changed its mind" as memories, and a **mainnet 0.05 USDC pay-with-your-wallet flow** verified server-side through Tatum gRPC (x402 8 mentions). Closest to Grudge's "sell to agents", but per sealed pick. Cliché idea.
- quits https://github.com/RaYYeR220/quits: created Nov 6, 55 commits (all since Nov 6), live https://quits-eight.vercel.app (200). T3 + Payments, x402 + MPP, 90/90 eval harness per the Nov 7 scan. Not prediction; a Payments contender.

Also checked, not top tier: tydavid5/recall-picks (8 commits, pick journal, demo loads), Oduwal/understudy (9 commits, forecasts relayer memory counts, modest 4% gain, demo loads), Maveri-Q/total-recall-hackathon "Vernier" (61 commits, bookies vs Polymarket on football, live vernier-odds.vercel.app, stamps on Sui mainnet, quiet since Nov 2), SammyCodes1/Veto (8 commits, quiet since Oct 31), PugarHuda/invoice-chaser (138 commits, 60 since Nov 6, T3 + MPP, demo loads, off our track).

## 3. Competitive map

Crowded:
- Pick journal that remembers who was right (Hindsight x3 incl. the Automationbot24x7 copy, Receipts, Recall Picks, Trustbook, Veto, Vernier).
- Memory ON vs OFF charts (Tuition, Understudy, Sibyl baseline).
- Agent allowances, spend guards, payee memory, invoices (Remora, Ellai, Quits, Invoice Chaser, Countersign, Tideover, Ghostsub, Spend-aware-agent).
- Sui incident / wallet watchdog learners (WatchSeal, Casewake, Recall Watchdog, Aftermath, Recallguard).

Empty or near-empty:
- Onchain Sui odds as a source: only Sibyl found. Code search for DeepBook Predict returns only Mysten repos plus axis-predict and SAPM, with no Walrus Memory seen in either.
- Selling a consensus signal to agents through x402 on Sui from a prediction product. Sibyl's agents are buyers; Hindsight and Receipts sell single picks.
- Short-window BTC calls (5m/15m) with live settlement: Sibyl only; Rimba uses 15-minute wallet-flow questions.
- Rebuild-after-wipe as a shown feature: Sibyl (button); Understudy claims it but does not demonstrate it.

Prediction track: about 45-50 repos by the Nov 7 count. Serious tier is about 8: Sibyl, Hindsight, KDAce, Rimba, Tuition, ThesisBreak, Vernier, Receipts. Only Hindsight is live with real activity, a video and mainnet money; Sibyl has the closest idea.
Best Walrus Memory: crowded at the top. Sibyl (decision-changing memory, restore), Tuition (honest effect size), Hindsight (2,598 memories), Remora (360 memories), ThesisBreak (blob/hash verification). The "memories that visibly change the product" bar is met on paper by Sibyl and Hindsight.
Best Agent Payments: about 23 payment entries. Mainnet with real evidence: Ellai (allowance), Receipts (0.05 USDC wallet pay), Hindsight (0.01 SUI x402), likely Quits. Remora and Sibyl are mostly testnet. Mainnet USDC x402 as a seller from a data product is uncommon.

"Polished" here: a live URL that loads; mainnet Suiscan links in a verify table; a 2-3 minute video; screenshots in the README; CI badge; an honest "what it does not claim" section; a rubric-to-code map; a blog post. Weak signals: placeholder video, "to be added", testnet only, free-tier hosting that returns 402/404.

## 4. Changed since Nov 7

- New: Sibyl (created Nov 7) overlaps directly and is the first DeepBook Predict user found.
- Rimba (created Nov 6) shows paper-and-pencil visuals and CI/release polish, still without real Walrus writes.
- Hindsight (neromtoobad): 2,598 memories and 680 picks live.
- Remora and Ellai have gone quiet (3 and 2 commits since Nov 6). Quits and Invoice Chaser are the fastest movers in T3 (55 and 60 commits since Nov 6).
- ThesisBreak demo returns 402; Ellai's homepage field is wrong but its README link works.
- The Nov 7 clichés still hold.

## 5. Open questions

- Does Sibyl deploy and switch anchors and payments to mainnet before Nov 10? Recheck its repo and homepage field on Nov 9 and Nov 10 morning.
- Sibyl is 4 commits in one burst; whether it predates Oct 20 is unverifiable. Rules allow existing projects only if the window's work is new; judges may or may not check.
- No public list of submitted entries exists, so the entry count after Nov 7 is a sample.
