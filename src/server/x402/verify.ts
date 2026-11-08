import { isDeepStrictEqual } from "node:util";
import { TransactionDataBuilder } from "@mysten/sui/transactions";
import { fromBase64 } from "@mysten/sui/utils";
import { verifyTransactionSignature } from "@mysten/sui/verify";
import type { Category } from "../domain";
import { log } from "../log";
import { fromHeader, paymentPayload, requirementsFor, USDC_TYPE } from "./protocol";
import { readQuote } from "./quote";

export interface BalanceChange {
  coinType: string;
  address: string;
  amount: string;
}

/** The two chain calls a payment needs. Both go out through Tatum. */
export interface Chain {
  simulate(transaction: Uint8Array): Promise<{ ok: boolean; changes: BalanceChange[] }>;
  execute(transaction: Uint8Array, signature: string): Promise<{ ok: boolean; digest: string }>;
}

/** Remembers every payment by its digest, so a signed payment can be used once. */
export interface Ledger {
  /** False if this digest was already taken. */
  claim(entry: {
    digest: string;
    payer: string;
    amount: bigint;
    category: Category;
  }): Promise<boolean>;
  finish(digest: string, settled: boolean): Promise<void>;
}

export type Refusal =
  | "malformed"
  | "quote"
  | "terms"
  | "signature"
  | "simulation"
  | "amount"
  | "duplicate"
  | "execution";

export type Accepted = { ok: true; digest: string; payer: string } | { ok: false; reason: Refusal };

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** Exactly what `payTo` would receive in USDC if this payment ran. */
function usdcReceived(changes: readonly BalanceChange[], payTo: string): bigint {
  return changes
    .filter((change) => same(change.address, payTo) && change.coinType === USDC_TYPE)
    .reduce((sum, change) => sum + BigInt(change.amount), 0n);
}

/**
 * Checks a payment in the order the spec gives, and executes it only when every check has held.
 * Nothing is claimed or executed before the amount has been simulated, so a refused payment
 * costs nothing and leaves nothing behind.
 */
export async function acceptPayment(input: {
  header: string;
  category: Category;
  payTo: string;
  secret: string;
  nowMs: number;
  chain: Chain;
  ledger: Ledger;
}): Promise<Accepted> {
  const refuse = (reason: Refusal): Accepted => ({ ok: false, reason });

  const payment = fromHeader(input.header, paymentPayload);
  if (payment === null) return refuse("malformed");

  const quote = readQuote(payment.accepted.extra.quote, input.secret, input.nowMs);
  if (quote === null) return refuse("quote");

  // The buyer may only accept what was offered: same price, same payee, same quote.
  const offered = requirementsFor(quote.amount, payment.accepted.extra.quote, input.payTo);
  if (quote.category !== input.category || !isDeepStrictEqual(payment.accepted, offered)) {
    return refuse("terms");
  }

  const transaction = fromBase64(payment.payload.transaction);
  let payer: string;
  try {
    payer = (
      await verifyTransactionSignature(transaction, payment.payload.signature)
    ).toSuiAddress();
  } catch {
    return refuse("signature");
  }
  const digest = TransactionDataBuilder.getDigestFromBytes(transaction);

  const simulation = await input.chain.simulate(transaction);
  if (!simulation.ok) return refuse("simulation");
  const amount = BigInt(quote.amount);
  if (usdcReceived(simulation.changes, input.payTo) !== amount) return refuse("amount");

  if (!(await input.ledger.claim({ digest, payer, amount, category: input.category }))) {
    return refuse("duplicate");
  }

  try {
    const executed = await input.chain.execute(transaction, payment.payload.signature);
    const settled = executed.ok && executed.digest === digest;
    await input.ledger.finish(digest, settled);
    return settled ? { ok: true, digest, payer } : refuse("execution");
  } catch (err) {
    log.error("x402.execute.failed", { digest, err });
    await input.ledger.finish(digest, false);
    return refuse("execution");
  }
}
