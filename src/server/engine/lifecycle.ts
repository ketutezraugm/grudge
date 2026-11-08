import type { ByVoice, Category, Outcome, Voice } from "../domain";

/** Past this long after the lock instant a capture is no longer a fair, simultaneous call. */
const LOCK_GRACE_MS = 30_000;

/** Polymarket settles about 80 s after a window ends, so asking sooner only wastes calls. */
export const RESOLVE_AFTER_MS = 60_000;

/** After this, a window is settled with whichever venues have answered. */
const RESOLVE_DEADLINE_MS = 20 * 60_000;

export function missedLock(lockMs: number, nowMs: number): boolean {
  return nowMs - lockMs > LOCK_GRACE_MS;
}

/**
 * The voices that settle a window. Kalshi lists 15-minute windows only, and DeepBook can only
 * settle a window whose strike was known at lock time.
 */
export function settlingVoices(category: Category, hasStrike: boolean): Voice[] {
  const venues: Voice[] =
    category === "btc-15m" ? ["deepbook", "polymarket", "kalshi"] : ["deepbook", "polymarket"];
  return hasStrike ? venues : venues.filter((voice) => voice !== "deepbook");
}

/** `final` once every settling voice has answered, or the deadline has passed. */
export function verdict(
  settling: readonly Voice[],
  answered: ByVoice<Outcome>,
  endMs: number,
  nowMs: number,
): "waiting" | "final" {
  const allAnswered = settling.every((voice) => answered[voice] !== undefined);
  return allAnswered || nowMs - endMs >= RESOLVE_DEADLINE_MS ? "final" : "waiting";
}

/** The crowd is the plain average of what visitors picked, or nothing if nobody did. */
export function crowdCall(picks: readonly number[]): number | null {
  if (picks.length === 0) return null;
  return picks.reduce((sum, p) => sum + p, 0) / picks.length;
}
