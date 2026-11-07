import { closeDatabase, runMigrations } from "../src/server/db/client";
import { log } from "../src/server/log";

try {
  await runMigrations();
  log.info("migrations.applied");
} finally {
  await closeDatabase();
}
