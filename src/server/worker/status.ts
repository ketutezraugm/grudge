import { singleton } from "../singleton";

interface WorkerState {
  running: boolean;
  /** When the loop last finished a full pass, or null before the first one. */
  lastTickMs: number | null;
  /** Set while amnesia rewrites the database: ticks still pass, but do no work. */
  paused: boolean;
  /** True from the first step of a pass to its last, so a pause can wait for work in flight. */
  ticking: boolean;
}

/** Shared through `globalThis`: the loop starts in `instrumentation.ts`, the health route reads it. */
export const workerState = () =>
  singleton<WorkerState>("worker", () => ({
    running: false,
    lastTickMs: null,
    paused: false,
    ticking: false,
  }));
