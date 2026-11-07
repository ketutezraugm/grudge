import { z } from "zod";
import type { Outcome } from "../domain";
import type { Window } from "../engine/windows";
import { fetchJson } from "./http";
import { type Call, MAX_SPREAD, makeCall } from "./types";

const GAMMA_MARKETS = "https://gamma-api.polymarket.com/markets";

const marketList = z.array(
  z.object({
    outcomes: z.string(),
    outcomePrices: z.string(),
    bestBid: z.number().nullish(),
    bestAsk: z.number().nullish(),
    closed: z.boolean(),
    umaResolutionStatus: z.string().nullish(),
  }),
);

type Market = z.infer<typeof marketList>[number];

/** Gamma ships these two arrays as JSON text inside the JSON body. */
function stringList(text: string): string[] | null {
  try {
    const parsed = z.array(z.string()).safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function upPrice(market: Market): number | null {
  const outcomes = stringList(market.outcomes);
  const prices = stringList(market.outcomePrices);
  const up = outcomes?.indexOf("Up") ?? -1;
  const price = Number(prices?.[up]);
  return up >= 0 && Number.isFinite(price) ? price : null;
}

function firstMarket(body: unknown): Market | null {
  const parsed = marketList.safeParse(body);
  return (parsed.success && parsed.data[0]) || null;
}

/**
 * The live book is the price. `outcomePrices` lags it right after a window opens, so it is
 * not used for a live reading.
 */
export function readPolymarketCall(body: unknown, nowMs: number): Call | null {
  const market = firstMarket(body);
  if (!market || market.closed) return null;
  const { bestBid, bestAsk } = market;
  if (bestBid == null || bestAsk == null || bestAsk - bestBid > MAX_SPREAD) return null;
  return makeCall((bestBid + bestAsk) / 2, nowMs);
}

export function readPolymarketResult(body: unknown): Outcome | null {
  const market = firstMarket(body);
  if (!market?.closed || market.umaResolutionStatus !== "resolved") return null;
  const up = upPrice(market);
  if (up === null) return null;
  if (up >= 0.99) return 1;
  if (up <= 0.01) return 0;
  return null;
}

function marketUrl(window: Window, extra = ""): string {
  const length = window.category === "btc-5m" ? "5m" : "15m";
  return `${GAMMA_MARKETS}?slug=btc-updown-${length}-${window.startMs / 1000}${extra}`;
}

export async function polymarketCall(window: Window, nowMs: number): Promise<Call | null> {
  return readPolymarketCall(await fetchJson(marketUrl(window), "polymarket.call"), nowMs);
}

/** Resolved markets only appear when Gamma is asked for closed ones. */
export async function polymarketResult(window: Window): Promise<Outcome | null> {
  return readPolymarketResult(
    await fetchJson(marketUrl(window, "&closed=true"), "polymarket.result"),
  );
}
