import { database } from "../db/client";
import { questions } from "../db/schema";
import { categories } from "../domain";
import { openWindows, questionId } from "../engine/windows";

/** Makes sure every window that can still take a call has a question waiting for it. */
export async function discoverWindows(nowMs: number): Promise<void> {
  const rows = categories.flatMap((category) =>
    openWindows(category, nowMs).map((window) => ({
      id: questionId(window),
      category,
      windowStart: new Date(window.startMs),
      expiry: new Date(window.endMs),
      lockAt: new Date(window.lockMs),
    })),
  );
  if (rows.length > 0) await database().insert(questions).values(rows).onConflictDoNothing();
}
