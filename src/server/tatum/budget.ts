import { singleton } from "../singleton";

export type TatumSurface = "grpc" | "data";

/** The free plan allows 3 requests per second across every Tatum endpoint we use. */
const SPACING_MS = 350;

const budget = () =>
  singleton("tatum-budget", () => ({
    nextSlotMs: 0,
    calls: { grpc: 0, data: 0 } satisfies Record<TatumSurface, number>,
  }));

/** Resolves when this call may go out. gRPC and the Data API share one queue. */
export async function takeSlot(surface: TatumSurface): Promise<void> {
  const state = budget();
  const now = Date.now();
  const start = Math.max(now, state.nextSlotMs);
  state.nextSlotMs = start + SPACING_MS;
  state.calls[surface] += 1;
  if (start > now) await new Promise((resolve) => setTimeout(resolve, start - now));
}

export function tatumCalls(): Readonly<Record<TatumSurface, number>> {
  return { ...budget().calls };
}
