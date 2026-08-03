import '../../env-loader.cjs'

const isDev = process.env.NODE_ENV === 'development'
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? (isDev ? 'http://localhost:3000' : '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.google.com' },
      { protocol: 'https', hostname: 'github.githubassets.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      // better-auth adapters — server-only
      '@better-auth/kysely-adapter',
      '@better-auth/drizzle-adapter',
      // other server-only packages
      'kysely',
      'stripe',
      'firebase-admin',
      'openai',
      'typesense',
      '@langchain/openai',
      '@langchain/pinecone',
      '@pinecone-database/pinecone',
      'nodemailer',
    ],
  },
  headers: async () => [
    // ─── Security headers for all routes ────────────────────────────────────
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        // HSTS — only meaningful in production over HTTPS
        ...(!isDev
          ? [
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload',
              },
            ]
          : []),
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            // Next.js needs unsafe-inline/unsafe-eval in dev for HMR
            isDev
              ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
              : "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://www.google.com https://github.githubassets.com https://upload.wikimedia.org https://images.unsplash.com",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
          ].join('; '),
        },
      ],
    },
    // ─── CORS headers for API routes ─────────────────────────────────────────
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: appUrl,
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization, X-Requested-With',
        },
        {
          key: 'Access-Control-Allow-Credentials',
          value: 'true',
        },
      ],
    },
  ],
}

export default nextConfig
