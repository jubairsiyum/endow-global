import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { db, schema } from '@endow/db'

const verificationAuthTable = mysqlTable('verification_token', {
  id: varchar('id', { length: 255 }).notNull().unique().$defaultFn(() => crypto.randomUUID()),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('token', { length: 255 }).notNull(),
  expiresAt: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

const authSchema = {
  users: schema.users,
  accounts: schema.accounts,
  sessions: schema.sessions,
  verification: verificationAuthTable,
  verifications: verificationAuthTable,
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
