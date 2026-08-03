import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq } from 'drizzle-orm'
const eq = _eq as any

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
