import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize builds for memory-constrained environments (Render free tier)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@prisma/client"],
  },
  // Reduce JS bundle size
  swcMinify: true,
  // Enable gzip compression
  compress: true,
  // Disable source maps in production to reduce build memory
  productionBrowserSourceMaps: false,
};

export default nextConfig;
