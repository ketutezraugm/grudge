import { describe, expect, it } from "vitest";
import { openWindows, questionId, windowEndingAt } from "./windows";

const at = (iso: string) => Date.parse(iso);

describe("windowEndingAt", () => {
  it("locks a 5m window three minutes before it ends", () => {
    const window = windowEndingAt("btc-5m", at("2026-11-07T13:05:00Z"));
    expect(window.startMs).toBe(at("2026-11-07T13:00:00Z"));
    expect(window.lockMs).toBe(at("2026-11-07T13:02:00Z"));
  });

  it("locks a 15m window eight minutes before it ends", () => {
    const window = windowEndingAt("btc-15m", at("2026-11-07T13:15:00Z"));
    expect(window.startMs).toBe(at("2026-11-07T13:00:00Z"));
    expect(window.lockMs).toBe(at("2026-11-07T13:07:00Z"));
  });
});

describe("openWindows", () => {
  it("offers the current and the next 5m window while the current one is unlocked", () => {
    const open = openWindows("btc-5m", at("2026-11-07T13:00:44Z"));
    expect(open.map((w) => w.endMs)).toEqual([
      at("2026-11-07T13:05:00Z"),
      at("2026-11-07T13:10:00Z"),
    ]);
  });

  it("drops the current window once it has locked", () => {
    const open = openWindows("btc-5m", at("2026-11-07T13:02:00Z"));
    expect(open.map((w) => w.endMs)).toEqual([at("2026-11-07T13:10:00Z")]);
  });

  it("treats the exact lock instant as locked", () => {
    const open = openWindows("btc-15m", at("2026-11-07T13:07:00Z"));
    expect(open.map((w) => w.endMs)).toEqual([at("2026-11-07T13:30:00Z")]);
  });

  it("rolls over on the exact window boundary", () => {
    const open = openWindows("btc-5m", at("2026-11-07T13:05:00Z"));
    expect(open[0]?.startMs).toBe(at("2026-11-07T13:05:00Z"));
  });
});

describe("questionId", () => {
  it("names a window by category and end time in unix seconds", () => {
    const window = windowEndingAt("btc-15m", at("2026-11-07T13:15:00Z"));
    expect(questionId(window)).toBe("btc-15m:1794057300");
  });
});
