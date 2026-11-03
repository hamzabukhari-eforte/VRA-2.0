import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@vra/db"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.resultsvault.co.uk",
        pathname: "/logo.ashx",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54341",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "54341",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  async rewrites() {
    const api =
      process.env.API_PROXY_URL || "http://localhost:7001";
    return [
      {
        source: "/api/:path*",
        destination: `${api}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
