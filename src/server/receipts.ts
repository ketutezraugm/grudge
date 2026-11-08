import "server-only";
import { and, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { database } from "./db/client";
import { amnesia, forecasts, memories, payments, questions } from "./db/schema";
import { type ByVoice, type Category, categories } from "./domain";
import { type LearningSummary, type LearningWindow, learningSummary } from "./engine/learning";
import { singleton } from "./singleton";
import { tatumCalls } from "./tatum/budget";

/** The PRD scores the learning over the last 100 resolved windows of each category. */
const LEARNING_WINDOWS = 100;

/** How the stored lock-time line compares with equal trust and with each voice alone. */
export async function learningByCategory(): Promise<Record<Category, LearningSummary>> {
  const db = database();
  const entries = await Promise.all(
    categories.map(async (category) => {
      const recent = await db
        .select({ id: questions.id, outcome: questions.outcome, line: questions.line })
        .from(questions)
        .where(
          and(
            eq(questions.category, category),
            eq(questions.state, "resolved"),
            isNotNull(questions.outcome),
            isNotNull(questions.line),
          ),
        )
        .orderBy(desc(questions.resolvedAt))
        .limit(LEARNING_WINDOWS);
      const called = recent.length
        ? await db
            .select()
            .from(forecasts)
            .where(
              inArray(
                forecasts.questionId,
                recent.map((window) => window.id),
              ),
            )
        : [];

      const history: LearningWindow[] = recent.flatMap((window) => {
        if (window.outcome === null) return [];
        const calls: ByVoice<number> = {};
        for (const call of called) if (call.questionId === window.id) calls[call.voice] = call.p;
        return [{ calls, outcome: window.outcome, line: window.line }];
      });
      return [category, learningSummary(history)] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<Category, LearningSummary>;
}

const WALRUSCAN = "https://walruscan.com/mainnet/blob";
const SUISCAN = "https://suiscan.xyz/mainnet/tx";

/** Everything the proof page shows. */
async function buildReceipts() {
  const db = database();
  const [byStatus, latest, paid, wipes, learning] = await Promise.all([
    db
      .select({ kind: memories.kind, status: memories.status, n: count() })
      .from(memories)
      .groupBy(memories.kind, memories.status),
    db
      .select({
        kind: memories.kind,
        ref: memories.ref,
        blobId: memories.blobId,
        at: memories.writtenAt,
      })
      .from(memories)
      .where(and(eq(memories.status, "done"), isNotNull(memories.blobId)))
      .orderBy(desc(memories.writtenAt))
      .limit(50),
    db.select().from(payments).orderBy(desc(payments.createdAt)).limit(50),
    db.select().from(amnesia).orderBy(desc(amnesia.at)).limit(20),
    learningByCategory(),
  ]);

  const totals: Record<string, Record<string, number>> = {};
  for (const { kind, status, n } of byStatus) {
    totals[kind] = { ...totals[kind], [status]: n };
  }
  const { calls, sinceMs } = tatumCalls();

  return {
    asOf: new Date().toISOString(),
    memories: {
      totals,
      latest: latest.flatMap((row) =>
        row.blobId
          ? [
              {
                kind: row.kind,
                ref: row.ref,
                blobId: row.blobId,
                at: row.at,
                url: `${WALRUSCAN}/${row.blobId}`,
              },
            ]
          : [],
      ),
    },
    payments: paid.map((row) => ({
      digest: row.digest,
      payer: row.payer,
      // JSON has no bigint: atomic USDC, six decimals, as a string.
      amount: row.amount.toString(),
      category: row.category,
      status: row.status,
      settledAt: row.settledAt,
      url: `${SUISCAN}/${row.digest}`,
    })),
    tatum: { ...calls, sinceStartedAt: new Date(sinceMs).toISOString() },
    amnesia: wipes,
    learning,
  };
}

type Receipts = Awaited<ReturnType<typeof buildReceipts>>;

const latest = () =>
  singleton<{ builtMs: number; held: Promise<Receipts> | null }>("receipts", () => ({
    builtMs: 0,
    held: null,
  }));

/** Shared between visitors for 10 seconds; the learning query reads a few hundred rows. */
export function receiptsSnapshot(): Promise<Receipts> {
  const state = latest();
  if (!state.held || Date.now() - state.builtMs > 10_000) {
    state.builtMs = Date.now();
    state.held = buildReceipts();
    state.held.catch(() => {
      state.held = null;
    });
  }
  return state.held;
}
