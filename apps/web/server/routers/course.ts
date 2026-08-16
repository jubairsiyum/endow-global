import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { z } from 'zod'
import {
  eq as _eq,
  and as _and,
  sql as _sql,
  desc as _desc,
  inArray as _inArray,
  gte as _gte,
  lte as _lte,
  lt as _lt,
  gt as _gt,
  or as _or,
} from 'drizzle-orm'
const eq = _eq as any
const and = _and as any
const sql = _sql as any
const desc = _desc as any
const inArray = _inArray as any
const gte = _gte as any
const lte = _lte as any
const lt = _lt as any
const gt = _gt as any
const or = _or as any
import { courses, universities, courseModules, platformCourseIntakes } from '@endow/db'

export const courseRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        countries: z.array(z.string()).optional(),
        cities: z.array(z.string()).optional(),
        institutionIds: z.array(z.string()).optional(),
        levels: z.array(z.string()).optional(),
        subjects: z.array(z.string()).optional(),
        expressOffer: z.boolean().optional(),
        englishWaiver: z.boolean().optional(),
        durations: z.array(z.string()).optional(),
        startYears: z.array(z.number()).optional(),
        feeMin: z.number().optional(),
        feeMax: z.number().optional(),
        hasScholarship: z.boolean().optional(),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(50).default(12),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const {
        query,
        countries,
        cities,
        institutionIds,
        levels,
        subjects,
        expressOffer,
        englishWaiver,
        durations,
        startYears,
        feeMin,
        feeMax,
        hasScholarship,
        page = 1,
        perPage = 12,
      } = input ?? {}

      try {
        const conditions = [eq(courses.isActive, true)]

        if (query) {
          conditions.push(
            sql`(${courses.name} LIKE ${'%' + query + '%'} OR ${courses.subject} LIKE ${'%' + query + '%'} OR ${courses.description} LIKE ${'%' + query + '%'})`
          )
        }
        if (countries && countries.length) {
          conditions.push(inArray(universities.country, countries))
        }
        if (cities && cities.length) {
          conditions.push(inArray(universities.city, cities))
        }
        if (institutionIds && institutionIds.length) {
          conditions.push(inArray(universities.id, institutionIds))
        }
        if (levels && levels.length) {
          conditions.push(inArray(courses.level, levels))
        }
        if (subjects && subjects.length) {
          conditions.push(inArray(courses.subject, subjects))
        }
        if (expressOffer) {
          conditions.push(eq(courses.expressOffer, true))
        }
        if (englishWaiver) {
          conditions.push(eq(courses.englishTestWaiver, true))
        }
        if (hasScholarship !== undefined) {
          conditions.push(eq(courses.hasScholarship, hasScholarship))
        }
        if (feeMin !== undefined) {
          conditions.push(gte(courses.tuitionFee, feeMin))
        }
        if (feeMax !== undefined) {
          conditions.push(lte(courses.tuitionFee, feeMax))
        }
        if (startYears && startYears.length) {
          conditions.push(inArray(sql`YEAR(${courses.startDate})`, startYears))
        }
        if (durations && durations.length) {
          const bucketConditions = durations
            .map((bucket) => {
              switch (bucket) {
                case 'lt1':
                  return lt(courses.duration, 1)
                case '1_2':
                  return and(gte(courses.duration, 1), lte(courses.duration, 2))
                case '2_3':
                  return and(gte(courses.duration, 2), lte(courses.duration, 3))
                case '3_4':
                  return and(gte(courses.duration, 3), lte(courses.duration, 4))
                case '4_5':
                  return and(gte(courses.duration, 4), lte(courses.duration, 5))
                case 'gt5':
                  return gt(courses.duration, 5)
                default:
                  return null
              }
            })
            .filter(Boolean)
          if (bucketConditions.length) {
            conditions.push(or(...bucketConditions))
          }
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
            .leftJoin(universities, eq(courses.universityId, universities.id))
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

  getFilterOptions: publicProcedure.query(async ({ ctx }) => {
    try {
      const [countryRows, cityRows, institutionRows, subjectRows, levelRows, yearRows, feeRow] = await Promise.all([
        ctx.db
          .selectDistinct({ country: universities.country })
          .from(universities)
          .where(eq(universities.isActive, true)),
        ctx.db
          .selectDistinct({ city: universities.city })
          .from(universities)
          .where(eq(universities.isActive, true)),
        ctx.db
          .selectDistinct({ id: universities.id, name: universities.name })
          .from(universities)
          .where(eq(universities.isActive, true)),
        ctx.db
          .selectDistinct({ subject: courses.subject })
          .from(courses)
          .where(eq(courses.isActive, true)),
        ctx.db
          .selectDistinct({ level: courses.level })
          .from(courses)
          .where(eq(courses.isActive, true)),
        ctx.db
          .selectDistinct({ year: sql<number>`YEAR(${courses.startDate})` })
          .from(courses)
          .where(and(eq(courses.isActive, true), sql`${courses.startDate} IS NOT NULL`)),
        ctx.db
          .select({ max: sql<number>`COALESCE(MAX(${courses.tuitionFee}), 0)` })
          .from(courses)
          .where(eq(courses.isActive, true)),
      ])

      return {
        countries: countryRows
          .map((r) => r.country)
          .filter((c): c is string => Boolean(c))
          .sort((a, b) => a.localeCompare(b)),
        cities: cityRows
          .map((r) => r.city)
          .filter((c): c is string => Boolean(c))
          .sort((a, b) => a.localeCompare(b)),
        institutions: institutionRows
          .map((r) => ({ id: r.id, name: r.name }))
          .sort((a, b) => a.name.localeCompare(b.name)),
        subjects: subjectRows
          .map((r) => r.subject)
          .filter((s): s is string => Boolean(s))
          .sort((a, b) => a.localeCompare(b)),
        levels: levelRows.map((r) => r.level as string),
        startYears: yearRows
          .map((r) => r.year)
          .filter((y) => Number.isFinite(y))
          .sort((a, b) => a - b),
        feeMax: Number(feeRow[0]?.max ?? 0),
      }
    } catch {
      return { countries: [], cities: [], institutions: [], subjects: [], levels: [], startYears: [], feeMax: 0 }
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
