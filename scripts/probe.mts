/**
 * Live check of every external dependency Grudge reads. Run it before a demo and whenever a
 * source misbehaves. `--write-memory` also stores one memory on Walrus mainnet.
 */
import { openWindows } from "../src/server/engine/windows";
import { NAMESPACES, writeBulk } from "../src/server/memory/store";
import { tatumCalls } from "../src/server/tatum/budget";
import { bitcoinUsd } from "../src/server/tatum/rate";
import { sui } from "../src/server/tatum/sui";
import { deepbookCall, deepbookStrike } from "../src/server/voices/deepbook";
import { kalshiReading } from "../src/server/voices/kalshi";
import { polymarketCall } from "../src/server/voices/polymarket";

const MAX_PRICER_AGE_MS = 30_000;
let failures = 0;

async function check(name: string, run: () => Promise<string>): Promise<void> {
  const started = Date.now();
  try {
    const detail = await run();
    console.log(`ok    ${name.padEnd(26)} ${detail}  (${Date.now() - started} ms)`);
  } catch (err) {
    failures += 1;
    const message = err instanceof Error ? err.message : String(err);
    console.log(`FAIL  ${name.padEnd(26)} ${message}`);
  }
}

const percent = (p: number) => `${(p * 100).toFixed(1)}%`;

await check("deepbook markets", async () => {
  const markets = await sui().predict.read.markets();
  const listed = markets
    .toSorted((a, b) => Number(a.expiryMs - b.expiryMs))
    .map(
      (m) =>
        `${new Date(Number(m.expiryMs)).toISOString().slice(11, 19)}=${m.referencePrice ?? "unset"}`,
    );
  if (markets.length === 0) throw new Error("no active markets");
  return `${markets.length} listed: ${listed.join(" ")}`;
});

await check("deepbook pricer", async () => {
  const markets = await sui().predict.read.markets();
  const next = markets
    .filter((m) => Number(m.expiryMs) > Date.now() + 30_000)
    .toSorted((a, b) => Number(a.expiryMs - b.expiryMs))[0];
  if (!next) throw new Error("no market far enough from expiry");
  const pricer = await sui().predict.read.pricer({ underlying: "BTC", expiryMs: next.expiryMs });
  const ageMs = Date.now() - pricer.asOf.pythSpotMs;
  if (ageMs > MAX_PRICER_AGE_MS) throw new Error(`pricer is ${ageMs} ms old`);
  const strike = next.referencePrice ?? pricer.forward;
  return `up(${strike.toFixed(2)}) = ${percent(pricer.up(strike))}, pyth age ${ageMs} ms`;
});

await check("deepbook strike chain", async () => {
  const { read } = sui().predict;
  const markets = await read.markets();
  // 1m markets chain on a 60 s step, so only a market on a 5-minute mark says anything here.
  const seeded = markets.find((m) => m.referencePrice !== null && m.expiryMs % 300_000n === 0n);
  if (!seeded?.referencePrice) throw new Error("no 5m market has a reference price yet");
  const before = await read.settlement({
    underlying: "BTC",
    expiryMs: seeded.expiryMs - 300_000n,
  });
  if (before.settlementPrice === null) throw new Error("previous window not settled");
  const gap = Math.abs(before.settlementPrice - seeded.referencePrice);
  const summary = `reference ${seeded.referencePrice.toFixed(2)} vs previous settlement ${before.settlementPrice.toFixed(4)} (gap $${gap.toFixed(4)})`;
  // The reference is the previous settlement rounded to the $0.01 tick.
  if (gap > 0.01) throw new Error(`windows no longer chain: ${summary}`);
  return summary;
});

await check("tatum btc rate", async () => {
  const price = await bitcoinUsd();
  if (price === null) throw new Error("no rate returned");
  return `BTC = $${price.toFixed(2)}`;
});

for (const category of ["btc-5m", "btc-15m"] as const) {
  const window = openWindows(category, Date.now())[0];
  if (!window) continue;
  const label = `${category} ends ${new Date(window.endMs).toISOString().slice(11, 16)}`;

  await check(`polymarket ${label}`, async () => {
    const call = await polymarketCall(window, Date.now());
    if (!call) throw new Error("no live call");
    return `p(up) = ${percent(call.p)}`;
  });

  if (category === "btc-15m") {
    await check(`kalshi ${label}`, async () => {
      const reading = await kalshiReading(window, Date.now());
      if (!reading) throw new Error("no live reading");
      return `p(up) = ${percent(reading.call.p)}, strike ${reading.strike}`;
    });
  }

  const opensInMs = window.startMs - Date.now();
  if (opensInMs > 0) {
    // The strike is the Bitcoin price at the window's start, so it does not exist before then.
    console.log(
      `skip  deepbook ${label}  strike exists once the window opens in ${Math.ceil(opensInMs / 1000)} s`,
    );
    continue;
  }
  const listed = (await sui().predict.read.markets()).some(
    (m) => m.expiryMs === BigInt(window.endMs),
  );
  if (!listed) {
    // DeepBook lists the 5m market for an end time only about 10 minutes ahead. A 15m window locks
    // 8 minutes before it ends, so the market is always there by then.
    console.log(`skip  deepbook ${label}  its 5m market is not listed yet (listed ~10 min ahead)`);
    continue;
  }
  await check(`deepbook ${label}`, async () => {
    const strike = await deepbookStrike(window);
    if (strike === null) throw new Error("strike not available");
    const call = await deepbookCall(window, strike, Date.now());
    if (!call) throw new Error("no live call (market not listed yet, or pricer stale)");
    return `p(up) = ${percent(call.p)} at strike ${strike.toFixed(2)}`;
  });
}

if (process.argv.includes("--write-memory")) {
  await check("walrus memory write", async () => {
    const text = `Grudge probe at ${new Date().toISOString()}: every voice answered.`;
    const [written] = await writeBulk([{ namespace: NAMESPACES.lesson, text }]);
    if (!written?.blobId) throw new Error(written?.error ?? "no blob id");
    return `blob ${written.blobId}`;
  });
}

const calls = tatumCalls();
console.log(`\ntatum calls this run: grpc ${calls.grpc}, data api ${calls.data}`);
process.exit(failures === 0 ? 0 : 1);
