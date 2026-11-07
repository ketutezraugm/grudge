import "server-only";
import { z } from "zod";

const suiAddress = z.string().regex(/^0x[0-9a-fA-F]{64}$/, "expected a 32-byte 0x address");

/**
 * Each module asks only for the variables it uses, so a half-filled `.env`
 * keeps working while accounts are still being created.
 */
function defineEnv<S extends z.ZodType>(schema: S): () => z.infer<S> {
  let parsed: z.infer<S> | undefined;
  return () => {
    if (parsed === undefined) {
      const result = schema.safeParse(process.env);
      if (!result.success) {
        const names = new Set(result.error.issues.map((issue) => issue.path.join(".")));
        throw new Error(`Missing or invalid environment: ${[...names].join(", ")}`);
      }
      parsed = result.data;
    }
    return parsed;
  };
}

export const tatumEnv = defineEnv(z.object({ TATUM_API_KEY: z.string().min(1) }));

export const memoryEnv = defineEnv(
  z.object({
    MEMWAL_PRIVATE_KEY: z.string().min(1),
    MEMWAL_ACCOUNT_ID: suiAddress,
    MEMWAL_SERVER_URL: z.url().default("https://relayer.memory.walrus.xyz"),
  }),
);

export const databaseEnv = defineEnv(z.object({ DATABASE_URL: z.url() }));

export const paymentEnv = defineEnv(
  z.object({
    TREASURY_ADDRESS: suiAddress,
    QUOTE_SECRET: z.string().min(32),
    PUBLIC_BASE_URL: z.url(),
  }),
);

export const adminEnv = defineEnv(z.object({ ADMIN_TOKEN: z.string().min(16) }));

export const refreshEnv = defineEnv(
  z.object({
    LIVE_REFRESH_MS: z.coerce.number().int().positive().default(15_000),
    IDLE_REFRESH_MS: z.coerce.number().int().positive().default(60_000),
  }),
);
