import { boardSnapshot } from "@/server/board";
import { type Category, categories } from "@/server/domain";
import { paymentEnv } from "@/server/env";
import { tatumChain } from "@/server/x402/chain";
import { paymentsLedger } from "@/server/x402/ledger";
import { NETWORK, requirementsFor, toHeader } from "@/server/x402/protocol";
import { QUOTE_TTL_MS, signQuote } from "@/server/x402/quote";
import { acceptPayment, type Refusal } from "@/server/x402/verify";

export const dynamic = "force-dynamic";

const WALRUSCAN = "https://walruscan.com/mainnet/blob";
const SUISCAN = "https://suiscan.xyz/mainnet/tx";

/** The 402: the price now, with a signed quote that holds it for two minutes. */
function demand(category: Category, amount: string, error: string): Response {
  const env = paymentEnv();
  const quote = signQuote(
    { amount, category, expiresMs: Date.now() + QUOTE_TTL_MS },
    env.QUOTE_SECRET,
  );
  const body = {
    x402Version: 2,
    error,
    resource: {
      url: `${env.PUBLIC_BASE_URL}/api/consensus?category=${category}`,
      description: `Grudge's trust-weighted call on the ${category} Bitcoin window`,
      mimeType: "application/json",
      serviceName: "Grudge",
    },
    accepts: [requirementsFor(amount, quote, env.TREASURY_ADDRESS)],
  };
  return Response.json(body, { status: 402, headers: { "PAYMENT-REQUIRED": toHeader(body) } });
}

const explain: Record<Refusal, string> = {
  malformed: "PAYMENT-SIGNATURE is not a payment",
  quote: "the quote is invalid or has expired",
  terms: "the payment does not accept the terms offered",
  signature: "the signature does not match the transaction",
  simulation: "the transaction would not run",
  amount: "the transaction does not pay exactly the quoted amount to the treasury",
  duplicate: "this payment was already used",
  execution: "the payment could not be settled",
};

/**
 * Grudge's consensus for one category, sold over x402: a USDC payment on Sui, verified and settled
 * through Tatum. The price is the board's confidence turned into USDC, so it rises as Grudge learns.
 */
export async function GET(request: Request): Promise<Response> {
  const requested = new URL(request.url).searchParams.get("category");
  const category = categories.find((known) => known === requested);
  if (!category) {
    return Response.json({ error: "category must be btc-5m or btc-15m" }, { status: 400 });
  }

  const board = (await boardSnapshot()).categories[category];
  const locked = board.locked;
  // Nothing is sold before there is something to sell.
  if (!locked || locked.line === null) {
    return Response.json({ error: "no locked window yet" }, { status: 503 });
  }

  const header = request.headers.get("payment-signature");
  if (!header) return demand(category, locked.priceAtomic, "payment required");

  const env = paymentEnv();
  const result = await acceptPayment({
    header,
    category,
    payTo: env.TREASURY_ADDRESS,
    secret: env.QUOTE_SECRET,
    nowMs: Date.now(),
    chain: tatumChain,
    ledger: paymentsLedger,
  });
  if (!result.ok) return demand(category, locked.priceAtomic, explain[result.reason]);

  const weights = Object.fromEntries(
    board.voices.flatMap((voice) => (voice.weight === null ? [] : [[voice.voice, voice.weight]])),
  );
  return Response.json(
    {
      question: locked.id,
      category,
      grudgeLine: locked.line,
      calls: locked.calls,
      weights,
      confidence: locked.confidence,
      disagreement: locked.disagreement,
      lesson: board.lesson
        ? { ...board.lesson, url: board.lesson.blobId && `${WALRUSCAN}/${board.lesson.blobId}` }
        : null,
      receipts: {
        walrus: board.ledger
          .flatMap((row) =>
            row.blobId
              ? [{ question: row.id, blobId: row.blobId, url: `${WALRUSCAN}/${row.blobId}` }]
              : [],
          )
          .slice(0, 5),
        sui: { digest: result.digest, url: `${SUISCAN}/${result.digest}` },
      },
    },
    {
      headers: {
        "PAYMENT-RESPONSE": toHeader({
          success: true,
          transaction: result.digest,
          network: NETWORK,
          payer: result.payer,
        }),
      },
    },
  );
}
