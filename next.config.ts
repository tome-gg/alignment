import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    // CSS optimization temporarily disabled due to build issues with Turbopack
    optimizeCss: false,
    optimizePackageImports: [
      '@mui/material', 
      '@mui/icons-material', 
      'd3-selection',
      'd3-time-format',
      'd3-array',
      'd3-scale',
      'd3-scale-chromatic',
      'd3-time'
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Headers for better caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600'
          }
        ],
      }
    ];
  },
  
  // Note: Webpack config is disabled when using Turbopack
  // These optimizations are handled by Turbopack automatically
};

export default nextConfig;
