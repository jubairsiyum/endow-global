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
import { absoluteUrl } from './utils'
import { autoAssignCounselor } from './counselor-assignment'
import { notifyCounselorNewStudent } from './notify'

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
      permissions: {
        type: 'string',
        required: false,
        defaultValue: '[]',
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
            // Automatically assign a counselor by equal distribution when a
            // new student registers (email/password, OTP, or Google sign-in).
            const role = (user as any)?.role
            const assignedCounselorId =
              role === 'STUDENT' ? await autoAssignCounselor(db, schema) : null
            await db.insert(schema.studentProfiles).values({
              userId: user.id,
              assignedCounselorId,
            })
            // Best-effort: notify the assigned counselor via email (SMTP).
            if (assignedCounselorId) {
              try {
                await notifyCounselorNewStudent(db, schema, {
                  counselorId: assignedCounselorId,
                  studentName: (user as any)?.name || 'New student',
                  studentEmail: (user as any)?.email || '',
                })
              } catch (err) {
                console.error('[notify] Failed to notify counselor of new student:', err)
              }
            }
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

        const content =
          type === 'sign-in'
            ? {
                eyebrow: 'Secure sign-in',
                heading: 'Your sign-in code',
                body: 'Use the 6-digit code below to sign in to your Endow Global account.',
              }
            : type === 'email-verification'
              ? {
                  eyebrow: 'Verify your email',
                  heading: 'Verify your email address',
                  body: 'Use the code below to confirm your email address and continue your registration.',
                }
              : type === 'forget-password'
                ? {
                    eyebrow: 'Password reset',
                    heading: 'Reset your password',
                    body: 'Use the code below to reset your password.',
                  }
                : {
                    eyebrow: 'Verify new email',
                    heading: 'Confirm your new email',
                    body: 'Use the code below to confirm your new email address.',
                  }

        const logoUrl = absoluteUrl('/logo/endoedu.svg')

        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f8f9fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Space Grotesk',Roboto,Helvetica,Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;"><tr><td align="center"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(10,10,10,0.08);"><tr><td style="background:#c41e3a;background-image:linear-gradient(135deg,#c41e3a 0%,#a01830 100%);padding:30px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;width:52px;"><div style="width:48px;height:48px;border-radius:12px;background:#ffffff;text-align:center;line-height:48px;"><img src="${logoUrl}" alt="Endow Global Education" width="34" height="34" style="display:inline-block;vertical-align:middle;border:0;outline:none;text-decoration:none;"></div></td><td style="padding-left:14px;vertical-align:middle;"><span style="display:block;font-size:18px;font-weight:800;letter-spacing:-0.01em;color:#ffffff;">Endow Global</span><span style="display:block;margin-top:2px;font-size:11px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#f3c19a;">Education</span></td></tr></table></td></tr><tr><td style="height:4px;background:#b8934a;"></td></tr><tr><td style="padding:40px 40px 32px;"><p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#c41e3a;">${content.eyebrow}</p><h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;font-weight:800;letter-spacing:-0.02em;color:#0a0a0a;">${content.heading}</h1><p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#52525b;">${content.body}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:22px 16px;background:#fef2f4;border:1px solid #f5c6cf;border-radius:14px;"><span style="font-family:'JetBrains Mono','SF Mono',Menlo,Consolas,monospace;font-size:34px;font-weight:700;letter-spacing:12px;color:#0a0a0a;">${otp}</span></td></tr></table><p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a8f9c;">This code expires in <strong style="color:#52525b;">5 minutes</strong>. For your security, never share this code with anyone.</p></td></tr><tr><td style="padding:0 40px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e4e4e7;padding-top:24px;"><tr><td><p style="margin:0 0 4px;font-size:12px;line-height:1.6;color:#8a8f9c;">Didn&rsquo;t request this code? You can safely ignore this email &mdash; no changes will be made to your account.</p><p style="margin:0;font-size:12px;line-height:1.6;color:#8a8f9c;">Need help? Reply to this email or reach us at <a href="mailto:support@endowglobaledu.com" style="color:#c41e3a;text-decoration:none;font-weight:600;">support@endowglobaledu.com</a></p></td></tr></table></td></tr><tr><td style="padding:26px 40px;background:#0a0a0a;"><p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#ffffff;">Endow Global Education</p><p style="margin:0 0 16px;font-size:12px;line-height:1.6;color:#a1a1aa;">Your trusted partner for international education.</p><p style="margin:0;font-size:11px;line-height:1.6;color:#52525b;">H# 24/1 &amp; 24/2, Level# 8, Shyamoli Square, Mirpur Rd, Dhaka</p></td></tr></table><p style="margin:20px 0 0;font-size:11px;color:#a1a1aa;">&copy; ${new Date().getFullYear()} Endow Global Education. All rights reserved.</p></td></tr></table></body></html>`

        const text = `Your ${content.eyebrow.toLowerCase()} code is ${otp}. It expires in 5 minutes.`

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
      // Parse permissions which may be stored as JSON string or array
      let perms: string[] = []
      const raw = (user as any).permissions
      if (Array.isArray(raw)) perms = raw
      else if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) perms = parsed
        } catch {
          perms = []
        }
      }
      return {
        user: {
          ...user,
          role: (user as any).role as UserRole,
          permissions: perms,
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
