# Testers

Goal: 5 to 10 real people use the board before the deadline. Record only what actually happens.

## Recruit

- Ask people you already know who follow crypto or prediction markets. One direct message each, with https://grudge-l19c.onrender.com.
- Post once in the hackathon channel and once on X with [BLOG URL]. Say what to do: make three picks.
- Ask each person to use a different network or device if they can.

## Ask them

Send this, nothing more:

1. Open https://grudge-l19c.onrender.com. Make a pick on any open window before it locks.
2. Say in one sentence what Grudge does, without looking.
3. What did you not understand?
4. An agent can buy the consensus for 0.010 to 0.050 USDC. Would you? Why or why not?
5. May I quote you, and under what name?

## Capture

- Quote only with written permission. Paste text exactly as sent; keep the date.
- Note the confusing moments separately from praise. Fix or log each as an issue.
- Do not edit quotes for tone.

## Crowd picks

Picks go through `POST /api/pick` with `{ question, direction, confidence }`. Three picks per address per window; a fourth gets `429`. People on one network share an address, so tell office or home groups to pick one at a time. The Crowd voice at lock is the mean of the window's picks. Check `GET /api/board` for the Crowd's call before reporting it.

## Testers

| Name or handle | Channel | Date asked | Picked? |
| --- | --- | --- | --- |
|  |  |  |  |

## Quotes

| Quote | Name | Permission | Date |
| --- | --- | --- | --- |
|  |  |  |  |

## Count

Testers who picked: [N, from the table]. Report this number only after counting the table.

## Drafts to send (written for the owner to reword)

### Direct message

Hey, I built something for the Walrus x Tatum hackathon and need a few people to try it for two minutes. It's called Grudge. DeepBook, Polymarket, Kalshi and visitors each call whether Bitcoin ends the next 5 or 15 minutes higher, and Grudge writes down who was wrong. Could you open https://grudge-l19c.onrender.com, pick up or down on an open window before it locks, and tell me in one sentence what you think it does? The confusing parts are the useful part.

### Hackathon channel

Grudge is live: https://grudge-l19c.onrender.com. Every 5 and 15 minutes it grades DeepBook, Polymarket and Kalshi on the same Bitcoin call, stores each result on Walrus Memory (mainnet), and lets agents pay for the consensus in USDC over x402. If you have 2 minutes, make one pick on an open window and tell me what you didn't understand.

### X post (attach a real Board screenshot taken at post time; 254 characters, with the link counted as 23)

Markets forget. I built one that doesn't.

Grudge asks DeepBook, Polymarket and Kalshi the same Bitcoin question every 5 minutes, writes each wrong call to @WalrusFoundation, and reads the chain through @Tatum_io. Make a call too: https://grudge-l19c.onrender.com

### Follow-up reply under the X post (after you have counted real picks)

[N] people have made picks so far. The Crowd is the only voice with no record yet, so it is the one to beat.

Fill [N] only from the Testers table, after counting it.

### Notes

- The channel post and DM ask for one pick; the board allows three per address per window.
- People on one network share an address, so groups should pick one at a time.
- The learning result is modest (slightly ahead of an equal-weight average, interval includes zero). None of these drafts claims more.
