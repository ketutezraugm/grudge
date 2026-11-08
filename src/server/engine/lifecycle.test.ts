import { describe, expect, it } from "vitest";
import { crowdCall, missedLock, settlingVoices, verdict } from "./lifecycle";

const at = (iso: string) => Date.parse(iso);

describe("missedLock", () => {
  const lock = at("2026-11-07T13:02:00Z");

  it("accepts a capture a few seconds after the lock instant", () => {
    expect(missedLock(lock, lock + 5_000)).toBe(false);
  });

  it("accepts a capture exactly at the end of the grace period", () => {
    expect(missedLock(lock, lock + 30_000)).toBe(false);
  });

  it("refuses a capture one millisecond later than that", () => {
    expect(missedLock(lock, lock + 30_001)).toBe(true);
  });
});

describe("settlingVoices", () => {
  it("asks DeepBook and Polymarket to settle a 5m window", () => {
    expect(settlingVoices("btc-5m", true)).toEqual(["deepbook", "polymarket"]);
  });

  it("adds Kalshi for a 15m window", () => {
    expect(settlingVoices("btc-15m", true)).toEqual(["deepbook", "polymarket", "kalshi"]);
  });

  it("leaves DeepBook out when the window never had a strike", () => {
    expect(settlingVoices("btc-15m", false)).toEqual(["polymarket", "kalshi"]);
  });
});

describe("verdict", () => {
  const end = at("2026-11-07T13:15:00Z");
  const settling = ["deepbook", "polymarket", "kalshi"] as const;

  it("waits for a venue that has not answered yet", () => {
    const answered = { deepbook: 1, polymarket: 1 } as const;
    expect(verdict(settling, answered, end, end + 2 * 60_000)).toBe("waiting");
  });

  it("is final as soon as every settling voice has answered", () => {
    const answered = { deepbook: 1, polymarket: 1, kalshi: 0 } as const;
    expect(verdict(settling, answered, end, end + 2 * 60_000)).toBe("final");
  });

  it("gives up on a silent venue after twenty minutes", () => {
    const answered = { deepbook: 1 } as const;
    expect(verdict(settling, answered, end, end + 20 * 60_000 - 1)).toBe("waiting");
    expect(verdict(settling, answered, end, end + 20 * 60_000)).toBe("final");
  });

  it("is final at the deadline even when nobody answered", () => {
    expect(verdict(settling, {}, end, end + 25 * 60_000)).toBe("final");
  });

  it("does not wait on a voice that is not settling", () => {
    const answered = { polymarket: 0 } as const;
    expect(verdict(["polymarket"], answered, end, end + 90_000)).toBe("final");
  });
});

describe("crowdCall", () => {
  it("averages the picks", () => {
    expect(crowdCall([0.8, 0.65, 0.35])).toBeCloseTo(0.6, 9);
  });

  it("is nothing when nobody picked", () => {
    expect(crowdCall([])).toBeNull();
  });
});
