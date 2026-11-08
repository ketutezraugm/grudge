import { and, asc, count, eq, lt } from "drizzle-orm";
import { database } from "../db/client";
import { memories, questions, scoreboard } from "../db/schema";
import { namespaces } from "../domain";
import { log } from "../log";
import { singleton } from "../singleton";
import { encode, scoreboardOf } from "./codec";
import { writeBulk } from "./store";

/** The relayer's budget is per minute and per hour, so memories leave in batches, not one by one. */
const FLUSH_EVERY_MS = 5 * 60_000;

/** This many waiting memories is reason enough to flush before the timer. */
const FLUSH_EARLY_AT = 15;

/** The relayer accepts at most 20 items per bulk call. */
const BATCH_SIZE = 20;

/** A memory the relayer keeps refusing is set aside after this many tries. */
const MAX_ATTEMPTS = 5;

/** Pause after a failed call (network, rate limit) before trying the whole batch again. */
const BACKOFF_MS = 60_000;

const progress = () =>
  singleton("memory-flusher", () => ({ inFlight: false, lastFlushMs: 0, backoffUntilMs: 0 }));

const waiting = and(eq(memories.status, "pending"), lt(memories.attempts, MAX_ATTEMPTS));

/**
 * Starts a flush when one is due and returns at once. A Walrus write takes 20 to 90 seconds,
 * far longer than a worker tick, so the write runs on its own and ticks keep going.
 */
export async function flushDue(nowMs: number): Promise<void> {
  const state = progress();
  if (state.inFlight || nowMs < state.backoffUntilMs) return;

  const [row] = await database().select({ n: count() }).from(memories).where(waiting);
  const waitingCount = row?.n ?? 0;
  if (waitingCount === 0) return;
  if (waitingCount < FLUSH_EARLY_AT && nowMs - state.lastFlushMs < FLUSH_EVERY_MS) return;

  state.inFlight = true;
  void flush(nowMs).finally(() => {
    state.inFlight = false;
  });
}

/** Adds a fresh scoreboard snapshot to the queue, so weights can be rebuilt from Walrus alone. */
async function queueScoreboard(nowMs: number): Promise<void> {
  const db = database();
  const [newRecords] = await db
    .select({ n: count() })
    .from(memories)
    .where(and(waiting, eq(memories.kind, "record")));
  const [alreadyQueued] = await db
    .select({ n: count() })
    .from(memories)
    .where(and(waiting, eq(memories.kind, "scoreboard")));
  // A snapshot only adds something when records arrived after the last one.
  if (!newRecords?.n || alreadyQueued?.n) return;

  const [previous] = await db
    .select({ n: count() })
    .from(memories)
    .where(eq(memories.kind, "scoreboard"));
  const seq = (previous?.n ?? 0) + 1;
  const grudges = await db.select().from(scoreboard);
  const resolved = await db
    .select({ category: questions.category, count: count() })
    .from(questions)
    .where(eq(questions.state, "resolved"))
    .groupBy(questions.category);

  await db.insert(memories).values({
    namespace: namespaces.scoreboard,
    kind: "scoreboard",
    ref: `scoreboard-${seq}`,
    body: encode(scoreboardOf({ seq, nowMs, grudges, resolved })),
  });
}

async function flush(nowMs: number): Promise<void> {
  const state = progress();
  try {
    await queueScoreboard(nowMs);
    const batch = await database()
      .select()
      .from(memories)
      .where(waiting)
      .orderBy(asc(memories.createdAt))
      .limit(BATCH_SIZE);
    if (batch.length === 0) return;

    const written = await writeBulk(
      batch.map((memory) => ({ namespace: memory.namespace, text: memory.body })),
    );
    let stored = 0;
    for (const [index, memory] of batch.entries()) {
      const outcome = written[index];
      if (outcome?.blobId) {
        stored += 1;
        await database()
          .update(memories)
          .set({ status: "done", blobId: outcome.blobId, writtenAt: new Date() })
          .where(eq(memories.id, memory.id));
      } else {
        const attempts = memory.attempts + 1;
        await database()
          .update(memories)
          .set({ attempts, status: attempts >= MAX_ATTEMPTS ? "failed" : "pending" })
          .where(eq(memories.id, memory.id));
        log.warn("memory.write.refused", { ref: memory.ref, attempts, error: outcome?.error });
      }
    }
    state.lastFlushMs = nowMs;
    log.info("memory.flushed", { stored, refused: batch.length - stored });
  } catch (err) {
    state.backoffUntilMs = nowMs + BACKOFF_MS;
    log.warn("memory.flush.failed", { err, retryInMs: BACKOFF_MS });
  }
}
