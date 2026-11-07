import "server-only";
import { MemWal } from "@mysten-incubation/memwal";
import type { MemoryKind } from "../domain";
import { memoryEnv } from "../env";
import { singleton } from "../singleton";

export const NAMESPACES = {
  record: "grudge:v1:records",
  scoreboard: "grudge:v1:scoreboard",
  lesson: "grudge:v1:lessons",
} as const satisfies Record<MemoryKind, string>;

/** Walrus takes 20 to 90 seconds to store a memory and confirm it. */
const WRITE_TIMEOUT_MS = 120_000;

const client = () =>
  singleton("walrus-memory", () => {
    const env = memoryEnv();
    return MemWal.create({
      key: env.MEMWAL_PRIVATE_KEY,
      accountId: env.MEMWAL_ACCOUNT_ID,
      serverUrl: env.MEMWAL_SERVER_URL,
    });
  });

export interface Written {
  /** The Walrus blob that holds the memory, or null when the write did not land. */
  blobId: string | null;
  error?: string;
}

/** One bulk call costs a tenth of the relayer's per-minute budget; singles would cost five each. */
export async function writeBulk(
  items: readonly { namespace: string; text: string }[],
): Promise<Written[]> {
  const outcome = await client().rememberBulkAndWait([...items], { timeoutMs: WRITE_TIMEOUT_MS });
  return outcome.results.map((result) =>
    result.status === "done" && result.blob_id
      ? { blobId: result.blob_id }
      : { blobId: null, error: result.error ?? result.status },
  );
}

export interface Recalled {
  blobId: string;
  text: string;
  createdAt: string | undefined;
}

export async function recall(
  namespace: string,
  query: string,
  options: { topK: number; sort: "relevance" | "recent"; maxDistance?: number },
): Promise<Recalled[]> {
  const found = await client().recall({ query, namespace, ...options });
  return found.results.map((memory) => ({
    blobId: memory.blob_id,
    text: memory.text,
    createdAt: memory.created_at,
  }));
}
