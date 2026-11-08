import { describe, expect, it } from "vitest";
import { type LearningWindow, learningSummary } from "./learning";

/**
 * Hand-worked. X and Y sit 80 pts apart and balance in log-odds, so the equal-weight pool is
 * exactly 0.5 and scores 0.25 whatever happens. The Grudge line trusted whoever was right.
 */
const windows: LearningWindow[] = [
  { calls: { deepbook: 0.9, polymarket: 0.1 }, outcome: 1, line: 0.9 }, // line 0.01, DeepBook 0.01, Polymarket 0.81
  { calls: { deepbook: 0.9, polymarket: 0.1 }, outcome: 0, line: 0.2 }, // line 0.04, DeepBook 0.81, Polymarket 0.01
];

describe("learningSummary", () => {
  it("scores the stored line, the equal-weight pool and each voice by mean Brier", () => {
    const summary = learningSummary(windows);
    expect(summary.windows).toBe(2);
    expect(summary.grudge).toBeCloseTo(0.025, 9);
    expect(summary.equalWeight).toBeCloseTo(0.25, 9);
    expect(summary.voices.deepbook).toBeCloseTo(0.41, 9);
    expect(summary.voices.polymarket).toBeCloseTo(0.41, 9);
  });

  it("reports the gain over equal weights with a 95% interval from the per-window differences", () => {
    // Differences are 0.24 and 0.21: mean 0.225, sample sd 0.0212, half-width 1.96 * sd / sqrt(2).
    const { gainOverEqual } = learningSummary(windows);
    expect(gainOverEqual.mean).toBeCloseTo(0.225, 9);
    expect(gainOverEqual.halfWidth).toBeCloseTo(0.0294, 4);
  });

  it("measures the gain over the best single voice on the windows where that voice called", () => {
    const { best, gainOverBest } = learningSummary(windows);
    expect(best?.mean).toBeCloseTo(0.41, 9);
    expect(gainOverBest?.mean).toBeCloseTo(0.385, 9);
  });

  it("says nothing about an interval from a single window", () => {
    const { gainOverEqual } = learningSummary(windows.slice(0, 1));
    expect(gainOverEqual.mean).toBeCloseTo(0.24, 9);
    expect(gainOverEqual.halfWidth).toBeNull();
  });

  it("reports a loss when the line does worse than the average", () => {
    const worse: LearningWindow[] = [
      { calls: { deepbook: 0.9, polymarket: 0.1 }, outcome: 1, line: 0.1 }, // line 0.81 against 0.25
      { calls: { deepbook: 0.9, polymarket: 0.1 }, outcome: 0, line: 0.9 }, // line 0.81 against 0.25
    ];
    expect(learningSummary(worse).gainOverEqual.mean).toBeCloseTo(-0.56, 9);
  });

  it("skips windows with no stored line and returns nulls for an empty history", () => {
    const summary = learningSummary([
      { calls: { deepbook: 0.7, polymarket: 0.4 }, outcome: 1, line: null },
    ]);
    expect(summary.windows).toBe(0);
    expect(summary.grudge).toBeNull();
    expect(summary.best).toBeNull();
    expect(summary.gainOverBest).toBeNull();
  });
});
