import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't auto-generate AGENTS.md / CLAUDE.md (Next 16.3 preview feature).
  agentRules: false,
  // TypeScript 7 (native/ts-go compiler) ships no JS compiler API, so Next's
  // build-time type-checker uses the TS 7 CLI instead. Requires next@preview.
  experimental: {
    useTypeScriptCli: true,
  },
  images: {
    // Mirrors the old `images.domains` list (which matched any protocol) —
    // the OG image endpoints are served over http as well as https.
    remotePatterns: [
      { protocol: "https", hostname: "uploadthing.com", pathname: "/**" },
      { protocol: "https", hostname: "manok.dev", pathname: "/**" },
      { protocol: "http", hostname: "manok.dev", pathname: "/**" },
      { protocol: "https", hostname: "beta.manok.dev", pathname: "/**" },
      { protocol: "http", hostname: "beta.manok.dev", pathname: "/**" },
    ],
  },
};

export default nextConfig;
