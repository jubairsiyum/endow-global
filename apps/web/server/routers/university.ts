import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { z } from 'zod'
import { eq as _eq, and as _and, or as _or, like as _like, sql as _sql, desc as _desc, count as _count } from 'drizzle-orm'
import { universities, courses } from '@endow/db'

const eq = _eq as any
const and = _and as any
const or = _or as any
const like = _like as any
const sql = _sql as any
const desc = _desc as any
const count = _count as any

export const universityRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        country: z.string().optional(),
        limit: z.number().min(1).max(50).default(24),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions: any[] = [eq(universities.isActive, true)]

      if (input.country) {
        conditions.push(eq(universities.country, input.country))
      }

      if (input.q && input.q.trim()) {
        const term = `%${input.q.trim()}%`
        conditions.push(
          or(
            like(universities.name, term),
            like(universities.city, term),
            like(universities.country, term),
            sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term}))` as any,
          ) as any,
        )
      }

      return ctx.db
        .select()
        .from(universities)
        .where(and(...conditions))
        .orderBy(desc(universities.featured), desc(universities.ranking))
        .limit(input.limit)
    }),

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

      // Try DB first with case-insensitive match — select only the columns the
      // destination pages actually render to keep the payload small and fast.
      const unis = await ctx.db
        .select({
          id: universities.id,
          name: universities.name,
          slug: universities.slug,
          country: universities.country,
          city: universities.city,
          logo: universities.logo,
          coverImage: universities.coverImage,
          description: universities.description,
          ranking: universities.ranking,
        })
        .from(universities)
        .where(
          and(
            eq(universities.isActive, true),
            sql`LOWER(${universities.country}) = LOWER(${countryName})`
          )
        )
        .orderBy(universities.ranking)
        .limit(60)

      if (unis.length > 0) {
        return { country: unis[0].country, universities: unis }
      }

      // Fallback: check static data
      const { countries: staticCountries, universities: staticUnis } = await import('@/lib/universities/data')
      const staticCountry = staticCountries.find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
      )
      if (!staticCountry) return null

      const countryUnis = staticUnis.filter(
        (u) => u.country.toLowerCase() === countryName.toLowerCase()
      )
      return {
        country: staticCountry.name,
        universities: countryUnis.map((u) => ({
          ...u,
          slug: u.id,
          coverImage: u.banner,
        })),
      }
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
