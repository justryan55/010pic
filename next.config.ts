import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: false,
      },
    ];
  },
  images: {
    domains: ["mkjgtonapkqolvaccphs.supabase.co"],
  },
};

export default nextConfig;
