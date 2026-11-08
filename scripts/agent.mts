/**
 * A client that pays for Grudge's consensus over x402 and reads it. It signs with the key in
 * AGENT_PRIVATE_KEY; that key lives only in .env on this machine, never on the server.
 *
 *   pnpm agent                          one purchase on btc-5m
 *   pnpm agent --category btc-15m       the other category
 *   pnpm agent --replay                 send the same payment again to show it is refused
 *   pnpm agent --loop                   every 30 min, buy only when the voices disagree, stop at the budget
 */
import { parseArgs } from "node:util";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { toBase64 } from "@mysten/sui/utils";
import {
  fromHeader,
  paymentRequired,
  settlement,
  toHeader,
  USDC_TYPE,
} from "../src/server/x402/protocol";

const { values } = parseArgs({
  options: {
    base: { type: "string", default: "https://grudge-l19c.onrender.com" },
    category: { type: "string", default: "btc-5m" },
    loop: { type: "boolean", default: false },
    replay: { type: "boolean", default: false },
  },
});

/** The most this client will ever pay for one call, whatever the server asks: 0.05 USDC. */
const MAX_PRICE = 50_000n;
/** What a --loop run may spend in total: 2 USDC. */
const BUDGET = 2_000_000n;
const LOOP_EVERY_MS = 30 * 60_000;
/** The public fullnode builds the payment, so the buyer does not depend on the seller's Tatum key. */
const FULLNODE = "https://fullnode.mainnet.sui.io:443";

const secret = process.env.AGENT_PRIVATE_KEY;
if (!secret) throw new Error("AGENT_PRIVATE_KEY is not set (put it in .env)");
const keypair = Ed25519Keypair.fromSecretKey(secret);
const client = new SuiGrpcClient({ network: "mainnet", baseUrl: FULLNODE });
const usdc = (atomic: bigint) => `${Number(atomic) / 1_000_000} USDC`;

/** Asks, reads the price from the 402, pays it, and asks again. Returns what was paid. */
async function buy(base: string, category: string): Promise<bigint> {
  const url = `${base}/api/consensus?category=${category}`;
  const asked = await fetch(url);
  if (asked.status !== 402) throw new Error(`expected a 402, got ${asked.status}`);
  const demand = fromHeader(asked.headers.get("payment-required") ?? "", paymentRequired);
  const terms = demand?.accepts[0];
  if (!terms) throw new Error("the 402 did not carry usable payment terms");

  const price = BigInt(terms.amount);
  if (price > MAX_PRICE) throw new Error(`price ${usdc(price)} is above this client's limit`);
  console.log(`402: ${usdc(price)} to ${terms.payTo.slice(0, 10)}…`);

  const tx = new Transaction();
  tx.setSender(keypair.toSuiAddress());
  tx.moveCall({
    target: "0x2::balance::send_funds",
    typeArguments: [USDC_TYPE],
    arguments: [tx.balance({ type: USDC_TYPE, balance: price }), tx.pure.address(terms.payTo)],
  });
  const bytes = await tx.build({ client });
  const { signature } = await keypair.signTransaction(bytes);
  const payment = toHeader({
    x402Version: 2,
    accepted: terms,
    payload: { signature, transaction: toBase64(bytes) },
  });

  const paid = await fetch(url, { headers: { "payment-signature": payment } });
  if (paid.status !== 200) {
    throw new Error(
      `payment refused (${paid.status}): ${((await paid.json()) as { error?: string }).error}`,
    );
  }
  const receipt = fromHeader(paid.headers.get("payment-response") ?? "", settlement);
  const body = (await paid.json()) as {
    question: string;
    grudgeLine: number;
    disagreement: number;
    lesson: { text: string } | null;
    receipts: { sui: { url: string } };
  };
  console.log(`200: ${body.question}`);
  console.log(
    `  Grudge line ${Math.round(body.grudgeLine * 100)}%, voices ${Math.round(body.disagreement * 100)} pts apart`,
  );
  if (body.lesson) console.log(`  lesson: ${body.lesson.text}`);
  console.log(`  settled: ${receipt?.transaction}`);
  console.log(`  ${body.receipts.sui.url}`);

  if (values.replay) {
    const again = await fetch(url, { headers: { "payment-signature": payment } });
    const reply = (await again.json()) as { error?: string };
    console.log(`replay of the same payment: ${again.status} ${reply.error}`);
  }
  return price;
}

if (!values.loop) {
  await buy(values.base, values.category);
} else {
  let spent = 0n;
  while (spent < BUDGET) {
    const board = (await (await fetch(`${values.base}/api/board`)).json()) as {
      categories: Record<string, { locked: { disagrees: boolean } | null }>;
    };
    if (board.categories[values.category]?.locked?.disagrees) {
      try {
        spent += await buy(values.base, values.category);
        console.log(`spent so far: ${usdc(spent)} of ${usdc(BUDGET)}`);
      } catch (err) {
        console.error(String(err));
      }
    } else {
      console.log("voices agree; not buying");
    }
    await new Promise((done) => setTimeout(done, LOOP_EVERY_MS));
  }
  console.log("budget spent; stopping");
}
