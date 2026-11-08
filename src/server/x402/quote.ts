import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { categories } from "../domain";

/** A price holds for this long, so it cannot move under a payment that is already on its way. */
export const QUOTE_TTL_MS = 120_000;

const quote = z.object({
  amount: z.string().regex(/^\d+$/),
  category: z.enum(categories),
  expiresMs: z.number().int(),
});

export type Quote = z.infer<typeof quote>;

const mac = (body: string, secret: string) =>
  createHmac("sha256", secret).update(body).digest("base64url");

/** The price, category and expiry, signed. The server keeps nothing: the buyer carries the quote back. */
export function signQuote(value: Quote, secret: string): string {
  const body = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${body}.${mac(body, secret)}`;
}

/** The quote if the signature is ours and it has not expired, otherwise null. */
export function readQuote(token: string, secret: string, nowMs: number): Quote | null {
  const [body, signature, ...extra] = token.split(".");
  if (!body || !signature || extra.length > 0) return null;

  const expected = Buffer.from(mac(body, secret));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const parsed = quote.safeParse(JSON.parse(Buffer.from(body, "base64url").toString()));
    return parsed.success && parsed.data.expiresMs > nowMs ? parsed.data : null;
  } catch {
    return null;
  }
}
