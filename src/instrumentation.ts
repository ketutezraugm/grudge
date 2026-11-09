export async function register(): Promise<void> {
  // The worker needs Node (gRPC, Postgres) and a running server, not a build or the edge runtime.
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return;
  }
  // A second worker double-writes memories, so a dev server for UI work can run without one.
  if (process.env.GRUDGE_WORKER === "off") return;
  const { runMigrations } = await import("./server/db/client");
  const { restoreIfEmpty } = await import("./server/memory/coldboot");
  const { log } = await import("./server/log");
  const { startWorker } = await import("./server/worker/loop");

  await runMigrations();
  try {
    await restoreIfEmpty();
  } catch (err) {
    // Walrus being unreachable must not take the site down with it; the worker starts regardless.
    log.error("coldboot.failed", { err });
  }
  startWorker();
}
