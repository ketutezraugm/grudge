import { type ByVoice, type Outcome, type Voice, voices } from "../domain";
import { grudgeLine } from "./scoring";

export interface LearningWindow {
  calls: ByVoice<number>;
  outcome: Outcome;
  /** The Grudge line as it stood at lock time, before the window resolved. */
  line: number | null;
}

/** How much better Grudge scored, as a mean difference in Brier loss, with a 95% half-width. */
export interface Gain {
  mean: number | null;
  /** Null until there are two windows to measure spread from. */
  halfWidth: number | null;
}

export interface LearningSummary {
  windows: number;
  grudge: number | null;
  equalWeight: number | null;
  voices: ByVoice<number>;
  best: { voice: Voice; mean: number } | null;
  /** Positive means Grudge did better than the same calls averaged with equal trust. */
  gainOverEqual: Gain;
  gainOverBest: Gain | null;
}

const brier = (p: number, outcome: Outcome) => (p - outcome) ** 2;
const mean = (values: readonly number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

function gainOf(differences: readonly number[]): Gain {
  if (differences.length === 0) return { mean: null, halfWidth: null };
  const centre = mean(differences);
  if (differences.length < 2) return { mean: centre, halfWidth: null };
  const spread =
    differences.reduce((sum, d) => sum + (d - centre) ** 2, 0) / (differences.length - 1);
  return { mean: centre, halfWidth: 1.96 * Math.sqrt(spread / differences.length) };
}

/**
 * Does the memory help? The stored lock-time line is a real forecast, made with the weights
 * Grudge had learned by then. Scoring it against the same calls averaged with equal trust, and
 * against each voice alone, says how much the learning is worth, whichever way it comes out.
 */
export function learningSummary(history: readonly LearningWindow[]): LearningSummary {
  const grudgeLosses: number[] = [];
  const equalLosses: number[] = [];
  const equalMinusGrudge: number[] = [];
  const perVoice = new Map<Voice, { loss: number; grudgeLoss: number }[]>();

  for (const { calls, outcome, line } of history) {
    if (line === null) continue;
    const present = voices.filter((voice) => calls[voice] !== undefined);
    const equalWeights: ByVoice<number> = Object.fromEntries(
      present.map((voice) => [voice, 1 / present.length]),
    );
    const pooled = grudgeLine(calls, equalWeights);
    if (pooled === null) continue;

    const grudgeLoss = brier(line, outcome);
    const equalLoss = brier(pooled, outcome);
    grudgeLosses.push(grudgeLoss);
    equalLosses.push(equalLoss);
    equalMinusGrudge.push(equalLoss - grudgeLoss);
    for (const voice of present) {
      const held = perVoice.get(voice) ?? [];
      held.push({ loss: brier(calls[voice] ?? 0, outcome), grudgeLoss });
      perVoice.set(voice, held);
    }
  }

  const voiceMeans: ByVoice<number> = {};
  let best: LearningSummary["best"] = null;
  // A voice that called in only a few windows (the Crowd, with a handful of visitor picks) can
  // post a tiny mean by luck, so it only competes for "best" once it covers half the windows.
  const needed = Math.ceil(grudgeLosses.length / 2);
  for (const [voice, held] of perVoice) {
    const voiceMean = mean(held.map((entry) => entry.loss));
    voiceMeans[voice] = voiceMean;
    if (held.length < needed) continue;
    if (best === null || voiceMean < best.mean) best = { voice, mean: voiceMean };
  }

  const bestRows = best === null ? [] : (perVoice.get(best.voice) ?? []);
  return {
    windows: grudgeLosses.length,
    grudge: grudgeLosses.length ? mean(grudgeLosses) : null,
    equalWeight: equalLosses.length ? mean(equalLosses) : null,
    voices: voiceMeans,
    best,
    gainOverEqual: gainOf(equalMinusGrudge),
    gainOverBest: best === null ? null : gainOf(bestRows.map((row) => row.loss - row.grudgeLoss)),
  };
}
