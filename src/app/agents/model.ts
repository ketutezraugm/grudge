import { usdc } from "../receipts/model";

export const CATEGORY = "btc-15m";
export const PATH = `/api/consensus?category=${CATEGORY}`;

/** Used until the board has a locked window to quote; the server prices between these. */
const RANGE = "0.010 to 0.050";

export const STEPS = [
  "Ask.",
  "Get a 402 with the price.",
  "Pay in USDC on Sui (no SUI needed).",
  "Ask again with the payment.",
  "Get the line.",
];

/** What the page says the line costs now: the live quote, or the range while there is none. */
export function priceOf(priceAtomic: string | null) {
  if (priceAtomic === null) {
    return {
      amount: RANGE,
      headline: `A line costs ${RANGE} USDC.`,
      atomic: "10000 to 50000 atomic units",
    };
  }
  const amount = usdc(priceAtomic);
  return {
    amount,
    headline: `This line costs ${amount} USDC.`,
    atomic: `${priceAtomic} atomic units`,
  };
}

const ASK = `GET ${PATH} HTTP/1.1\nAccept: application/json`;

/** The four exchanges the page draws, as the server speaks them (x402 v2, headers PAYMENT-*). */
export function samplesOf(priceAtomic: string | null) {
  const amount = priceAtomic ?? "25000";
  const terms = JSON.stringify(
    {
      x402Version: 2,
      error: "payment required",
      accepts: [
        {
          scheme: "exact",
          network: "sui:mainnet",
          amount,
          asset: "<USDC coin type>",
          payTo: "<treasury address>",
          maxTimeoutSeconds: 120,
          extra: { quote: "<signed price, good for 120 s>" },
        },
      ],
    },
    null,
    2,
  );
  return [
    { title: "1 · Ask", label: "Copy request", text: ASK },
    {
      title: "2 · The price",
      label: "Copy 402 response",
      text: `HTTP/1.1 402 Payment Required\nPAYMENT-REQUIRED: <the same terms, base64>\n\n${terms}`,
    },
    {
      title: "4 · Ask again with the payment",
      label: "Copy paid request",
      text: `${ASK}\nPAYMENT-SIGNATURE: <base64 of { x402Version, accepted, payload: { signature, transaction } }>`,
    },
    {
      title: "5 · The line",
      label: "Copy response",
      text: `HTTP/1.1 200 OK\nPAYMENT-RESPONSE: <base64 of { success, transaction, network, payer }>\n\n${JSON.stringify(
        {
          question: `${CATEGORY}:<window start>`,
          category: CATEGORY,
          grudgeLine: 0.68,
          calls: { deepbook: 0.675, kalshi: 0.695, polymarket: 0.675 },
          weights: { deepbook: 0.43, kalshi: 0.36, polymarket: 0.21 },
          confidence: 0.37,
          receipts: { walrus: ["…"], sui: { digest: "…", url: "…" } },
        },
        null,
        2,
      )}`,
    },
  ];
}
