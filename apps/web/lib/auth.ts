import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { customSession, emailOTP } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { compare, hash as bcryptHash } from 'bcryptjs'
import { scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { db, schema } from '@endow/db'
import { UserRole } from '@endow/types'
import { sendEmail } from './email'

const BCRYPT_SALT_ROUNDS = 12
const SCRYPT_KEY_LENGTH = 64
const BCRYPT_PREFIXES = ['$2a$', '$2b$', '$2y$']
const scrypt = promisify(nodeScrypt)

function isBcryptHash(value: string): boolean {
  return BCRYPT_PREFIXES.some((prefix) => value.startsWith(prefix))
}

async function verifyStoredPassword(password: string, storedHash: string): Promise<boolean> {
  if (isBcryptHash(storedHash)) {
    return compare(password, storedHash)
  }

  const [salt, key] = storedHash.split(':')
  if (!salt || !key) {
    return false
  }

  const derivedKey = (await scrypt(password, salt, SCRYPT_KEY_LENGTH)) as Buffer
  const encoding: BufferEncoding = /^[0-9a-f]+$/i.test(key) && key.length % 2 === 0 ? 'hex' : 'base64'
  const storedKey = Buffer.from(key, encoding)

  if (storedKey.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(storedKey, derivedKey)
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    'http://localhost:3000',
    'https://egev2.vercel.app',
    process.env.BETTER_AUTH_URL!,
  ].filter(Boolean),
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
    expiresIn: 60 * 60 * 24, // 1 day for admin portals (reduced from 7 days)
    updateAge: 60 * 60 * 4, // re-issue session after 4 hours of inactivity
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
    freshSession: {
      enabled: false,
      expiresIn: 60 * 60 * 24 * 7,
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => bcryptHash(password, BCRYPT_SALT_ROUNDS),
      verify: async ({ password, hash }) => verifyStoredPassword(password, hash),
    },
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
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 5,
      resendStrategy: 'reuse',
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

        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f7fb;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;"><tr><td align="center"><table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);"><tr><td style="background:linear-gradient(135deg,#0f172a,#991b1b);padding:32px 40px;"><h1 style="margin:0;color:#fff;font-size:20px;font-weight:800;">Endow Global Education</h1></td></tr><tr><td style="padding:40px;"><p style="margin:0 0 8px;color:#475569;font-size:14px;">Hello,</p><p style="margin:0 0 24px;color:#334155;font-size:15px;line-height:1.6;">Your verification code is:</p><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0 0 24px;"><div style="background:#f1f5f9;border-radius:12px;padding:20px 0;display:inline-block;"><span style="font-size:36px;font-weight:900;letter-spacing:10px;color:#0f172a;padding:0 32px;">${otp}</span></div></td></tr></table><p style="margin:0 0 8px;color:#64748b;font-size:13px;">This code expires in 5 minutes. Do not share it with anyone.</p><p style="margin:0;color:#94a3b8;font-size:12px;">If you didn't request this, you can safely ignore this email.</p></td></tr><tr><td style="padding:20px 40px;border-top:1px solid #f1f5f9;"><p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;">Endow Global Education &mdash; Your trusted partner for international education</p></td></tr></table></td></tr></table></body></html>`

        const text = `Your verification code is: ${otp}. It expires in 5 minutes.`

        try {
          const result = await sendEmail({ to: email, subject, text, html })
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
