import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.ytimg.com", "sp2.snapapi.space", "instagram.fhan5-2.fna.fbcdn.net"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  // Add metadataBase to resolve the warning
  metadataBase: new URL("https://tube-xtract-e465.vercel.app"),
};

export default nextConfig;
