import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  {
    key: "Permissions-Policy",
    value:
      'camera=(self "https://meet.jit.si"), microphone=(self "https://meet.jit.si"), display-capture=(self "https://meet.jit.si"), geolocation=(), payment=(self "https://checkout.razorpay.com"), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()',
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["firebase-admin", "@prisma/client", "prisma", "sharp"],
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '/api/avatar/**',
      },
      {
        pathname: '/api/image-optimize',
        search: '?**',
      },
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/:path*.(webp|png|jpg|jpeg|gif|svg|ico|txt|xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Prevent caching on the auth page redirect
        source: '/auth',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/security.txt',
        destination: '/.well-known/security.txt',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/join',
        destination: '/joinus',
        permanent: true,
      },
      {
        source: '/join-us',
        destination: '/joinus',
        permanent: true,
      },
      {
        source: '/im',
        destination: '/ourteam',
        permanent: true,
      },
      {
        source: '/our-team',
        destination: '/ourteam',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/legal/privacy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/legal/terms',
        permanent: true,
      },
    ];
  },
};

// Next.js configuration reloaded for prisma query engine client
export default nextConfig;
