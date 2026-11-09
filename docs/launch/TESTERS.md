# Testers

Goal: 5 to 10 real people use the board before the deadline. Record only what actually happens.

## Recruit

- Ask people you already know who follow crypto or prediction markets. One direct message each, with [LIVE URL].
- Post once in the hackathon channel and once on X with [BLOG URL]. Say what to do: make three picks.
- Ask each person to use a different network or device if they can.

## Ask them

Send this, nothing more:

1. Open [LIVE URL]. Make a pick on any open window before it locks.
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
