import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'

export const sessionRouter = createTRPCRouter({
  getUpcoming: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.bookingSession.findMany({
      where: { student: { userId: ctx.session.user.id } },
      take: 5
    })
  }),
})
