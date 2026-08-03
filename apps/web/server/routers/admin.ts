import { z } from 'zod'
import { createTRPCRouter, adminProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq as _eq, desc as _desc, and as _and, like as _like, or as _or, count as _count, sql as _sql } from 'drizzle-orm'
const eq = _eq as any
const desc = _desc as any
const and = _and as any
const like = _like as any
const or = _or as any
const count = _count as any
const sql = _sql as any

export const adminRouter = createTRPCRouter({
  dashboard: createTRPCRouter({
    getMetrics: adminProcedure.query(async () => {
      const studentCountRes = await db
        .select({ value: count() as any })
        .from(schema.users)
        .where(eq(schema.users.role, 'STUDENT'))
      const counselorCountRes = await db
        .select({ value: count() as any })
        .from(schema.users)
        .where(eq(schema.users.role, 'COUNSELOR'))

      const appsByStatus = await db
        .select({
          status: schema.applications.status,
          count: count() as any,
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

      // Top countries by student count
      const topCountries = await db
        .select({
          country: schema.studentProfiles.nationality,
          count: count() as any,
        })
        .from(schema.studentProfiles)
        .where(sql`${schema.studentProfiles.nationality} IS NOT NULL` as any)
        .groupBy(schema.studentProfiles.nationality)
        .orderBy(desc(count() as any))
        .limit(5)

      // Upcoming consultations
      const upcomingConsultations = await db.query.bookingSessions.findMany({
        where: and(
          eq(schema.bookingSessions.status, 'SCHEDULED'),
          sql`${schema.bookingSessions.scheduledAt} >= NOW()` as any
        ),
        orderBy: [schema.bookingSessions.scheduledAt],
        limit: 5,
        with: {
          student: { with: { user: true } },
          counselor: { with: { user: true } },
        },
      })

      // Application trend (last 7 days)
      const applicationTrend = await db
        .select({
          date: (sql`DATE(${schema.applications.createdAt})` as any).as('date'),
          count: count() as any,
        })
        .from(schema.applications)
        .where(sql`${schema.applications.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)` as any)
        .groupBy(sql`DATE(${schema.applications.createdAt})` as any)
        .orderBy(sql`DATE(${schema.applications.createdAt})` as any)

      // Total students count for top countries
      const totalStudentsWithNationality = await db
        .select({ value: count() as any })
        .from(schema.studentProfiles)
        .where(sql`${schema.studentProfiles.nationality} IS NOT NULL` as any)

      return {
        students: studentCountRes[0]?.value || 0,
        counselors: counselorCountRes[0]?.value || 0,
        applicationsByStatus: appsByStatus,
        recentActivity,
        topCountries,
        upcomingConsultations,
        applicationTrend,
        totalStudentsWithNationality: totalStudentsWithNationality[0]?.value || 0,
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
          cursor ? sql`${schema.users.id} < ${cursor}` as any : undefined // Simple cursor logic based on desc ID
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
            cursor ? sql`${schema.applications.id} < ${cursor}` as any : undefined
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
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          bio: z.string().optional(),
          expertiseCountries: z.array(z.string()).default([]),
          expertiseSubjects: z.array(z.string()).default([]),
          languages: z.array(z.string()).default(['English']),
          calUsername: z.string().optional(),
          sessionRate: z.number().default(0),
          isAvailable: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const { name, email, ...profileData } = input
        const userId = globalThis.crypto.randomUUID()
        await db.insert(schema.users).values({
          id: userId,
          name,
          email,
          role: 'COUNSELOR',
        })
        await db.insert(schema.counselorProfiles).values({
          userId,
          ...profileData,
        })
        return { success: true, userId }
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          email: z.string().email().optional(),
          bio: z.string().optional(),
          expertiseCountries: z.array(z.string()).optional(),
          expertiseSubjects: z.array(z.string()).optional(),
          languages: z.array(z.string()).optional(),
          calUsername: z.string().optional(),
          sessionRate: z.number().optional(),
          isAvailable: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, name, email, ...profileData } = input
        if (name || email) {
          await db.update(schema.users).set({ ...(name && { name }), ...(email && { email }) }).where(eq(schema.users.id, id))
        }
        const profile = await db.query.counselorProfiles.findFirst({
          where: eq(schema.counselorProfiles.userId, id),
        })
        if (profile && Object.keys(profileData).length > 0) {
          await db.update(schema.counselorProfiles).set(profileData).where(eq(schema.counselorProfiles.id, profile.id))
        }
        return { success: true }
      }),
    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const profile = await db.query.counselorProfiles.findFirst({
          where: eq(schema.counselorProfiles.userId, input.id),
        })
        if (profile) {
          await db.delete(schema.counselorProfiles).where(eq(schema.counselorProfiles.id, profile.id))
        }
        await db.delete(schema.users).where(eq(schema.users.id, input.id))
        return { success: true }
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

  // ─── Courses CRUD ──────────────────────────────────────────

  courses: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          universityId: z.string().optional(),
          subject: z.string().optional(),
          level: z.enum(['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']).optional(),
          isActive: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.search) {
          conditions.push(
            or(
              like(schema.courses.name, `%${input.search}%`),
              like(schema.courses.subject, `%${input.search}%`)
            )
          )
        }
        if (input.universityId) conditions.push(eq(schema.courses.universityId, input.universityId))
        if (input.subject) conditions.push(eq(schema.courses.subject, input.subject))
        if (input.level) conditions.push(eq(schema.courses.level, input.level))
        if (input.isActive !== undefined) conditions.push(eq(schema.courses.isActive, input.isActive))

        return db.query.courses.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: [desc(schema.courses.createdAt)],
          with: { university: { columns: { id: true, name: true, country: true } } },
        })
      }),

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      return db.query.courses.findFirst({
        where: eq(schema.courses.id, input.id),
        with: { university: true },
      })
    }),

    create: adminProcedure
      .input(
        z.object({
          universityId: z.string().min(1),
          name: z.string().min(1),
          slug: z.string().min(1),
          subject: z.string().min(1),
          level: z.enum(['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']),
          duration: z.number().min(1),
          durationUnit: z.string().default('YEARS'),
          tuitionFee: z.number().min(0),
          currency: z.string().default('USD'),
          applicationDeadline: z.date().optional(),
          startDate: z.date().optional(),
          language: z.string().default('English'),
          requirements: z.array(z.string()).default([]),
          hasScholarship: z.boolean().default(false),
          scholarshipDetails: z.string().optional(),
          description: z.string().min(1),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(schema.courses).values(input)
        return { success: true }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          universityId: z.string().min(1).optional(),
          name: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          subject: z.string().min(1).optional(),
          level: z.enum(['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']).optional(),
          duration: z.number().min(1).optional(),
          durationUnit: z.string().optional(),
          tuitionFee: z.number().min(0).optional(),
          currency: z.string().optional(),
          applicationDeadline: z.date().optional(),
          startDate: z.date().optional(),
          language: z.string().optional(),
          requirements: z.array(z.string()).optional(),
          hasScholarship: z.boolean().optional(),
          scholarshipDetails: z.string().optional(),
          description: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        await db.update(schema.courses).set(data).where(eq(schema.courses.id, id))
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.courses).where(eq(schema.courses.id, input.id))
        return { success: true }
      }),

    getSubjects: adminProcedure.query(async () => {
      const rows = await db
        .selectDistinct({ subject: schema.courses.subject })
        .from(schema.courses)
      return rows.map(r => r.subject).filter(Boolean)
    }),
  }),

  // ─── Countries CRUD (Catalog) ──────────────────────────────

  countries: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          continent: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.search) {
          conditions.push(like(schema.countries.name, `%${input.search}%`))
        }
        if (input.continent) conditions.push(eq(schema.countries.continent, input.continent))

        return db.query.countries.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: [schema.countries.name],
        })
      }),

    getById: adminProcedure.input(z.object({ code: z.string() })).query(async ({ input }) => {
      return db.query.countries.findFirst({
        where: eq(schema.countries.code, input.code),
      })
    }),

    create: adminProcedure
      .input(
        z.object({
          code: z.string().length(2),
          name: z.string().min(1),
          flagUrl: z.string().optional(),
          continent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(schema.countries).values(input)
        return { success: true }
      }),

    update: adminProcedure
      .input(
        z.object({
          code: z.string().length(2),
          name: z.string().min(1).optional(),
          flagUrl: z.string().optional(),
          continent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { code, ...data } = input
        await db.update(schema.countries).set(data).where(eq(schema.countries.code, code))
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.countries).where(eq(schema.countries.code, input.code))
        return { success: true }
      }),
  }),

  // ─── Departments CRUD (Catalog) ───────────────────────────

  departments: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          universityId: z.number().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.universityId) conditions.push(eq(schema.departments.universityId, input.universityId))
        if (input.search) conditions.push(like(schema.departments.name, `%${input.search}%`))

        return db.query.departments.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: [schema.departments.name],
          with: { university: { columns: { id: true, name: true } } },
        })
      }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.query.departments.findFirst({
        where: eq(schema.departments.id, input.id),
        with: { university: true },
      })
    }),

    create: adminProcedure
      .input(
        z.object({
          universityId: z.number(),
          name: z.string().min(1),
          code: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(schema.departments).values(input)
        return { success: true }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          universityId: z.number().optional(),
          name: z.string().min(1).optional(),
          code: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        await db.update(schema.departments).set(data).where(eq(schema.departments.id, id))
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.departments).where(eq(schema.departments.id, input.id))
        return { success: true }
      }),

    getCatalogUniversities: adminProcedure.query(async () => {
      return db.query.catalogUniversities.findMany({
        orderBy: [schema.catalogUniversities.name],
        columns: { id: true, name: true },
      })
    }),
  }),

  // ─── Scholarships CRUD (Catalog) ──────────────────────────

  scholarships: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          universityId: z.number().optional(),
          search: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.universityId) conditions.push(eq(schema.scholarships.universityId, input.universityId))
        if (input.search) conditions.push(like(schema.scholarships.name, `%${input.search}%`))
        if (input.isActive !== undefined) conditions.push(eq(schema.scholarships.isActive, input.isActive))

        return db.query.scholarships.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: [schema.scholarships.name],
          with: { university: { columns: { id: true, name: true } }, course: { columns: { id: true, title: true } } },
        })
      }),

    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.query.scholarships.findFirst({
        where: eq(schema.scholarships.id, input.id),
        with: { university: true, course: true },
      })
    }),

    create: adminProcedure
      .input(
        z.object({
          universityId: z.number().optional(),
          courseId: z.number().optional(),
          name: z.string().min(1),
          description: z.string().optional(),
          amount: z.number().optional(),
          currencyCode: z.string().default('USD'),
          coverageType: z.enum(['full', 'partial', 'tuition_only', 'living_only']).default('partial'),
          eligibility: z.string().optional(),
          deadline: z.date().optional(),
          linkUrl: z.string().optional(),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(schema.scholarships).values(input)
        return { success: true }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          universityId: z.number().optional(),
          courseId: z.number().optional(),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          amount: z.number().optional(),
          currencyCode: z.string().optional(),
          coverageType: z.enum(['full', 'partial', 'tuition_only', 'living_only']).optional(),
          eligibility: z.string().optional(),
          deadline: z.date().optional(),
          linkUrl: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        await db.update(schema.scholarships).set(data).where(eq(schema.scholarships.id, id))
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.scholarships).where(eq(schema.scholarships.id, input.id))
        return { success: true }
      }),

    getCatalogUniversities: adminProcedure.query(async () => {
      return db.query.catalogUniversities.findMany({
        orderBy: [schema.catalogUniversities.name],
        columns: { id: true, name: true },
      })
    }),

    getCatalogCourses: adminProcedure.query(async () => {
      return db.query.catalogCourses.findMany({
        orderBy: [schema.catalogCourses.title],
        columns: { id: true, title: true },
      })
    }),
  }),

  // ─── Newsletter Subscribers CRUD ─────────────────────────

  newsletters: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.search) {
          conditions.push(
            or(
              like(schema.newsletterSubscribers.email, `%${input.search}%`),
              like(schema.newsletterSubscribers.name, `%${input.search}%`)
            )
          )
        }
        if (input.isActive !== undefined) conditions.push(eq(schema.newsletterSubscribers.isActive, input.isActive))

        return db.query.newsletterSubscribers.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: [desc(schema.newsletterSubscribers.subscribedAt)],
        })
      }),

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      return db.query.newsletterSubscribers.findFirst({
        where: eq(schema.newsletterSubscribers.id, input.id),
      })
    }),

    create: adminProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          isActive: z.boolean().default(true),
          tags: z.array(z.string()).default([]),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(schema.newsletterSubscribers).values(input)
        return { success: true }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          email: z.string().email().optional(),
          name: z.string().optional(),
          isActive: z.boolean().optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        await db.update(schema.newsletterSubscribers).set(data).where(eq(schema.newsletterSubscribers.id, id))
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.id, input.id))
        return { success: true }
      }),
  }),

  // ─── Messages ─────────────────────────────────────────────

  messages: createTRPCRouter({
    list: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
      .query(async ({ input }) => {
        const rows = await db
          .select({
            id: schema.conversations.id,
            studentId: schema.conversations.studentId,
            counselorId: schema.conversations.counselorId,
            lastMessageAt: schema.conversations.lastMessageAt,
            lastMessage: schema.conversations.lastMessage,
            createdAt: schema.conversations.createdAt,
            studentName: schema.users.name,
            studentEmail: schema.users.email,
          })
          .from(schema.conversations)
          .leftJoin(schema.studentProfiles, eq(schema.conversations.studentId, schema.studentProfiles.id))
          .leftJoin(schema.users, eq(schema.studentProfiles.userId, schema.users.id))
          .orderBy(desc(schema.conversations.lastMessageAt))
          .limit(input.limit)
        return rows
      }),

    getMessages: adminProcedure
      .input(z.object({ conversationId: z.string() }))
      .query(async ({ input }) => {
        const rows = await db
          .select({
            id: schema.messages.id,
            conversationId: schema.messages.conversationId,
            senderId: schema.messages.senderId,
            content: schema.messages.content,
            attachmentUrl: schema.messages.attachmentUrl,
            isRead: schema.messages.isRead,
            createdAt: schema.messages.createdAt,
            senderName: schema.users.name,
            senderRole: schema.users.role,
          })
          .from(schema.messages)
          .leftJoin(schema.users, eq(schema.messages.senderId, schema.users.id))
          .where(eq(schema.messages.conversationId, input.conversationId))
          .orderBy(desc(schema.messages.createdAt))
          .limit(100)
        return rows
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
