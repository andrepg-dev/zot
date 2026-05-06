import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/setup-waitlist",
        has: [{ type: "host", value: "localhost:3009" }],
        destination: "http://localhost:3000/setup-waitlist",
        permanent: false,
      },
      {
        source: "/setup-waitlist",
        has: [{ type: "host", value: "zot.so" }],
        destination: "https://app.zot.so/setup-waitlist",
        permanent: true,
      },
      {
        source: "/setup-waitlist",
        has: [{ type: "host", value: "www.zot.so" }],
        destination: "https://app.zot.so/setup-waitlist",
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
      "gsap",
      "three",
      "@react-three/fiber",
      "motion",
      "cobe",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  devIndicators: false,
};

export default nextConfig;
