const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001',
    NEXT_PUBLIC_PRODUCTS_SERVICE_URL: process.env.NEXT_PUBLIC_PRODUCTS_SERVICE_URL || 'http://localhost:3002',
    NEXT_PUBLIC_ORDERS_SERVICE_URL: process.env.NEXT_PUBLIC_ORDERS_SERVICE_URL || 'http://localhost:3003',
  },
};

module.exports = withPWA(nextConfig); 