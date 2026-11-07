import type { ByVoice, Outcome } from "../domain";

export interface Resolution {
  state: "resolved" | "void";
  outcome: Outcome | null;
  /** The venues disagreed about what happened. They settle on different price feeds. */
  split: boolean;
}

/**
 * Venues answer "did Bitcoin finish at or above where it started" from Pyth, a Chainlink TWAP and
 * the BRTI index, so they can disagree. The majority decides. A tie decides nothing.
 */
export function resolve(venueResults: ByVoice<Outcome>): Resolution {
  const results = Object.values(venueResults);
  const ups = results.filter((result) => result === 1).length;
  const downs = results.length - ups;

  if (results.length === 0) return { state: "void", outcome: null, split: false };
  if (ups === downs) return { state: "void", outcome: null, split: true };
  return { state: "resolved", outcome: ups > downs ? 1 : 0, split: ups > 0 && downs > 0 };
}
