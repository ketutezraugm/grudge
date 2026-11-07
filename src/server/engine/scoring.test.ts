import { describe, expect, it } from "vitest";
import { resolve } from "./resolve";
import {
  confidence,
  disagreement,
  grudgeLine,
  priceAtomic,
  scoreCall,
  trustWeights,
} from "./scoring";

describe("scoreCall", () => {
  it("starts a record from the Brier score of the first call", () => {
    expect(scoreCall(undefined, 0.8, 1)).toEqual({ loss: expect.closeTo(0.04, 9), count: 1 });
  });

  it("charges a confident wrong call far more than a hedged one", () => {
    const confident = scoreCall(undefined, 0.9, 0).loss;
    const hedged = scoreCall(undefined, 0.6, 0).loss;
    expect(confident).toBeCloseTo(0.81, 9);
    expect(hedged).toBeCloseTo(0.36, 9);
  });

  it("lets old calls fade by 2% each window", () => {
    const next = scoreCall({ loss: 10, count: 50 }, 0.5, 1);
    expect(next.loss).toBeCloseTo(0.98 * 10 + 0.25, 9);
    expect(next.count).toBeCloseTo(0.98 * 50 + 1, 9);
  });
});

describe("trustWeights", () => {
  const established = (loss: number) => ({ loss, count: 50 });

  it("sums to one and favours the voice with the smaller grudge", () => {
    const weights = trustWeights(
      { deepbook: established(8), polymarket: established(12), kalshi: established(11) },
      ["deepbook", "polymarket", "kalshi"],
    );
    const total = (weights.deepbook ?? 0) + (weights.polymarket ?? 0) + (weights.kalshi ?? 0);
    expect(total).toBeCloseTo(1, 9);
    expect(weights.deepbook).toBeGreaterThan(weights.kalshi ?? 1);
    expect(weights.kalshi).toBeGreaterThan(weights.polymarket ?? 1);
  });

  it("does not let a 0.03 Brier gap hand one voice the whole say", () => {
    const gap = 0.03 * 50;
    const weights = trustWeights({ deepbook: established(10), polymarket: established(10 + gap) }, [
      "deepbook",
      "polymarket",
    ]);
    expect(weights.deepbook).toBeGreaterThan(0.6);
    expect(weights.deepbook).toBeLessThan(0.75);
  });

  it("holds a newcomer at the average of the established voices", () => {
    const weights = trustWeights(
      { deepbook: established(5), polymarket: established(15), crowd: { loss: 0.2, count: 1 } },
      ["deepbook", "polymarket", "crowd"],
    );
    expect(weights.crowd).toBeGreaterThan(weights.polymarket ?? 1);
    expect(weights.crowd).toBeLessThan(weights.deepbook ?? 0);
  });

  it("splits evenly when nobody has a history", () => {
    const weights = trustWeights({}, ["deepbook", "polymarket"]);
    expect(weights).toEqual({ deepbook: 0.5, polymarket: 0.5 });
  });

  it("returns nothing when no voice is present", () => {
    expect(trustWeights({}, [])).toEqual({});
  });
});

describe("grudgeLine", () => {
  it("returns the shared call when every voice agrees", () => {
    const line = grudgeLine({ deepbook: 0.6, polymarket: 0.6 }, { deepbook: 0.5, polymarket: 0.5 });
    expect(line).toBeCloseTo(0.6, 9);
  });

  it("sits near the trusted voice when trust is lopsided", () => {
    const line = grudgeLine({ deepbook: 0.7, polymarket: 0.4 }, { deepbook: 0.9, polymarket: 0.1 });
    expect(line).toBeGreaterThan(0.65);
    expect(line).toBeLessThan(0.7);
  });

  it("stays finite when a venue quotes the extremes", () => {
    const line = grudgeLine({ kalshi: 0.999, polymarket: 0.001 }, { kalshi: 0.5, polymarket: 0.5 });
    expect(line).toBeCloseTo(0.5, 9);
  });

  it("ignores a voice that has a call but no weight", () => {
    expect(grudgeLine({ deepbook: 0.7, crowd: 0.2 }, { deepbook: 1 })).toBeCloseTo(0.7, 9);
  });

  it("has no line without calls", () => {
    expect(grudgeLine({}, {})).toBeNull();
  });
});

describe("confidence and price", () => {
  it("is zero before any window has resolved", () => {
    expect(confidence({ deepbook: 0.9 }, 0)).toBe(0);
  });

  it("rises with resolved windows and with the lead of the strongest voice", () => {
    const early = confidence({ deepbook: 0.5, polymarket: 0.5 }, 10);
    const later = confidence({ deepbook: 0.5, polymarket: 0.5 }, 200);
    const lopsided = confidence({ deepbook: 0.8, polymarket: 0.2 }, 200);
    expect(later).toBeGreaterThan(early);
    expect(lopsided).toBeGreaterThan(later);
  });

  it("prices a call from 0.010 USDC up to 0.050, in whole thousandths", () => {
    expect(priceAtomic(0)).toBe(10_000n);
    expect(priceAtomic(1)).toBe(50_000n);
    expect(priceAtomic(0.43)).toBe(27_000n);
  });
});

describe("disagreement", () => {
  it("measures the gap between the most and least bullish voice", () => {
    expect(disagreement({ deepbook: 0.61, polymarket: 0.8, kalshi: 0.93 })).toBeCloseTo(0.32, 9);
  });

  it("is zero with fewer than two voices", () => {
    expect(disagreement({ deepbook: 0.61 })).toBe(0);
  });
});

describe("resolve", () => {
  it("settles a unanimous result", () => {
    expect(resolve({ deepbook: 1, polymarket: 1, kalshi: 1 })).toEqual({
      state: "resolved",
      outcome: 1,
      split: false,
    });
  });

  it("follows the majority and marks the split", () => {
    expect(resolve({ deepbook: 0, polymarket: 1, kalshi: 0 })).toEqual({
      state: "resolved",
      outcome: 0,
      split: true,
    });
  });

  it("voids a tie between two venues", () => {
    expect(resolve({ deepbook: 1, polymarket: 0 })).toEqual({
      state: "void",
      outcome: null,
      split: true,
    });
  });

  it("accepts a single venue when the others never answered", () => {
    expect(resolve({ polymarket: 0 })).toEqual({ state: "resolved", outcome: 0, split: false });
  });

  it("voids a window nobody resolved", () => {
    expect(resolve({})).toEqual({ state: "void", outcome: null, split: false });
  });
});
