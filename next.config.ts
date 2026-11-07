import type { NextConfig } from "next";

const config: NextConfig = {
  // Native gRPC and the Walrus Memory client load dynamic imports that the bundler cannot trace.
  serverExternalPackages: ["@grpc/grpc-js", "@mysten-incubation/memwal", "@mysten/seal"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default config;
