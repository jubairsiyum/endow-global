import { z } from 'zod'
import { createTRPCRouter, adminProcedure, publicProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq, desc } from 'drizzle-orm'

export const testimonialRouter = createTRPCRouter({
  published: publicProcedure.query(async () => {
    return db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.isPublished, true))
      .orderBy(desc(schema.testimonials.createdAt))
  }),

  admin: createTRPCRouter({
    list: adminProcedure.query(async () => {
      return db
        .select()
        .from(schema.testimonials)
        .orderBy(desc(schema.testimonials.createdAt))
    }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          program: z.string().min(1),
          university: z.string().min(1),
          country: z.string().min(1),
          quote: z.string().min(1),
          rating: z.number().min(1).max(5).default(5),
          initials: z.string().min(1).max(4),
          isPublished: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await db
          .insert(schema.testimonials)
          .values(input)
        return result
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          program: z.string().min(1).optional(),
          university: z.string().min(1).optional(),
          country: z.string().min(1).optional(),
          quote: z.string().min(1).optional(),
          rating: z.number().min(1).max(5).optional(),
          initials: z.string().min(1).max(4).optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        const [result] = await db
          .update(schema.testimonials)
          .set(data)
          .where(eq(schema.testimonials.id, id))
        return result
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const [result] = await db
          .delete(schema.testimonials)
          .where(eq(schema.testimonials.id, input.id))
        return result
      }),
  }),
})
