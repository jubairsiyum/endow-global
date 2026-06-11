import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { customSession } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { db, schema } from '@endow/db'
import { UserRole } from '@endow/types'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: {
      ...schema,
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verificationTokens,
    },
  }),
  user: {
    modelName: 'user',
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
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const existing = await db.query.studentProfiles.findFirst({
            where: (sp: any, { eq }: any) => eq(sp.userId, user.id),
          })
          if (!existing) {
            await db.insert(schema.studentProfiles).values({ userId: user.id })
          }
        },
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
          role: (user as any).role as UserRole,
        },
        session,
      }
    }),
    nextCookies(),
  ],
  pages: {
    signIn: '/login',
  },
})

export type Session = typeof auth.$Infer.Session
