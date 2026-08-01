import { z } from 'zod'
import { createTRPCRouter, adminProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq, desc, and, like, or, count, sql } from 'drizzle-orm'

export const adminRouter = createTRPCRouter({
  dashboard: createTRPCRouter({
    getMetrics: adminProcedure.query(async () => {
      const studentCountRes = await db
        .select({ value: count() })
        .from(schema.users)
        .where(eq(schema.users.role, 'STUDENT'))
      const counselorCountRes = await db
        .select({ value: count() })
        .from(schema.users)
        .where(eq(schema.users.role, 'COUNSELOR'))

      const appsByStatus = await db
        .select({
          status: schema.applications.status,
          count: count(),
        })
        .from(schema.applications)
        .groupBy(schema.applications.status)

      const recentActivity = await db.query.applications.findMany({
        orderBy: [desc(schema.applications.updatedAt)],
        limit: 10,
        with: {
          student: {
            with: { user: true },
          },
          course: {
            with: { university: true },
          },
        },
      })

      return {
        students: studentCountRes[0]?.value || 0,
        counselors: counselorCountRes[0]?.value || 0,
        applicationsByStatus: appsByStatus,
        recentActivity,
      }
    }),
  }),

  students: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          cursor: z.string().nullish(),
          limit: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ input }) => {
        const { search, cursor, limit } = input

        const where = and(
          eq(schema.users.role, 'STUDENT'),
          search
            ? or(like(schema.users.name, `%${search}%`), like(schema.users.email, `%${search}%`))
            : undefined,
          cursor ? sql`${schema.users.id} < ${cursor}` : undefined // Simple cursor logic based on desc ID
        )

        const items = await db.query.users.findMany({
          where,
          limit: limit + 1,
          orderBy: [desc(schema.users.id)],
          with: {
            studentProfile: {
              with: { assignedCounselor: { with: { user: true } } },
            },
          },
        })

        let nextCursor: typeof cursor | undefined = undefined
        if (items.length > limit) {
          const nextItem = items.pop()
          nextCursor = nextItem!.id
        }

        return { items, nextCursor }
      }),

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const student = await db.query.users.findFirst({
        where: and(eq(schema.users.id, input.id), eq(schema.users.role, 'STUDENT')),
        with: {
          studentProfile: {
            with: {
              assignedCounselor: true,
              applications: {
                with: {
                  course: { with: { university: true } },
                },
              },
              bookingSessions: {
                with: { counselor: true },
              },
            },
          },
        },
      })
      return student
    }),

    updateProfile: adminProcedure
      .input(
        z.object({
          id: z.string(),
          data: z.any(), // Add proper schema if needed
        })
      )
      .mutation(async ({ input }) => {
        // Find profile ID
        const profile = await db.query.studentProfiles.findFirst({
          where: eq(schema.studentProfiles.userId, input.id),
        })
        if (profile) {
          await db
            .update(schema.studentProfiles)
            .set(input.data)
            .where(eq(schema.studentProfiles.id, profile.id))
        }
        return { success: true }
      }),

    assignCounselor: adminProcedure
      .input(
        z.object({
          studentId: z.string(),
          counselorId: z.string().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(schema.studentProfiles)
          .set({ assignedCounselorId: input.counselorId })
          .where(eq(schema.studentProfiles.userId, input.studentId))
        return { success: true }
      }),
  }),

  applications: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          status: z
            .enum([
              'DRAFT',
              'IN_PROGRESS',
              'SUBMITTED',
              'UNDER_REVIEW',
              'DOCUMENTS_REQUIRED',
              'ACCEPTED',
              'REJECTED',
              'WAITLISTED',
              'WITHDRAWN',
            ])
            .optional(),
          cursor: z.string().nullish(),
          limit: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ input }) => {
        const { search, status, cursor, limit } = input

        // Note: For complex search across relations, you might need joins.
        // Here we keep it simple or filter memory side for deep relation search.
        const items = await db.query.applications.findMany({
          where: and(
            status ? eq(schema.applications.status, status) : undefined,
            cursor ? sql`${schema.applications.id} < ${cursor}` : undefined
          ),
          limit: limit + 1,
          orderBy: [desc(schema.applications.id)],
          with: {
            student: { with: { user: true } },
            course: { with: { university: true } },
            counselor: { with: { user: true } },
          },
        })

        // Client-side search filtering for simplicity if relation search is complex in Drizzle queries
        let filteredItems = items
        if (search) {
          const lowerSearch = search.toLowerCase()
          filteredItems = items.filter(
            (app) =>
              app.student?.user?.name?.toLowerCase().includes(lowerSearch) ||
              app.course?.university?.name.toLowerCase().includes(lowerSearch) ||
              app.course?.name.toLowerCase().includes(lowerSearch)
          )
        }

        let nextCursor: typeof cursor | undefined = undefined
        if (items.length > limit) {
          const nextItem = items.pop()
          nextCursor = nextItem!.id
        }

        return { items: filteredItems.slice(0, limit), nextCursor }
      }),

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      return db.query.applications.findFirst({
        where: eq(schema.applications.id, input.id),
        with: {
          student: { with: { user: true } },
          course: { with: { university: true } },
          counselor: { with: { user: true } },
        },
      })
    }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum([
            'DRAFT',
            'IN_PROGRESS',
            'SUBMITTED',
            'UNDER_REVIEW',
            'DOCUMENTS_REQUIRED',
            'ACCEPTED',
            'REJECTED',
            'WAITLISTED',
            'WITHDRAWN',
          ]),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(schema.applications)
          .set({ status: input.status })
          .where(eq(schema.applications.id, input.id))
        return { success: true }
      }),

    addNotes: adminProcedure
      .input(
        z.object({
          id: z.string(),
          notes: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(schema.applications)
          .set({ counselorNotes: input.notes })
          .where(eq(schema.applications.id, input.id))
        return { success: true }
      }),
  }),

  counselors: createTRPCRouter({
    list: adminProcedure.query(async () => {
      return db.query.users.findMany({
        where: eq(schema.users.role, 'COUNSELOR'),
        with: {
          counselorProfile: true,
        },
      })
    }),
    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      return db.query.users.findFirst({
        where: and(eq(schema.users.id, input.id), eq(schema.users.role, 'COUNSELOR')),
        with: { counselorProfile: true },
      })
    }),
  }),

  notifications: createTRPCRouter({
    sendSystem: adminProcedure
      .input(
        z.object({
          userId: z.string().optional(), // If not provided, it's a broadcast
          title: z.string(),
          body: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.userId) {
          await db.insert(schema.notifications).values({
            userId: input.userId,
            title: input.title,
            body: input.body,
            type: 'SYSTEM',
          })
        } else {
          // Broadcast to all (expensive in real app, might want a batch process)
          const allUsers = await db.select({ id: schema.users.id }).from(schema.users)
          const values = allUsers.map((u) => ({
            userId: u.id,
            title: input.title,
            body: input.body,
            type: 'SYSTEM' as const,
          }))
          // Chunked insert if many
          for (let i = 0; i < values.length; i += 1000) {
            await db.insert(schema.notifications).values(values.slice(i, i + 1000))
          }
        }
        return { success: true }
      }),

    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input }) => {
        const where = input.search
          ? or(
              like(schema.notifications.title, `%${input.search}%`),
              like(schema.notifications.body, `%${input.search}%`)
            )
          : undefined

        return db.query.notifications.findMany({
          where,
          orderBy: [desc(schema.notifications.createdAt)],
          limit: input.limit,
          with: { user: { columns: { name: true, email: true } } },
        })
      }),
  }),

  // ─── Universities CRUD ────────────────────────────────────

  universities: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          country: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.search) {
          conditions.push(
            or(
              like(schema.universities.name, `%${input.search}%`),
              like(schema.universities.city, `%${input.search}%`)
            )
          )
        }
        if (input.country) conditions.push(eq(schema.universities.country, input.country))
        if (input.isActive !== undefined) conditions.push(eq(schema.universities.isActive, input.isActive))

        return db.query.universities.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: [desc(schema.universities.createdAt)],
          with: { courses: { columns: { id: true } } },
        })
      }),

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      return db.query.universities.findFirst({
        where: eq(schema.universities.id, input.id),
        with: { courses: true },
      })
    }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          country: z.string().min(1),
          city: z.string().min(1),
          description: z.string().min(1),
          logo: z.string().optional(),
          coverImage: z.string().optional(),
          ranking: z.number().optional(),
          website: z.string().optional(),
          established: z.number().optional(),
          totalStudents: z.number().optional(),
          internationalPercent: z.number().optional(),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(schema.universities).values(input)
        return { success: true }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          country: z.string().min(1).optional(),
          city: z.string().min(1).optional(),
          description: z.string().optional(),
          logo: z.string().optional(),
          coverImage: z.string().optional(),
          ranking: z.number().optional(),
          website: z.string().optional(),
          established: z.number().optional(),
          totalStudents: z.number().optional(),
          internationalPercent: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        await db.update(schema.universities).set(data).where(eq(schema.universities.id, id))
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.universities).where(eq(schema.universities.id, input.id))
        return { success: true }
      }),
  }),

  // ─── Messages ─────────────────────────────────────────────

  messages: createTRPCRouter({
    list: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
      .query(async () => {
        return db.query.conversations.findMany({
          orderBy: [desc(schema.conversations.lastMessageAt)],
          limit: 50,
          with: {
            student: { columns: { name: true, email: true } },
            counselor: { columns: { name: true, email: true } },
            messages: { orderBy: [desc(schema.messages.createdAt)], limit: 1 },
          },
        })
      }),

    getMessages: adminProcedure
      .input(z.object({ conversationId: z.string() }))
      .query(async ({ input }) => {
        return db.query.messages.findMany({
          where: eq(schema.messages.conversationId, input.conversationId),
          orderBy: [desc(schema.messages.createdAt)],
          limit: 100,
        })
      }),
  }),

  // ─── Documents ────────────────────────────────────────────

  documents: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input }) => {
        const apps = await db.query.applications.findMany({
          orderBy: [desc(schema.applications.updatedAt)],
          limit: input.limit,
          with: {
            student: { with: { user: { columns: { name: true, email: true } } } },
            course: { with: { university: { columns: { name: true } } } },
          },
        })

        // Filter & expand: only apps with documents, and flatten for table view
        let docs: Array<{
          id: string
          studentName: string
          studentEmail: string
          university: string
          course: string
          status: string
          docLabel: string
          docUrl: string
          updatedAt: Date
        }> = []

        for (const app of apps) {
          const urls = (app.documentsUrls || []) as string[]
          if (urls.length === 0) continue
          urls.forEach((url, i) => {
            docs.push({
              id: `${app.id}-${i}`,
              studentName: app.student?.user?.name || 'Unknown',
              studentEmail: app.student?.user?.email || '',
              university: app.course?.university?.name || 'Unknown',
              course: app.course?.name || 'Unknown',
              status: app.status,
              docLabel: url.split('/').pop() || `Document ${i + 1}`,
              docUrl: url,
              updatedAt: app.updatedAt,
            })
          })
        }

        if (input.search) {
          const s = input.search.toLowerCase()
          docs = docs.filter(d =>
            d.studentName.toLowerCase().includes(s) ||
            d.studentEmail.toLowerCase().includes(s) ||
            d.university.toLowerCase().includes(s)
          )
        }

        return docs.slice(0, input.limit)
      }),
  }),
})
