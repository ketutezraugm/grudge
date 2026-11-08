import { z } from "zod";

export const NETWORK = "sui:mainnet";
export const USDC_TYPE =
  "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";

/** How long a buyer has from the request to the signed payment. Matches the quote's lifetime. */
const MAX_TIMEOUT_SECONDS = 120;

const suiAddress = z.string().regex(/^0x[0-9a-fA-F]{64}$/);

/** One way to pay: exactly `amount` atomic USDC to `payTo`. The quote pins the price. */
export const requirements = z.object({
  scheme: z.literal("exact"),
  network: z.literal(NETWORK),
  amount: z.string().regex(/^\d+$/),
  asset: z.literal(USDC_TYPE),
  payTo: suiAddress,
  maxTimeoutSeconds: z.number().int().positive(),
  extra: z.object({ quote: z.string() }),
});

export type Requirements = z.infer<typeof requirements>;

/** The 402 body, also sent base64 in `PAYMENT-REQUIRED`. */
export const paymentRequired = z.object({
  x402Version: z.literal(2),
  error: z.string(),
  resource: z.object({
    url: z.string(),
    description: z.string(),
    mimeType: z.string(),
    serviceName: z.string(),
  }),
  accepts: z.array(requirements).min(1),
});

/** What the buyer sends back in `PAYMENT-SIGNATURE`: the terms it accepted and the signed payment. */
export const paymentPayload = z.object({
  x402Version: z.literal(2),
  accepted: requirements,
  payload: z.object({ signature: z.string(), transaction: z.string() }),
});

/** Sent base64 in `PAYMENT-RESPONSE` once the payment has settled. */
export const settlement = z.object({
  success: z.boolean(),
  transaction: z.string(),
  network: z.literal(NETWORK),
  payer: suiAddress,
});

export function requirementsFor(amount: string, quote: string, payTo: string): Requirements {
  return {
    scheme: "exact",
    network: NETWORK,
    amount,
    asset: USDC_TYPE,
    payTo,
    maxTimeoutSeconds: MAX_TIMEOUT_SECONDS,
    extra: { quote },
  };
}

export const toHeader = (value: unknown): string =>
  Buffer.from(JSON.stringify(value)).toString("base64");

/** The parsed header, or null if it is not base64 JSON of the expected shape. */
export function fromHeader<S extends z.ZodType>(header: string, schema: S): z.infer<S> | null {
  try {
    const parsed = schema.safeParse(JSON.parse(Buffer.from(header, "base64").toString()));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
