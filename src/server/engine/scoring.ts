import { type ByVoice, type Outcome, type Voice, voices } from "../domain";

/** What Grudge holds against one voice in one category. */
export interface Grudge {
  /** Brier loss, discounted so recent calls count for more. */
  loss: number;
  /** Discounted number of calls behind `loss`. */
  count: number;
}

/** Calls this old are worth 0.98 of a fresh one: a memory of roughly the last 50 windows. */
const DISCOUNT = 0.98;

/**
 * `loss` is a discounted sum, so it settles near 50 times the mean Brier score. At that scale
 * the textbook Hedge rate sqrt(8 ln K / T) with K = 4 voices and T = 50 is about 0.47. A rate
 * of 2 would turn a 0.03 Brier gap into a 20x weight ratio and leave one voice in charge.
 */
const HEDGE_RATE = 0.5;

/** A voice with fewer calls than this has not earned a grudge or a good name yet. */
const ESTABLISHED_AFTER = 5;

/** Logit pooling needs probabilities away from 0 and 1. */
const POOL_CLAMP = 0.02;

const PRICE_FLOOR = 10_000n;
const PRICE_SPAN = 40_000;
const PRICE_STEP = 1_000;

/** Calls this far apart are worth showing as a disagreement. */
export const DISAGREEMENT_GAP = 0.07;

export function scoreCall(grudge: Grudge | undefined, p: number, outcome: Outcome): Grudge {
  const brier = (p - outcome) ** 2;
  return {
    loss: DISCOUNT * (grudge?.loss ?? 0) + brier,
    count: DISCOUNT * (grudge?.count ?? 0) + 1,
  };
}

/**
 * How much each present voice gets to say. A newcomer is held at the average of the
 * established voices until it has enough calls to be judged.
 */
export function trustWeights(board: ByVoice<Grudge>, present: readonly Voice[]): ByVoice<number> {
  const established = present.flatMap((voice) => {
    const grudge = board[voice];
    return grudge && grudge.count >= ESTABLISHED_AFTER ? [grudge.loss] : [];
  });
  const neutral = established.length
    ? established.reduce((sum, loss) => sum + loss, 0) / established.length
    : 0;

  const losses = present.map((voice) => {
    const grudge = board[voice];
    return { voice, loss: grudge && grudge.count >= ESTABLISHED_AFTER ? grudge.loss : neutral };
  });
  const lowest = Math.min(...losses.map((entry) => entry.loss));
  const shares = losses.map(({ voice, loss }) => ({
    voice,
    share: Math.exp(-HEDGE_RATE * (loss - lowest)),
  }));
  const total = shares.reduce((sum, entry) => sum + entry.share, 0);

  const weights: ByVoice<number> = {};
  for (const { voice, share } of shares) weights[voice] = share / total;
  return weights;
}

const logit = (p: number) => Math.log(p / (1 - p));
const clamp = (p: number) => Math.min(1 - POOL_CLAMP, Math.max(POOL_CLAMP, p));

/** The trust-weighted call, averaged in log-odds so confident voices are not diluted. */
export function grudgeLine(calls: ByVoice<number>, weights: ByVoice<number>): number | null {
  let pooled = 0;
  let totalWeight = 0;
  for (const voice of voices) {
    const p = calls[voice];
    const weight = weights[voice];
    if (p === undefined || weight === undefined) continue;
    pooled += weight * logit(clamp(p));
    totalWeight += weight;
  }
  return totalWeight > 0 ? 1 / (1 + Math.exp(-pooled / totalWeight)) : null;
}

/** 0 with no history, rising toward the weight of the most trusted voice. */
export function confidence(weights: ByVoice<number>, resolvedCount: number): number {
  const strongest = Math.max(0, ...voices.map((voice) => weights[voice] ?? 0));
  return (1 - Math.exp(-resolvedCount / 50)) * strongest;
}

/** USDC atomic units (6 decimals): 0.010 with no confidence, up to 0.050, in steps of 0.001. */
export function priceAtomic(confidenceLevel: number): bigint {
  const raw = Number(PRICE_FLOOR) + PRICE_SPAN * confidenceLevel;
  return BigInt(Math.round(raw / PRICE_STEP) * PRICE_STEP);
}

export function disagreement(calls: ByVoice<number>): number {
  const values = voices.flatMap((voice) => {
    const p = calls[voice];
    return p === undefined ? [] : [p];
  });
  return values.length < 2 ? 0 : Math.max(...values) - Math.min(...values);
}
