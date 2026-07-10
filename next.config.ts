import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase storage - match any supabase.co subdomain
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Allow example.com for development/testing
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
    unoptimized: true,
  },
};

export default withPayload(nextConfig);
