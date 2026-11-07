import { describe, expect, it } from "vitest";
import { windowEndingAt } from "../engine/windows";
import kalshiFinalized from "./fixtures/kalshi-finalized.json";
import kalshiOpen from "./fixtures/kalshi-open.json";
import polymarketClosedDown from "./fixtures/polymarket-closed-down.json";
import polymarketClosedUp from "./fixtures/polymarket-closed-up.json";
import polymarketOpen from "./fixtures/polymarket-open.json";
import { kalshiResult, readKalshiReading, readKalshiResult } from "./kalshi";
import { readPolymarketCall, readPolymarketResult } from "./polymarket";

// Payloads recorded from the live venues on 2026-11-07.
const NOW = Date.parse("2026-11-07T15:50:00Z");

describe("polymarket", () => {
  it("prices an open window at the middle of the live book, not the lagging outcomePrices", () => {
    const call = readPolymarketCall(polymarketOpen, NOW);
    expect(call?.p).toBeCloseTo(0.565, 6);
    expect(call?.capturedAtMs).toBe(NOW);
  });

  it("gives no call for a market that has already closed", () => {
    expect(readPolymarketCall(polymarketClosedUp, NOW)).toBeNull();
  });

  it("gives no call when the book is too wide to mean anything", () => {
    const wide = [{ ...polymarketOpen[0], bestBid: 0.1, bestAsk: 0.9 }];
    expect(readPolymarketCall(wide, NOW)).toBeNull();
  });

  it("reads a resolved Up window as 1 and a resolved Down window as 0", () => {
    expect(readPolymarketResult(polymarketClosedUp)).toBe(1);
    expect(readPolymarketResult(polymarketClosedDown)).toBe(0);
  });

  it("has no result while the window is still open", () => {
    expect(readPolymarketResult(polymarketOpen)).toBeNull();
  });

  it("has no result before the oracle has resolved the market", () => {
    const unresolved = [{ ...polymarketClosedUp[0], umaResolutionStatus: "proposed" }];
    expect(readPolymarketResult(unresolved)).toBeNull();
  });

  it("ignores a body that is not a market list", () => {
    expect(readPolymarketCall({ error: "rate limited" }, NOW)).toBeNull();
    expect(readPolymarketResult([])).toBeNull();
  });
});

describe("kalshi", () => {
  it("reads the live call and the strike from the market that closes with the window", () => {
    const reading = readKalshiReading(kalshiOpen, NOW);
    expect(reading?.call.p).toBeCloseTo(0.0695, 6);
    expect(reading?.strike).toBe(75719.35);
  });

  it("gives no live reading for a finalized market", () => {
    expect(readKalshiReading(kalshiFinalized, NOW)).toBeNull();
  });

  it("reads a finalized no as 0 and has no result while the market is active", () => {
    expect(readKalshiResult(kalshiFinalized)).toBe(0);
    expect(readKalshiResult(kalshiOpen)).toBeNull();
  });

  it("does not ask Kalshi about 5m windows, which it does not list", async () => {
    const window = windowEndingAt("btc-5m", Date.parse("2026-11-07T16:05:00Z"));
    expect(await kalshiResult(window)).toBeNull();
  });
});
