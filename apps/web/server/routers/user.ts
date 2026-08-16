import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq } from 'drizzle-orm'
const eq = _eq as any
import { z } from 'zod'
import { hash as bcryptHash } from 'bcryptjs'

const BCRYPT_SALT_ROUNDS = 12

export const userRouter = createTRPCRouter({
  checkEmailExists: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, input.email.trim().toLowerCase()),
      })
      return { exists: Boolean(user) }
    }),

  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.user.id),
      with: { studentProfile: true, counselorProfile: true },
    })
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
        name: z.string().optional(),
        nationality: z.string().optional(),
        countryOfResidence: z.string().optional(),
        phone: z.string().optional(),
        targetCountries: z.array(z.string()).optional(),
        highestEducation: z.enum(['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD']).optional(),
        preferredIntakeYear: z.number().optional(),
        preferredIntakeMonth: z.string().optional(),
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
          highestEducation: input.highestEducation ?? 'HIGH_SCHOOL',
          preferredIntakeYear: input.preferredIntakeYear,
          preferredIntakeMonth: input.preferredIntakeMonth,
        })
      }

      return { success: true }
    }),
})
