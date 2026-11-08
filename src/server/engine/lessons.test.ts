import { describe, expect, it } from "vitest";
import { disagreementLesson, type ScoredWindow } from "./lessons";

/** Hand-worked: in each window the closest voice to the outcome is named in the comment. */
const windows: ScoredWindow[] = [
  { outcome: 1, calls: { kalshi: 0.9, polymarket: 0.6, deepbook: 0.5 } }, // Kalshi
  { outcome: 0, calls: { kalshi: 0.8, polymarket: 0.3, deepbook: 0.45 } }, // Polymarket
  { outcome: 1, calls: { kalshi: 0.85, polymarket: 0.7, deepbook: 0.6 } }, // Kalshi
  { outcome: 1, calls: { kalshi: 0.7, polymarket: 0.95, deepbook: 0.55 } }, // Polymarket
  { outcome: 0, calls: { kalshi: 0.2, polymarket: 0.5, deepbook: 0.6 } }, // Kalshi
  { outcome: 1, calls: { kalshi: 0.9, polymarket: 0.5 } }, // Kalshi, no DeepBook
  { outcome: 1, calls: { kalshi: 0.6, polymarket: 0.62, deepbook: 0.61 } }, // within 7 pts: ignored
];

describe("disagreementLesson", () => {
  it("counts how often each voice was closest when they disagreed", () => {
    expect(disagreementLesson("btc-15m", windows)).toBe(
      "In btc-15m disagreements of 7+ pts (n=6), Kalshi was closer 67% of the time; Polymarket was closer 33%.",
    );
  });

  it("waits when there have been too few disagreements to say anything", () => {
    expect(disagreementLesson("btc-15m", windows.slice(0, 4))).toBeNull();
  });

  it("credits nobody when two voices are equally close", () => {
    const tied = Array.from({ length: 5 }, () => ({
      outcome: 1 as const,
      calls: { kalshi: 0.8, polymarket: 0.8, deepbook: 0.5 },
    }));
    expect(disagreementLesson("btc-5m", tied)).toMatch(
      /^In btc-5m disagreements of 7\+ pts \(n=5\), \w+ was closer 0% of the time; \w+ was closer 0%\.$/,
    );
  });
});
