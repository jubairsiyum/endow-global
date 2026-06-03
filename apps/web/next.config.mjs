/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.google.com",
      "github.githubassets.com",
      "upload.wikimedia.org",
      "images.unsplash.com",
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