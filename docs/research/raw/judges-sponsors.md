# Total Recall: judges, sponsor asks, rules (fetched 2026-11-08)

Sources checked:
- https://tatum.io/hackathon/total-recall (WebFetch returned only the page title; no body)
- https://recall-tatum-walrus.vercel.app (WebFetch, summarized by a small model)
- https://github.com/tatummarketing/total-recall-hackathon (README and src/lib/content.ts via gh api; content.ts is the most complete source)
- https://walrus.xyz/blog/how-to-add-portable-memory-to-claude-code-and-codex-with-walrus-memory/ (redirected from blog.walrus.xyz)
- Web search for Tatum/Walrus announcement posts: no Total Recall announcement found.

## 1. Judges

None listed publicly. The judging panel is "appointed by the Sponsors" (Event Rules, content.ts `eventRules`). No names, roles or companies anywhere.

## 2. Sponsor asks

- Walrus Memory: "Deepest learning loop. Memories that visibly change the product." (content.ts `bonusPrizes`; Best Walrus Memory, $500, selected by the Walrus team)
- Walrus Memory: "Walrus Memory keeps scores, preferences, and reasoning across sessions. Your product gets sharper every week, not every login." (content.ts `missionCards`)
- Tatum: "Tatum Sui RPC and Data APIs when you need onchain reads." Optional per track; required as "Tatum RPC used for onchain data where relevant."
- Agent payments: "Best app across tracks using x402 or MPP, settled on Sui." ($500)
- Submission requirements: Walrus Memory writing on Mainnet; at least 10 memories on Mainnet; Tatum RPC where relevant; published blog post (what it does, how it uses Tatum + Walrus, how it learned over time); working demo; public repo. Optional Tatum AI Builder build for its $500 prize.
- Video: "Short demo video (2 to 3 min)" is a form field (Event Rules, Eligibility).
- Form fields (Event Rules): email, Discord handle, LinkedIn, how did you hear, first Web3 project?, Tatum ID, SUI address, Account ID (SUI), MEMWAL_AGENT_ID, project description, demo video, GitHub repo, Walrus experience, AI Builder experience.

## 3. Rule changes, FAQ, deadlines not in the brief

- Deadline: submissions close 10 Nov 2026, 17:00 UTC. Results 17 Nov 2026. Judging 11 to 16 Nov.
- Judging weights: Walrus + Tatum integration 30%, technical quality 30%, creativity 20%, presentation 20%.
- Bonus points for sharing on X or LinkedIn, tagging @Tatum_io and @WalrusFoundation (optional).
- Prizes paid in USDC to a wallet; winner must confirm via email and send wallet within 14 days of an official announcement. A de minimis test transaction is required.
- Track prizes: $500 / $300 / $200 per track (three tracks, $1,000 each per content.ts comment).
- FAQ: existing projects allowed only if new progress is made during the build window.
- Sponsors may disqualify incomplete or non-compliant submissions. Participation grants Sponsors a royalty-free license to demo and showcase the submission.
- Event Rules name the Sponsors as Walrus Foundation and Tatum Technology LLC.
- Age 18+. One submission per person.

## 4. Public gallery or submissions list

None found. The site and repo show no gallery or list of submissions.

## Caveat

The web search found no public announcement post from @Tatum_io or @WalrusFoundation for "Total Recall". The nearest events were a Tatum "Build on Sui with Walrus" hackathon (storage, earlier) and a Hugging Face Walrus Memory hackathon (closed Oct 9). Firecrawl was unavailable (keyless limit), so the Tatum and Vercel pages were read through WebFetch summaries, not raw HTML. Verify the quotes above against the live pages before citing them in the submission.
