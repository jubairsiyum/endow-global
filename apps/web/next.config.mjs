import '../../env-loader.cjs'
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
      "stripe",
      "firebase-admin",
      "openai",
      "typesense",
      "@langchain/openai",
      "@langchain/pinecone",
      "@pinecone-database/pinecone",
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Permissions-Policy',
          value: 'identity-credentials-get=(), publickey-credentials-get=(), publickey-credentials-create=()',
        },
      ],
    },
  ],
};

export default nextConfig;
