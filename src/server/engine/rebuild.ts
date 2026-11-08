import { voices } from "../domain";
import type { RecordPayload, ScoreboardPayload } from "../memory/codec";
import { scoreCall } from "./scoring";

export type Board = ScoreboardPayload["grudges"];

/**
 * The grudges as they stood after the newest of `records`, rebuilt from Walrus alone: start from the
 * latest snapshot, then replay every settled record the snapshot does not count yet. Windows are
 * replayed in the order they were settled, because a grudge fades with every window that follows.
 */
export function rebuildGrudges(
  snapshot: ScoreboardPayload | null,
  records: readonly RecordPayload[],
): Board {
  const board: Board = structuredClone(snapshot?.grudges ?? {});
  const through = snapshot?.through ?? null;

  const unseen = records
    .filter((entry) => entry.outcome !== null && (through === null || entry.resolvedAt > through))
    .toSorted(
      (a, b) => a.resolvedAt.localeCompare(b.resolvedAt) || a.question.localeCompare(b.question),
    );

  for (const entry of unseen) {
    const outcome = entry.outcome;
    if (outcome === null) continue;
    const held = board[entry.category] ?? {};
    for (const voice of voices) {
      const p = entry.calls[voice];
      if (p !== undefined) held[voice] = scoreCall(held[voice], p, outcome);
    }
    board[entry.category] = held;
  }
  return board;
}
