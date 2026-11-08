export async function register(): Promise<void> {
  // The worker needs Node (gRPC, Postgres) and a running server, not a build or the edge runtime.
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return;
  }
  const { runMigrations } = await import("./server/db/client");
  const { startWorker } = await import("./server/worker/loop");
  await runMigrations();
  startWorker();
}
