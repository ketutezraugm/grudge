import { z } from "zod";
import type { Outcome } from "../domain";
import type { Window } from "../engine/windows";
import { fetchJson } from "./http";
import { type Call, MAX_SPREAD, makeCall } from "./types";

const MARKETS = "https://api.elections.kalshi.com/trade-api/v2/markets";
const SERIES_15M = "KXBTC15M";

const marketList = z.object({
  markets: z.array(
    z.object({
      status: z.string(),
      result: z.string(),
      floor_strike: z.number(),
      yes_bid_dollars: z.string(),
      yes_ask_dollars: z.string(),
    }),
  ),
});

type Market = z.infer<typeof marketList>["markets"][number];

export interface KalshiReading {
  call: Call;
  /** The price the window has to beat, as Kalshi states it. */
  strike: number;
}

function onlyMarket(body: unknown): Market | null {
  const parsed = marketList.safeParse(body);
  return (parsed.success && parsed.data.markets[0]) || null;
}

export function readKalshiReading(body: unknown, nowMs: number): KalshiReading | null {
  const market = onlyMarket(body);
  if (market?.status !== "active") return null;
  const bid = Number(market.yes_bid_dollars);
  const ask = Number(market.yes_ask_dollars);
  if (!(bid > 0) || !(ask > 0) || ask - bid > MAX_SPREAD) return null;
  return { call: makeCall((bid + ask) / 2, nowMs), strike: market.floor_strike };
}

export function readKalshiResult(body: unknown): Outcome | null {
  const market = onlyMarket(body);
  if (!market || (market.status !== "finalized" && market.status !== "determined")) return null;
  if (market.result === "yes") return 1;
  if (market.result === "no") return 0;
  return null;
}

/** The one market that closes exactly when the window ends. Kalshi lists 15m markets only. */
function marketUrl(window: Window): string | null {
  if (window.category !== "btc-15m") return null;
  const closeSeconds = window.endMs / 1000;
  return `${MARKETS}?series_ticker=${SERIES_15M}&min_close_ts=${closeSeconds}&max_close_ts=${closeSeconds}`;
}

export async function kalshiReading(window: Window, nowMs: number): Promise<KalshiReading | null> {
  const url = marketUrl(window);
  return url ? readKalshiReading(await fetchJson(url, "kalshi.reading"), nowMs) : null;
}

export async function kalshiResult(window: Window): Promise<Outcome | null> {
  const url = marketUrl(window);
  return url ? readKalshiResult(await fetchJson(url, "kalshi.result")) : null;
}
