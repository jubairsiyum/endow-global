import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq } from 'drizzle-orm'
const eq = _eq as any

export const notificationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.notifications.findMany({
      where: (n, { eq }) => eq(n.userId, ctx.session.user.id),
    })
  }),
})
