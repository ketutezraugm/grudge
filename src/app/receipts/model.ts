import { type Category, type Voice, voiceNames } from "@/server/domain";
import type { Clock } from "../board/clock";
import type { CheckResponse, ReceiptsResponse } from "./schema";

const WALRUSCAN = "https://walruscan.com/mainnet/blob";

type Kind = ReceiptsResponse["memories"]["latest"][number]["kind"];

export function totalsOf(totals: ReceiptsResponse["memories"]["totals"]) {
  const done = (kind: Kind) => totals[kind]?.done ?? 0;
  const all = (["record", "scoreboard", "lesson"] as const).reduce(
    (sum, kind) => sum + done(kind),
    0,
  );
  const waiting = Object.values(totals).reduce((sum, byStatus) => sum + (byStatus.pending ?? 0), 0);
  return {
    cards: [
      { n: done("record"), label: "records", sub: "one per resolved window" },
      { n: done("scoreboard"), label: "scoreboards", sub: "the weights after each pass" },
      { n: done("lesson"), label: "lessons", sub: "one every 25 windows" },
    ],
    all,
    waiting,
  };
}

export function blobsOf(
  latest: ReceiptsResponse["memories"]["latest"],
  clock: Clock,
  limit: number,
) {
  return latest.slice(0, limit).map((blob) => ({
    kind: blob.kind,
    ref: blob.ref,
    at: clock.hms(Date.parse(blob.at)),
    url: `${WALRUSCAN}/${blob.blobId}`,
    id: blob.blobId,
    // The full id is in the link and its label; the row only needs enough to tell blobs apart.
    short:
      limit <= 8
        ? `${blob.blobId.slice(0, 4)}…`
        : `${blob.blobId.slice(0, 6)}…${blob.blobId.slice(-4)}`,
  }));
}

/** 38000 atomic units is "0.038": at least three decimals, trailing zeros trimmed past that. */
export function usdc(atomic: string): string {
  const value = BigInt(atomic);
  const whole = value / 1_000_000n;
  const fraction = (value % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
  return `${whole}.${fraction.padEnd(3, "0")}`;
}

/** 0x132643284e…d76c becomes 0x1326…d76c. */
export const shortAddress = (address: string): string =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

export function paymentsOf(payments: ReceiptsResponse["payments"], clock: Clock) {
  return payments.map((payment) => ({
    digest: payment.digest,
    amount: `${usdc(payment.amount)} USDC`,
    status: { settling: "Settling", settled: "Settled", failed: "Failed" }[payment.status],
    settled: payment.status === "settled",
    category: payment.category,
    at: payment.settledAt === null ? null : clock.hms(Date.parse(payment.settledAt)),
    payer: shortAddress(payment.payer),
    url: payment.url,
  }));
}

export function amnesiaOf(wipes: ReceiptsResponse["amnesia"], clock: Clock) {
  return wipes.map((wipe) => ({
    id: wipe.id,
    at: clock.hms(Date.parse(wipe.at)),
    line: `${wipe.restored} of ${wipe.before} memories restored, ${wipe.windows} windows, ${wipe.lessons} lessons.`,
    result: wipe.identical
      ? "Weights identical."
      : `Largest gap against the live weights: ${wipe.maxDifference.toFixed(3)}.`,
  }));
}

// The Brier chart runs from 0.17 to 0.25 as the design draws it; a value outside is pinned to the edge.
const BRIER = { lo: 0.17, hi: 0.25 };
const GAIN = 0.03;
const clamp = (x: number) => Math.min(100, Math.max(0, +x.toFixed(2)));
const brierX = (value: number) => clamp(((value - BRIER.lo) / (BRIER.hi - BRIER.lo)) * 100);
const gainX = (value: number) => clamp(((value + GAIN) / (2 * GAIN)) * 100);
const signed = (value: number) => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(4)}`;

const titles: Record<Category, string> = { "btc-15m": "15 min", "btc-5m": "5 min" };
const VOICE_ORDER: Voice[] = ["deepbook", "kalshi", "polymarket"];

/** Says only what the interval supports: a gain whose interval includes zero is not a gain. */
export function captionOf(learning: NonNullable<ReceiptsResponse["learning"][Category]>): string {
  const { grudge, equalWeight, best, gainOverEqual, gainOverBest } = learning;
  if (grudge === null || equalWeight === null || !best || !gainOverEqual || !gainOverBest) {
    return "Not enough resolved windows yet.";
  }
  const bestName = voiceNames[best.voice];
  const figures = `Grudge ${grudge.toFixed(3)}, equal weights ${equalWeight.toFixed(3)}, ${bestName} alone ${best.mean.toFixed(3)}.`;
  const clearOfZero = (gain: { mean: number; halfWidth: number }) =>
    Math.abs(gain.mean) > gain.halfWidth;

  const average = !clearOfZero(gainOverEqual)
    ? `${gainOverEqual.mean >= 0 ? "Slightly ahead of" : "Slightly behind"} the average; the interval includes zero.`
    : gainOverEqual.mean > 0
      ? "Ahead of the average, and the interval excludes zero."
      : "Behind the average, and the interval excludes zero.";
  const alone =
    gainOverBest.mean < 0 ? `${bestName} alone is better.` : `${bestName} alone is no better.`;
  return `${figures} ${average} ${alone}`;
}

export function learningOf(learning: ReceiptsResponse["learning"]) {
  return (["btc-15m", "btc-5m"] as const).flatMap((category) => {
    const summary = learning[category];
    if (!summary || summary.grudge === null || summary.equalWeight === null) return [];
    const rows = [
      { name: "Grudge", value: summary.grudge, strong: true, dashed: false },
      { name: "Equal weights", value: summary.equalWeight, strong: false, dashed: true },
      ...VOICE_ORDER.flatMap((voice) => {
        const value = summary.voices[voice];
        return value === undefined
          ? []
          : [{ name: `${voiceNames[voice]} alone`, value, strong: false, dashed: false }];
      }),
    ];
    const gains = [
      { name: "vs equal weights", gain: summary.gainOverEqual },
      {
        name: `vs ${summary.best ? voiceNames[summary.best.voice] : "best"} alone`,
        gain: summary.gainOverBest,
      },
    ].flatMap(({ name, gain }) =>
      gain
        ? [
            {
              name,
              value: signed(gain.mean),
              mean: gainX(gain.mean),
              low: gainX(gain.mean - gain.halfWidth),
              high: gainX(gain.mean + gain.halfWidth),
            },
          ]
        : [],
    );
    return [
      {
        category,
        title: titles[category],
        windows: summary.windows,
        rows: rows.map((row) => ({ ...row, label: row.value.toFixed(3), x: brierX(row.value) })),
        ticks: [0.18, 0.2, 0.22, 0.24].map((tick) => ({ x: brierX(tick), label: tick.toFixed(2) })),
        gains,
        caption: captionOf(summary),
      },
    ];
  });
}

/** Mean loss per voice for one category, so the live and rebuilt weights can be read side by side. */
export function checkOf(check: CheckResponse, category: Category = "btc-15m") {
  const mean = (cell: { loss: number; count: number }) => cell.loss / cell.count;
  const live = check.live[category] ?? {};
  const rebuilt = check.rebuilt[category] ?? {};
  const voices = (["deepbook", "kalshi", "polymarket"] as const).filter((voice) => live[voice]);
  const gap = check.maxDifference.toFixed(3);
  const from =
    check.snapshotSeq === null
      ? "records alone"
      : `snapshot #${check.snapshotSeq} and ${check.recordsRead} records`;
  const waiting =
    check.waiting > 0
      ? ` ${check.waiting} ${check.waiting === 1 ? "memory is" : "memories are"} still writing, so a gap is expected.`
      : "";
  return {
    summary: `Rebuilt from ${from}. Largest gap against the live weights: ${gap}.${waiting}`,
    rows: voices.map((voice) => {
      const liveCell = live[voice];
      const rebuiltCell = rebuilt[voice];
      return {
        name: voiceNames[voice],
        live: liveCell ? mean(liveCell).toFixed(4) : "–",
        rebuilt: rebuiltCell ? mean(rebuiltCell).toFixed(4) : "–",
      };
    }),
    snapshotUrl: check.snapshotBlobId === null ? null : `${WALRUSCAN}/${check.snapshotBlobId}`,
    snapshotLabel:
      check.snapshotSeq === null ? "" : `Snapshot #${check.snapshotSeq} on Walruscan ↗`,
  };
}
