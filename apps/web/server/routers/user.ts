import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.user.id),
      with: { studentProfile: true, counselorProfile: true },
    })
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
