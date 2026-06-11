import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { customSession, emailOTP } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { db, schema } from '@endow/db'
import { UserRole } from '@endow/types'
import { sendEmail } from './resend'

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
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 5,
      sendVerificationOnSignUp: false,
      disableSignUp: false,
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === 'sign-in'
            ? 'Sign in to Endow Global'
            : type === 'email-verification'
              ? 'Verify your email - Endow Global'
              : type === 'forget-password'
                ? 'Reset your password - Endow Global'
                : 'Verify your email change - Endow Global'

        try {
          const result = await sendEmail({
            to: email,
            subject,
            text: `Your verification code is: ${otp}. It expires in 5 minutes.`,
          })
          console.log('[emailOTP] Email sent successfully:', JSON.stringify(result))
        } catch (err) {
          console.error('[emailOTP] Failed to send OTP email:', err)
          throw err
        }
      },
    }),
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
