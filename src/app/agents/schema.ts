import { z } from "zod";

/** Only the price from `GET /api/board`: the Board page owns the rest of that response. */
export const priceResponse = z.object({
  categories: z.object({
    "btc-15m": z.object({
      locked: z.object({ priceAtomic: z.string().regex(/^\d+$/) }).nullable(),
    }),
  }),
});
