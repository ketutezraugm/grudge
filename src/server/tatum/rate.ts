import "server-only";
import { z } from "zod";
import { tatumEnv } from "../env";
import { log } from "../log";
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
