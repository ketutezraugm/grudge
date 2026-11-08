import { describe, expect, it } from "vitest";
import { bucketNamespace, bucketsBack } from "./buckets";

const base = "grudge:v1:records";

describe("bucketNamespace", () => {
  it("names the UTC hour a memory was written in", () => {
    expect(bucketNamespace(base, Date.parse("2026-11-08T18:21:08Z"))).toBe(
      "grudge:v1:records:2026-11-08T18",
    );
  });

  it("puts the first and last second of an hour in the same bucket", () => {
    const first = bucketNamespace(base, Date.parse("2026-11-08T18:00:00.000Z"));
    const last = bucketNamespace(base, Date.parse("2026-11-08T18:59:59.999Z"));
    expect(first).toBe(last);
    expect(bucketNamespace(base, Date.parse("2026-11-08T19:00:00.000Z"))).not.toBe(first);
  });

  it("keeps a namespace under the relayer's 255-byte limit", () => {
    expect(bucketNamespace(base, Date.now()).length).toBeLessThan(255);
  });
});

describe("bucketsBack", () => {
  it("lists the current hour first, then each earlier hour, across midnight", () => {
    expect(bucketsBack(base, Date.parse("2026-11-09T01:10:00Z"), 4)).toEqual([
      "grudge:v1:records:2026-11-09T01",
      "grudge:v1:records:2026-11-09T00",
      "grudge:v1:records:2026-11-08T23",
      "grudge:v1:records:2026-11-08T22",
    ]);
  });

  it("returns nothing for a count of zero", () => {
    expect(bucketsBack(base, Date.now(), 0)).toEqual([]);
  });
});
