import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { z } from 'zod'
import { eq as _eq, and as _and, like as _like, sql as _sql, desc as _desc } from 'drizzle-orm'
const eq = _eq as any
const and = _and as any
const like = _like as any
const sql = _sql as any
const desc = _desc as any
import { courses, universities, courseModules, platformCourseIntakes } from '@endow/db'

export const courseRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        subject: z.string().optional(),
        level: z.string().optional(),
        country: z.string().optional(),
        hasScholarship: z.boolean().optional(),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(50).default(12),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { query, subject, level, country, hasScholarship, page = 1, perPage = 12 } = input ?? {}

      try {
        const conditions = [eq(courses.isActive, true)]

        if (query) {
          conditions.push(
            sql`(${courses.name} LIKE ${'%' + query + '%'} OR ${courses.subject} LIKE ${'%' + query + '%'} OR ${courses.description} LIKE ${'%' + query + '%'})`
          )
        }
        if (subject) {
          conditions.push(eq(courses.subject, subject))
        }
        if (level) {
          conditions.push(eq(courses.level, level as any))
        }
        if (hasScholarship !== undefined) {
          conditions.push(eq(courses.hasScholarship, hasScholarship))
        }

        const where = and(...conditions)

        const offset = (page - 1) * perPage

        const [results, countResult] = await Promise.all([
          ctx.db
            .select({
              id: courses.id,
              name: courses.name,
              slug: courses.slug,
              subject: courses.subject,
              level: courses.level,
              duration: courses.duration,
              durationUnit: courses.durationUnit,
              tuitionFee: courses.tuitionFee,
              currency: courses.currency,
              language: courses.language,
              hasScholarship: courses.hasScholarship,
              scholarshipDetails: courses.scholarshipDetails,
              description: courses.description,
              universityId: courses.universityId,
              universityName: universities.name,
              universitySlug: universities.slug,
              universityCountry: universities.country,
              universityCity: universities.city,
              universityLogo: universities.logo,
            })
            .from(courses)
            .leftJoin(universities, eq(courses.universityId, universities.id))
            .where(where)
            .orderBy(desc(courses.createdAt))
            .limit(perPage)
            .offset(offset),
          ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(courses)
            .where(where),
        ])

        const total = Number(countResult[0]?.count ?? 0)
        const totalPages = Math.ceil(total / perPage)

        return {
          hits: results,
          total,
          page,
          totalPages,
        }
      } catch {
        return { hits: [], total: 0, page, totalPages: 0 }
      }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .select({
            id: courses.id,
            name: courses.name,
            slug: courses.slug,
            subject: courses.subject,
            level: courses.level,
            duration: courses.duration,
            durationUnit: courses.durationUnit,
            tuitionFee: courses.tuitionFee,
            currency: courses.currency,
            applicationDeadline: courses.applicationDeadline,
            startDate: courses.startDate,
            language: courses.language,
            requirements: courses.requirements,
            hasScholarship: courses.hasScholarship,
            scholarshipDetails: courses.scholarshipDetails,
            description: courses.description,
            campus: courses.campus,
            modeOfStudy: courses.modeOfStudy,
            highlights: courses.highlights,
            professionalAccreditation: courses.professionalAccreditation,
            offerResponseTime: courses.offerResponseTime,
            backlogsAccepted: courses.backlogsAccepted,
            gapYearsAccepted: courses.gapYearsAccepted,
            englishTestWaiver: courses.englishTestWaiver,
            expressOffer: courses.expressOffer,
            applicationFee: courses.applicationFee,
            brochureUrl: courses.brochureUrl,
            universityId: courses.universityId,
            universityName: universities.name,
            universitySlug: universities.slug,
            universityCountry: universities.country,
            universityCity: universities.city,
            universityLogo: universities.logo,
            universityCoverImage: universities.coverImage,
            universityDescription: universities.description,
            universityRanking: universities.ranking,
            universityWebsite: universities.website,
            universityEstablished: universities.established,
            universityTotalStudents: universities.totalStudents,
            universityInternationalPercent: universities.internationalPercent,
          })
          .from(courses)
          .leftJoin(universities, eq(courses.universityId, universities.id))
          .where(and(eq(courses.slug, input.slug), eq(courses.isActive, true)))
          .limit(1)

        if (!result[0]) return null
        const courseData = result[0] as any

        // Parse JSON fields that may come as strings from MySQL
        ;['highlights', 'requirements'].forEach((k) => {
          if (typeof courseData[k] === 'string') {
            try { courseData[k] = JSON.parse(courseData[k]) } catch {}
          }
        })

        let modules: any[] = []; let intakes: any[] = []
        try {
          const [m, i] = await Promise.all([
            ctx.db.select().from(courseModules).where(eq(courseModules.courseId, courseData.id)),
            ctx.db.select().from(platformCourseIntakes).where(eq(platformCourseIntakes.courseId, courseData.id)),
          ])
          modules = m || []; intakes = i || []
        } catch {}

        return { ...courseData, modules, intakes }
      } catch {
        return null
      }
    }),

  getSubjects: publicProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.db
        .selectDistinct({ subject: courses.subject })
        .from(courses)
        .where(eq(courses.isActive, true))

      return result.map((r) => r.subject)
    } catch {
      return []
    }
  }),

  getLevels: publicProcedure.query(() => {
    return ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']
  }),
})
