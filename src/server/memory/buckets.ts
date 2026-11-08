const HOUR_MS = 3_600_000;

/**
 * Walrus Memory's recall returns the most similar memories first and `sort: "recent"` only
 * re-orders that set, so "the newest 100" cannot be asked for (measured 2026-11-08: a recall of
 * 100 records spanned 12 hours of a namespace holding 187). Records and snapshots are therefore
 * written to one namespace per UTC hour. An hour holds about 16 records and 12 snapshots, far
 * under the 100-result cap, so reading a bucket returns all of it whatever the ranking.
 */
export function bucketNamespace(base: string, writtenMs: number): string {
  return `${base}:${new Date(writtenMs).toISOString().slice(0, 13)}`;
}

/** The current hour's bucket first, then each earlier hour. */
export function bucketsBack(base: string, nowMs: number, count: number): string[] {
  return Array.from({ length: count }, (_, hour) => bucketNamespace(base, nowMs - hour * HOUR_MS));
}
