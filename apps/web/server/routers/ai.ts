import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { embedStudentProfile } from '@endow/ai-worker/src/embed-profile'

export const aiRouter = createTRPCRouter({
  getMatches: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!profile) throw new Error('Student profile not found')

    return ctx.prisma.matchResult.findMany({
      where: { studentId: profile.id },
      include: { course: { include: { university: true } } },
      orderBy: { score: 'desc' },
    })
  }),

  refreshMatches: protectedProcedure.mutation(async ({ ctx }) => {
    const profile = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!profile) throw new Error('Student profile not found')

    if (profile.matchesUpdatedAt) {
      const hoursSince = (Date.now() - profile.matchesUpdatedAt.getTime()) / 3600000
      if (hoursSince < 24) {
        return { cached: true, message: 'Matches are up to date' }
      }
    }

    await embedStudentProfile(profile.id)
    return { success: true }
  }),

  getChatHistory: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.chatHistory.findUnique({
        where: { sessionId: input.sessionId },
      })
    }),
})
