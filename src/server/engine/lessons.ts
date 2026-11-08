import {
  type ByVoice,
  type Category,
  type Outcome,
  type Voice,
  voiceNames,
  voices,
} from "../domain";
import { DISAGREEMENT_GAP, disagreement } from "./scoring";

/** A lesson is written each time a category reaches a multiple of this many scored windows. */
export const LESSON_EVERY = 25;

/** Fewer disagreements than this say nothing yet; the lesson waits for the next 25 windows. */
const MIN_DISAGREEMENTS = 5;

export interface ScoredWindow {
  calls: ByVoice<number>;
  outcome: Outcome;
}

/**
 * Of the windows where the voices were far apart, how often was each one closest to what happened?
 * Written as a plain sentence from a template, so it is never invented, only counted.
 */
export function disagreementLesson(
  category: Category,
  windows: readonly ScoredWindow[],
): string | null {
  const apart = windows.filter((window) => disagreement(window.calls) >= DISAGREEMENT_GAP);
  if (apart.length < MIN_DISAGREEMENTS) return null;

  const tally = new Map<Voice, { present: number; closer: number }>();
  for (const { calls, outcome } of apart) {
    const errors = voices.flatMap((voice) => {
      const p = calls[voice];
      return p === undefined ? [] : [{ voice, error: Math.abs(p - outcome) }];
    });
    const best = Math.min(...errors.map((entry) => entry.error));
    // A tie for closest credits nobody.
    const winners = errors.filter((entry) => entry.error - best < 1e-12);
    for (const { voice } of errors) {
      const held = tally.get(voice) ?? { present: 0, closer: 0 };
      held.present += 1;
      if (winners.length === 1 && winners[0]?.voice === voice) held.closer += 1;
      tally.set(voice, held);
    }
  }

  const share = (held: { present: number; closer: number }) => held.closer / held.present;
  const [first, second] = [...tally.entries()].toSorted(([, a], [, b]) => share(b) - share(a));
  if (!first || !second) return null;

  const percent = (held: { present: number; closer: number }) => Math.round(share(held) * 100);
  return (
    `In ${category} disagreements of ${Math.round(DISAGREEMENT_GAP * 100)}+ pts (n=${apart.length}), ` +
    `${voiceNames[first[0]]} was closer ${percent(first[1])}% of the time; ` +
    `${voiceNames[second[0]]} was closer ${percent(second[1])}%.`
  );
}
