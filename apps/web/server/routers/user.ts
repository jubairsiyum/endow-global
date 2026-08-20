import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq } from 'drizzle-orm'
const eq = _eq as any
import { z } from 'zod'
import { hash as bcryptHash } from 'bcryptjs'

const BCRYPT_SALT_ROUNDS = 12

// Unicode-aware name: Latin letters (incl. accents), spaces, hyphens,
// apostrophes and periods only.
const NAME_PATTERN = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF][A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s'’.-]{1,99}$/

function normalizePhone(value: string): string {
  return value.replace(/[\s.-]/g, '').replace(/^(?:\+|00)(\d)/, '$1')
}

function isValidPhone(value: string): boolean {
  if (!value) return true
  return /^(?!0+$)\d{7,15}$/.test(normalizePhone(value))
}

export const userRouter = createTRPCRouter({
  checkEmailExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, input.email.trim().toLowerCase()),
      })
      return { exists: Boolean(user) }
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({ user: schema.users, studentProfile: schema.studentProfiles })
      .from(schema.users)
      .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.userId, schema.users.id))
      .where(eq(schema.users.id, ctx.session.user.id))
      .limit(1)
    const row = rows[0]
    return row ? { ...row.user, studentProfile: row.studentProfile } : null
  }),

  setPassword: protectedProcedure
    .input(z.object({ password: z.string().min(8).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const hashed = await bcryptHash(input.password, BCRYPT_SALT_ROUNDS)

      const existing = await ctx.db.query.accounts.findFirst({
        where: (a, { eq, and }) => and(eq(a.userId, userId), eq(a.providerId, 'credential')),
      })

      if (existing) {
        await ctx.db
          .update(schema.accounts)
          .set({ password: hashed })
          .where(eq(schema.accounts.id, existing.id))
      } else {
        await ctx.db.insert(schema.accounts).values({
          userId,
          providerId: 'credential',
          accountId: userId,
          password: hashed,
        })
      }

      return { success: true }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .trim()
          .min(2, 'Full name must be at least 2 characters')
          .max(100, 'Full name is too long')
          .regex(NAME_PATTERN, 'Full name contains invalid characters')
          .optional(),
        nationality: z.string().trim().max(100).optional(),
        countryOfResidence: z.string().trim().max(100).optional(),
        phone: z
          .string()
          .trim()
          .max(30)
          .superRefine((value, ctx) => {
            if (!value) return
            if (!isValidPhone(value)) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid phone number' })
            }
          })
          .optional(),
        targetCountries: z.array(z.string()).optional(),
        targetSubjects: z.array(z.string()).optional(),
        budgetMin: z.number().nonnegative().nullable().optional(),
        budgetMax: z.number().nonnegative().nullable().optional(),
        gpa: z.number().min(0, 'GPA must be between 0 and 5').max(5, 'GPA must be between 0 and 5').nullable().optional(),
        ieltsScore: z.number().min(0, 'IELTS band must be between 0 and 9').max(9, 'IELTS band must be between 0 and 9').nullable().optional(),
        toeflScore: z.number().int('TOEFL score must be a whole number').min(0, 'TOEFL score must be between 0 and 120').max(120, 'TOEFL score must be between 0 and 120').nullable().optional(),
        highestEducation: z.enum(['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD']).optional(),
        preferredIntakeYear: z.number().int().min(2020).max(2100).optional(),
        preferredIntakeMonth: z.string().trim().max(50).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Update user name if provided
      if (input.name) {
        await ctx.db
          .update(schema.users)
          .set({ name: input.name })
          .where(eq(schema.users.id, userId))
      }

      // Find or create student profile
      const existing = await ctx.db.query.studentProfiles.findFirst({
        where: (sp, { eq }) => eq(sp.userId, userId),
      })

      if (existing) {
        await ctx.db
          .update(schema.studentProfiles)
          .set({
            ...(input.nationality !== undefined && { nationality: input.nationality }),
            ...(input.countryOfResidence !== undefined && { countryOfResidence: input.countryOfResidence }),
            ...(input.phone !== undefined && { phone: input.phone }),
            ...(input.targetCountries !== undefined && { targetCountries: input.targetCountries }),
            ...(input.targetSubjects !== undefined && { targetSubjects: input.targetSubjects }),
            ...(input.budgetMin !== undefined && { budgetMin: input.budgetMin }),
            ...(input.budgetMax !== undefined && { budgetMax: input.budgetMax }),
            ...(input.gpa !== undefined && { gpa: input.gpa }),
            ...(input.ieltsScore !== undefined && { ieltsScore: input.ieltsScore }),
            ...(input.toeflScore !== undefined && { toeflScore: input.toeflScore }),
            ...(input.highestEducation !== undefined && { highestEducation: input.highestEducation }),
            ...(input.preferredIntakeYear !== undefined && { preferredIntakeYear: input.preferredIntakeYear }),
            ...(input.preferredIntakeMonth !== undefined && { preferredIntakeMonth: input.preferredIntakeMonth }),
          })
          .where(eq(schema.studentProfiles.userId, userId))
      } else {
        await ctx.db.insert(schema.studentProfiles).values({
          userId,
          nationality: input.nationality,
          countryOfResidence: input.countryOfResidence,
          phone: input.phone,
          targetCountries: input.targetCountries ?? [],
          targetSubjects: input.targetSubjects ?? [],
          budgetMin: input.budgetMin,
          budgetMax: input.budgetMax,
          gpa: input.gpa,
          ieltsScore: input.ieltsScore,
          toeflScore: input.toeflScore,
          highestEducation: input.highestEducation ?? 'HIGH_SCHOOL',
          preferredIntakeYear: input.preferredIntakeYear,
          preferredIntakeMonth: input.preferredIntakeMonth,
        })
      }

      return { success: true }
    }),
})
