# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Hackathon judges.** About five minutes each, on a 1440 laptop, scoring against a rubric where Walrus and Tatum integration is 30%. In ten seconds they must see three things, in this order: the sources disagree about the same Bitcoin move and Grudge keeps score of who is right; it learns, and the record lives on Walrus; it is live now.
- **Crypto and prediction-market visitors on a 390 phone.** They arrive from a post, look at the live window, and make one pick (up or down, and a confidence). At most three picks per address per window.
- **AI agents.** API only. They buy the trust-weighted line over x402 for a few cents in USDC on Sui. They have no visual surface.

## Product Purpose

Every 5 and 15 minutes four sources (DeepBook, Polymarket, Kalshi and the Crowd, which is visitors' picks) give a probability that Bitcoin ends the window higher. Grudge freezes their calls at a lock time, scores each source with the Brier score when the window resolves, and trusts each source in proportion to how right it has been. The record is stored in Walrus Memory on mainnet and survives a full server wipe. Success is a judge or visitor who can check any number against a blob or a transaction.

## Positioning

A public record of who was right. Every resolved window, every scoreboard snapshot and every lesson is a Walrus blob a visitor can open, and the server can be wiped and rebuilt from Walrus alone with no gap against the live weights. A neighbouring prediction product could copy the sources; it could not honestly claim that record without writing it.

## Operating Context

- Windows are 5 and 15 minutes. Calls lock 2 minutes after the start of a 5-minute window and 7 minutes after the start of a 15-minute one; nothing moves after the lock.
- Venues settle minutes after a window ends, so a locked window can wait for its result. The worker is polled every 5 seconds.
- Times arrive in UTC and are shown in the visitor's time.
- Judges first meet the product in the demo video, then in the live app, then in the repo and the write-up.
- The Tatum free plan allows 3 requests per second, so there are no live odds before the lock.

## Capabilities and Constraints

- Public API: `GET /api/board`, `POST /api/pick`, `GET /api/receipts`, `POST /api/verify-memory`, x402 `GET /api/consensus`. Contracts: `docs/API.md`.
- Per-source Brier figures are not an API field today; they are computed from the ledger the board returns.
- Learning claim: slightly ahead of an equal-weight average, not statistically clear (the 95% interval includes zero), and about level with the best single source (which source is best changes from day to day). Never claim Grudge beats its best source or the market.
- The payer of an x402 call needs no SUI. "Zero gas" is not verified and is never written.
- Tatum call counters reset on every deploy and are labelled "since the last deploy".
- Vocabulary in copy and code: voice (the code calls them sources in copy), call, grudge, ledger, receipt, window, lock, resolve.

## Brand Commitments

Name Grudge. Motto "Markets forget. Grudge doesn't." Voice and writing rules: `docs/brand-guidelines.md` §5. The visual identity is locked in `docs/IDENTITY.md`.

## Evidence on Hand

- A live service at https://grudge-l19c.onrender.com with real windows resolving every few minutes.
- Walrus memories on mainnet (records, scoreboard snapshots, lessons), a public memory check, and a wipe-and-rebuild that was run on real data.
- One real mainnet x402 payment of 0.038 USDC (digest `4f3bXYdmR1XYJTvVrm17HEat4aDSePvShTcqAZmeSnTY`) and a refused replay.
- Absent, and not to be invented: visitor picks (the Crowd has not called), testimonials, outside buyers, and a clear learning margin.

## Product Principles

- Honest numbers over flattering ones: show the modest learning result as it is.
- Every claim is checkable: a blob link, a transaction digest, or the memory check.
- The live state comes first; history and proof follow.
- Missing, stale or empty data is shown as such, never hidden or faked.

## Accessibility & Inclusion

WCAG 2.2 AA text contrast on the verified pairs in `docs/IDENTITY.md`. Up and down are the glyphs ▲ and ▼, never colour alone, and right and wrong are never red against green. Every graphic has a text equivalent. Touch targets are 44 px or more, focus is visible, reduced motion is respected, and there is no horizontal scroll at 390.
