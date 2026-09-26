import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { z } from 'zod'
import { eq as _eq, and as _and, or as _or, like as _like, sql as _sql, desc as _desc, count as _count } from 'drizzle-orm'
import { schema, universities, courses } from '@endow/db'
import { isMissingColumnError, isMissingTableError } from '@/server/utils/db-errors'

const eq = _eq as any
const and = _and as any
const or = _or as any
const like = _like as any
const sql = _sql as any
const desc = _desc as any
const count = _count as any

export const universityRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        perPage: z.number().int().min(1).max(24).default(9),
        q: z.string().optional(),
        country: z.string().optional(),
        level: z.string().optional(),
        degree: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, perPage } = input
      const offset = (page - 1) * perPage
      const conditions: any[] = [eq(universities.isActive, true)]

      if (input.country?.trim()) {
        conditions.push(sql`LOWER(${universities.country}) = LOWER(${input.country.trim()})`)
      }

      const rawLevel = (input.level || input.degree)?.trim().toUpperCase()
      const degreeAlias: Record<string, string> = {
        BACHELOR: 'UNDERGRADUATE',
        MASTER: 'POSTGRADUATE',
        PHD: 'PHD',
      }
      const normalizedLevel = rawLevel && (degreeAlias[rawLevel] || rawLevel)
      const validLevels = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']
      const level = normalizedLevel && validLevels.includes(normalizedLevel) ? normalizedLevel : undefined
      const query = input.q?.trim()

      if (level) {
        conditions.push(
          sql`EXISTS (
            SELECT 1 FROM ${courses}
            WHERE ${courses.universityId} = ${universities.id}
              AND ${courses.isActive} = 1
              AND ${courses.level} = ${level}
          )` as any,
        )
      }

      if (query) {
        const term = `%${query}%`
        const courseMatch = level
          ? sql`EXISTS (
              SELECT 1 FROM ${courses}
              WHERE ${courses.universityId} = ${universities.id}
                AND ${courses.isActive} = 1
                AND ${courses.level} = ${level}
                AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term})
            )` as any
          : sql`EXISTS (
              SELECT 1 FROM ${courses}
              WHERE ${courses.universityId} = ${universities.id}
                AND ${courses.isActive} = 1
                AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term})
            )` as any

        conditions.push(
          or(
            like(universities.name, term),
            like(universities.city, term),
            like(universities.country, term),
            courseMatch,
          ) as any,
        )
      }

      const where = and(...conditions)
      const [rows, countResult] = await Promise.all([
        ctx.db
          .select({
            id: universities.id,
            name: universities.name,
            slug: universities.slug,
            country: universities.country,
            city: universities.city,
            logo: universities.logo,
            description: universities.description,
            ranking: universities.ranking,
          })
          .from(universities)
          .where(where)
          .orderBy(
            desc(universities.featured),
            sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`,
          )
          .limit(perPage)
          .offset(offset),
        ctx.db.select({ count: count() }).from(universities).where(where),
      ])

      const total = Number(countResult[0]?.count ?? 0)

      return {
        universities: rows,
        total,
        page,
        perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      }
    }),

  search: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        country: z.string().optional(),
        level: z.string().optional(),
        degree: z.string().optional(),
        limit: z.number().min(1).max(50).default(24),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions: any[] = [eq(universities.isActive, true)]

      if (input.country) {
        const c = input.country.trim()
        if (c) conditions.push(sql`LOWER(${universities.country}) = LOWER(${c})`)
      }

      const rawLevel = (input.level || (input as any).degree)?.trim().toUpperCase()
      // Map sticky-filter degree aliases (bachelor/master/phd) to course levels
      const degreeAlias: Record<string, string> = { BACHELOR: 'UNDERGRADUATE', MASTER: 'POSTGRADUATE', PHD: 'PHD' }
      const normalizedRaw = rawLevel && (degreeAlias[rawLevel] || rawLevel)
      const validLevels = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION'] as const
      const level = normalizedRaw && (validLevels as readonly string[]).includes(normalizedRaw) ? normalizedRaw : undefined

      const q = input.q?.trim()
      if (level && q) {
        const term = `%${q}%`
        // Must have at least one course at this level
        conditions.push(sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND ${courses.level} = ${level})` as any)
        // q can match university fields OR a level-specific course
        conditions.push(
          or(
            like(universities.name, term),
            like(universities.city, term),
            like(universities.country, term),
            sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND ${courses.level} = ${level} AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term}))` as any,
          ) as any,
        )
      } else if (level) {
        conditions.push(sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND ${courses.level} = ${level})` as any)
      } else if (q) {
        const term = `%${q}%`
        conditions.push(
          or(
            like(universities.name, term),
            like(universities.city, term),
            like(universities.country, term),
            sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term}))` as any,
          ) as any,
        )
      }

      return ctx.db
        .select({
          id: universities.id,
          name: universities.name,
          slug: universities.slug,
          country: universities.country,
          city: universities.city,
          logo: universities.logo,
          description: universities.description,
          ranking: universities.ranking,
        })
        .from(universities)
        .where(and(...conditions))
        .orderBy(
          desc(universities.featured),
          sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`,
        )
        .limit(input.limit)
    }),

  featured: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: universities.id,
        name: universities.name,
        slug: universities.slug,
        country: universities.country,
        city: universities.city,
        logo: universities.logo,
        description: universities.description,
        ranking: universities.ranking,
      })
      .from(universities)
      .where(eq(universities.isActive, true))
      .orderBy(
        desc(universities.featured),
        sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`,
      )
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

  heroImages: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db
        .select({
          id: schema.homepageHeroImages.id,
          imageUrl: schema.homepageHeroImages.imageUrl,
          altText: schema.homepageHeroImages.altText,
        })
        .from(schema.homepageHeroImages)
        .where(eq(schema.homepageHeroImages.isActive, true))
        .orderBy(schema.homepageHeroImages.sortOrder, schema.homepageHeroImages.createdAt)
        .limit(12)
    } catch (error) {
      // Keep the homepage on its built-in image fallback until the migration
      // has been applied to an existing production database.
      if (isMissingTableError(error)) return []
      throw error
    }
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
        .orderBy(sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`)
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
      let uni: any
      try {
        uni = await ctx.db
          .select()
          .from(universities)
          .where(eq(universities.slug, input.slug))
          .limit(1)
          .then((r) => r[0] || null)
      } catch (error) {
        if (!isMissingColumnError(error)) throw error

        const legacyResult = await ctx.db
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
            website: universities.website,
            established: universities.established,
            totalStudents: universities.totalStudents,
            accreditation: universities.accreditation,
            rankings: universities.rankings,
            featured: universities.featured,
            isActive: universities.isActive,
          })
          .from(universities)
          .where(eq(universities.slug, input.slug))
          .limit(1)

        uni = legacyResult[0]
          ? { ...legacyResult[0], koreaRanking: null, internationalStudents: null }
          : null
      }
      if (!uni) return null

      const uniCourses = await ctx.db
        .select()
        .from(courses)
        .where(and(eq(courses.universityId, uni.id), eq(courses.isActive, true)))
        .limit(20)

      return { ...uni, courses: uniCourses }
    }),
})
