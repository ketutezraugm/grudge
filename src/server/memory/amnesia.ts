import { and, eq, inArray } from "drizzle-orm";
import { database } from "../db/client";
import { amnesia, forecasts, lessons, memories, picks, questions, scoreboard } from "../db/schema";
import { log } from "../log";
import { workerState } from "../worker/status";
import { checkAgainstWalrus, largestGap, liveBoard, restoreFromWalrus } from "./coldboot";
import { flushAll } from "./flusher";

/** Two boards that differ by less than this are the same sum done in a different order. */
const SAME = 1e-9;

/** How long to wait for a worker pass in flight before giving up on the wipe. */
const PAUSE_TIMEOUT_MS = 60_000;

/** Why the wipe did not happen. Nothing has been deleted when this is thrown. */
export class AmnesiaRefused extends Error {}

export interface AmnesiaReport {
  /** Grudges (category and voice pairs) the database held before the wipe and after the restore. */
  before: number;
  restored: number;
  /** Recent windows put back into the ledger, with their blob ids. */
  windows: number;
  /** Lessons put back, newest 20 at most. */
  lessons: number;
  /** Largest gap between the weights before the wipe and after the restore. */
  maxDifference: number;
  identical: boolean;
}

const countGrudges = (board: Awaited<ReturnType<typeof liveBoard>>) =>
  Object.values(board).reduce((sum, held) => sum + Object.keys(held ?? {}).length, 0);

/**
 * Wipes what the server has learned and rebuilds it from Walrus alone. It will not start unless
 * everything is already on Walrus and Walrus alone reproduces the live weights; otherwise the
 * wipe would lose something for good.
 */
export async function forget(): Promise<AmnesiaReport> {
  const worker = workerState();
  if (worker.paused) throw new AmnesiaRefused("amnesia is already running");
  worker.paused = true;
  try {
    const waitUntil = Date.now() + PAUSE_TIMEOUT_MS;
    while (worker.ticking) {
      if (Date.now() > waitUntil) throw new AmnesiaRefused("the worker did not stop in time");
      await new Promise((done) => setTimeout(done, 200));
    }

    const unwritten = await flushAll();
    if (unwritten > 0) throw new AmnesiaRefused(`${unwritten} memories are not on Walrus yet`);

    const check = await checkAgainstWalrus();
    if (check.maxDifference > SAME) {
      throw new AmnesiaRefused(
        `Walrus does not reproduce the live weights (gap ${check.maxDifference})`,
      );
    }

    await database().transaction(async (tx) => {
      await tx.delete(picks);
      await tx.delete(forecasts);
      await tx.delete(lessons);
      await tx.delete(questions);
      await tx.delete(scoreboard);
      // Records and lessons come back from Walrus with their blob ids. Snapshots stay, so the
      // next one continues the numbering instead of starting again at 1.
      await tx
        .delete(memories)
        .where(and(inArray(memories.kind, ["record", "lesson"]), eq(memories.status, "done")));
    });
    log.warn("amnesia.wiped", { grudges: countGrudges(check.live) });

    const restored = await restoreFromWalrus();
    const maxDifference = largestGap(check.live, await liveBoard());
    const report = {
      before: countGrudges(check.live),
      restored: restored.grudges,
      windows: restored.windows,
      lessons: restored.lessons,
      maxDifference,
      identical: maxDifference <= SAME,
    };
    log.info("amnesia.restored", report);
    await database().insert(amnesia).values(report);
    return report;
  } finally {
    worker.paused = false;
  }
}
