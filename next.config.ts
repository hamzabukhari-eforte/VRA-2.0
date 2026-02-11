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
  serverExternalPackages: ["@sparticuz/chromium"],
  outputFileTracingIncludes: {
    "/api/*": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
