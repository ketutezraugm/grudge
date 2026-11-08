import { readFileSync } from "node:fs";
import { TransactionDataBuilder } from "@mysten/sui/transactions";
import { fromBase64 } from "@mysten/sui/utils";
import { beforeEach, describe, expect, it } from "vitest";
import { requirementsFor, toHeader, USDC_TYPE } from "./protocol";
import { QUOTE_TTL_MS, signQuote } from "./quote";
import { acceptPayment, type Chain, type Ledger } from "./verify";

/**
 * A gasless 0.01 USDC payment from the agent wallet to the treasury, built and signed for real,
 * with the simulation result Tatum returned for it on 2026-11-08.
 */
const recorded = JSON.parse(
  readFileSync(new URL("./fixtures/gasless-usdc.json", import.meta.url), "utf8"),
) as {
  agent: string;
  treasury: string;
  amount: string;
  transaction: string;
  signature: string;
  simulated: {
    status: { success: boolean };
    balanceChanges: { coinType: string; address: string; amount: string }[];
  };
};

const secret = "s".repeat(40);
const now = Date.parse("2026-11-08T15:30:00Z");
const digest = TransactionDataBuilder.getDigestFromBytes(fromBase64(recorded.transaction));

function paymentFor(options: { amount?: string; expiresMs?: number; signature?: string } = {}) {
  const token = signQuote(
    {
      amount: recorded.amount,
      category: "btc-5m",
      expiresMs: options.expiresMs ?? now + QUOTE_TTL_MS,
    },
    secret,
  );
  return toHeader({
    x402Version: 2,
    accepted: requirementsFor(options.amount ?? recorded.amount, token, recorded.treasury),
    payload: {
      signature: options.signature ?? recorded.signature,
      transaction: recorded.transaction,
    },
  });
}

let executed: number;
let claims: Map<string, "settling" | "settled" | "failed">;
let chain: Chain;
const ledger: Ledger = {
  async claim(entry) {
    if (claims.has(entry.digest)) return false;
    claims.set(entry.digest, "settling");
    return true;
  },
  async finish(entryDigest, settled) {
    claims.set(entryDigest, settled ? "settled" : "failed");
  },
};

const accept = (header: string, category: "btc-5m" | "btc-15m" = "btc-5m") =>
  acceptPayment({ header, category, payTo: recorded.treasury, secret, nowMs: now, chain, ledger });

beforeEach(() => {
  executed = 0;
  claims = new Map();
  chain = {
    async simulate() {
      return { ok: recorded.simulated.status.success, changes: recorded.simulated.balanceChanges };
    },
    async execute() {
      executed += 1;
      return { ok: true, digest };
    },
  };
});

describe("acceptPayment", () => {
  it("settles a correct payment and names the payer", async () => {
    expect(await accept(paymentFor())).toEqual({ ok: true, digest, payer: recorded.agent });
    expect(executed).toBe(1);
    expect(claims.get(digest)).toBe("settled");
  });

  it("refuses the same signed payment a second time and does not execute it again", async () => {
    await accept(paymentFor());
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "duplicate" });
    expect(executed).toBe(1);
  });

  it("refuses a payment that sends less than the quoted price, before anything executes", async () => {
    chain.simulate = async () => ({
      ok: true,
      changes: recorded.simulated.balanceChanges.map((change) =>
        change.address === recorded.treasury ? { ...change, amount: "5000" } : change,
      ),
    });
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "amount" });
    expect(executed).toBe(0);
    expect(claims.size).toBe(0);
  });

  it("refuses an overpayment too: the scheme is exact", async () => {
    chain.simulate = async () => ({
      ok: true,
      changes: recorded.simulated.balanceChanges.map((change) =>
        change.address === recorded.treasury ? { ...change, amount: "20000" } : change,
      ),
    });
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "amount" });
    expect(executed).toBe(0);
  });

  it("refuses a payment that pays someone other than the treasury", async () => {
    chain.simulate = async () => ({
      ok: true,
      changes: recorded.simulated.balanceChanges.map((change) =>
        change.address === recorded.treasury ? { ...change, address: recorded.agent } : change,
      ),
    });
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "amount" });
    expect(executed).toBe(0);
  });

  it("ignores a transfer of some other coin to the treasury", async () => {
    chain.simulate = async () => ({
      ok: true,
      changes: recorded.simulated.balanceChanges.map((change) =>
        change.address === recorded.treasury ? { ...change, coinType: "0x2::sui::SUI" } : change,
      ),
    });
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "amount" });
  });

  it("refuses a payment the chain would not run", async () => {
    chain.simulate = async () => ({ ok: false, changes: [] });
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "simulation" });
    expect(executed).toBe(0);
  });

  it("refuses a quote that has expired", async () => {
    expect(await accept(paymentFor({ expiresMs: now - 1 }))).toEqual({
      ok: false,
      reason: "quote",
    });
    expect(executed).toBe(0);
  });

  it("refuses terms the buyer lowered after the quote was signed", async () => {
    expect(await accept(paymentFor({ amount: "1" }))).toEqual({ ok: false, reason: "terms" });
    expect(executed).toBe(0);
  });

  it("refuses a quote taken for another category", async () => {
    expect(await accept(paymentFor(), "btc-15m")).toEqual({ ok: false, reason: "terms" });
  });

  it("refuses a signature that does not match the transaction", async () => {
    const forged = `${recorded.signature.slice(0, -4)}AAAA`;
    expect(await accept(paymentFor({ signature: forged }))).toEqual({
      ok: false,
      reason: "signature",
    });
    expect(executed).toBe(0);
  });

  it("refuses a header that is not a payment", async () => {
    expect(await accept("not a payment")).toEqual({ ok: false, reason: "malformed" });
  });

  it("records a failed execution and reports it", async () => {
    chain.execute = async () => ({ ok: false, digest });
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "execution" });
    expect(claims.get(digest)).toBe("failed");
  });

  it("records a payment that threw during execution as failed too", async () => {
    chain.execute = async () => {
      throw new Error("Received HTTP status code 429");
    };
    expect(await accept(paymentFor())).toEqual({ ok: false, reason: "execution" });
    expect(claims.get(digest)).toBe("failed");
  });

  it("uses the USDC type the quote names", () => {
    expect(recorded.simulated.balanceChanges.every((change) => change.coinType === USDC_TYPE)).toBe(
      true,
    );
  });
});
