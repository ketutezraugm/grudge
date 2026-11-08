import { and, count, eq, lt } from "drizzle-orm";
import { database } from "../db/client";
import { forecasts, memories, questions, scoreboard } from "../db/schema";
import { categories, namespaces, voices } from "../domain";
import { type Board, rebuildGrudges } from "../engine/rebuild";
import { windowEndingAt } from "../engine/windows";
import { log } from "../log";
import { decode, type RecordPayload, type ScoreboardPayload } from "./codec";
import { recall } from "./store";

/** Walrus returns at most 100 memories per recall, which is also how far back a restore can see. */
const RECORDS_TO_RECALL = 100;

/** Snapshots written before the current format cannot be read; look a few back for one that can. */
const SNAPSHOTS_TO_TRY = 5;

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

async function readFromWalrus(): Promise<{
  snapshot: ScoreboardPayload | null;
  snapshotBlobId: string | null;
  records: FoundRecord[];
}> {
  const candidates = await recallAgainIfEmpty(namespaces.scoreboard, "Grudge scoreboard", {
    topK: SNAPSHOTS_TO_TRY,
    sort: "recent",
  });
  const newest = candidates.flatMap((memory) => {
    const payload = decode(memory.text);
    return payload?.kind === "scoreboard" ? [{ payload, blobId: memory.blobId }] : [];
  })[0];
  const snapshot = newest?.payload ?? null;

  const found = await recallAgainIfEmpty(namespaces.record, "BTC window went UP or DOWN", {
    topK: RECORDS_TO_RECALL,
    sort: "recent",
  });
  const records = found.flatMap((memory) => {
    const payload = decode(memory.text);
    return payload?.kind === "record"
      ? [{ payload, blobId: memory.blobId, text: memory.text }]
      : [];
  });
  return { snapshot, snapshotBlobId: newest?.blobId ?? null, records };
}

const rowsOf = (board: Board) =>
  categories.flatMap((category) =>
    voices.flatMap((voice) => {
      const grudge = board[category]?.[voice];
      return grudge ? [{ category, voice, loss: grudge.loss, count: grudge.count }] : [];
    }),
  );

/** Rebuilds the grudges and the recent ledger from Walrus alone. Replaces whatever is in the scoreboard. */
export async function restoreFromWalrus(): Promise<{ grudges: number; windows: number }> {
  const { snapshot, records } = await readFromWalrus();
  if (!snapshot && records.length === 0) return { grudges: 0, windows: 0 };

  const rows = rowsOf(
    rebuildGrudges(
      snapshot,
      records.map((entry) => entry.payload),
    ),
  );
  let windows = 0;

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
  });
  return { grudges: rows.length, windows };
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
  const { snapshot, snapshotBlobId, records } = await readFromWalrus();
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
