import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { z } from 'zod'
import { eq as _eq, and as _and, sql as _sql, desc as _desc, count as _count } from 'drizzle-orm'
import { universities, courses } from '@endow/db'

const eq = _eq as any
const and = _and as any
const sql = _sql as any
const desc = _desc as any
const count = _count as any

export const universityRouter = createTRPCRouter({
  featured: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(universities)
      .where(eq(universities.isActive, true))
      .orderBy(desc(universities.featured), desc(universities.ranking))
      .limit(12)
  }),

  stats: publicProcedure.query(async ({ ctx }) => {
    const [uniRes, courseRes, countryRes] = await Promise.all([
      ctx.db.select({ value: count() }).from(universities).where(eq(universities.isActive, true)),
      ctx.db.select({ value: count() }).from(courses).where(eq(courses.isActive, true)),
      ctx.db.select({ value: sql`COUNT(DISTINCT ${universities.country})` }).from(universities).where(eq(universities.isActive, true)),
    ])
    return {
      universities: Number(uniRes[0]?.value ?? 0),
      courses: Number(courseRes[0]?.value ?? 0),
      countries: Number(countryRes[0]?.value ?? 0),
    }
  }),

  countries: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        country: universities.country,
        count: sql`COUNT(*)`,
      })
      .from(universities)
      .where(eq(universities.isActive, true))
      .groupBy(universities.country)
      .orderBy(sql`COUNT(*) DESC`)
  }),

  byCountry: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const countryName = input.slug.replace(/-/g, ' ')
      const unis = await ctx.db
        .select()
        .from(universities)
        .where(eq(universities.isActive, true))
      const matched = unis.filter((u) => u.country.toLowerCase() === countryName)
      if (!matched.length) return null
      return { country: matched[0].country, universities: matched }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const uni = await ctx.db
        .select()
        .from(universities)
        .where(eq(universities.slug, input.slug))
        .limit(1)
        .then((r) => r[0] || null)
      if (!uni) return null

      const uniCourses = await ctx.db
        .select()
        .from(courses)
        .where(and(eq(courses.universityId, uni.id), eq(courses.isActive, true)))
        .limit(20)

      return { ...uni, courses: uniCourses }
    }),
})
