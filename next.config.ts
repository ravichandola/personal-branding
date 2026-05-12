import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.output = {
        ...config.output,
        // Default can feel tight when the dev server is busy recomputing large layout chunks.
        chunkLoadTimeout: 300_000,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
};

export default nextConfig;
