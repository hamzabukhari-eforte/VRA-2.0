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
  // Required so Puppeteer + Chromium binaries are not bundled into the serverless function
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
};

export default nextConfig;
