# Grudge: name, voice and copy

> The visual identity is in [IDENTITY.md](IDENTITY.md). The Grudge Book look this file once described (paper, red pencil, stamps, ledger rules) was retired on 2026-11-08 by PLAYBOOK v3, and its palette, type, marks and signature UI sections were removed on 2026-11-09 (they remain in git history). Section numbers are unchanged, so references to §5 and §7 still hold.

## Quick Reference

| Element                             | Value                                                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                                | **Grudge**                                                                                                                                            |
| Motto                               | **Markets forget. Grudge doesn't.**                                                                                                                   |
| One-liner                           | Grudge watches DeepBook, Polymarket, Kalshi and you call the same Bitcoin move, remembers every wrong call on Walrus, and trusts whoever's earned it. |
| Visual identity                     | See [IDENTITY.md](IDENTITY.md)                                                                                                                        |
| Voice                               | Petty, deadpan, precise                                                                                                                               |
| Emotion                             | The satisfying feeling of "I told you so", backed by receipts                                                                                         |

---

## 1. Idea

Every forecaster is wrong sometimes. Most apps forget it by the next refresh. Grudge writes it down.

- A **grudge** is a remembered wrong call. It lives on Walrus Memory (mainnet), and it lowers that voice's pull on the Grudge line.
- **Forgiveness** is earned: a voice that keeps being right sees its grudge decay (`L ← 0.98·L`).
- The **Grudge line** is the trust-weighted consensus, shown as the current call of the board.
- Grudges are portable. Wipe the server and they survive, because they live on Walrus.

### Product vocabulary (use these words everywhere, in UI and in code)

| Term        | Meaning                                                      | Never say                      |
| ----------- | ------------------------------------------------------------ | ------------------------------ |
| Voice       | One source of calls: DeepBook, Polymarket, Kalshi, the Crowd | "source", "oracle", "feed"     |
| Call        | A voice's probability at lock time                           | "prediction datapoint"         |
| Grudge      | A remembered wrong call / a voice's accumulated loss         | "penalty", "negative score"    |
| Grudge line | Trust-weighted consensus probability                         | "aggregate", "ensemble output" |
| Forgiven    | A voice whose trust recovered                                | "rehabilitated"                |
| Ledger      | The feed of resolved windows                                 | "history table"                |
| Receipt     | A Walrus blob or Sui digest link proving a record            | "proof artifact"               |

---

## 5. Voice & Tone

**Personality:** a petty but meticulous bookkeeper. Deadpan. Never mean to _people_, only to _bad calls_. Backs every claim with a number or a receipt.

| We are                      | We are not                     |
| --------------------------- | ------------------------------ |
| Petty about calls           | Mean to users                  |
| Deadpan, dry                | Memey, emoji-spam              |
| Precise (numbers, receipts) | Vague hype                     |
| Short                       | Explaining the math unprompted |

### Copy bank

| Context         | Copy                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Hero            | **Markets forget. Grudge doesn't.**                                                                                     |
| Sub-hero        | Four voices call the same Bitcoin move. Grudge writes down who was wrong, on Walrus, and trusts the rest a little more. |
| Wrong call      | `Polymarket said 71% ▲. It went ▼. Noted.`                                                                              |
| Right call      | `Kalshi called it. Grudge reduced by 0.04.`                                                                             |
| Forgiven        | `DeepBook: forgiven. Nine right in a row.`                                                                              |
| Disagreement    | `DeepBook and Polymarket disagree by 11 pts. The last 31 times, DeepBook was closer.`                                   |
| Crowd wrong     | `The Crowd said 80% ▲. It went ▼. Noted.`                                                                               |
| Empty state     | `No grudges yet. Give it five minutes.`                                                                                 |
| Amnesia         | `Server wiped. 212 grudges restored from Walrus. Nothing forgiven.`                                                     |
| Paid API (402)  | `This memory costs 0.012 USDC. Grudges aren't free.`                                                                    |
| Payment success | `Paid. Settled on Sui. Receipt ↗`                                                                                       |
| Source down     | `Lost a voice. Grudge will hold it against them.`                                                                       |
| 404             | `Grudge doesn't remember this page. Unusual.`                                                                           |
| Footer          | `Every grudge is a Walrus blob. Receipts ↗`                                                                             |

### Writing rules

- **Banned words and shapes:**
  - "revolutionary", "seamless", "leverage", "unlock", "game-changer", "delve", "AI-powered", "web3-native", "to the moon"
  - "not just X, but Y"
  - triple-adjective lists
  - em-dash chains
  - emoji bullet walls
  - "honest about…" sections
  - "In conclusion" endings
- **Show, don't claim.** Use real numbers and real moments from the build.
- Claude drafts in this voice; the user does the final pass in their own words.

---

## 7. Social / Blog

- Blog title: **"I built an app that holds grudges, on mainnet"**
- X hook: `Markets forget. I built one that doesn't. Grudge reads DeepBook, Polymarket and Kalshi on the same BTC window, writes every wrong call to @WalrusFoundation, and reads the chain through @Tatum_io. Agents pay it in USDC to borrow its memory.`
- Hashtags: none. Tagging is enough.
- Visuals: one hero visual from the approved design, reused everywhere.
