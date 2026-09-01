import { z } from 'zod'
import { createTRPCRouter, adminProcedure, publicProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq as _eq, desc as _desc, and as _and, or as _or, like as _like } from 'drizzle-orm'

const eq = _eq as any
const desc = _desc as any
const and = _and as any
const or = _or as any
const like = _like as any

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

    files: publicProcedure.query(async () => {
      return db
        .select()
        .from(schema.resources)
        .where(and(eq(schema.resources.type, 'FILE'), eq(schema.resources.isPublished, true)))
        .orderBy(desc(schema.resources.publishedAt))
    }),
  }),

  admin: createTRPCRouter({
    list: adminProcedure
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

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      return db
        .select()
        .from(schema.resources)
        .where(eq(schema.resources.id, input.id))
        .limit(1)
        .then((r) => r[0] || null)
    }),

    create: adminProcedure.input(resourceInput).mutation(async ({ input }) => {
      const publishedAt = input.isPublished ? input.publishedAt ?? new Date() : null
      const { publishedAt: _ignored, ...rest } = input
      await db.insert(schema.resources).values({ ...rest, publishedAt })
      return { success: true }
    }),

    update: adminProcedure
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

    delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
      await db.delete(schema.resources).where(eq(schema.resources.id, input.id))
      return { success: true }
    }),
  }),
})
