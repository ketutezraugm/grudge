import { describe, expect, it } from "vitest";
import { makeClock } from "../board/clock";
import checkFixture from "./check.fixture.json";
import {
  amnesiaOf,
  blobsOf,
  captionOf,
  checkOf,
  learningOf,
  paymentsOf,
  totalsOf,
  usdc,
} from "./model";
import receiptsFixture from "./receipts.fixture.json";
import { checkResponse, receiptsResponse } from "./schema";

// Real responses from GET /api/receipts and POST /api/verify-memory, recorded 05:48 UTC on 2026-11-09.
const receipts = receiptsResponse.parse(receiptsFixture);
const check = checkResponse.parse(checkFixture);
const utc = makeClock("UTC");

describe("memory totals", () => {
  it("counts what is on Walrus and what is still writing", () => {
    const { cards, all, waiting } = totalsOf(receipts.memories.totals);
    expect(cards.map((card) => [card.label, card.n])).toEqual([
      ["records", 368],
      ["scoreboards", 279],
      ["lessons", 13],
    ]);
    expect(all).toBe(660);
    expect(waiting).toBe(0);
  });

  it("counts pending memories of every kind as still writing", () => {
    expect(totalsOf({ record: { done: 3, pending: 2 }, lesson: { pending: 1 } }).waiting).toBe(3);
  });
});

describe("latest blobs", () => {
  it("lists newest first in UTC and links each blob on Walruscan", () => {
    const [first] = blobsOf(receipts.memories.latest, utc, 12);
    expect(first).toMatchObject({ kind: "scoreboard", ref: "scoreboard-279", at: "05:46:53" });
    expect(first?.url).toBe(
      "https://walruscan.com/mainnet/blob/onVNUJrzSina91723vFuU17hctt9VG8XIB2Fw3qOF8E",
    );
    expect(first?.short).toBe("onVNUJ…OF8E");
  });

  it("shows fewer, shorter rows on a phone", () => {
    const rows = blobsOf(receipts.memories.latest, utc, 8);
    expect(rows).toHaveLength(8);
    expect(rows[0]?.short).toBe("onVN…");
  });
});

describe("payments", () => {
  it("writes atomic USDC with at least three decimals", () => {
    expect(usdc("38000")).toBe("0.038");
    expect(usdc("12000")).toBe("0.012");
    expect(usdc("1500000")).toBe("1.500");
    expect(usdc("1")).toBe("0.000001");
  });

  it("shortens the payer and links the Sui receipt", () => {
    expect(paymentsOf(receipts.payments, utc)[0]).toMatchObject({
      amount: "0.038 USDC",
      status: "Settled",
      category: "btc-5m",
      at: "15:33:20",
      payer: "0x1326…d76c",
      url: "https://suiscan.xyz/mainnet/tx/4f3bXYdmR1XYJTvVrm17HEat4aDSePvShTcqAZmeSnTY",
    });
  });
});

describe("amnesia", () => {
  it("is empty until a wipe is logged", () => {
    expect(amnesiaOf(receipts.amnesia, utc)).toEqual([]);
  });
});

describe("learning", () => {
  const [fifteen, five] = learningOf(receipts.learning);

  it("draws 15 min first, then 5 min, with Grudge and the equal-weight line before each source", () => {
    expect([fifteen?.title, five?.title]).toEqual(["15 min", "5 min"]);
    expect(fifteen?.rows.map((row) => row.name)).toEqual([
      "Grudge",
      "Equal weights",
      "DeepBook alone",
      "Kalshi alone",
      "Polymarket alone",
    ]);
    expect(five?.rows.map((row) => row.name)).not.toContain("Kalshi alone");
  });

  it("puts a value on the 0.17 to 0.25 axis", () => {
    expect(fifteen?.rows[0]?.label).toBe("0.182");
    expect(fifteen?.rows[0]?.x).toBeCloseTo(((0.18181507 - 0.17) / 0.08) * 100, 1);
  });

  it("does not call a gain whose interval includes zero a win", () => {
    expect(fifteen?.caption).toBe(
      "Grudge 0.182, equal weights 0.183, Kalshi alone 0.179. Slightly ahead of the average; the interval includes zero. Kalshi alone is better.",
    );
  });

  it("says so when the interval excludes zero", () => {
    const summary = receipts.learning["btc-15m"];
    if (!summary) throw new Error("fixture has no btc-15m");
    const clear = { ...summary, gainOverEqual: { mean: 0.01, halfWidth: 0.002 } };
    expect(captionOf(clear)).toContain("Ahead of the average, and the interval excludes zero.");
  });
});

describe("the memory check", () => {
  const result = checkOf(check);

  it("names the snapshot and records it read and the largest gap", () => {
    expect(result.summary).toBe(
      "Rebuilt from snapshot #279 and 13 records. Largest gap against the live weights: 0.000.",
    );
    expect(result.snapshotUrl).toBe(
      "https://walruscan.com/mainnet/blob/onVNUJrzSina91723vFuU17hctt9VG8XIB2Fw3qOF8E",
    );
  });

  it("compares live and rebuilt mean loss for each btc-15m source", () => {
    expect(result.rows.map((row) => row.name)).toEqual(["DeepBook", "Kalshi", "Polymarket"]);
    expect(result.rows[0]).toEqual({ name: "DeepBook", live: "0.1823", rebuilt: "0.1823" });
  });

  it("explains a gap while memories are still writing", () => {
    expect(checkOf({ ...check, waiting: 2, maxDifference: 0.4 }).summary).toContain(
      "2 memories are still writing, so a gap is expected.",
    );
  });
});
