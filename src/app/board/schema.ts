import { z } from "zod";
import { categories, voices } from "@/server/domain";

const voice = z.enum(voices);
const window = z.object({
  id: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  lockAt: z.string(),
});
const outcome = z.union([z.literal(0), z.literal(1)]);
const calls = z.partialRecord(voice, z.number());

const ledgerRow = z.object({
  id: z.string(),
  endsAt: z.string(),
  state: z.enum(["resolved", "void"]),
  outcome: outcome.nullable(),
  split: z.boolean(),
  line: z.number().nullable(),
  calls: z.partialRecord(
    voice,
    z.object({ p: z.number(), mark: z.enum(["right", "wrong"]).nullable() }),
  ),
  blobId: z.string().nullable(),
});

const categoryBoard = z.object({
  open: window.nullable(),
  locked: window
    .omit({ lockAt: true })
    .extend({
      strike: z.number().nullable(),
      line: z.number().nullable(),
      calls,
      disagreement: z.number(),
      disagrees: z.boolean(),
    })
    .nullable(),
  voices: z.array(
    z.object({
      voice,
      name: z.string(),
      call: z.number().nullable(),
      weight: z.number().nullable(),
      loss: z.number().nullable(),
      samples: z.number(),
    }),
  ),
  resolved: z.number(),
  lesson: z
    .object({
      text: z.string(),
      at: z.string().nullable(),
      blobId: z.string().nullable(),
      recalled: z.boolean(),
    })
    .nullable(),
  ledger: z.array(ledgerRow),
});

/** What `GET /api/board` returns. Parsed at the edge so the rest of the page can trust it. */
export const boardResponse = z.object({
  asOf: z.string(),
  workerAgeMs: z.number(),
  bitcoinUsd: z.number().nullable(),
  yourPicks: z.record(z.enum(categories), z.number().nullable()),
  categories: z.record(z.enum(categories), categoryBoard),
});

export type BoardResponse = z.infer<typeof boardResponse>;
export type CategoryBoard = z.infer<typeof categoryBoard>;
export type LedgerRow = z.infer<typeof ledgerRow>;
export type BoardWindow = z.infer<typeof window>;
export type { Category, Voice } from "@/server/domain";
