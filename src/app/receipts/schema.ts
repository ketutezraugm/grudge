import { z } from "zod";
import { categories, paymentStatuses, voices } from "@/server/domain";

const voice = z.enum(voices);
const meanWithHalfWidth = z.object({ mean: z.number(), halfWidth: z.number() });

const learning = z.object({
  windows: z.number(),
  grudge: z.number().nullable(),
  equalWeight: z.number().nullable(),
  voices: z.partialRecord(voice, z.number()),
  best: z.object({ voice, mean: z.number() }).nullable(),
  gainOverEqual: meanWithHalfWidth.nullable(),
  gainOverBest: meanWithHalfWidth.nullable(),
});

/** What `GET /api/receipts` returns. Parsed at the edge so the page can trust it. */
export const receiptsResponse = z.object({
  asOf: z.string(),
  memories: z.object({
    totals: z.record(z.string(), z.record(z.string(), z.number())),
    latest: z.array(
      z.object({
        kind: z.enum(["record", "scoreboard", "lesson"]),
        ref: z.string(),
        blobId: z.string(),
        at: z.string(),
        url: z.string(),
      }),
    ),
  }),
  payments: z.array(
    z.object({
      digest: z.string(),
      payer: z.string(),
      // Atomic USDC (six decimals) as a string, because JSON has no bigint.
      amount: z.string().regex(/^\d+$/),
      category: z.enum(categories),
      status: z.enum(paymentStatuses),
      settledAt: z.string().nullable(),
      url: z.string(),
    }),
  ),
  tatum: z.object({ grpc: z.number(), data: z.number(), sinceStartedAt: z.string() }),
  amnesia: z.array(
    z.object({
      id: z.string(),
      at: z.string(),
      before: z.number(),
      restored: z.number(),
      windows: z.number(),
      lessons: z.number(),
      maxDifference: z.number(),
      identical: z.boolean(),
    }),
  ),
  learning: z.partialRecord(z.enum(categories), learning),
});

const loss = z.record(
  z.string(),
  z.record(z.string(), z.object({ loss: z.number(), count: z.number() })),
);

/** What `POST /api/verify-memory` returns. */
export const checkResponse = z.object({
  checkedAt: z.string(),
  maxDifference: z.number(),
  waiting: z.number(),
  snapshotSeq: z.number().nullable(),
  snapshotBlobId: z.string().nullable(),
  recordBlobIds: z.array(z.string()),
  recordsRead: z.number(),
  rebuilt: loss,
  live: loss,
});

export type ReceiptsResponse = z.infer<typeof receiptsResponse>;
export type CheckResponse = z.infer<typeof checkResponse>;
