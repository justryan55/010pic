// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   devIndicators: false,
//   async redirects() {
//     return [
//       {
//         source: "/",
//         destination: "/auth/login",
//         permanent: false,
//       },
//     ];
//   },
//   images: {
//     domains: ["mkjgtonapkqolvaccphs.supabase.co"],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "*.r2.cloudflarestorage.com",
//         port: "",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, 
  devIndicators: false,

  images: {
    unoptimized: true,
    domains: ["mkjgtonapkqolvaccphs.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
