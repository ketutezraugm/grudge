import { singleton } from "../singleton";

interface WorkerState {
  running: boolean;
  /** When the loop last finished a full pass, or null before the first one. */
  lastTickMs: number | null;
}

/** Shared through `globalThis`: the loop starts in `instrumentation.ts`, the health route reads it. */
export const workerState = () =>
  singleton<WorkerState>("worker", () => ({ running: false, lastTickMs: null }));
