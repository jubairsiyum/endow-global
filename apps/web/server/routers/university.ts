import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { isMissingColumnError, isMissingTableError } from '@/server/utils/db-errors'
import { courses, schema, universities } from '@endow/db'
import {
  and as _and,
  asc as _asc,
  count as _count,
  desc as _desc,
  eq as _eq,
  inArray as _inArray,
  like as _like,
  or as _or,
  sql as _sql,
} from 'drizzle-orm'
import { z } from 'zod'

const eq = _eq as any
const inArray = _inArray as any
const and = _and as any
const or = _or as any
const like = _like as any
const sql = _sql as any
const desc = _desc as any
const asc = _asc as any
const count = _count as any

/**
 * University records store display names (for example, "South Korea"), while
 * public links intentionally use URL slugs (for example, "south-korea").
 * Normalize both forms before comparing so destination links work everywhere.
 */
function normalizeCountryFilter(value?: string) {
  const normalized = value?.trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')

  return normalized || undefined
}

function getIntakeFilter(intake: string | undefined | null) {
  if (!intake) return null
  const norm = intake.toLowerCase().trim()
  if (norm.includes('mar') || norm.includes('spring')) {
    return {
      name: 'March Intake',
      startMonths: [2, 3, 4],
      dlMonths: [11, 12, 1, 2],
      keywords: ['march', 'spring'],
    }
  }
  if (norm.includes('jun') || norm.includes('summer')) {
    return {
      name: 'June Intake',
      startMonths: [5, 6, 7],
      dlMonths: [3, 4],
      keywords: ['june', 'summer'],
    }
  }
  if (norm.includes('sep') || norm.includes('fall') || norm.includes('autumn')) {
    return {
      name: 'September Intake',
      startMonths: [8, 9, 10],
      dlMonths: [5, 6, 7],
      keywords: ['september', 'fall', 'autumn'],
    }
  }
  if (norm.includes('dec') || norm.includes('winter')) {
    return {
      name: 'December Intake',
      startMonths: [11, 12, 1],
      dlMonths: [8, 9, 10],
      keywords: ['december', 'winter'],
    }
  }
  return null
}

function pickBestDeadline(
  uniCourses: Array<{
    universityId: string
    applicationDeadline: Date | null
    startDate?: Date | null
  }>,
  intakeFilter?: { startMonths: number[]; dlMonths: number[]; keywords?: string[] } | null
): Map<string, string> {
  const deadlineMap = new Map<string, string>()
  const nowTime = Date.now()

  const byUni = new Map<string, typeof uniCourses>()
  for (const c of uniCourses) {
    if (!c.applicationDeadline) continue
    const list = byUni.get(c.universityId) || []
    list.push(c)
    byUni.set(c.universityId, list)
  }

  for (const [uniId, coursesList] of Array.from(byUni.entries())) {
    let candidates = coursesList
    if (intakeFilter) {
      const intakeMatches = coursesList.filter((c: any) => {
        const startM = c.startDate ? new Date(c.startDate).getMonth() + 1 : null
        const dlM = c.applicationDeadline ? new Date(c.applicationDeadline).getMonth() + 1 : null
        return (
          (startM !== null && intakeFilter.startMonths.includes(startM)) ||
          (dlM !== null && intakeFilter.dlMonths.includes(dlM))
        )
      })
      if (intakeMatches.length > 0) {
        candidates = intakeMatches
      }
    }

    let bestIso: string | null = null
    let bestTime = 0
    for (const c of candidates) {
      if (!c.applicationDeadline) continue
      const dTime = new Date(c.applicationDeadline).getTime()
      if (!bestIso) {
        bestIso = c.applicationDeadline.toISOString()
        bestTime = dTime
      } else if (bestTime < nowTime && dTime >= nowTime) {
        bestIso = c.applicationDeadline.toISOString()
        bestTime = dTime
      } else if (dTime >= nowTime && dTime < bestTime) {
        bestIso = c.applicationDeadline.toISOString()
        bestTime = dTime
      } else if (bestTime < nowTime && dTime < nowTime && dTime > bestTime) {
        bestIso = c.applicationDeadline.toISOString()
        bestTime = dTime
      }
    }

    if (bestIso) {
      deadlineMap.set(uniId, bestIso)
    }
  }

  return deadlineMap
}

export const universityRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
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
        sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`
      )
  }),
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        perPage: z.number().int().min(1).max(24).default(9),
        q: z.string().optional(),
        country: z.string().optional(),
        level: z.string().optional(),
        degree: z.string().optional(),
        intake: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, perPage } = input
      const offset = (page - 1) * perPage
      const conditions: any[] = [eq(universities.isActive, true)]

      const country = normalizeCountryFilter(input.country)

      if (country) {
        conditions.push(sql`LOWER(TRIM(${universities.country})) = ${country}`)
      }

      const rawLevel = (input.level || input.degree)?.trim().toUpperCase()
      const degreeAlias: Record<string, string> = {
        BACHELOR: 'UNDERGRADUATE',
        MASTER: 'POSTGRADUATE',
        PHD: 'PHD',
      }
      const normalizedLevel = rawLevel && (degreeAlias[rawLevel] || rawLevel)
      const validLevels = [
        'UNDERGRADUATE',
        'POSTGRADUATE',
        'PHD',
        'DIPLOMA',
        'CERTIFICATE',
        'FOUNDATION',
      ]
      const level =
        normalizedLevel && validLevels.includes(normalizedLevel) ? normalizedLevel : undefined
      const query = input.q?.trim()

      const intakeFilter = getIntakeFilter(input.intake)
      if (intakeFilter) {
        const parts = [
          sql`MONTH(${courses.startDate}) IN (${sql.raw(intakeFilter.startMonths.join(','))})`,
          sql`MONTH(${courses.applicationDeadline}) IN (${sql.raw(intakeFilter.dlMonths.join(','))})`,
        ]
        for (const kw of intakeFilter.keywords) {
          parts.push(sql`LOWER(${courses.name}) LIKE ${`%${kw}%`}`)
          parts.push(sql`LOWER(${courses.description}) LIKE ${`%${kw}%`}`)
        }
        conditions.push(
          sql`EXISTS (
            SELECT 1 FROM ${courses}
            WHERE ${courses.universityId} = ${universities.id}
              AND ${courses.isActive} = 1
              AND (${sql.join(parts, sql` OR `)})
          )` as any
        )
      }

      if (level) {
        conditions.push(
          sql`EXISTS (
            SELECT 1 FROM ${courses}
            WHERE ${courses.universityId} = ${universities.id}
              AND ${courses.isActive} = 1
              AND ${courses.level} = ${level}
          )` as any
        )
      }

      if (query) {
        const term = `%${query}%`
        const courseMatch = level
          ? (sql`EXISTS (
              SELECT 1 FROM ${courses}
              WHERE ${courses.universityId} = ${universities.id}
                AND ${courses.isActive} = 1
                AND ${courses.level} = ${level}
                AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term})
            )` as any)
          : (sql`EXISTS (
              SELECT 1 FROM ${courses}
              WHERE ${courses.universityId} = ${universities.id}
                AND ${courses.isActive} = 1
                AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term})
            )` as any)

        conditions.push(
          or(
            like(universities.name, term),
            like(universities.city, term),
            like(universities.country, term),
            courseMatch
          ) as any
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
            sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`
          )
          .limit(perPage)
          .offset(offset),
        ctx.db.select({ count: count() }).from(universities).where(where),
      ])

      const total = Number(countResult[0]?.count ?? 0)

      const uniIds = rows.map((r) => r.id)
      let deadlineMap = new Map<string, string>()

      if (uniIds.length > 0) {
        const uniCourses = await ctx.db
          .select({
            universityId: courses.universityId,
            applicationDeadline: courses.applicationDeadline,
            startDate: courses.startDate,
          })
          .from(courses)
          .where(
            and(
              inArray(courses.universityId, uniIds),
              eq(courses.isActive, true),
              sql`${courses.applicationDeadline} IS NOT NULL`
            )
          )

        deadlineMap = pickBestDeadline(uniCourses, intakeFilter)
      }

      const formattedRows = rows.map((r) => {
        const rawDl = deadlineMap.get(r.id)
        let deadline: string | null = null
        if (rawDl) {
          deadline = new Date(rawDl).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        }
        return {
          ...r,
          deadline,
        }
      })

      return {
        universities: formattedRows,
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
        intake: z.string().optional(),
        limit: z.number().min(1).max(50).default(24),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions: any[] = [eq(universities.isActive, true)]

      const country = normalizeCountryFilter(input.country)

      if (country) {
        conditions.push(sql`LOWER(TRIM(${universities.country})) = ${country}`)
      }

      const intakeFilter = getIntakeFilter(input.intake)
      if (intakeFilter) {
        const parts = [
          sql`MONTH(${courses.startDate}) IN (${sql.raw(intakeFilter.startMonths.join(','))})`,
          sql`MONTH(${courses.applicationDeadline}) IN (${sql.raw(intakeFilter.dlMonths.join(','))})`,
        ]
        for (const kw of intakeFilter.keywords) {
          parts.push(sql`LOWER(${courses.name}) LIKE ${`%${kw}%`}`)
          parts.push(sql`LOWER(${courses.description}) LIKE ${`%${kw}%`}`)
        }
        conditions.push(
          sql`EXISTS (
            SELECT 1 FROM ${courses}
            WHERE ${courses.universityId} = ${universities.id}
              AND ${courses.isActive} = 1
              AND (${sql.join(parts, sql` OR `)})
          )` as any
        )
      }

      const rawLevel = (input.level || (input as any).degree)?.trim().toUpperCase()
      // Map sticky-filter degree aliases (bachelor/master/phd) to course levels
      const degreeAlias: Record<string, string> = {
        BACHELOR: 'UNDERGRADUATE',
        MASTER: 'POSTGRADUATE',
        PHD: 'PHD',
      }
      const normalizedRaw = rawLevel && (degreeAlias[rawLevel] || rawLevel)
      const validLevels = [
        'UNDERGRADUATE',
        'POSTGRADUATE',
        'PHD',
        'DIPLOMA',
        'CERTIFICATE',
        'FOUNDATION',
      ] as const
      const level =
        normalizedRaw && (validLevels as readonly string[]).includes(normalizedRaw)
          ? normalizedRaw
          : undefined

      const q = input.q?.trim()
      if (level && q) {
        const term = `%${q}%`
        // Must have at least one course at this level
        conditions.push(
          sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND ${courses.level} = ${level})` as any
        )
        // q can match university fields OR a level-specific course
        conditions.push(
          or(
            like(universities.name, term),
            like(universities.city, term),
            like(universities.country, term),
            sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND ${courses.level} = ${level} AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term}))` as any
          ) as any
        )
      } else if (level) {
        conditions.push(
          sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND ${courses.level} = ${level})` as any
        )
      } else if (q) {
        const term = `%${q}%`
        conditions.push(
          or(
            like(universities.name, term),
            like(universities.city, term),
            like(universities.country, term),
            sql`EXISTS (SELECT 1 FROM ${courses} WHERE ${courses.universityId} = ${universities.id} AND ${courses.isActive} = 1 AND (${courses.name} LIKE ${term} OR ${courses.subject} LIKE ${term} OR ${courses.description} LIKE ${term}))` as any
          ) as any
        )
      }

      const searchRows = await ctx.db
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
          sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`
        )
        .limit(input.limit)

      const searchUniIds = searchRows.map((r) => r.id)
      let searchDeadlineMap = new Map<string, string>()

      if (searchUniIds.length > 0) {
        const uniCourses = await ctx.db
          .select({
            universityId: courses.universityId,
            applicationDeadline: courses.applicationDeadline,
            startDate: courses.startDate,
          })
          .from(courses)
          .where(
            and(
              inArray(courses.universityId, searchUniIds),
              eq(courses.isActive, true),
              sql`${courses.applicationDeadline} IS NOT NULL`
            )
          )

        searchDeadlineMap = pickBestDeadline(uniCourses, intakeFilter)
      }

      return searchRows.map((r) => {
        const rawDl = searchDeadlineMap.get(r.id)
        let deadline: string | null = null
        if (rawDl) {
          deadline = new Date(rawDl).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        }
        return {
          ...r,
          deadline,
        }
      })
    }),

  featured: publicProcedure.query(async ({ ctx }) => {
    const featRows = await ctx.db
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
        sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`
      )
      .limit(12)

    const featIds = featRows.map((r) => r.id)
    if (featIds.length === 0) return []

    const uniCourses = await ctx.db
      .select({
        universityId: courses.universityId,
        applicationDeadline: courses.applicationDeadline,
        startDate: courses.startDate,
      })
      .from(courses)
      .where(
        and(
          inArray(courses.universityId, featIds),
          eq(courses.isActive, true),
          sql`${courses.applicationDeadline} IS NOT NULL`
        )
      )

    const featDeadlineMap = pickBestDeadline(uniCourses)

    return featRows.map((r) => {
      const rawDl = featDeadlineMap.get(r.id)
      let deadline: string | null = null
      if (rawDl) {
        deadline = new Date(rawDl).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      }
      return {
        ...r,
        deadline,
      }
    })
  }),

  intakeOverview: publicProcedure.query(async ({ ctx }) => {
    const now = new Date()
    const currentYear = now.getFullYear()

    const activeCourses = await ctx.db
      .select({
        universityId: courses.universityId,
        name: courses.name,
        description: courses.description,
        startDate: courses.startDate,
        applicationDeadline: courses.applicationDeadline,
      })
      .from(courses)
      .where(eq(courses.isActive, true))

    const intakeDefs = [
      {
        key: 'march',
        season: 'March Intake',
        term: 'Spring',
        targetMonthName: 'March',
        startMonth: 3,
        startMonths: [2, 3, 4],
        dlMonths: [11, 12, 1, 2],
        keywords: ['march', 'spring'],
        defaultDlMonth: 11, // Dec
        defaultDlDay: 15,
        badge: 'Applications Open',
        color: 'bg-[#C41E3A]',
        bgColor: 'bg-rose-50',
      },
      {
        key: 'june',
        season: 'June Intake',
        term: 'Summer',
        targetMonthName: 'June',
        startMonth: 6,
        startMonths: [5, 6, 7],
        dlMonths: [3, 4],
        keywords: ['june', 'summer'],
        defaultDlMonth: 2, // March
        defaultDlDay: 31,
        badge: 'Open Now',
        color: 'bg-[#C41E3A]',
        bgColor: 'bg-rose-50',
      },
      {
        key: 'september',
        season: 'September Intake',
        term: 'Fall',
        targetMonthName: 'September',
        startMonth: 9,
        startMonths: [8, 9, 10],
        dlMonths: [5, 6, 7],
        keywords: ['september', 'fall', 'autumn'],
        defaultDlMonth: 5, // June
        defaultDlDay: 30,
        badge: 'Most Popular',
        color: 'bg-[#C41E3A]',
        bgColor: 'bg-rose-50',
      },
      {
        key: 'december',
        season: 'December Intake',
        term: 'Winter',
        targetMonthName: 'December',
        startMonth: 12,
        startMonths: [11, 12, 1],
        dlMonths: [8, 9, 10],
        keywords: ['december', 'winter'],
        defaultDlMonth: 8, // September
        defaultDlDay: 30,
        badge: 'Limited Seats',
        color: 'bg-[#C41E3A]',
        bgColor: 'bg-rose-50',
      },
    ]

    return intakeDefs.map((def) => {
      const matching = activeCourses.filter((c) => {
        const startM = c.startDate ? new Date(c.startDate).getMonth() + 1 : null
        const dlM = c.applicationDeadline ? new Date(c.applicationDeadline).getMonth() + 1 : null
        const nameLower = (c.name || '').toLowerCase()
        const descLower = (c.description || '').toLowerCase()
        const matchesStart = startM && def.startMonths.includes(startM)
        const matchesDl = dlM && def.dlMonths.includes(dlM)
        const matchesKeyword = def.keywords.some((kw) => nameLower.includes(kw) || descLower.includes(kw))
        return matchesStart || matchesDl || matchesKeyword
      })

      const uniqueUnis = new Set(matching.map((m) => m.universityId))
      const universityCount = uniqueUnis.size

      // Find future deadlines from matching courses
      const validFutureDeadlines = matching
        .map((m) => m.applicationDeadline)
        .filter((d): d is Date => Boolean(d))
        .map((d) => new Date(d))
        .filter((d) => d.getTime() > now.getTime())
        .sort((a, b) => a.getTime() - b.getTime())

      let deadline = validFutureDeadlines[0]

      if (!deadline) {
        let targetYear = currentYear
        const candidate = new Date(targetYear, def.defaultDlMonth, def.defaultDlDay, 23, 59, 59)
        if (candidate.getTime() <= now.getTime()) {
          targetYear += 1
        }
        deadline = new Date(targetYear, def.defaultDlMonth, def.defaultDlDay, 23, 59, 59)
      }

      const diffMs = deadline.getTime() - now.getTime()
      const daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))

      let intakeStartYear = deadline.getFullYear()
      if (def.key === 'march' && deadline.getMonth() >= 10) {
        intakeStartYear += 1
      }
      const monthLabel = `${def.targetMonthName} ${intakeStartYear}`

      let status = def.badge
      if (daysLeft < 30) {
        status = 'Closing Soon'
      } else if (daysLeft > 180) {
        status = 'Upcoming'
      }

      const deadlineStr = deadline.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

      return {
        key: def.key,
        season: def.season,
        term: def.term,
        month: monthLabel,
        deadline: deadlineStr,
        status,
        daysLeft,
        universityCount,
        color: def.color,
        bgColor: def.bgColor,
      }
    })
  }),

  stats: publicProcedure.query(async ({ ctx }) => {
    const [uniRes, courseRes, countryRes] = await Promise.all([
      ctx.db.select({ value: count() }).from(universities).where(eq(universities.isActive, true)),
      ctx.db.select({ value: count() }).from(courses).where(eq(courses.isActive, true)),
      ctx.db
        .select({ value: sql`COUNT(DISTINCT ${universities.country})` })
        .from(universities)
        .where(eq(universities.isActive, true)),
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

  byCountry: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
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
    const { countries: staticCountries, universities: staticUnis } =
      await import('@/lib/universities/data')
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

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
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

  upcomingDeadlines: publicProcedure.query(async ({ ctx }) => {
    try {
      // 1. Query courses joined with universities that have active deadlines
      const courseDeadlines = await ctx.db
        .select({
          courseId: courses.id,
          courseName: courses.name,
          deadline: courses.applicationDeadline,
          universityId: universities.id,
          universityName: universities.name,
          universitySlug: universities.slug,
          universityLogo: universities.logo,
          country: universities.country,
          city: universities.city,
        })
        .from(courses)
        .innerJoin(universities, eq(courses.universityId, universities.id))
        .where(
          and(
            eq(universities.isActive, true),
            eq(courses.isActive, true),
            sql`${courses.applicationDeadline} IS NOT NULL`
          )
        )
        .orderBy(asc(courses.applicationDeadline))
        .limit(20)

      if (courseDeadlines && courseDeadlines.length > 0) {
        // Deduplicate so each university only shows once with its nearest deadline
        const seenUni = new Set<string>()
        const formatted = []
        for (const row of courseDeadlines) {
          if (!seenUni.has(row.universityId) && row.deadline) {
            seenUni.add(row.universityId)
            formatted.push({
              id: row.courseId,
              universityId: row.universityId,
              universityName: row.universityName,
              universitySlug: row.universitySlug,
              universityLogo: row.universityLogo,
              country: row.country,
              city: row.city,
              courseName: row.courseName,
              deadline: row.deadline.toISOString(),
            })
          }
        }
        if (formatted.length > 0) {
          return formatted
        }
      }

      // 2. Query admin deadlines table
      const adminDeadlines = await ctx.db
        .select({
          id: schema.deadlines.id,
          title: schema.deadlines.title,
          dueAt: schema.deadlines.dueAt,
          relatedUniversity: schema.deadlines.relatedUniversity,
          relatedCourse: schema.deadlines.relatedCourse,
        })
        .from(schema.deadlines)
        .where(
          and(
            eq(schema.deadlines.isActive, true),
            sql`${schema.deadlines.relatedUniversity} IS NOT NULL`
          )
        )
        .orderBy(asc(schema.deadlines.dueAt))
        .limit(10)

      if (adminDeadlines && adminDeadlines.length > 0) {
        const uniList = await ctx.db
          .select({
            id: universities.id,
            name: universities.name,
            slug: universities.slug,
            logo: universities.logo,
            country: universities.country,
            city: universities.city,
          })
          .from(universities)
          .where(eq(universities.isActive, true))

        const uniMap = new Map(uniList.map((u) => [u.name.toLowerCase().trim(), u]))

        return adminDeadlines.map((d) => {
          const match = d.relatedUniversity ? uniMap.get(d.relatedUniversity.toLowerCase().trim()) : null
          return {
            id: d.id,
            universityId: match?.id || d.id,
            universityName: d.relatedUniversity || d.title,
            universitySlug: match?.slug || '',
            universityLogo: match?.logo || null,
            country: match?.country || 'South Korea',
            city: match?.city || '',
            courseName: d.relatedCourse || d.title,
            deadline: d.dueAt ? d.dueAt.toISOString() : null,
          }
        })
      }

      // 3. Query active universities from DB and generate realistic upcoming intake dates
      const activeUnis = await ctx.db
        .select({
          id: universities.id,
          name: universities.name,
          slug: universities.slug,
          logo: universities.logo,
          country: universities.country,
          city: universities.city,
        })
        .from(universities)
        .where(eq(universities.isActive, true))
        .orderBy(desc(universities.featured), sql`CAST(SUBSTRING_INDEX(${universities.ranking}, '-', 1) AS UNSIGNED)`)
        .limit(12)

      if (activeUnis && activeUnis.length > 0) {
        const now = new Date()
        const year = now.getFullYear()
        // Spring & Fall admission milestones
        const seasonalDeadlines = [
          new Date(year, 10, 30), // Nov 30
          new Date(year, 11, 15), // Dec 15
          new Date(year + 1, 0, 15), // Jan 15
          new Date(year + 1, 1, 28), // Feb 28
          new Date(year + 1, 2, 31), // Mar 31
          new Date(year + 1, 4, 31), // May 31
          new Date(year + 1, 5, 30), // Jun 30
        ]

        return activeUnis.map((u, idx) => ({
          id: u.id,
          universityId: u.id,
          universityName: u.name,
          universitySlug: u.slug,
          universityLogo: u.logo,
          country: u.country,
          city: u.city,
          courseName: 'Spring / Fall Intake',
          deadline: seasonalDeadlines[idx % seasonalDeadlines.length].toISOString(),
        }))
      }
    } catch (error) {
      console.error('Error querying upcomingDeadlines:', error)
    }

    // 4. Static fallback if database is empty/unreachable
    const { universities: staticUnis } = await import('@/lib/universities/data')
    return staticUnis.slice(0, 8).map((u, idx) => {
      const d = u.intakeDeadline ? new Date(u.intakeDeadline) : new Date(Date.now() + (idx + 1) * 7 * 86400000)
      return {
        id: u.id,
        universityId: u.id,
        universityName: u.name,
        universitySlug: u.id,
        universityLogo: u.logo,
        country: u.country,
        city: u.city,
        courseName: u.programs?.[0] || 'General Admission',
        deadline: d.toISOString(),
      }
    })
  }),
})
