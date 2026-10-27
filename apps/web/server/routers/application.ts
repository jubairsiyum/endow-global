import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { cleanCounselorNotes } from '@/lib/utils'
import { eq as _eq, desc as _desc, and as _and, or as _or } from 'drizzle-orm'
const eq = _eq as any
const desc = _desc as any
const and = _and as any
const or = _or as any
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authorizeApplicationAccess } from '../utils/authorizeApplicationAccess'
import { syncStudentInquiriesToApplications } from '../utils/syncStudentApplications'

export const applicationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    let profile = await ctx.db.query.studentProfiles.findFirst({
      where: (sp, { eq }) => eq(sp.userId, ctx.session.user.id),
    })

    // Automatically sync any submitted inquiries into applications
    const syncRes = await syncStudentInquiriesToApplications(ctx.db, ctx.session.user, profile)
    profile = syncRes.profile || profile

    if (!profile) return []

    const rows = await ctx.db
      .select({
        id: schema.applications.id,
        studentId: schema.applications.studentId,
        courseId: schema.applications.courseId,
        counselorId: schema.applications.counselorId,
        status: schema.applications.status,
        currentStep: schema.applications.currentStep,
        totalSteps: schema.applications.totalSteps,
        personalInfo: schema.applications.personalInfo,
        academicHistory: schema.applications.academicHistory,
        personalStatement: schema.applications.personalStatement,
        documentsUrls: schema.applications.documentsUrls,
        submittedAt: schema.applications.submittedAt,
        counselorNotes: schema.applications.counselorNotes,
        createdAt: schema.applications.createdAt,
        updatedAt: schema.applications.updatedAt,
        courseName: schema.courses.name,
        courseSlug: schema.courses.slug,
        courseLevel: schema.courses.level,
        courseSubject: schema.courses.subject,
        universityName: schema.universities.name,
        universityCountry: schema.universities.country,
        universityCity: schema.universities.city,
        universityLogo: schema.universities.logo,
      })
      .from(schema.applications)
      .leftJoin(schema.courses, eq(schema.courses.id, schema.applications.courseId))
      .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
      .where(eq(schema.applications.studentId, profile.id))
      .orderBy(desc(schema.applications.updatedAt))

    return rows.map((row: any) => ({
      ...row,
      counselorNotes: cleanCounselorNotes(row.counselorNotes),
      course: {
        id: row.courseId,
        name: row.courseName,
        slug: row.courseSlug,
        level: row.courseLevel,
        subject: row.courseSubject,
        university: {
          name: row.universityName,
          country: row.universityCountry,
          city: row.universityCity,
          logo: row.universityLogo,
        },
      },
    }))
  }),

  getById: protectedProcedure
    .input((val: any) => val)
    .query(async ({ ctx, input }) => {
      const { applicationId } = input
      if (!applicationId) throw new Error('BAD_REQUEST')
      const app = await authorizeApplicationAccess(ctx, applicationId, 'read')
      const result = await ctx.db.query.applications.findFirst({
        where: (a, { eq }) => eq(a.id, app.id),
        with: { course: { with: { university: true } } },
      })
      if (result) {
        return {
          ...result,
          counselorNotes: cleanCounselorNotes(result.counselorNotes),
        }
      }
      return null
    }),

  withdraw: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { applicationId } = input
      if (!applicationId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Application ID is required.',
        })
      }

      // Ensure application exists and belongs to current student/user
      const app = await authorizeApplicationAccess(ctx, applicationId, 'write')

      // Identify linked inquiry ID from personalInfo or counselorNotes
      let linkedInquiryId: string | null = null
      if (app.personalInfo) {
        try {
          const p =
            typeof app.personalInfo === 'string'
              ? JSON.parse(app.personalInfo)
              : app.personalInfo
          if (p?.inquiryId) linkedInquiryId = p.inquiryId
        } catch {}
      }
      if (!linkedInquiryId && app.counselorNotes && app.counselorNotes.includes('__inq_')) {
        const match = app.counselorNotes.match(/__inq_([a-zA-Z0-9-]+)/)
        if (match?.[1]) linkedInquiryId = match[1]
      }

      // If linked inquiry found by ID, delete it so it cannot recreate the application
      if (linkedInquiryId) {
        await ctx.db
          .delete(schema.studentInquiries)
          .where(eq(schema.studentInquiries.id, linkedInquiryId))
          .catch(() => {})
      }

      // Also clean up any inquiry from this student for this course to prevent sync recreation
      if (app.courseId && ctx.session.user.id) {
        const [course] = await ctx.db
          .select({ id: schema.courses.id, slug: schema.courses.slug, name: schema.courses.name })
          .from(schema.courses)
          .where(eq(schema.courses.id, app.courseId))
          .limit(1)

        if (course) {
          const courseFilters = []
          if (course.slug) courseFilters.push(eq(schema.studentInquiries.courseSlug, course.slug))
          if (course.name) courseFilters.push(eq(schema.studentInquiries.courseName, course.name))

          if (courseFilters.length > 0) {
            await ctx.db
              .delete(schema.studentInquiries)
              .where(
                and(
                  eq(schema.studentInquiries.userId, ctx.session.user.id),
                  or(...courseFilters)
                )
              )
              .catch(() => {})
          }
        }
      }

      // Delete documents linked specifically to this application
      await ctx.db
        .delete(schema.studentDocuments)
        .where(eq(schema.studentDocuments.applicationId, applicationId))
        .catch(() => {})

      // Delete the application row itself
      await ctx.db
        .delete(schema.applications)
        .where(eq(schema.applications.id, applicationId))

      return {
        success: true,
        message: 'Application has been successfully withdrawn and removed.',
      }
    }),
})
