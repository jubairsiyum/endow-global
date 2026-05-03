/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@endow/db', '@endow/types', '@endow/config'],
  experimental: {
    typedRoutes: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/student', destination: '/dashboard', permanent: false },
    ]
  },
}

export default nextConfig
