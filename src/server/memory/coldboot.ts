import { and, count, eq, lt } from "drizzle-orm";
import { database } from "../db/client";
import { forecasts, lessons, memories, questions, scoreboard } from "../db/schema";
import { categories, namespaces, voices } from "../domain";
import { type Board, rebuildGrudges } from "../engine/rebuild";
import { windowEndingAt } from "../engine/windows";
import { log } from "../log";
import { bucketsBack } from "./buckets";
import { decode, type RecordPayload, type ScoreboardPayload } from "./codec";
import { recall } from "./store";

/** Walrus returns at most 100 memories per recall; an hourly bucket holds far fewer (buckets.ts). */
const BUCKET_RECALL = 100;

/** How many hours back to look for a snapshot before falling back to the old single namespaces. */
const SNAPSHOT_HOURS = 12;

/** A restore also rebuilds the recent ledger, so it reads at least this many hours of records. */
const LEDGER_HOURS = 8;

const EMPTY_RECALL_TRIES = 4;
const EMPTY_RECALL_PAUSE_MS = 2_000;

interface FoundRecord {
  payload: RecordPayload;
  blobId: string;
  text: string;
}

/**
 * A fresh process gets empty answers from the relayer for its first couple of seconds, even
 * when the memories exist (measured 2026-11-08: empty at 1.3 s and 1.7 s, full at 6 s). So an
 * empty answer is asked again after a pause, a few times, before it is believed.
 */
async function recallAgainIfEmpty(...args: Parameters<typeof recall>) {
  for (let attempt = 1; attempt < EMPTY_RECALL_TRIES; attempt += 1) {
    const found = await recall(...args);
    if (found.length > 0) return found;
    await new Promise((done) => setTimeout(done, EMPTY_RECALL_PAUSE_MS));
  }
  return recall(...args);
}

interface WalrusRead {
  snapshot: ScoreboardPayload | null;
  snapshotBlobId: string | null;
  records: FoundRecord[];
}

const toRecords = (found: Awaited<ReturnType<typeof recall>>): FoundRecord[] =>
  found.flatMap((memory) => {
    const payload = decode(memory.text);
    return payload?.kind === "record"
      ? [{ payload, blobId: memory.blobId, text: memory.text }]
      : [];
  });

const newestSnapshot = (found: Awaited<ReturnType<typeof recall>>) =>
  found
    .flatMap((memory) => {
      const payload = decode(memory.text);
      return payload?.kind === "scoreboard" ? [{ payload, blobId: memory.blobId }] : [];
    })
    .toSorted((a, b) => b.payload.seq - a.payload.seq)[0];

/** One bucket, asked again once on a failure: the relayer's decrypt step times out now and then. */
async function readBucket(namespace: string, query: string, firstOfProcess: boolean) {
  const options = { topK: BUCKET_RECALL, sort: "recent" } as const;
  try {
    return await (firstOfProcess
      ? recallAgainIfEmpty(namespace, query, options)
      : recall(namespace, query, options));
  } catch (err) {
    log.warn("coldboot.recall.retry", { namespace, err });
    await new Promise((done) => setTimeout(done, EMPTY_RECALL_PAUSE_MS));
    return recall(namespace, query, options);
  }
}

/**
 * The newest snapshot and every record flushed at or after its hour, read from the hourly
 * buckets. `ledgerHours` adds older hours of records for the ledger; the weights need none.
 */
async function readFromWalrus(
  options: { ledgerHours: number },
  nowMs = Date.now(),
): Promise<WalrusRead> {
  let snapshotHour = -1;
  let snapshot: Awaited<ReturnType<typeof newestSnapshot>>;
  const scoreboardBuckets = bucketsBack(namespaces.scoreboard, nowMs, SNAPSHOT_HOURS);
  for (const [hour, namespace] of scoreboardBuckets.entries()) {
    snapshot = newestSnapshot(await readBucket(namespace, "Grudge scoreboard", hour === 0));
    if (snapshot) {
      snapshotHour = hour;
      break;
    }
  }
  // Nothing in the hourly buckets yet (the first hour after this change): the old namespaces.
  if (!snapshot) return readLegacy();

  const recordHours = Math.max(snapshotHour + 1, options.ledgerHours);
  const records: FoundRecord[] = [];
  for (const namespace of bucketsBack(namespaces.record, nowMs, recordHours)) {
    const found = await readBucket(namespace, "BTC window went UP or DOWN", false);
    if (found.length >= BUCKET_RECALL) log.warn("coldboot.bucket.full", { namespace });
    records.push(...toRecords(found));
  }
  return { snapshot: snapshot.payload, snapshotBlobId: snapshot.blobId, records };
}

/** Before hourly buckets: one namespace per kind, where only a similarity-ranked sample comes back. */
async function readLegacy(): Promise<WalrusRead> {
  const candidates = await recallAgainIfEmpty(namespaces.scoreboard, "Grudge scoreboard", {
    topK: 5,
    sort: "recent",
  });
  const newest = newestSnapshot(candidates);
  const found = await recallAgainIfEmpty(namespaces.record, "BTC window went UP or DOWN", {
    topK: BUCKET_RECALL,
    sort: "recent",
  });
  return {
    snapshot: newest?.payload ?? null,
    snapshotBlobId: newest?.blobId ?? null,
    records: toRecords(found),
  };
}

const rowsOf = (board: Board) =>
  categories.flatMap((category) =>
    voices.flatMap((voice) => {
      const grudge = board[category]?.[voice];
      return grudge ? [{ category, voice, loss: grudge.loss, count: grudge.count }] : [];
    }),
  );

/** How many lessons to bring back; the board shows the latest few. */
const LESSONS_TO_RECALL = 20;

/**
 * No retry on empty: this runs after the records were read, so the process is warm, and an
 * empty answer here usually means no lesson has been written yet.
 */
async function readLessons() {
  const found = await recall(namespaces.lesson, "disagreements of 7+ pts", {
    topK: LESSONS_TO_RECALL,
    sort: "recent",
  });
  return found.flatMap((memory) => {
    const payload = decode(memory.text);
    return payload?.kind === "lesson"
      ? [{ payload, blobId: memory.blobId, text: memory.text, createdAt: memory.createdAt }]
      : [];
  });
}

/** Rebuilds the grudges, the recent ledger and the lessons from Walrus alone. Replaces whatever is in the scoreboard. */
export async function restoreFromWalrus(): Promise<{
  grudges: number;
  windows: number;
  lessons: number;
}> {
  const { snapshot, records } = await readFromWalrus({ ledgerHours: LEDGER_HOURS });
  if (!snapshot && records.length === 0) return { grudges: 0, windows: 0, lessons: 0 };
  const found = await readLessons();

  const rows = rowsOf(
    rebuildGrudges(
      snapshot,
      records.map((entry) => entry.payload),
    ),
  );
  let windows = 0;
  let restoredLessons = 0;

  await database().transaction(async (tx) => {
    await tx.delete(scoreboard);
    if (rows.length > 0) await tx.insert(scoreboard).values(rows);

    for (const { payload, blobId, text } of records) {
      const [existing] = await tx
        .select({ id: questions.id })
        .from(questions)
        .where(eq(questions.id, payload.question));
      if (existing) continue;

      const window = windowEndingAt(payload.category, Date.parse(payload.endsAt));
      await tx.insert(questions).values({
        id: payload.question,
        category: payload.category,
        windowStart: new Date(window.startMs),
        expiry: new Date(window.endMs),
        lockAt: new Date(window.lockMs),
        strike: payload.strike,
        line: payload.line,
        state: payload.state,
        outcome: payload.outcome,
        split: payload.split,
        venueResults: payload.results,
        resolvedAt: new Date(payload.resolvedAt),
      });
      const calls = voices.flatMap((voice) => {
        const p = payload.calls[voice];
        return p === undefined
          ? []
          : [{ questionId: payload.question, voice, p, capturedAt: new Date(window.lockMs) }];
      });
      if (calls.length > 0) await tx.insert(forecasts).values(calls);
      await tx.insert(memories).values({
        namespace: namespaces.record,
        kind: "record",
        ref: payload.question,
        body: text,
        status: "done",
        blobId,
        writtenAt: new Date(),
      });
      windows += 1;
    }

    // Oldest first, so the cards keep their order.
    for (const { payload, blobId, text, createdAt } of found.toReversed()) {
      const [held] = await tx
        .select({ id: memories.id })
        .from(memories)
        .where(eq(memories.blobId, blobId));
      if (held) continue;

      const [memory] = await tx
        .insert(memories)
        .values({
          namespace: namespaces.lesson,
          kind: "lesson",
          ref: `lesson-${payload.category}-${blobId.slice(0, 8)}`,
          body: text,
          status: "done",
          blobId,
          writtenAt: new Date(),
        })
        .returning({ id: memories.id });
      await tx.insert(lessons).values({
        category: payload.category,
        text: payload.text,
        memoryId: memory?.id,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      });
      restoredLessons += 1;
    }
  });
  return { grudges: rows.length, windows, lessons: restoredLessons };
}

/** At boot: a database with no grudges at all is either brand new or wiped, so ask Walrus. */
export async function restoreIfEmpty(): Promise<void> {
  const [row] = await database().select({ n: count() }).from(scoreboard);
  if ((row?.n ?? 0) > 0) return;
  const restored = await restoreFromWalrus();
  if (restored.grudges === 0) log.info("coldboot.nothing_to_restore");
  else log.info("coldboot.restored", restored);
}

/** The grudges as the database holds them now. */
export async function liveBoard(): Promise<Board> {
  const live: Board = {};
  for (const row of await database().select().from(scoreboard)) {
    const held = live[row.category] ?? {};
    held[row.voice] = { loss: row.loss, count: row.count };
    live[row.category] = held;
  }
  return live;
}

/** The largest difference in any loss or count between two boards; 0 means they are the same. */
export function largestGap(a: Board, b: Board): number {
  let gap = 0;
  for (const category of categories) {
    for (const voice of voices) {
      const left = a[category]?.[voice];
      const right = b[category]?.[voice];
      if (!left && !right) continue;
      gap = Math.max(
        gap,
        Math.abs((left?.loss ?? 0) - (right?.loss ?? 0)),
        Math.abs((left?.count ?? 0) - (right?.count ?? 0)),
      );
    }
  }
  return gap;
}

export interface WalrusCheck {
  /** Largest gap between a live number and the same number rebuilt from Walrus. */
  maxDifference: number;
  /** Memories written but not yet on Walrus; a gap is expected while they wait. */
  waiting: number;
  snapshotSeq: number | null;
  /** The Walrus blobs the rebuild read, so anyone can fetch them and redo the sum. */
  snapshotBlobId: string | null;
  recordBlobIds: string[];
  recordsRead: number;
  rebuilt: Board;
  live: Board;
}

/** Non-destructive: rebuilds the grudges from Walrus and compares them with the live scoreboard. */
export async function checkAgainstWalrus(): Promise<WalrusCheck> {
  const { snapshot, snapshotBlobId, records } = await readFromWalrus({ ledgerHours: 0 });
  const rebuilt = rebuildGrudges(
    snapshot,
    records.map((entry) => entry.payload),
  );

  const live = await liveBoard();
  const maxDifference = largestGap(rebuilt, live);

  const [waiting] = await database()
    .select({ n: count() })
    .from(memories)
    .where(and(eq(memories.status, "pending"), lt(memories.attempts, 5)));
  return {
    maxDifference,
    waiting: waiting?.n ?? 0,
    snapshotSeq: snapshot?.seq ?? null,
    snapshotBlobId,
    recordBlobIds: records.map((entry) => entry.blobId),
    recordsRead: records.length,
    rebuilt,
    live,
  };
}
