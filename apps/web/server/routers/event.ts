import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq as _eq, desc as _desc, and as _and, or as _or, like as _like, sql as _sql } from 'drizzle-orm'

const eq = _eq as any
const desc = _desc as any
const and = _and as any
const or = _or as any
const like = _like as any
const sql = _sql as any

export const eventRouter = createTRPCRouter({
  /**
   * Returns up to 4 featured + published events for the homepage section.
   */
  featured: publicProcedure.query(async () => {
    return db
      .select()
      .from(schema.events)
      .where(and(eq(schema.events.isPublished, true), eq(schema.events.isFeatured, true)))
      .orderBy(desc(schema.events.eventDate))
      .limit(4)
  }),

  /**
   * Paginated list of all published events (public listing page).
   */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        perPage: z.number().int().min(1).max(50).default(9),
        category: z
          .enum(['WEBINAR', 'WORKSHOP', 'FAIR', 'SEMINAR', 'DEADLINE', 'OTHER'])
          .optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, perPage, category, search } = input
      const offset = (page - 1) * perPage

      const conditions: any[] = [eq(schema.events.isPublished, true)]

      if (category) {
        conditions.push(eq(schema.events.category, category))
      }

      if (search) {
        const term = `%${search.trim()}%`
        conditions.push(
          or(
            like(schema.events.title, term),
            like(schema.events.excerpt, term),
            like(schema.events.location, term)
          )
        )
      }

      const [rows, countResult] = await Promise.all([
        db
          .select()
          .from(schema.events)
          .where(and(...conditions))
          .orderBy(desc(schema.events.eventDate))
          .limit(perPage)
          .offset(offset),
        db
          .select({ count: sql`COUNT(*)` })
          .from(schema.events)
          .where(and(...conditions)),
      ])

      const total = Number((countResult[0] as any)?.count ?? 0)

      return {
        events: rows,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      }
    }),

  /**
   * Returns a single published event by slug and increments view count.
   */
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const event = await db
        .select()
        .from(schema.events)
        .where(and(eq(schema.events.slug, input.slug), eq(schema.events.isPublished, true)))
        .limit(1)
        .then((r) => r[0] ?? null)

      if (!event) return null

      // Fire-and-forget view count increment
      db.update(schema.events)
        .set({ viewCount: sql`${schema.events.viewCount} + 1` })
        .where(eq(schema.events.id, event.id))
        .catch(() => {}) // non-critical

      return event
    }),
})
