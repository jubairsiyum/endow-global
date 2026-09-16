import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq, and as _and } from 'drizzle-orm'
const eq = _eq as any
const and = _and as any

export const notificationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.notifications.findMany({
      where: (n, { eq }) => eq(n.userId, ctx.session.user.id),
      orderBy: (n, { desc }) => [desc(n.createdAt)],
      limit: 20,
    })
  }),
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.notifications.findMany({
      where: (n, { eq }) => eq(n.userId, ctx.session.user.id),
      columns: { isRead: true },
    })
    return rows.filter((notification) => !notification.isRead).length
  }),
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(schema.notifications)
      .set({ isRead: true })
      .where(and(eq(schema.notifications.userId, ctx.session.user.id), eq(schema.notifications.isRead, false)))
    return { success: true }
  }),
})
