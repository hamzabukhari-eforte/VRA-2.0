import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.resultsvault.co.uk",
        pathname: "/logo.ashx",
      },
    ],
  },
};

export default nextConfig;
