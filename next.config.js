/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable experimental features if needed
  experimental: {
    // serverActions are now stable in Next.js 14
  },
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Webpack configuration for server-side packages
  webpack: (config, { isServer }) => {
    // Handle fs module for server-side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
