import { describe, expect, it } from "vitest";
import { priceOf, samplesOf } from "./model";
import { priceResponse } from "./schema";

describe("the price", () => {
  it("quotes the board's price in USDC, with three decimals", () => {
    expect(priceOf("25000")).toEqual({
      amount: "0.025",
      headline: "This line costs 0.025 USDC.",
      atomic: "25000 atomic units",
    });
  });

  it("gives the range while no window is locked", () => {
    expect(priceOf(null).headline).toBe("A line costs 0.010 to 0.050 USDC.");
  });

  it("reads the price out of a board response and ignores the rest", () => {
    const parsed = priceResponse.parse({
      asOf: "x",
      categories: { "btc-15m": { locked: { priceAtomic: "25000", line: 0.9 }, open: null } },
    });
    expect(parsed.categories["btc-15m"].locked?.priceAtomic).toBe("25000");
  });
});

describe("the samples", () => {
  it("show the four exchanges in order, and the 402 body carries the live price", () => {
    const samples = samplesOf("42000");
    expect(samples.map((sample) => sample.title[0])).toEqual(["1", "2", "4", "5"]);
    const body = samples[1]?.text.split("\n\n")[1] ?? "";
    expect(JSON.parse(body).accepts[0]).toMatchObject({ network: "sui:mainnet", amount: "42000" });
  });

  it("send the payment in the header the server reads", () => {
    expect(samplesOf(null)[2]?.text).toContain("PAYMENT-SIGNATURE:");
  });
});
