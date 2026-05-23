import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq } from 'drizzle-orm'

export const sessionRouter = createTRPCRouter({
  getUpcoming: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.studentProfiles.findFirst({
      where: (sp, { eq }) => eq(sp.userId, ctx.session.user.id),
    })
    if (!profile) return []
    return ctx.db.query.bookingSessions.findMany({
      where: (bs, { eq }) => eq(bs.studentId, profile.id),
      limit: 5,
    })
  }),
})
