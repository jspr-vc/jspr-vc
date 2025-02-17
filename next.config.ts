import type { NextConfig } from "next";
import "./env.mjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["uploadthing.com", "manok.dev", "beta.manok.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "manok.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "beta.manok.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
