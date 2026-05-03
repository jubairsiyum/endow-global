import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { studentProfile: true, counselorProfile: true }
    })
  }),
})
