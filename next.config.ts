import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't auto-generate AGENTS.md / CLAUDE.md.
  agentRules: false,
  // Prerender everything that can be, cache data reads with "use cache", and
  // stream only what depends on the request (the session).
  cacheComponents: true,
  // Links prefetch each route's shell, including its per-session content, so
  // dashboard tabs navigate without a loading state.
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      // Images uploaded before the move to Vercel Blob.
      { protocol: "https", hostname: "uploadthing.com", pathname: "/**" },
      { protocol: "https", hostname: "utfs.io", pathname: "/**" },
      { protocol: "https", hostname: "*.ufs.sh", pathname: "/**" },
    ],
  },
};

export default nextConfig;
