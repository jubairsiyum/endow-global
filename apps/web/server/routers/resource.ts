import { z } from 'zod'
import { createTRPCRouter, adminProcedure, publicProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq as _eq, desc as _desc, and as _and, or as _or, like as _like } from 'drizzle-orm'

const eq = _eq as any
const desc = _desc as any
const and = _and as any
const or = _or as any
const like = _like as any

const resourceInput = z.object({
  type: z.enum(['BLOG', 'FILE']),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  fileSize: z.number().int().min(0).optional().nullable(),
  isPublished: z.boolean().default(false),
  publishedAt: z.date().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  noIndex: z.boolean().default(false),
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
