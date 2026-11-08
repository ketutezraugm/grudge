import type { ByVoice, Outcome, Voice } from "../domain";

export type Mark = "right" | "wrong";

/** A call is right when it leaned toward what happened; exactly 50% leans up. */
export function markOf(p: number, outcome: Outcome): Mark {
  return p >= 0.5 === (outcome === 1) ? "right" : "wrong";
}

export interface SettledWindow {
  calls: ByVoice<number>;
  outcome: Outcome | null;
}

/**
 * A voice's last `limit` marks, oldest first, so the newest tally lands at the end of the row.
 * `windows` comes newest first; a window the voice sat out, or that was never scored, is skipped.
 */
export function lastMarks(windows: readonly SettledWindow[], voice: Voice, limit: number): Mark[] {
  const marks: Mark[] = [];
  for (const { calls, outcome } of windows) {
    const p = calls[voice];
    if (p === undefined || outcome === null) continue;
    marks.push(markOf(p, outcome));
    if (marks.length === limit) break;
  }
  return marks.reverse();
}
