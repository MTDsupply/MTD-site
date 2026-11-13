import type { NextConfig } from "next";
import { ASSET_VERSION } from "./src/lib/asset-version";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Team portraits are served at 90; everything else stays at the default 75.
    qualities: [75, 90],
    // Photos carry ?v=<ASSET_VERSION> so replaced files get new URLs; only that exact query (or none) is optimised.
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/**", search: `?v=${ASSET_VERSION}` },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
