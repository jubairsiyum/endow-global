import { z } from 'zod'
import { SessionStatus } from '@endow/types'
import { createTRPCRouter, protectedProcedure, counselorProcedure } from '../trpc'

async function getActor(ctx: any) {
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    include: { studentProfile: true, counselorProfile: true },
  })
  return user
}

export const sessionRouter = createTRPCRouter({
  getUpcoming: protectedProcedure.query(async ({ ctx }) => {
    const user = await getActor(ctx)
    const now = new Date()

    if (user?.counselorProfile) {
      return ctx.prisma.bookingSession.findMany({
        where: { counselorId: user.counselorProfile.id, scheduledAt: { gte: now } },
        include: { student: { include: { user: true } } },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
      })
    }

    if (user?.studentProfile) {
      return ctx.prisma.bookingSession.findMany({
        where: { studentId: user.studentProfile.id, scheduledAt: { gte: now } },
        include: { counselor: { include: { user: true } } },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
      })
    }

    return []
  }),

  getPast: protectedProcedure
    .input(z.object({ page: z.number().int().min(1).default(1), perPage: z.number().int().min(5).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const user = await getActor(ctx)
      const now = new Date()
      const skip = (input.page - 1) * input.perPage

      if (user?.counselorProfile) {
        const [sessions, total] = await Promise.all([
          ctx.prisma.bookingSession.findMany({
            where: { counselorId: user.counselorProfile.id, scheduledAt: { lt: now } },
            include: { student: { include: { user: true } } },
            orderBy: { scheduledAt: 'desc' },
            skip,
            take: input.perPage,
          }),
          ctx.prisma.bookingSession.count({
            where: { counselorId: user.counselorProfile.id, scheduledAt: { lt: now } },
          }),
        ])

        return { sessions, total, page: input.page, totalPages: Math.ceil(total / input.perPage) }
      }

      if (user?.studentProfile) {
        const [sessions, total] = await Promise.all([
          ctx.prisma.bookingSession.findMany({
            where: { studentId: user.studentProfile.id, scheduledAt: { lt: now } },
            include: { counselor: { include: { user: true } } },
            orderBy: { scheduledAt: 'desc' },
            skip,
            take: input.perPage,
          }),
          ctx.prisma.bookingSession.count({
            where: { studentId: user.studentProfile.id, scheduledAt: { lt: now } },
          }),
        ])

        return { sessions, total, page: input.page, totalPages: Math.ceil(total / input.perPage) }
      }

      return { sessions: [], total: 0, page: input.page, totalPages: 0 }
    }),

  cancel: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getActor(ctx)

      const existing = await ctx.prisma.bookingSession.findUnique({
        where: { id: input.sessionId },
      })
      if (!existing) throw new Error('Session not found')

      const isOwner =
        (user?.studentProfile && existing.studentId === user.studentProfile.id) ||
        (user?.counselorProfile && existing.counselorId === user.counselorProfile.id)

      if (!isOwner) throw new Error('Unauthorized')

      return ctx.prisma.bookingSession.update({
        where: { id: input.sessionId },
        data: { status: SessionStatus.CANCELLED },
      })
    }),

  addNotes: counselorProcedure
    .input(z.object({ sessionId: z.string(), notes: z.string().nullable().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.bookingSession.update({
        where: { id: input.sessionId },
        data: { notes: input.notes },
      })
    }),

  rateSession: protectedProcedure
    .input(z.object({ sessionId: z.string(), rating: z.number().int().min(1).max(5) }))
    .mutation(async ({ ctx, input }) => {
      const user = await getActor(ctx)

      if (!user?.studentProfile) throw new Error('Student profile not found')

      const session = await ctx.prisma.bookingSession.findUnique({
        where: { id: input.sessionId },
      })
      if (!session || session.studentId !== user.studentProfile.id) {
        throw new Error('Session not found')
      }

      return ctx.prisma.bookingSession.update({
        where: { id: input.sessionId },
        data: { studentRating: input.rating },
      })
    }),

  getCalLink: protectedProcedure.query(async ({ ctx }) => {
    const student = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!student || !student.assignedCounselorId) {
      return { url: null }
    }

    const counselor = await ctx.prisma.counselorProfile.findUnique({
      where: { id: student.assignedCounselorId },
    })
    if (!counselor?.calUsername) {
      return { url: null }
    }

    const namespace = process.env.NEXT_PUBLIC_CAL_NAMESPACE || 'endow'
    return { url: `https://cal.com/${counselor.calUsername}/${namespace}` }
  }),
})
