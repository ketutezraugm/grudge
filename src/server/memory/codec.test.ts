import { describe, expect, it } from "vitest";
import { decode, encode, type MemoryPayload, type RecordPayload, recordOf } from "./codec";

const record: RecordPayload = {
  kind: "record",
  question: "btc-15m:1794057300",
  category: "btc-15m",
  endsAt: "2026-11-07T13:15:00.000Z",
  strike: 75808.87,
  state: "resolved",
  outcome: 1,
  split: false,
  calls: { kalshi: 0.93, polymarket: 0.8, deepbook: 0.61, crowd: 0.45 },
  results: { kalshi: 1, polymarket: 1, deepbook: 1 },
  line: 0.86,
};

describe("encode", () => {
  it("opens with a sentence that names each voice and whether it was right", () => {
    const [sentence] = encode(record).split("\n");
    expect(sentence).toBe(
      "BTC 15m window ending 2026-11-07T13:15Z went UP. DeepBook 61% ▲ (right), Polymarket 80% ▲ (right), Kalshi 93% ▲ (right), Crowd 45% ▼ (wrong). Grudge line 86%.",
    );
  });

  it("says why a window was voided", () => {
    const split: RecordPayload = {
      ...record,
      state: "void",
      outcome: null,
      split: true,
      line: null,
    };
    expect(encode(split).split("\n")[0]).toBe(
      "BTC 15m window ending 2026-11-07T13:15Z ended void: the venues disagreed about what happened.",
    );
  });
});

describe("decode", () => {
  const entries: MemoryPayload[] = [
    record,
    {
      kind: "scoreboard",
      seq: 412,
      at: "2026-11-07T13:20:00.000Z",
      grudges: { "btc-15m": { kalshi: { loss: 9.5, count: 41.2 } } },
      resolved: { "btc-15m": 61 },
    },
    {
      kind: "lesson",
      category: "btc-5m",
      text: "In btc-5m disagreements of 7+ pts, DeepBook was closer 68% of the time.",
    },
  ];

  it.each(entries)("returns every $kind exactly as it was written", (entry) => {
    expect(decode(encode(entry))).toEqual(entry);
  });

  it("returns null when the tail is damaged", () => {
    const damaged = encode(record).slice(0, -12);
    expect(decode(damaged)).toBeNull();
  });

  it("returns null for a memory that was never written by Grudge", () => {
    expect(decode("User prefers dark mode.")).toBeNull();
  });

  it("returns null for a tail of an unknown kind", () => {
    expect(decode('sentence\n#grudge {"kind":"rumour"}')).toBeNull();
  });

  it("reads the last tail when a sentence quotes the marker", () => {
    const tricky = `He wrote "#grudge nope".\n${encode(record)}`;
    expect(decode(tricky)).toEqual(record);
  });
});

describe("recordOf", () => {
  it("builds the record that was written for a settled window", () => {
    const built = recordOf({
      id: record.question,
      category: record.category,
      endMs: Date.parse(record.endsAt),
      strike: record.strike,
      state: "resolved",
      outcome: record.outcome,
      split: record.split,
      calls: record.calls,
      results: record.results,
      line: record.line,
    });
    expect(built).toEqual(record);
    expect(decode(encode(built))).toEqual(record);
  });
});
