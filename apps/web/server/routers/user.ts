import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq } from 'drizzle-orm'

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.user.id),
      with: { studentProfile: true, counselorProfile: true },
    })
  }),
})
