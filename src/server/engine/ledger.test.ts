import { describe, expect, it } from "vitest";
import { lastMarks, markOf, type SettledWindow } from "./ledger";

describe("markOf", () => {
  it("is right when the call leaned the way the window went", () => {
    expect(markOf(0.8, 1)).toBe("right");
    expect(markOf(0.3, 0)).toBe("right");
    expect(markOf(0.8, 0)).toBe("wrong");
    expect(markOf(0.3, 1)).toBe("wrong");
  });

  it("counts exactly 50% as leaning up", () => {
    expect(markOf(0.5, 1)).toBe("right");
    expect(markOf(0.5, 0)).toBe("wrong");
  });
});

describe("lastMarks", () => {
  // Newest first, as the database returns them.
  const windows: SettledWindow[] = [
    { calls: { kalshi: 0.9, deepbook: 0.4 }, outcome: 1 }, // newest: Kalshi right, DeepBook wrong
    { calls: { deepbook: 0.7 }, outcome: 0 }, // Kalshi sat out; DeepBook wrong
    { calls: { kalshi: 0.6, deepbook: 0.6 }, outcome: null }, // void: not scored
    { calls: { kalshi: 0.2, deepbook: 0.3 }, outcome: 0 }, // both right
  ];

  it("lists marks oldest first and skips windows the voice sat out or that were void", () => {
    expect(lastMarks(windows, "kalshi", 10)).toEqual(["right", "right"]);
    expect(lastMarks(windows, "deepbook", 10)).toEqual(["right", "wrong", "wrong"]);
  });

  it("keeps only the newest marks when there are more than the limit", () => {
    expect(lastMarks(windows, "deepbook", 2)).toEqual(["wrong", "wrong"]);
  });
});
