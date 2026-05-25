import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db, schema } from '@endow/db'

const authSchema = {
  users: schema.users,
  accounts: schema.accounts,
  sessions: schema.sessions,
  verification: schema.verificationTokens,
  verifications: schema.verificationTokens,
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: authSchema,
    usePlural: true,
  }),

  // ── Social providers ────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Allow cross-origin requests from common dev ports
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ],

  // Custom fields stored on the user table
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'STUDENT',
        fieldName: 'role',
      },
      fcmToken: {
        type: 'string',
        fieldName: 'fcmToken',
      },
    },
  },

  // Force server-side OAuth state storage to avoid cookie-related losses
  account: {
    storeStateStrategy: 'database',
  },

  // ── ID generation ──────────────────────────────────────────
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },

  // ── Pages ──────────────────────────────────────────────────
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  // ── Database hooks: auto-create studentProfile on signup ──
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const existing = await db.query.studentProfiles.findFirst({
              where: (sp, { eq }) => eq(sp.userId, user.id),
            })
            if (!existing) {
              await db.insert(schema.studentProfiles).values({ userId: user.id })
            }
          } catch (err) {
            console.error('[BetterAuth] Failed to create student profile:', err)
          }
        },
      },
    },
  },
})

// ── Server-side session helper ───────────────────────────────
// Use this in server components, tRPC context, and API routes.
export async function getSession(headers: Headers) {
  const session = await auth.api.getSession({ headers })
  if (!session) return null

  // Map BetterAuth session → the standard shape expected by tRPC/middleware
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? '',
      role: (session.user as Record<string, unknown>).role as string ?? 'STUDENT',
      image: session.user.image ?? null,
    },
  }
}

export type AuthSession = Awaited<ReturnType<typeof getSession>>
