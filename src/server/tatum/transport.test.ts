import {
  type MethodInfo,
  type RpcOptions,
  type RpcTransport,
  UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThrottledTransport } from "./transport";

const method = { name: "GetObject" } as MethodInfo<object, object>;
const options = { meta: {} } as RpcOptions;

function callThatReplies(reply: Promise<object>): UnaryCall<object, object> {
  return new UnaryCall(
    method,
    {},
    {},
    Promise.resolve({}),
    reply,
    Promise.resolve({ code: "OK", detail: "" }),
    Promise.resolve({}),
  );
}

/** A transport whose successive calls answer with the given replies, in order. */
function transportAnswering(...replies: Array<object | Error>): {
  transport: RpcTransport;
  attempts: () => number;
} {
  let attempts = 0;
  const transport = {
    mergeOptions: (o?: Partial<RpcOptions>) => o as RpcOptions,
    unary: () => {
      const reply = replies[attempts++];
      return callThatReplies(
        reply instanceof Error ? Promise.reject(reply) : Promise.resolve(reply ?? {}),
      );
    },
  } as unknown as RpcTransport;
  return { transport, attempts: () => attempts };
}

describe("ThrottledTransport", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("retries a rate-limited call and returns the answer that follows", async () => {
    const { transport, attempts } = transportAnswering(new Error("Received HTTP status code 429"), {
      ok: true,
    });
    const pending = new ThrottledTransport(transport).unary(method, {}, options).response;
    await vi.advanceTimersByTimeAsync(5_000);
    expect(await pending).toEqual({ ok: true });
    expect(attempts()).toBe(2);
  });

  it("retries a call whose connection was reset and returns the answer that follows", async () => {
    const { transport, attempts } = transportAnswering(new Error("read ECONNRESET"), { ok: true });
    const pending = new ThrottledTransport(transport).unary(method, {}, options).response;
    await vi.advanceTimersByTimeAsync(5_000);
    expect(await pending).toEqual({ ok: true });
    expect(attempts()).toBe(2);
  });

  it("gives up after two retries and surfaces the rate-limit error", async () => {
    const limited = new Error("Received HTTP status code 429");
    const { transport, attempts } = transportAnswering(limited, limited, limited, { ok: true });
    const pending = new ThrottledTransport(transport).unary(method, {}, options).response;
    const settled = expect(pending).rejects.toThrow("429");
    await vi.advanceTimersByTimeAsync(10_000);
    await settled;
    expect(attempts()).toBe(3);
  });

  it("does not retry an error that is not a rate limit", async () => {
    const { transport, attempts } = transportAnswering(new Error("Unauthenticated"), { ok: true });
    const pending = new ThrottledTransport(transport).unary(method, {}, options).response;
    const settled = expect(pending).rejects.toThrow("Unauthenticated");
    await vi.advanceTimersByTimeAsync(10_000);
    await settled;
    expect(attempts()).toBe(1);
  });
});
