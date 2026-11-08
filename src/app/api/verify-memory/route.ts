import { checkAgainstWalrus, type WalrusCheck } from "@/server/memory/coldboot";
import { singleton } from "@/server/singleton";

export const dynamic = "force-dynamic";

/** Each check reads Walrus twice, and the relayer's budget is shared with the writes. */
const REUSE_FOR_MS = 60_000;

const latest = () =>
  singleton<{ atMs: number; check: Promise<WalrusCheck> | null }>("verify-memory", () => ({
    atMs: 0,
    check: null,
  }));

/** Public and read-only. Anyone who calls within a minute of the last check sees that check. */
export async function POST(): Promise<Response> {
  const held = latest();
  if (!held.check || Date.now() - held.atMs > REUSE_FOR_MS) {
    held.atMs = Date.now();
    held.check = checkAgainstWalrus();
    held.check.catch(() => {
      held.check = null;
    });
  }
  try {
    const check = await held.check;
    return Response.json({ checkedAt: new Date(held.atMs).toISOString(), ...check });
  } catch {
    return Response.json({ error: "Walrus did not answer; try again shortly" }, { status: 502 });
  }
}
