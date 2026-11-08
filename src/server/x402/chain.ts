import "server-only";
import { log } from "../log";
import { singleton } from "../singleton";
import { sui } from "../tatum/sui";
import type { Chain } from "./verify";

/**
 * A payment that reaches simulation spends Tatum calls from the 3 rps budget the worker needs to
 * lock windows on time. Anyone can fetch a quote and sign junk, so attempts are capped.
 * ponytail: one global cap, so a flood can lock honest buyers out of the paid API for a minute
 * but never delays the worker. Per-address caps if that happens.
 */
const ATTEMPTS_PER_MINUTE = 20;

const attempts = () => singleton("x402-attempts", () => ({ sinceMs: 0, count: 0 }));

function allowed(nowMs: number): boolean {
  const state = attempts();
  if (nowMs - state.sinceMs >= 60_000) Object.assign(state, { sinceMs: nowMs, count: 0 });
  state.count += 1;
  return state.count <= ATTEMPTS_PER_MINUTE;
}

/** Simulates and executes payments through Tatum's Sui gRPC gateway, under the shared 3 rps budget. */
export const tatumChain: Chain = {
  async simulate(transaction) {
    if (!allowed(Date.now())) {
      log.warn("x402.simulate.throttled");
      return { ok: false, changes: [] };
    }
    const result = await sui().core.simulateTransaction({
      transaction,
      include: { balanceChanges: true },
    });
    if (result.$kind !== "Transaction") return { ok: false, changes: [] };
    return { ok: result.Transaction.status.success, changes: result.Transaction.balanceChanges };
  },

  async execute(transaction, signature) {
    const result = await sui().core.executeTransaction({ transaction, signatures: [signature] });
    const executed = result.$kind === "Transaction" ? result.Transaction : result.FailedTransaction;
    return {
      ok: result.$kind === "Transaction" && executed.status.success,
      digest: executed.digest,
    };
  },
};
