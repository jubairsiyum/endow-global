import '../../env-loader.cjs'
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
      "better-auth",
      "@better-auth/kysely-adapter",
      "@better-auth/drizzle-adapter",
      "kysely",
    ],
  },
};

export default nextConfig;
