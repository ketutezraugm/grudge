/** Rebuilds the grudges from Walrus alone and compares them with the live scoreboard. Read-only. */
import { closeDatabase } from "../src/server/db/client";
import { checkAgainstWalrus } from "../src/server/memory/coldboot";

try {
  const check = await checkAgainstWalrus();
  console.log(`snapshot read: ${check.snapshotSeq === null ? "none" : `#${check.snapshotSeq}`}`);
  console.log(`records read:  ${check.recordsRead}`);
  console.log(`waiting for Walrus: ${check.waiting} memories not written yet`);
  for (const [category, voices] of Object.entries(check.rebuilt)) {
    for (const [voice, grudge] of Object.entries(voices ?? {})) {
      console.log(
        `  ${category} ${voice.padEnd(10)} loss ${grudge.loss.toFixed(6)}  count ${grudge.count.toFixed(4)}`,
      );
    }
  }
  console.log(`largest gap against the live scoreboard: ${check.maxDifference}`);
} finally {
  await closeDatabase();
}
