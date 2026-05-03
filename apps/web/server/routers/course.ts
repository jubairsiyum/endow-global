import { z } from 'zod'
import { CourseLevel, type CourseSearchFilters } from '@endow/types'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { typesense, COURSES_COLLECTION } from '@/lib/typesense'

const searchSchema = z.object({
  query: z.string().optional(),
  country: z.array(z.string()).optional(),
  subject: z.array(z.string()).optional(),
  level: z.array(z.nativeEnum(CourseLevel)).optional(),
  minFee: z.number().optional(),
  maxFee: z.number().optional(),
  hasScholarship: z.boolean().optional(),
  language: z.array(z.string()).optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
})

export const courseRouter = createTRPCRouter({
  search: publicProcedure.input(searchSchema).query(async ({ input }) => {
    const filters: string[] = ['isActive:true']

    if (input.country?.length) {
      filters.push(`country:=[${input.country.join(',')}]`)
    }
    if (input.subject?.length) {
      filters.push(`subject:=[${input.subject.join(',')}]`)
    }
    if (input.level?.length) {
      filters.push(`level:=[${input.level.join(',')}]`)
    }
    if (input.language?.length) {
      filters.push(`language:=[${input.language.join(',')}]`)
    }
    if (input.minFee !== undefined) {
      filters.push(`tuitionFee:>=${input.minFee}`)
    }
    if (input.maxFee !== undefined) {
      filters.push(`tuitionFee:<=${input.maxFee}`)
    }
    if (input.hasScholarship === true) {
      filters.push('hasScholarship:true')
    }

    const page = input.page || 1
    const perPage = input.perPage || 12

    const results = await typesense.collections(COURSES_COLLECTION).documents().search({
      q: input.query || '*',
      query_by: 'name,subject,universityName,description',
      filter_by: filters.join(' && '),
      facet_by: 'country,subject,level,hasScholarship',
      sort_by: 'tuitionFee:asc',
      page,
      per_page: perPage,
    })

    const hits = results.hits?.map((hit: any) => hit.document) || []

    return {
      hits,
      total: results.found || 0,
      page: results.page || page,
      totalPages: Math.ceil((results.found || 0) / perPage),
    }
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.prisma.course.findUnique({
      where: { id: input.id },
      include: { university: true },
    })
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    return ctx.prisma.course.findUnique({
      where: { slug: input.slug },
      include: { university: true },
    })
  }),

  shortlist: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.studentProfile.findUnique({
        where: { userId: ctx.session.user.id },
      })
      if (!student) throw new Error('Student profile not found')

      const count = await ctx.prisma.shortlistedCourse.count({
        where: { studentId: student.id },
      })
      if (count >= 20) throw new Error('Shortlist limit reached')

      return ctx.prisma.shortlistedCourse.upsert({
        where: { studentId_courseId: { studentId: student.id, courseId: input.courseId } },
        update: {},
        create: { studentId: student.id, courseId: input.courseId },
      })
    }),

  removeShortlist: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.studentProfile.findUnique({
        where: { userId: ctx.session.user.id },
      })
      if (!student) throw new Error('Student profile not found')

      return ctx.prisma.shortlistedCourse.delete({
        where: { studentId_courseId: { studentId: student.id, courseId: input.courseId } },
      })
    }),

  getShortlist: protectedProcedure.query(async ({ ctx }) => {
    const student = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!student) throw new Error('Student profile not found')

    return ctx.prisma.shortlistedCourse.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          include: {
            university: true,
            applications: {
              where: { studentId: student.id },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  getComparison: protectedProcedure
    .input(z.object({ courseIds: z.array(z.string()).min(2).max(3) }))
    .query(async ({ ctx, input }) => {
      const courses = await ctx.prisma.course.findMany({
        where: { id: { in: input.courseIds } },
        include: { university: true },
      })
      const orderMap = new Map(input.courseIds.map((id, index) => [id, index]))
      return courses.sort((a, b) => (orderMap.get(a.id) || 0) - (orderMap.get(b.id) || 0))
    }),
})
