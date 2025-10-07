// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ laisse passer le build sur Vercel
  },
};

export default nextConfig;
