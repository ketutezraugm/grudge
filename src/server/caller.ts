/**
 * Render sits behind Cloudflare, and each appends what it saw to X-Forwarded-For. Measured on the
 * live service (2026-11-08): sending `6.6.6.6` arrived as `6.6.6.6,<my address>, <Cloudflare edge>`.
 * The last entry is a shared edge that changes per request, and anything before the second to
 * last was written by the caller. So the visitor's address is the second to last entry.
 * With fewer than two entries there is no address to trust, and the caller gets none.
 */
export function callerAddress(forwardedFor: string | null): string | null {
  const hops = (forwardedFor ?? "").split(",").map((hop) => hop.trim());
  return hops.length >= 2 ? hops.at(-2) || null : null;
}
