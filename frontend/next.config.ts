import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.kapruka.com",
      },
      {
        protocol: "https",
        hostname: "kapruka.com",
      },
      {
        protocol: "https",
        hostname: "singerwebcdn.azureedge.net",
      },
    ],
  },
};

export default nextConfig;
