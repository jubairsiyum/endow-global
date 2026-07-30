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
      "stripe",
      "firebase-admin",
      "openai",
      "typesense",
      "@langchain/openai",
      "@langchain/pinecone",
      "@pinecone-database/pinecone",
      "nodemailer",
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Permissions-Policy',
          value: 'interest-cohort=()',
        },
      ],
    },
  ],
};

export default nextConfig;
