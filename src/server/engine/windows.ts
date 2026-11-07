import type { Category } from "../domain";

const WINDOW_SECONDS: Record<Category, number> = { "btc-5m": 300, "btc-15m": 900 };

/**
 * Every voice is frozen this long before the window ends. The 15m lead is longer because the
 * DeepBook market that expires at the end is only listed about 6.5 to 10 minutes ahead.
 */
const LOCK_LEAD_SECONDS: Record<Category, number> = { "btc-5m": 180, "btc-15m": 480 };

export interface Window {
  category: Category;
  startMs: number;
  endMs: number;
  lockMs: number;
}

export function windowEndingAt(category: Category, endMs: number): Window {
  return {
    category,
    startMs: endMs - WINDOW_SECONDS[category] * 1000,
    endMs,
    lockMs: endMs - LOCK_LEAD_SECONDS[category] * 1000,
  };
}

/** Windows that can still take a call: the current one until it locks, and the next one. */
export function openWindows(category: Category, nowMs: number): Window[] {
  const durationMs = WINDOW_SECONDS[category] * 1000;
  const currentEnd = (Math.floor(nowMs / durationMs) + 1) * durationMs;
  return [currentEnd, currentEnd + durationMs]
    .map((endMs) => windowEndingAt(category, endMs))
    .filter((window) => window.lockMs > nowMs);
}

export function questionId(window: Window): string {
  return `${window.category}:${window.endMs / 1000}`;
}
