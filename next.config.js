/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
// const config = {};

// export default config;
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sbctest.memmserve.com",
        port: "8081",
        pathname: "/grid-flex/v1/api/uploads/**",
      },
      {
        protocol: "https",
        hostname: "alfuttaim-gridflex.memmserve.com",
        port: "8081",
        pathname: "/grid-flex/v1/api/uploads/**",
      },
    ],
  },
};

export default nextConfig;
