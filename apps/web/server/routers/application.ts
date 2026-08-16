import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq, desc as _desc } from 'drizzle-orm'
const eq = _eq as any
const desc = _desc as any
import { authorizeApplicationAccess } from '../utils/authorizeApplicationAccess'

export const applicationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.studentProfiles.findFirst({
      where: (sp, { eq }) => eq(sp.userId, ctx.session.user.id),
    })
    if (!profile) return []
    const rows = await ctx.db.select({
      id: schema.applications.id,
      studentId: schema.applications.studentId,
      courseId: schema.applications.courseId,
      counselorId: schema.applications.counselorId,
      status: schema.applications.status,
      currentStep: schema.applications.currentStep,
      totalSteps: schema.applications.totalSteps,
      personalStatement: schema.applications.personalStatement,
      documentsUrls: schema.applications.documentsUrls,
      submittedAt: schema.applications.submittedAt,
      counselorNotes: schema.applications.counselorNotes,
      createdAt: schema.applications.createdAt,
      updatedAt: schema.applications.updatedAt,
      courseName: schema.courses.name,
      courseSlug: schema.courses.slug,
      universityName: schema.universities.name,
      universityCountry: schema.universities.country,
    }).from(schema.applications)
      .leftJoin(schema.courses, eq(schema.courses.id, schema.applications.courseId))
      .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
      .where(eq(schema.applications.studentId, profile.id))
      .orderBy(desc(schema.applications.updatedAt))
    return rows.map((row: any) => ({ ...row, course: { name: row.courseName, slug: row.courseSlug, university: { name: row.universityName, country: row.universityCountry } } }))
  }),

  getById: protectedProcedure
    .input((val: any) => val)
    .query(async ({ ctx, input }) => {
      const { applicationId } = input
      if (!applicationId) throw new Error('BAD_REQUEST')
      const app = await authorizeApplicationAccess(ctx, applicationId, 'read')
      return ctx.db.query.applications.findFirst({
        where: (a, { eq }) => eq(a.id, app.id),
        with: { course: { with: { university: true } } },
      })
    }),
})
