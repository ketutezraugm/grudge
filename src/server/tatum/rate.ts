import "server-only";
import { z } from "zod";
import { tatumEnv } from "../env";
import { log } from "../log";
import { singleton } from "../singleton";
import { takeSlot } from "./budget";

const RATE_URL = "https://api.tatum.io/v4/data/rate/symbol?symbol=BTC&basePair=USD";

const rateResponse = z.object({ value: z.coerce.number().positive() });

/** Bitcoin in US dollars from the Tatum Data API, or null when Tatum cannot answer. */
export async function bitcoinUsd(): Promise<number | null> {
  await takeSlot("data");
  const response = await fetch(RATE_URL, {
    headers: { "x-api-key": tatumEnv().TATUM_API_KEY },
    signal: AbortSignal.timeout(8_000),
  }).catch((err: unknown) => {
    log.warn("tatum.rate.unreachable", { err });
    return null;
  });
  if (response === null) return null;
  if (!response.ok) {
    log.warn("tatum.rate.rejected", { status: response.status });
    return null;
  }
  const parsed = rateResponse.safeParse(await response.json());
  if (!parsed.success) {
    log.warn("tatum.rate.unexpected_shape");
    return null;
  }
  return parsed.data.value;
}

/** Every visitor shares one reading; about 290 Data API calls a day however many people look. */
const SPOT_FRESH_MS = 5 * 60_000;
/** After a failed reading, try again sooner. */
const SPOT_RETRY_MS = 60_000;

const spot = () =>
  singleton("bitcoin-spot", () => ({
    usd: null as number | null,
    askedMs: 0,
    asking: null as Promise<void> | null,
  }));

/**
 * The last good reading, refreshed when stale. A failed refresh keeps the old number.
 * ponytail: the number can be arbitrarily old if Tatum stays down; add an age if the UI needs it.
 */
export async function cachedBitcoinUsd(): Promise<number | null> {
  const held = spot();
  const freshFor = held.usd === null ? SPOT_RETRY_MS : SPOT_FRESH_MS;
  if (!held.asking && Date.now() - held.askedMs > freshFor) {
    held.askedMs = Date.now();
    held.asking = bitcoinUsd()
      .then((usd) => {
        if (usd !== null) held.usd = usd;
      })
      .finally(() => {
        held.asking = null;
      });
  }
  await held.asking;
  return held.usd;
}
