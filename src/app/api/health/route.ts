import { workerState } from "@/server/worker/status";

export const dynamic = "force-dynamic";

/** The loop passes every 5 s, so a minute of silence means it is stuck or dead. */
const STALE_AFTER_MS = 60_000;

export function GET(): Response {
  const { running, lastTickMs } = workerState();
  const ageMs = lastTickMs === null ? null : Date.now() - lastTickMs;
  const healthy = running && ageMs !== null && ageMs < STALE_AFTER_MS;
  return Response.json(
    { ok: healthy, running, lastTickAgeMs: ageMs },
    { status: healthy ? 200 : 503 },
  );
}
