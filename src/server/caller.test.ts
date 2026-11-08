import { describe, expect, it } from "vitest";
import { callerAddress } from "./caller";

describe("callerAddress", () => {
  it("takes the address Cloudflare saw, not the edge and not what the caller wrote", () => {
    // Recorded from the live service while spoofing the header.
    expect(callerAddress("6.6.6.6,118.99.73.70, 172.68.153.143")).toBe("118.99.73.70");
  });

  it("gives a visitor who sent nothing the same address as one who sent a lie", () => {
    expect(callerAddress("118.99.73.70, 162.158.218.128")).toBe("118.99.73.70");
  });

  it("trusts nothing when the chain is too short to tell", () => {
    expect(callerAddress("118.99.73.70")).toBeNull();
    expect(callerAddress("")).toBeNull();
    expect(callerAddress(null)).toBeNull();
  });
});
