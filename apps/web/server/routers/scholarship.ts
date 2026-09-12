import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { z } from 'zod'
import { eq, asc, and, like, sql } from 'drizzle-orm'

const eqAny = eq as unknown as (...args: unknown[]) => unknown
const ascAny = asc as unknown as (col: unknown) => unknown
const andAny = and as unknown as (...args: unknown[]) => unknown
const likeAny = like as unknown as (...args: unknown[]) => unknown

export const scholarshipRouter = createTRPCRouter({
  featured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(12).default(6) }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit ?? 6

      try {
        const rows = await db
          .select({
            id: schema.scholarships.id,
            name: schema.scholarships.name,
            description: schema.scholarships.description,
            amount: schema.scholarships.amount,
            currencySymbol: schema.currencies.symbol,
            coverageType: schema.scholarships.coverageType,
            eligibility: schema.scholarships.eligibility,
            deadline: schema.scholarships.deadline,
            linkUrl: schema.scholarships.linkUrl,
            universityName: schema.catalogUniversities.name,
            universityCity: schema.catalogUniversities.city,
            universityLogo: schema.catalogUniversities.logoUrl,
            universitySlug: schema.catalogUniversities.slug,
            universityWebsite: schema.catalogUniversities.websiteUrl,
            country: schema.countries.name,
          })
          .from(schema.scholarships)
          .leftJoin(schema.catalogUniversities, eqAny(schema.scholarships.universityId, schema.catalogUniversities.id) as never)
          .leftJoin(schema.countries, eqAny(schema.catalogUniversities.countryCode, schema.countries.code) as never)
          .leftJoin(schema.currencies, eqAny(schema.scholarships.currencyCode, schema.currencies.code) as never)
          .where(eqAny(schema.scholarships.isActive, true) as never)
          .orderBy(ascAny(schema.scholarships.name) as never)
          .limit(limit)

        return rows.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description ?? null,
          amount: s.amount ?? null,
          currencySymbol: s.currencySymbol ?? '$',
          coverageType: s.coverageType ?? 'partial',
          eligibility: s.eligibility ?? null,
          deadline: s.deadline ?? null,
          linkUrl: s.linkUrl ?? null,
          universityName: s.universityName ?? null,
          universityCity: s.universityCity ?? null,
          universityLogo: s.universityLogo ?? null,
          universitySlug: s.universitySlug ?? null,
          universityWebsite: s.universityWebsite ?? null,
          country: s.country ?? null,
        }))
      } catch (e) {
        console.error('[scholarship.featured] query failed:', e)
        return []
      }
    }),

  list: publicProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          perPage: z.number().min(1).max(24).default(9),
          search: z.string().optional(),
          coverageType: z.enum(['full', 'partial', 'tuition_only', 'living_only']).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const perPage = input?.perPage ?? 9
      const offset = (page - 1) * perPage

      try {
        const conditions: unknown[] = [eqAny(schema.scholarships.isActive, true) as never]
        if (input?.search) {
          conditions.push(likeAny(schema.scholarships.name, `%${input.search}%`) as never)
        }
        if (input?.coverageType) {
          conditions.push(eqAny(schema.scholarships.coverageType, input.coverageType) as never)
        }
        const whereClause = conditions.length ? (andAny(...(conditions as never[])) as never) : undefined

        const [{ total }] = await db
          .select({ total: sql`count(*)` } as never)
          .from(schema.scholarships)
          .where(whereClause as never) as unknown as { total: number }[]

        const rows = await db
          .select({
            id: schema.scholarships.id,
            name: schema.scholarships.name,
            description: schema.scholarships.description,
            amount: schema.scholarships.amount,
            currencySymbol: schema.currencies.symbol,
            coverageType: schema.scholarships.coverageType,
            eligibility: schema.scholarships.eligibility,
            deadline: schema.scholarships.deadline,
            linkUrl: schema.scholarships.linkUrl,
            universityName: schema.catalogUniversities.name,
            universityCity: schema.catalogUniversities.city,
            universityLogo: schema.catalogUniversities.logoUrl,
            universitySlug: schema.catalogUniversities.slug,
            universityWebsite: schema.catalogUniversities.websiteUrl,
            country: schema.countries.name,
          })
          .from(schema.scholarships)
          .leftJoin(schema.catalogUniversities, eqAny(schema.scholarships.universityId, schema.catalogUniversities.id) as never)
          .leftJoin(schema.countries, eqAny(schema.catalogUniversities.countryCode, schema.countries.code) as never)
          .leftJoin(schema.currencies, eqAny(schema.scholarships.currencyCode, schema.currencies.code) as never)
          .where(whereClause as never)
          .orderBy(ascAny(schema.scholarships.name) as never)
          .limit(perPage)
          .offset(offset)

        const items = rows.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description ?? null,
          amount: s.amount ?? null,
          currencySymbol: s.currencySymbol ?? '$',
          coverageType: s.coverageType ?? 'partial',
          eligibility: s.eligibility ?? null,
          deadline: s.deadline ?? null,
          linkUrl: s.linkUrl ?? null,
          universityName: s.universityName ?? null,
          universityCity: s.universityCity ?? null,
          universityLogo: s.universityLogo ?? null,
          universitySlug: s.universitySlug ?? null,
          universityWebsite: s.universityWebsite ?? null,
          country: s.country ?? null,
        }))

        const totalNum = Number(total ?? 0)
        return {
          items,
          total: totalNum,
          page,
          perPage,
          totalPages: Math.max(1, Math.ceil(totalNum / perPage)),
        }
      } catch (e) {
        console.error('[scholarship.list] query failed:', e)
        return { items: [], total: 0, page, perPage, totalPages: 1 }
      }
    }),
})
