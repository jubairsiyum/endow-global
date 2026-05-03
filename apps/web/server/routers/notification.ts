import { createTRPCRouter, protectedProcedure } from '../trpc'

export const notificationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.notification.findMany({
      where: { userId: ctx.session.user.id }
    })
  }),
})
