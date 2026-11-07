import "server-only";
import { ChannelCredentials } from "@grpc/grpc-js";
import { predict } from "@mysten/deepbook-v3/predict";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { tatumEnv } from "../env";
import { singleton } from "../singleton";
import { ThrottledTransport } from "./transport";

const TATUM_SUI_GRPC = "sui-mainnet-grpc.gateway.tatum.io:443";

/** Sui mainnet over Tatum's gRPC gateway, with DeepBook Predict reads attached. */
export const sui = () =>
  singleton("tatum-sui", () => {
    const grpc = new GrpcTransport({
      host: TATUM_SUI_GRPC,
      channelCredentials: ChannelCredentials.createSsl(),
      meta: { "x-api-key": tatumEnv().TATUM_API_KEY },
      timeout: 10_000,
    });
    return new SuiGrpcClient({
      network: "mainnet",
      transport: new ThrottledTransport(grpc),
    }).$extend(predict({ network: "mainnet" }));
  });
