import {
  type ClientStreamingCall,
  type DuplexStreamingCall,
  type MethodInfo,
  type RpcOptions,
  type RpcTransport,
  type ServerStreamingCall,
  UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import { log } from "../log";
import { takeSlot } from "./budget";

/** Tatum answers a burst with HTTP 429 even inside the plan's average rate; a pause clears it. */
const RATE_LIMIT_RETRY_DELAYS_MS = [1_000, 3_000];

const isRateLimited = (err: unknown) => err instanceof Error && err.message.includes("429");

/** A failed call rejects all four of its promises, and only `response` is ever awaited. */
function quiet<T>(promise: Promise<T>): Promise<T> {
  promise.catch(() => undefined);
  return promise;
}

/** Holds every unary call until the shared Tatum budget has a free slot. */
export class ThrottledTransport implements RpcTransport {
  constructor(private readonly inner: RpcTransport) {}

  mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
    return this.inner.mergeOptions(options);
  }

  unary<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    input: I,
    options: RpcOptions,
  ): UnaryCall<I, O> {
    const started = this.untilAccepted(method, input, options);
    return new UnaryCall(
      method,
      options.meta ?? {},
      input,
      quiet(started.then((call) => call.headers)),
      started.then((call) => call.response),
      quiet(started.then((call) => call.status)),
      quiet(started.then((call) => call.trailers)),
    );
  }

  private async untilAccepted<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    input: I,
    options: RpcOptions,
  ): Promise<UnaryCall<I, O>> {
    for (let retry = 0; ; retry++) {
      await takeSlot("grpc");
      const call = this.inner.unary(method, input, options);
      quiet(call.headers);
      quiet(call.status);
      quiet(call.trailers);
      try {
        await call.response;
        return call;
      } catch (err) {
        const delayMs = RATE_LIMIT_RETRY_DELAYS_MS[retry];
        if (delayMs === undefined || !isRateLimited(err)) throw err;
        log.warn("tatum.grpc.rate_limited", { method: method.name, retry: retry + 1, delayMs });
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // Streams are not throttled; nothing here opens one.
  serverStreaming<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    input: I,
    options: RpcOptions,
  ): ServerStreamingCall<I, O> {
    return this.inner.serverStreaming(method, input, options);
  }

  clientStreaming<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    options: RpcOptions,
  ): ClientStreamingCall<I, O> {
    return this.inner.clientStreaming(method, options);
  }

  duplex<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    options: RpcOptions,
  ): DuplexStreamingCall<I, O> {
    return this.inner.duplex(method, options);
  }
}
