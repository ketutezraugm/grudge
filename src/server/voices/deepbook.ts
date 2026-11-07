import "server-only";
import type { Outcome } from "../domain";
import type { Window } from "../engine/windows";
import { log } from "../log";
import { sui } from "../tatum/sui";
import { type Call, makeCall } from "./types";

/** A pricer older than this still returns numbers, so the age has to be checked by hand. */
const MAX_PRICER_AGE_MS = 30_000;

/**
 * The price a window has to beat. A 5m window reads it off its own market, which is seeded once
 * the window opens. A 15m window has no market of its own, so it takes the settlement of the 5m
 * market that expired when the window began.
 */
export async function deepbookStrike(window: Window): Promise<number | null> {
  try {
    const { read } = sui().predict;
    if (window.category === "btc-15m") {
      const settled = await read.settlement({
        underlying: "BTC",
        expiryMs: BigInt(window.startMs),
      });
      return settled.settled ? settled.settlementPrice : null;
    }
    const markets = await read.markets();
    return markets.find((m) => m.expiryMs === BigInt(window.endMs))?.referencePrice ?? null;
  } catch (err) {
    log.warn("deepbook.strike.failed", { err });
    return null;
  }
}

/** P(Bitcoin settles above the strike) from the 5m DeepBook market that expires with the window. */
export async function deepbookCall(
  window: Window,
  strike: number,
  nowMs: number,
): Promise<Call | null> {
  try {
    const pricer = await sui().predict.read.pricer({
      underlying: "BTC",
      expiryMs: BigInt(window.endMs),
    });
    const ageMs = nowMs - pricer.asOf.pythSpotMs;
    if (ageMs > MAX_PRICER_AGE_MS) {
      log.warn("deepbook.call.stale", { ageMs });
      return null;
    }
    return makeCall(pricer.up(strike), nowMs);
  } catch (err) {
    log.warn("deepbook.call.failed", { err });
    return null;
  }
}

export async function deepbookResult(window: Window, strike: number): Promise<Outcome | null> {
  try {
    const settled = await sui().predict.read.settlement({
      underlying: "BTC",
      expiryMs: BigInt(window.endMs),
    });
    if (!settled.settled || settled.settlementPrice === null) return null;
    return settled.settlementPrice >= strike ? 1 : 0;
  } catch (err) {
    log.warn("deepbook.result.failed", { err });
    return null;
  }
}
