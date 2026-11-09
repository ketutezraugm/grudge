import { describe, expect, it } from "vitest";
import fixture from "./board.fixture.json";
import { makeClock } from "./clock";
import { bandOf, focusOf, frontOf, frontText, lastOf, lessonOf, rowsOf, stationsOf } from "./model";
import { boardResponse } from "./schema";

// A real GET /api/board response, recorded at 17:58 UTC on 2026-11-08.
const data = boardResponse.parse(fixture);
const utc = makeClock("UTC");
const fifteen = data.categories["btc-15m"];
const five = data.categories["btc-5m"];

describe("the board for btc-15m", () => {
  const focus = focusOf("btc-15m", fifteen);

  it("puts the locked window in focus, with its result still pending", () => {
    expect(focus).toMatchObject({ id: "btc-15m:1794160800", result: null });
    expect(focus?.calls.kalshi).toBeCloseTo(0.695);
  });

  it("draws the sources in the design's order, with the Crowd silent and Brier from the loss", () => {
    const stations = stationsOf(fifteen, focus);
    expect(stations.map((s) => s.voice)).toEqual(["deepbook", "kalshi", "polymarket", "crowd"]);
    expect(stations[0]?.brier).toBeCloseTo(0.2002, 4);
    expect(stations[0]?.trust).toBeCloseTo(0.43, 2);
    expect(stations[3]).toMatchObject({ status: "silent", call: null, trust: null });
  });

  it("marks a split window as split in each source's record", () => {
    const record = stationsOf(fifteen, focus)[0]?.record ?? [];
    expect(record).toHaveLength(10);
    expect(record.at(-1)).toBe("right");
    expect(record.at(-2)).toBe("split");
  });

  it("reports a 2-point spread as no front, and says so", () => {
    const front = frontOf(focus);
    expect(front?.disagrees).toBe(false);
    expect(frontText(focus, front)).toBe("Spread now 2 pts. No front.");
  });

  it("shortens the stored lesson only when the sources disagree", () => {
    expect(lessonOf(fifteen.lesson, true).text).toBe(
      "Over 22 disagreements, Kalshi was closer 45% of the time; DeepBook, 36%.",
    );
    expect(lessonOf(fifteen.lesson, false).text).toMatch(/^Latest lesson: In btc-15m/);
    expect(lessonOf(fifteen.lesson, false).link?.href).toMatch(
      /^https:\/\/walruscan\.com\/mainnet\/blob\//,
    );
    expect(lessonOf(null, true).text).toBe("No lesson yet. Grudge writes one every 25 windows.");
  });

  it("reads the last window from the newest settled row, in the given zone", () => {
    expect(lastOf("btc-15m", fifteen, utc)).toEqual({
      window: "17:30–17:45",
      result: "▲ up · all three right.",
      note: "",
    });
  });

  it("lays out the band oldest first, locked window last and pending", () => {
    const band = bandOf(fifteen);
    expect(band).toHaveLength(21);
    expect(band.at(-1)?.result).toBe("pending");
    expect(band[0]?.endsAt).toBeLessThan(band[1]?.endsAt ?? 0);
  });

  it("lists the settled windows with a blob link", () => {
    const rows = rowsOf("btc-15m", fifteen, utc);
    expect(rows).toHaveLength(20);
    expect(rows[0]).toMatchObject({ window: "17:30–17:45", result: "up" });
    expect(rows[0]?.cells.deepbook).toEqual({ p: expect.closeTo(0.6466, 3), mark: "right" });
    expect(rows[1]?.result).toBe("split");
  });

  it("falls back to the newest settled window once nothing is locked", () => {
    const resolved = focusOf("btc-15m", { ...fifteen, locked: null });
    expect(resolved).toMatchObject({ result: "up", strike: null });
    expect(resolved?.marks.deepbook).toBe("right");
  });

  it("names the most confident wrong call", () => {
    const [first, ...rest] = fifteen.ledger;
    if (!first) throw new Error("fixture has no ledger");
    const wrong = {
      ...fifteen,
      ledger: [
        {
          ...first,
          outcome: 0 as const,
          calls: {
            kalshi: { p: 0.7, mark: "wrong" as const },
            deepbook: { p: 0.55, mark: "wrong" as const },
          },
        },
        ...rest,
      ],
    };
    expect(lastOf("btc-15m", wrong, utc)).toMatchObject({
      result: "▼ down · both wrong.",
      note: "Kalshi said 70% ▲. It went ▼. Noted.",
    });
  });
});

describe("the board for btc-5m", () => {
  it("shows only the sources that have a market there, plus the Crowd", () => {
    const stations = stationsOf(five, focusOf("btc-5m", five));
    expect(stations.map((s) => s.voice)).toEqual(["deepbook", "polymarket", "crowd"]);
  });
});
