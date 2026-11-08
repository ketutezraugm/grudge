import { log } from "../log";
import { flushDue } from "../memory/flusher";
import { discoverWindows } from "./discover";
import { lockDue } from "./lock";
import { settleDue } from "./settle";
import { workerState } from "./status";

/** Locks have to land within seconds of their instant, so the loop wakes often and works little. */
const TICK_MS = 5_000;

const steps = [
  ["discover", discoverWindows],
  ["lock", lockDue],
  ["settle", settleDue],
  ["flush", flushDue],
] as const;

async function tick(): Promise<void> {
  const worker = workerState();
  if (!worker.paused) {
    worker.ticking = true;
    for (const [step, run] of steps) {
      try {
        // Read the clock per step: a slow lock must not make the next step act on old time.
        await run(Date.now());
      } catch (err) {
        log.error("worker.step.failed", { step, err });
      }
    }
    worker.ticking = false;
  }
  worker.lastTickMs = Date.now();
}

/** Starts the loop once per process, however many times the framework loads this module. */
export function startWorker(): void {
  const worker = workerState();
  if (worker.running) return;
  worker.running = true;
  log.info("worker.started", { tickMs: TICK_MS });

  const next = async (): Promise<void> => {
    const startedMs = Date.now();
    await tick();
    setTimeout(next, Math.max(0, TICK_MS - (Date.now() - startedMs)));
  };
  void next();
}
