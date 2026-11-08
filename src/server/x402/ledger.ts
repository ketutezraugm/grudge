import "server-only";
import { eq } from "drizzle-orm";
import { database } from "../db/client";
import { payments } from "../db/schema";
import type { Ledger } from "./verify";

/**
 * The digest is the primary key, so the database is what decides who gets a payment first.
 * ponytail: a payment that failed on a transient error keeps its digest and cannot be retried;
 * the buyer signs a fresh one. Free the digest on a Tatum 429 if that turns out to cost buyers.
 */
export const paymentsLedger: Ledger = {
  async claim({ digest, payer, amount, category }) {
    const taken = await database()
      .insert(payments)
      .values({ digest, payer, amount, category })
      .onConflictDoNothing()
      .returning({ digest: payments.digest });
    return taken.length > 0;
  },

  async finish(digest, settled) {
    await database()
      .update(payments)
      .set(settled ? { status: "settled", settledAt: new Date() } : { status: "failed" })
      .where(eq(payments.digest, digest));
  },
};
