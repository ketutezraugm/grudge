import { describe, expect, it } from "vitest";
import {
  fromHeader,
  NETWORK,
  paymentPayload,
  paymentRequired,
  requirementsFor,
  toHeader,
  USDC_TYPE,
} from "./protocol";

const treasury = "0x257c40edfb58d7e6574f0b7df816398db3f191fcaffcaefaaa6523a696f3f46e";

describe("requirementsFor", () => {
  it("asks for exact USDC on Sui mainnet, paid to the treasury, with the quote attached", () => {
    expect(requirementsFor("39000", "quote.token", treasury)).toEqual({
      scheme: "exact",
      network: NETWORK,
      amount: "39000",
      asset: USDC_TYPE,
      payTo: treasury,
      maxTimeoutSeconds: 120,
      extra: { quote: "quote.token" },
    });
  });
});

describe("headers", () => {
  const required = {
    x402Version: 2,
    error: "payment required",
    resource: {
      url: "https://grudge.example/api/consensus?category=btc-5m",
      description: "Grudge consensus for btc-5m",
      mimeType: "application/json",
      serviceName: "Grudge",
    },
    accepts: [requirementsFor("39000", "quote.token", treasury)],
  };

  it("carries a payment request through base64 unchanged", () => {
    expect(fromHeader(toHeader(required), paymentRequired)).toEqual(required);
  });

  it("refuses a payment header that is not base64 JSON of the right shape", () => {
    expect(fromHeader("not base64 json", paymentPayload)).toBeNull();
    expect(fromHeader(toHeader({ x402Version: 1 }), paymentPayload)).toBeNull();
    expect(fromHeader(toHeader({ ...required, x402Version: 1 }), paymentRequired)).toBeNull();
  });

  it("refuses a request for a different network or asset", () => {
    const other = { ...required, accepts: [{ ...required.accepts[0], network: "sui:testnet" }] };
    expect(fromHeader(toHeader(other), paymentRequired)).toBeNull();
  });
});
