import "server-only";
import type { Category } from "../domain";
import { log } from "../log";
import { singleton } from "../singleton";
import { decode } from "./codec";
import { recall } from "./store";

/** The board is polled, so one Walrus read serves everyone looking at the same disagreement. */
const FRESH_MS = 10 * 60_000;
/** A failed or empty read is not retried on every poll: the relayer's budget is shared with writes. */
const RETRY_MS = 60_000;
/** The board must never wait long on Walrus. */
const GIVE_UP_MS = 3_000;
/** The PRD's cut-off: a lesson further than this from the question is about something else. */
const MAX_DISTANCE = 0.55;

export interface RecalledLesson {
  text: string;
  blobId: string;
  at: string | undefined;
}

const held = () =>
  singleton(
    "recalled-lessons",
    () => new Map<string, { atMs: number; lesson: RecalledLesson | null }>(),
  );

/**
 * The lesson Walrus gives back for "who was closer when these two voices disagreed", read from
 * the memory itself. Null when Walrus has nothing close enough, is slow, or fails; the board
 * then shows its stored copy instead.
 */
export async function recalledLesson(
  category: Category,
  high: string,
  low: string,
): Promise<RecalledLesson | null> {
  const key = `${category}:${high}:${low}`;
  const cached = held().get(key);
  const age = cached ? Date.now() - cached.atMs : Number.POSITIVE_INFINITY;
  if (cached && age < (cached.lesson ? FRESH_MS : RETRY_MS)) return cached.lesson;

  let lesson: RecalledLesson | null = null;
  try {
    const found = await Promise.race([
      recall("grudge:v1:lessons", `${category} disagreement ${high} higher than ${low}`, {
        topK: 3,
        sort: "relevance",
        maxDistance: MAX_DISTANCE,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timed out")), GIVE_UP_MS),
      ),
    ]);
    lesson =
      found.flatMap((memory) => {
        const payload = decode(memory.text);
        // The query names a category, but the nearest text can belong to the other one.
        return payload?.kind === "lesson" && payload.category === category
          ? [{ text: payload.text, blobId: memory.blobId, at: memory.createdAt }]
          : [];
      })[0] ?? null;
  } catch (err) {
    log.warn("memory.recall.failed", { category, err });
  }
  held().set(key, { atMs: Date.now(), lesson });
  return lesson;
}
