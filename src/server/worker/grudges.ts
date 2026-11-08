import { eq } from "drizzle-orm";
import type { database } from "../db/client";
import { scoreboard } from "../db/schema";
import type { ByVoice, Category } from "../domain";
import type { Grudge } from "../engine/scoring";

/** Either the connection or a transaction on it. */
type Reader = Pick<ReturnType<typeof database>, "select">;

export async function grudgesIn(reader: Reader, category: Category): Promise<ByVoice<Grudge>> {
  const rows = await reader.select().from(scoreboard).where(eq(scoreboard.category, category));
  const held: ByVoice<Grudge> = {};
  for (const row of rows) held[row.voice] = { loss: row.loss, count: row.count };
  return held;
}
