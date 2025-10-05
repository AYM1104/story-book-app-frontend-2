import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.cloud.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'story-book-backend-20459204449.asia-northeast1.run.app',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
