import { createTRPCRouter, protectedProcedure } from '../trpc'

export const applicationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.application.findMany({
      where: { student: { userId: ctx.session.user.id } },
      include: { course: { include: { university: true } } }
    })
  }),
})
