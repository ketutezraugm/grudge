import { describe, expect, it } from "vitest";
import { QUOTE_TTL_MS, readQuote, signQuote } from "./quote";

const secret = "a".repeat(40);
const now = Date.parse("2026-11-08T15:30:00Z");
const quote = { amount: "39000", category: "btc-5m" as const, expiresMs: now + QUOTE_TTL_MS };

describe("quote", () => {
  it("reads back what was signed while it is fresh", () => {
    expect(readQuote(signQuote(quote, secret), secret, now + 1_000)).toEqual(quote);
  });

  it("refuses a quote whose price was edited", () => {
    const [body, mac] = signQuote(quote, secret).split(".");
    const cheaper = Buffer.from(JSON.stringify({ ...quote, amount: "10000" })).toString(
      "base64url",
    );
    expect(readQuote(`${cheaper}.${mac}`, secret, now)).toBeNull();
    expect(body).not.toBe(cheaper);
  });

  it("refuses a quote signed with another secret", () => {
    expect(readQuote(signQuote(quote, "b".repeat(40)), secret, now)).toBeNull();
  });

  it("refuses a quote after its 120 seconds are up", () => {
    const token = signQuote(quote, secret);
    expect(readQuote(token, secret, quote.expiresMs - 1)).not.toBeNull();
    expect(readQuote(token, secret, quote.expiresMs)).toBeNull();
  });

  it("refuses junk without throwing", () => {
    for (const junk of ["", "x", "a.b", "....", "e30.e30"]) {
      expect(readQuote(junk, secret, now)).toBeNull();
    }
  });
});
