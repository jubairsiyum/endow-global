import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq } from 'drizzle-orm'
import { authorizeApplicationAccess } from '../utils/authorizeApplicationAccess'

export const applicationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.studentProfiles.findFirst({
      where: (sp, { eq }) => eq(sp.userId, ctx.session.user.id),
    })
    if (!profile) return []
    return ctx.db.query.applications.findMany({
      where: (a, { eq }) => eq(a.studentId, profile.id),
      with: { course: { with: { university: true } } },
    })
  }),

  getById: protectedProcedure.input((val: any) => val).query(async ({ ctx, input }) => {
    const { applicationId } = input
    if (!applicationId) throw new Error('BAD_REQUEST')
    const app = await authorizeApplicationAccess(ctx, applicationId, 'read')
    return ctx.db.query.applications.findFirst({ where: (a, { eq }) => eq(a.id, app.id), with: { course: { with: { university: true } } } })
  }),
})
