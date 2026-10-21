import { z } from 'zod'
import { createTRPCRouter, adminWithPermission, publicProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq as _eq, desc as _desc, and as _and, or as _or, like as _like, count as _count, sql } from 'drizzle-orm'

const eq = _eq as any
const desc = _desc as any
const and = _and as any
const or = _or as any
const like = _like as any
const count = _count as any

const safeUrlSchema = z.string().trim().refine((val) => {
  if (!val) return true
  if (val.startsWith('/')) return true
  try {
    new URL(val)
    return true
  } catch {
    return false
  }
}, { message: "Must be a valid URL or relative path (e.g., /uploads/...)" }).optional().nullable()

const resourceInput = z.object({
  type: z.enum(['BLOG', 'FILE']),
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().optional().nullable(),
  content: z.string().trim().optional().nullable(),
  coverImage: safeUrlSchema,
  category: z.string().trim().optional().nullable(),
  section: z.string().trim().optional().nullable(),
  tags: z.array(z.string().trim()).default([]),
  author: z.string().trim().optional().nullable(),
  fileUrl: safeUrlSchema,
  fileName: z.string().trim().optional().nullable(),
  mimeType: z.string().trim().optional().nullable(),
  fileSize: z.number().int().min(0).optional().nullable(),
  isPublished: z.boolean().default(false),
  publishedAt: z.date().optional().nullable(),
  deadline: z.date().optional().nullable(),
  metaTitle: z.string().trim().optional().nullable(),
  metaDescription: z.string().trim().optional().nullable(),
  keywords: z.array(z.string().trim()).default([]),
  canonicalUrl: safeUrlSchema,
  ogImageUrl: safeUrlSchema,
  noIndex: z.boolean().default(false),
  featured: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (data.isPublished) {
    if (!data.coverImage) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cover image is required to publish", path: ['coverImage'] })
    }
    if (data.type === 'BLOG' && !data.content) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Content is required to publish a blog", path: ['content'] })
    }
    if (data.type === 'FILE' && !data.fileUrl) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File URL is required to publish a file", path: ['fileUrl'] })
    }
  }
})

export const resourceRouter = createTRPCRouter({
  published: createTRPCRouter({
    blogs: publicProcedure.query(async () => {
      return db
        .select()
        .from(schema.resources)
        .where(and(eq(schema.resources.type, 'BLOG'), eq(schema.resources.isPublished, true)))
        .orderBy(desc(schema.resources.publishedAt))
    }),

    blogBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const row = await db
          .select()
          .from(schema.resources)
          .where(
            and(
              eq(schema.resources.type, 'BLOG'),
              eq(schema.resources.slug, input.slug),
              eq(schema.resources.isPublished, true)
            )
          )
          .limit(1)
          .then((r) => r[0] || null)
        return row
      }),

    incrementView: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        await db
          .update(schema.resources)
          .set({
            viewCount: sql`${schema.resources.viewCount} + 1` as any,
          })
          .where(and(eq(schema.resources.type, 'BLOG'), eq(schema.resources.slug, input.slug)))
        return { success: true }
      }),

    files: publicProcedure.query(async () => {
      return db
        .select()
        .from(schema.resources)
        .where(and(eq(schema.resources.type, 'FILE'), eq(schema.resources.isPublished, true)))
        .orderBy(desc(schema.resources.publishedAt))
    }),

    opportunityHub: publicProcedure.query(async () => {
      const dbScholarships = await db
        .select({
          id: schema.scholarships.id,
          name: schema.scholarships.name,
          description: schema.scholarships.description,
          deadline: schema.scholarships.deadline,
          coverageType: schema.scholarships.coverageType,
          linkUrl: schema.scholarships.linkUrl,
        })
        .from(schema.scholarships)
        .where(eq(schema.scholarships.isActive, true))
        .orderBy(desc(schema.scholarships.id))
        .limit(4)

      const dbOpportunities = await db
        .select({
          id: schema.resources.id,
          title: schema.resources.title,
          slug: schema.resources.slug,
          description: schema.resources.description,
          category: schema.resources.category,
          section: schema.resources.section,
          deadline: schema.resources.deadline,
          publishedAt: schema.resources.publishedAt,
        })
        .from(schema.resources)
        .where(
          and(
            eq(schema.resources.type, 'BLOG'),
            eq(schema.resources.isPublished, true),
            or(
              eq(schema.resources.section, 'opportunity'),
              like(schema.resources.category, '%intern%'),
              like(schema.resources.category, '%compet%'),
              like(schema.resources.category, '%exchange%'),
              like(schema.resources.category, '%opport%')
            )
          )
        )
        .orderBy(desc(schema.resources.publishedAt))
        .limit(4)

      const [coursesWithScholarship] = await db
        .select({ count: count() })
        .from(schema.courses)
        .where(and(eq(schema.courses.isActive, true), eq(schema.courses.hasScholarship, true)))

      const totalScholarshipsCount = Math.max(
        dbScholarships.length + Number(coursesWithScholarship?.count || 0),
        200
      )

      const dynamicList: Array<{
        id: string
        type: string
        title: string
        description: string
        deadline: string
        href: string
      }> = []

      for (const s of dbScholarships) {
        dynamicList.push({
          id: `sch-${s.id}`,
          type: 'Scholarship',
          title: s.name,
          description: s.description || 'Full and partial tuition support available for eligible students.',
          deadline: s.deadline
            ? new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Applications Open',
          href: s.linkUrl || '/scholarships',
        })
      }

      for (const o of dbOpportunities) {
        dynamicList.push({
          id: `opp-${o.id}`,
          type: o.category || 'Opportunity',
          title: o.title,
          description: o.description || '',
          deadline: o.deadline
            ? new Date(o.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Open Now',
          href: `/blog/${o.slug}`,
        })
      }

      const defaultOpportunities = [
        {
          id: 'def-gks',
          type: 'Scholarship',
          title: 'Global Korea Scholarship (GKS) Degree Program',
          description: 'Full tuition, monthly allowance, and round-trip airfare supported by Korean Government.',
          deadline: 'Dec 15, 2026',
          href: '/scholarships',
        },
        {
          id: 'def-tech',
          type: 'Internship',
          title: 'Seoul Global Business Internship Program',
          description: 'Hands-on paid corporate internship at leading Seoul-based tech and trading companies.',
          deadline: 'Jun 30, 2027',
          href: '/blog',
        },
        {
          id: 'def-biz',
          type: 'Competition',
          title: 'International Student Innovation Challenge',
          description: 'Win seed grant prizes and startup mentorship from Korean startup accelerators.',
          deadline: 'Aug 15, 2027',
          href: '/blog',
        },
        {
          id: 'def-ex',
          type: 'Exchange',
          title: 'Partner University Semester Exchange',
          description: 'Study for a credit-bearing semester at renowned universities with tuition waiver.',
          deadline: 'Jul 01, 2027',
          href: '/universities',
        },
      ]

      const finalList =
        dynamicList.length >= 4
          ? dynamicList.slice(0, 4)
          : [...dynamicList, ...defaultOpportunities.slice(dynamicList.length)]

      return {
        stats: [
          {
            title: 'Scholarships',
            count: `${totalScholarshipsCount}+`,
            description: 'Full and partial scholarships available',
          },
          {
            title: 'Internships',
            count: '150+',
            description: 'Paid internship opportunities',
          },
          {
            title: 'Competitions',
            count: '50+',
            description: 'Student competitions with prizes',
          },
          {
            title: 'Exchange Programs',
            count: '100+',
            description: 'Study abroad exchange opportunities',
          },
        ],
        latestOpportunities: finalList,
      }
    }),
  }),

  admin: createTRPCRouter({
    list: adminWithPermission('resources:view')
      .input(
        z.object({
          type: z.enum(['BLOG', 'FILE']).optional(),
          search: z.string().optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.type) conditions.push(eq(schema.resources.type, input.type))
        if (input.isPublished !== undefined) conditions.push(eq(schema.resources.isPublished, input.isPublished))
        if (input.search) {
          const term = `%${input.search.trim()}%`
          conditions.push(
            or(
              like(schema.resources.title, term),
              like(schema.resources.slug, term),
              like(schema.resources.category, term),
              like(schema.resources.fileName, term)
            )
          )
        }
        return db
          .select()
          .from(schema.resources)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(schema.resources.updatedAt))
      }),

    getById: adminWithPermission('resources:view').input(z.object({ id: z.string() })).query(async ({ input }) => {
      return db
        .select()
        .from(schema.resources)
        .where(eq(schema.resources.id, input.id))
        .limit(1)
        .then((r) => r[0] || null)
    }),

    create: adminWithPermission('resources:manage').input(resourceInput).mutation(async ({ input }) => {
      const publishedAt = input.isPublished ? input.publishedAt ?? new Date() : null
      const { publishedAt: _ignored, ...rest } = input
      await db.insert(schema.resources).values({ ...rest, publishedAt })
      return { success: true }
    }),

    update: adminWithPermission('resources:manage')
      .input(resourceInput.extend({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { id, publishedAt, ...rest } = input
        const existing = await db
          .select()
          .from(schema.resources)
          .where(eq(schema.resources.id, id))
          .limit(1)
          .then((r) => r[0] || null)

        const resolvedPublishedAt = rest.isPublished
          ? publishedAt ?? existing?.publishedAt ?? new Date()
          : null

        await db
          .update(schema.resources)
          .set({ ...rest, publishedAt: resolvedPublishedAt })
          .where(eq(schema.resources.id, id))
        return { success: true }
      }),

    delete: adminWithPermission('resources:manage').input(z.object({ id: z.string() })).mutation(async ({ input }) => {
      await db.delete(schema.resources).where(eq(schema.resources.id, input.id))
      return { success: true }
    }),
  }),
})
