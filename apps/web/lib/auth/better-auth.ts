import { betterAuth } from 'better-auth'
import { createPool } from 'mysql2/promise'
import { db, schema } from '@endow/db'

const pool = createPool({
  uri: process.env.DATABASE_URL,
  timezone: 'Z',
})

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,

  // ── Map to existing table/column names ──────────────────────
  // The existing DB uses @auth/drizzle-adapter shaped tables.
  // We remap BetterAuth's internal model names → actual DB names.
  user: {
    modelName: 'user', // actual table name
    fields: {
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'STUDENT',
        input: false,
      },
      fcmToken: {
        type: 'string',
        required: false,
        fieldName: 'fcm_token',
      },
    },
  },

  session: {
    modelName: 'session', // actual table name
    fields: {
      token: 'session_token',
      userId: 'user_id',
      expiresAt: 'expires',
    },
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  account: {
    modelName: 'account', // actual table name
    fields: {
      userId: 'user_id',
      accountId: 'provider_account_id',
      providerId: 'provider',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: 'expires_at',
      idToken: 'id_token',
    },
  },

  // ── Social providers ────────────────────────────────────────
  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ??
        '947347962477-tb5j0imimktvo456gtq4t3m3pvheujqe.apps.googleusercontent.com',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        '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',
    },
  },

  // ── ID generation ──────────────────────────────────────────
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },

  // ── Pages ──────────────────────────────────────────────────
  pages: {
    signIn: '/login',
    error: '/login',
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
