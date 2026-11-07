/** A voice's reading: the probability that the window ends at or above where it started. */
export interface Call {
  p: number;
  capturedAtMs: number;
}

/** Venues quote exact 0 and 1 near settlement; the scoring math and the database need both open. */
const EDGE = 0.001;

export function makeCall(p: number, capturedAtMs: number): Call {
  return { p: Math.min(1 - EDGE, Math.max(EDGE, p)), capturedAtMs };
}

/** A book wider than this says nothing about the odds. */
export const MAX_SPREAD = 0.2;
