import { receiptsSnapshot } from "@/server/receipts";

export const dynamic = "force-dynamic";

/** The proof page's data: memory on Walrus, payments on Sui, Tatum use, amnesia runs, learning. */
export async function GET(): Promise<Response> {
  return Response.json(await receiptsSnapshot());
}
