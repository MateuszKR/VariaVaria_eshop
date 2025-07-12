const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Disable image optimization to avoid Docker networking issues
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'variavaria.com',
      },
      {
        protocol: 'https',
        hostname: 's1.apart.pl',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
      },
      {
        protocol: 'http',
        hostname: 'products-service',
        port: '3002',
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