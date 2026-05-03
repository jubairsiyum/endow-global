import { z } from 'zod'
import { createTRPCRouter, counselorProcedure } from '../trpc'

export const counselorRouter = createTRPCRouter({
  getAssignedStudents: counselorProcedure.query(async ({ ctx }) => {
    const counselor = await ctx.prisma.counselorProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!counselor) throw new Error('Counselor profile not found')

    return ctx.prisma.studentProfile.findMany({
      where: { assignedCounselorId: counselor.id },
      include: { user: true },
    })
  }),

  getStudentDetail: counselorProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.studentProfile.findUnique({
        where: { id: input.studentId },
        include: {
          user: true,
          applications: { include: { course: { include: { university: true } } } },
          bookingSessions: true,
          matchResults: { include: { course: { include: { university: true } } } },
        },
      })
    }),

  updateAvailability: counselorProcedure
    .input(z.object({ isAvailable: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.counselorProfile.update({
        where: { userId: ctx.session.user.id },
        data: { isAvailable: input.isAvailable },
      })
    }),

  getProfile: counselorProcedure.query(async ({ ctx }) => {
    return ctx.prisma.counselorProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
  }),

  updateProfile: counselorProcedure
    .input(
      z.object({
        bio: z.string().nullable().optional(),
        expertiseCountries: z.array(z.string()).optional(),
        expertiseSubjects: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
        sessionRate: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.counselorProfile.update({
        where: { userId: ctx.session.user.id },
        data: input,
      })
    }),
})
