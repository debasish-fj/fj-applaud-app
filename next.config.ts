import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fischerjordan.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
