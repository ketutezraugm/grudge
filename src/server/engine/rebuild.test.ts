import { describe, expect, it } from "vitest";
import type { ByVoice, Outcome } from "../domain";
import { type RecordPayload, scoreboardOf } from "../memory/codec";
import { type Board, rebuildGrudges } from "./rebuild";
import { type Grudge, scoreCall } from "./scoring";

/** A settled 5m window, settled `minute` minutes after 06:00 on 2026-11-08. */
function settled(
  minute: number,
  outcome: Outcome,
  calls: ByVoice<number>,
  category: RecordPayload["category"] = "btc-5m",
): RecordPayload {
  const resolvedAt = new Date(Date.parse("2026-11-08T06:00:00Z") + minute * 60_000).toISOString();
  return {
    kind: "record",
    question: `${category}:${minute}`,
    category,
    endsAt: resolvedAt,
    strike: 75_000,
    state: "resolved",
    outcome,
    split: false,
    resolvedAt,
    calls,
    results: { polymarket: outcome },
    line: null,
  };
}

/** What the worker does live: score every call of every window, in the order they settle. */
function liveBoard(records: readonly RecordPayload[]): Board {
  const board: Board = {};
  for (const entry of records) {
    if (entry.outcome === null) continue;
    const held = board[entry.category] ?? {};
    for (const [voice, p] of Object.entries(entry.calls) as [keyof typeof held, number][]) {
      held[voice] = scoreCall(held[voice] as Grudge | undefined, p, entry.outcome);
    }
    board[entry.category] = held;
  }
  return board;
}

const history: RecordPayload[] = [
  settled(5, 1, { deepbook: 0.9, polymarket: 0.505 }),
  settled(10, 0, { deepbook: 0.45, polymarket: 0.575 }),
  settled(15, 1, { deepbook: 0.62, polymarket: 0.71, kalshi: 0.85 }, "btc-15m"),
  settled(20, 1, { deepbook: 0.7, polymarket: 0.66 }),
  settled(25, 0, { deepbook: 0.3, polymarket: 0.4, crowd: 0.8 }),
  settled(30, 1, { deepbook: 0.55, polymarket: 0.6 }),
];

describe("rebuildGrudges", () => {
  it("rebuilds the live grudges from the records alone when there is no snapshot", () => {
    expect(rebuildGrudges(null, history)).toEqual(liveBoard(history));
  });

  it("rebuilds the same grudges from a snapshot plus only the records after it", () => {
    const upToTen = history.slice(0, 2);
    const snapshot = scoreboardOf({
      seq: 1,
      nowMs: Date.parse("2026-11-08T06:11:00Z"),
      throughMs: Date.parse(upToTen[1]?.resolvedAt ?? ""),
      grudges: Object.entries(liveBoard(upToTen)).flatMap(([category, voices]) =>
        Object.entries(voices).map(([voice, grudge]) => ({
          category: category as RecordPayload["category"],
          voice: voice as keyof typeof voices,
          ...grudge,
        })),
      ),
      resolved: [],
    });
    expect(rebuildGrudges(snapshot, history)).toEqual(liveBoard(history));
  });

  it("does not count a record the snapshot already contains", () => {
    const snapshot = scoreboardOf({
      seq: 1,
      nowMs: Date.parse("2026-11-08T06:31:00Z"),
      throughMs: Date.parse(history.at(-1)?.resolvedAt ?? ""),
      grudges: [{ category: "btc-5m", voice: "deepbook", loss: 3, count: 4 }],
      resolved: [],
    });
    expect(rebuildGrudges(snapshot, history)).toEqual({
      "btc-5m": { deepbook: { loss: 3, count: 4 } },
    });
  });

  it("replays windows in the order they settled, whatever order Walrus returns them in", () => {
    expect(rebuildGrudges(null, history.toReversed())).toEqual(liveBoard(history));
  });

  it("ignores windows that were voided", () => {
    const voided: RecordPayload = {
      ...settled(35, 1, { deepbook: 0.5 }),
      state: "void",
      outcome: null,
    };
    expect(rebuildGrudges(null, [...history, voided])).toEqual(liveBoard(history));
  });
});
