import {
  type ClientStreamingCall,
  type DuplexStreamingCall,
  type MethodInfo,
  type RpcOptions,
  type RpcTransport,
  type ServerStreamingCall,
  UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import { takeSlot } from "./budget";

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
    const started = takeSlot("grpc").then(() => this.inner.unary(method, input, options));
    // Only `response` is awaited by callers. A failed call rejects all four promises, and the
    // other three would otherwise surface as unhandled rejections.
    const quiet = <T>(promise: Promise<T>): Promise<T> => {
      promise.catch(() => undefined);
      return promise;
    };
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
