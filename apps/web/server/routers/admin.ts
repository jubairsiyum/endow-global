import { z } from 'zod'
import { createTRPCRouter, adminProcedure, superAdminProcedure } from '@/lib/trpc'
import { db, schema } from '@endow/db'
import { eq as _eq, desc as _desc, and as _and, like as _like, or as _or, count as _count, sql as _sql, asc as _asc, isNull as _isNull, inArray as _inArray, ne as _ne, gte as _gte } from 'drizzle-orm'
import { applicantLevelFromEducation } from '@/lib/documents'
const eq = _eq as any
const desc = _desc as any
const and = _and as any
const like = _like as any
const or = _or as any
const count = _count as any
const sql = _sql as any
const asc = _asc as any
const isNull = _isNull as any
const inArray = _inArray as any
const ne = _ne as any
const gte = _gte as any

export const adminRouter = createTRPCRouter({
  dashboard: createTRPCRouter({
    getMetrics: adminProcedure.query(async () => {
      // All metrics are independent — run them in parallel to cut total
      // latency (the dashboard previously awaited them one by one).
      const [studentCountRes, counselorCountRes, appsByStatus, recentActivity, topCountries, upcomingConsultations, applicationTrend, totalStudentsWithNationality] = await Promise.all([
        db.select({ value: count() as any }).from(schema.users).where(eq(schema.users.role, 'STUDENT')),
        db.select({ value: count() as any }).from(schema.users).where(eq(schema.users.role, 'COUNSELOR')),
        db.select({ status: schema.applications.status, count: count() as any }).from(schema.applications).groupBy(schema.applications.status),
        db.query.applications.findMany({
          orderBy: [desc(schema.applications.updatedAt)],
          limit: 10,
          with: {
            student: { with: { user: true } },
            course: { with: { university: true } },
          },
        }),
        db.select({
          country: schema.studentProfiles.nationality,
          count: count() as any,
        })
          .from(schema.studentProfiles)
          .where(sql`${schema.studentProfiles.nationality} IS NOT NULL` as any)
          .groupBy(schema.studentProfiles.nationality)
          .orderBy(desc(count() as any))
          .limit(5),
        db.query.bookingSessions.findMany({
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
        }),
        db.select({
          date: (sql`DATE(${schema.applications.createdAt})` as any).as('date'),
          count: count() as any,
        })
          .from(schema.applications)
          .where(sql`${schema.applications.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)` as any)
          .groupBy(sql`DATE(${schema.applications.createdAt})` as any)
          .orderBy(sql`DATE(${schema.applications.createdAt})` as any),
        db.select({ value: count() as any })
          .from(schema.studentProfiles)
          .where(sql`${schema.studentProfiles.nationality} IS NOT NULL` as any),
      ])

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

    getNetworkMap: adminProcedure.query(async () => {
      const branchRows = await db.select().from(schema.branches)
      const uniRows = await db.query.universities.findMany({
        with: { courses: { columns: { id: true } } },
      })

      const countryCoords: Record<string, { x: number; y: number }> = {
        'Bangladesh': { x: 0.68, y: 0.38 },
        'Australia': { x: 0.83, y: 0.62 },
        'South Korea': { x: 0.73, y: 0.28 },
        'UAE': { x: 0.58, y: 0.42 },
        'United Kingdom': { x: 0.45, y: 0.22 },
        'Malaysia': { x: 0.72, y: 0.48 },
        'United States': { x: 0.20, y: 0.30 },
        'Canada': { x: 0.18, y: 0.22 },
        'India': { x: 0.62, y: 0.42 },
        'Germany': { x: 0.47, y: 0.25 },
        'France': { x: 0.44, y: 0.28 },
        'Japan': { x: 0.78, y: 0.30 },
        'Singapore': { x: 0.71, y: 0.50 },
        'China': { x: 0.75, y: 0.32 },
        'New Zealand': { x: 0.88, y: 0.68 },
      }

      const statusMap: Record<string, string> = {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        SETUP: 'warning',
        CLOSED: 'inactive',
      }

      const nodes: Array<{ id: string; label: string; code: string; type: 'branch' | 'university'; x: number; y: number; volume: number; activeRoutes: number; status: 'active' | 'inactive' | 'warning' }> = []

      for (const br of branchRows) {
        const coord = countryCoords[br.country] || { x: 0.5, y: 0.5 }
        nodes.push({
          id: `b-${br.id}`,
          label: br.name,
          code: br.code,
          type: 'branch',
          x: coord.x + (Math.random() - 0.5) * 0.03,
          y: coord.y + (Math.random() - 0.5) * 0.03,
          volume: br.applications || (br.counselors ?? 0) * 12 || 15,
          activeRoutes: br.counselors || 2,
          status: (statusMap[br.status] || 'active') as 'active' | 'inactive' | 'warning',
        })
      }

      for (const uni of uniRows) {
        const coord = countryCoords[uni.country] || { x: 0.5, y: 0.5 }
        nodes.push({
          id: `u-${uni.id}`,
          label: uni.name,
          code: uni.slug.slice(0, 6).toUpperCase(),
          type: 'university',
          x: coord.x + (Math.random() - 0.5) * 0.04,
          y: coord.y + (Math.random() - 0.5) * 0.04,
          volume: (uni as any)?.courses?.length * 8 || 20,
          activeRoutes: (uni as any)?.courses?.length || 3,
          status: (uni.isActive ? 'active' : 'inactive') as 'active' | 'inactive' | 'warning',
        })
      }

      const arcs: Array<{ from: string; to: string; count: number }> = []
      const branchNodes = nodes.filter((n) => n.type === 'branch')
      const uniNodes = nodes.filter((n) => n.type === 'university')

      for (const branch of branchNodes) {
        const branchId = branch.id.replace('b-', '')
        const branchCountry = branchRows.find((b) => b.id === branchId)?.country
        if (!branchCountry) continue
        const sameCountryUnis = uniNodes.filter((u) => {
          const uniId = u.id.replace('u-', '')
          const uniCountry = uniRows.find((x) => (x as any).id === uniId)?.country
          return uniCountry === branchCountry
        })
        for (const uni of sameCountryUnis.slice(0, 3)) {
          arcs.push({ from: branch.id, to: uni.id, count: Math.floor(Math.random() * 3) + 1 })
        }
      }

      return { nodes, arcs }
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

        const conditions = [eq(schema.users.role, 'STUDENT')]
        if (search) {
          conditions.push(or(like(schema.users.name, `%${search}%`), like(schema.users.email, `%${search}%`)))
        }
        if (cursor) {
          conditions.push(sql`${schema.users.id} < ${cursor}` as any)
        }

        const items = await db.query.users.findMany({
          where: and(...conditions),
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
        const conditions = []
        if (status) conditions.push(eq(schema.applications.status, status))
        if (cursor) conditions.push(sql`${schema.applications.id} < ${cursor}` as any)

        const items = await db
          .select()
          .from(schema.applications)
          .where(conditions.length > 0 ? and(...conditions) : undefined as any)
          .orderBy(desc(schema.applications.id))
          .limit(limit + 1)

        // Resolve relations manually
        const itemIds = items.map(i => i.id)
        const appDetails = itemIds.length > 0 ? await db.select().from(schema.applications)
          .where(sql`${schema.applications.id} IN ${itemIds}` as any) : []

        // Fetch related student/course/counselor data
        const studentIds = Array.from(new Set(items.map(i => i.studentId)))
        const courseIds = Array.from(new Set(items.map(i => i.courseId)))
        const counselorIds = Array.from(new Set(items.map(i => i.counselorId).filter(Boolean) as string[]))

        const [students, courses, counselors] = await Promise.all([
          studentIds.length > 0 ? db.select().from(schema.users).where(or(...studentIds.map(id => eq(schema.users.id, id))) as any) : [],
          courseIds.length > 0 ? db.select().from(schema.courses).where(or(...courseIds.map(id => eq(schema.courses.id, id))) as any) : [],
          counselorIds.length > 0 ? db.select().from(schema.users).where(or(...counselorIds.map(id => eq(schema.users.id, id))) as any) : [],
        ])
        const universityIds = Array.from(new Set(courses.map(c => c.universityId)))
        const unis = universityIds.length > 0 ? await db.select().from(schema.universities).where(or(...universityIds.map(id => eq(schema.universities.id, id))) as any) : []

        const studentMap = new Map(students.map(s => [s.id, s]))
        const courseMap = new Map(courses.map(c => [c.id, c]))
        const counselorMap = new Map(counselors.map(c => [c.id, c]))
        const uniMap = new Map(unis.map(u => [u.id, u]))

        const enriched = items.map(item => ({
          ...item,
          student: item.studentId ? { user: studentMap.get(item.studentId) || null } : null,
          course: item.courseId ? { ...courseMap.get(item.courseId), university: uniMap.get(courseMap.get(item.courseId)?.universityId || '') || null } : null,
          counselor: item.counselorId ? { user: counselorMap.get(item.counselorId) || null } : null,
        }))

        // Client-side search filtering
        let filteredItems = enriched
        if (search) {
          const lowerSearch = search.toLowerCase()
          filteredItems = enriched.filter(
            (app) =>
              app.student?.user?.name?.toLowerCase().includes(lowerSearch) ||
              app.course?.university?.name?.toLowerCase().includes(lowerSearch) ||
              app.course?.name?.toLowerCase().includes(lowerSearch)
          )
        }

        let nextCursor: typeof cursor | undefined = undefined
        if (filteredItems.length > limit) {
          const nextItem = filteredItems.pop()
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
      const users = await db.select().from(schema.users)
        .where(eq(schema.users.role, 'COUNSELOR' as any))

      if (users.length === 0) return []

      const ids = users.map((u) => u.id)
      const profileConds = ids.map((id) => eq(schema.counselorProfiles.userId, id))
      const profiles = await db.select().from(schema.counselorProfiles).where(or(...profileConds) as any)

      const profileMap = new Map(profiles.map((p) => [p.userId, p]))
      return users.map((u) => ({ ...u, counselorProfile: profileMap.get(u.id) || null }))
    }),
    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const user = await db.select().from(schema.users)
        .where(and(eq(schema.users.id, input.id), eq(schema.users.role, 'COUNSELOR' as any)))
        .limit(1).then((r) => r[0] || null)
      if (!user) return null
      const profile = await db.select().from(schema.counselorProfiles)
        .where(eq(schema.counselorProfiles.userId, input.id))
        .limit(1).then((r) => r[0] || null)
      return { ...user, counselorProfile: profile }
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
          image: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { name, email, image, ...profileData } = input
          const userId = globalThis.crypto.randomUUID()
          await db.insert(schema.users).values({
            id: userId,
            name,
            email,
            image: image || undefined,
            role: 'COUNSELOR' as any,
          })
          await db.insert(schema.counselorProfiles).values({
            userId,
            expertiseCountries: JSON.stringify(profileData.expertiseCountries || []),
            expertiseSubjects: JSON.stringify(profileData.expertiseSubjects || []),
            languages: JSON.stringify(profileData.languages || ['English']),
            bio: profileData.bio,
            calUsername: profileData.calUsername,
            sessionRate: profileData.sessionRate || 0,
            isAvailable: profileData.isAvailable ?? true,
          } as any)
          return { success: true, userId }
        } catch (e: any) {
          if (e?.message?.includes('Duplicate') || e?.code === 'ER_DUP_ENTRY') {
            throw new Error('A user with this email already exists')
          }
          throw e
        }
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          email: z.string().email().optional(),
          image: z.string().optional(),
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
        const { id, name, email, image, ...profileData } = input
        const userUpdates: any = {}
        if (name) userUpdates.name = name
        if (email) userUpdates.email = email
        if (image !== undefined) userUpdates.image = image
        if (Object.keys(userUpdates).length > 0) {
          await db.update(schema.users).set(userUpdates).where(eq(schema.users.id, id))
        }
        const profiles = await db.select().from(schema.counselorProfiles)
          .where(eq(schema.counselorProfiles.userId, id)).limit(1)
        const profile = profiles[0] || null
        if (profile) {
          const updates: any = {}
          if (profileData.bio !== undefined) updates.bio = profileData.bio
          if (profileData.expertiseCountries !== undefined) updates.expertiseCountries = JSON.stringify(profileData.expertiseCountries)
          if (profileData.expertiseSubjects !== undefined) updates.expertiseSubjects = JSON.stringify(profileData.expertiseSubjects)
          if (profileData.languages !== undefined) updates.languages = JSON.stringify(profileData.languages)
          if (profileData.calUsername !== undefined) updates.calUsername = profileData.calUsername
          if (profileData.sessionRate !== undefined) updates.sessionRate = profileData.sessionRate
          if (profileData.isAvailable !== undefined) updates.isAvailable = profileData.isAvailable
          if (Object.keys(updates).length > 0) {
            await db.update(schema.counselorProfiles).set(updates).where(eq(schema.counselorProfiles.id, profile.id))
          }
        }
        return { success: true }
      }),
    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const profiles = await db.select().from(schema.counselorProfiles)
          .where(eq(schema.counselorProfiles.userId, input.id)).limit(1)
        const profile = profiles[0] || null
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

        return db.select().from(schema.universities)
          .where(conditions.length > 0 ? and(...conditions) : undefined as any)
          .orderBy(desc(schema.universities.createdAt))
      }),

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
return db.select().from(schema.universities)
          .where(eq(schema.universities.id, input.id))
          .limit(1)
          .then((rows) => rows[0] || null)
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
          accreditation: z.string().optional(),
          rankings: z.any().optional(),
          featured: z.boolean().default(false),
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
          accreditation: z.string().optional(),
          rankings: z.any().optional(),
          featured: z.boolean().optional(),
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

        const courses = await db.select().from(schema.courses)
          .where(conditions.length > 0 ? and(...conditions) : undefined as any)
          .orderBy(desc(schema.courses.createdAt))

        const uniIds = Array.from(new Set(courses.map((c) => c.universityId)))
        const universities = uniIds.length > 0
          ? await db.select().from(schema.universities).where(or(...uniIds.map((id) => eq(schema.universities.id, id))))
          : []
        const uniMap = new Map(universities.map((u) => [u.id, u]))

        return courses.map((c) => ({
          ...c,
          university: uniMap.get(c.universityId) ? {
            id: uniMap.get(c.universityId)!.id,
            name: uniMap.get(c.universityId)!.name,
            country: uniMap.get(c.universityId)!.country,
          } : null,
        }))
      }),

    getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
const course = await db.select().from(schema.courses)
          .where(eq(schema.courses.id, input.id))
          .limit(1)
          .then((rows) => rows[0] || null)
        if (!course) return null
        const uni = await db.select().from(schema.universities)
          .where(eq(schema.universities.id, course.universityId))
          .limit(1)
          .then((rows) => rows[0] || null)
        return { ...course, university: uni }
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
          campus: z.string().optional(),
          modeOfStudy: z.enum(['FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID']).default('FULL_TIME'),
          highlights: z.array(z.string()).default([]),
          professionalAccreditation: z.string().optional(),
          offerResponseTime: z.string().optional(),
          backlogsAccepted: z.boolean().default(false),
          gapYearsAccepted: z.boolean().default(false),
          englishTestWaiver: z.boolean().default(false),
          expressOffer: z.boolean().default(false),
          applicationFee: z.number().optional(),
          brochureUrl: z.string().optional(),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const inserted = await db.insert(schema.courses).values(input as any).$returningId()
        const id = (inserted as any)?.[0]?.id
        return { success: true, id }
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
          campus: z.string().optional(),
          modeOfStudy: z.enum(['FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID']).optional(),
          highlights: z.array(z.string()).optional(),
          professionalAccreditation: z.string().optional(),
          offerResponseTime: z.string().optional(),
          backlogsAccepted: z.boolean().optional(),
          gapYearsAccepted: z.boolean().optional(),
          englishTestWaiver: z.boolean().optional(),
          expressOffer: z.boolean().optional(),
          applicationFee: z.number().optional(),
          brochureUrl: z.string().optional(),
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

  // ─── Requirements Pool CRUD ──────────────────────────────────

  requirements: createTRPCRouter({
    list: adminProcedure
      .input(z.object({ type: z.string().optional() }))
      .query(async ({ input }) => {
        const conds = input.type ? [eq(schema.requirements.type, input.type as any)] : []
        return db.select().from(schema.requirements)
          .where(conds.length > 0 ? and(...conds) : undefined)
          .orderBy(schema.requirements.name)
      }),

    create: adminProcedure
      .input(z.object({
        type: z.enum(['ACADEMIC', 'ENGLISH_LANGUAGE', 'IDENTITY', 'MEDICAL', 'PROFESSIONAL', 'OTHER']),
        name: z.string().min(1),
        minPercentage: z.number().optional(),
        description: z.string().optional(),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        await db.insert(schema.requirements).values(input as any)
        return { success: true }
      }),

    update: adminProcedure
      .input(z.object({
        id: z.string(),
        type: z.enum(['ACADEMIC', 'ENGLISH_LANGUAGE', 'IDENTITY', 'MEDICAL', 'PROFESSIONAL', 'OTHER']).optional(),
        name: z.string().min(1).optional(),
        minPercentage: z.number().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        await db.update(schema.requirements).set(data as any).where(eq(schema.requirements.id, id))
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.requirements).where(eq(schema.requirements.id, input.id))
        return { success: true }
      }),
  }),

  // ─── Course Requirements (Junction) ──────────────────────────

  courseRequirements: createTRPCRouter({
    list: adminProcedure
      .input(z.object({ courseId: z.string() }))
      .query(async ({ input }) => {
        return db.select().from(schema.platformCourseRequirements)
          .where(eq(schema.platformCourseRequirements.courseId, input.courseId))
      }),

    set: adminProcedure
      .input(z.object({
        courseId: z.string(),
        requirementIds: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        await db.delete(schema.platformCourseRequirements)
          .where(eq(schema.platformCourseRequirements.courseId, input.courseId))
        if (input.requirementIds.length > 0) {
          await db.insert(schema.platformCourseRequirements)
            .values(input.requirementIds.map((rid) => ({ courseId: input.courseId, requirementId: rid })) as any)
        }
        return { success: true }
      }),
  }),

  // ─── Related Courses ─────────────────────────────────────────

  relatedCourses: createTRPCRouter({
    list: adminProcedure
      .input(z.object({ courseId: z.string() }))
      .query(async ({ input }) => {
        return db.select().from(schema.relatedCourses)
          .where(eq(schema.relatedCourses.courseId, input.courseId))
          .orderBy(schema.relatedCourses.sortOrder)
      }),

    set: adminProcedure
      .input(z.object({
        courseId: z.string(),
        relatedCourseIds: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        await db.delete(schema.relatedCourses)
          .where(eq(schema.relatedCourses.courseId, input.courseId))
        if (input.relatedCourseIds.length > 0) {
          await db.insert(schema.relatedCourses)
            .values(input.relatedCourseIds.map((rid, i) => ({
              courseId: input.courseId,
              relatedCourseId: rid,
              sortOrder: i,
            })) as any)
        }
        return { success: true }
      }),
  }),

  // ─── Course Modules ──────────────────────────────────────────

  courseModules: createTRPCRouter({
    create: adminProcedure
      .input(z.object({
        courseId: z.string(),
        term: z.string(),
        name: z.string().min(1),
        type: z.enum(['CORE', 'OPTIONAL']),
      }))
      .mutation(async ({ input }) => {
        await db.insert(schema.courseModules).values(input)
        return { success: true }
      }),

    deleteByCourse: adminProcedure
      .input(z.object({ courseId: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.courseModules)
          .where(eq(schema.courseModules.courseId, input.courseId))
        return { success: true }
      }),
  }),

  // ─── Course Intakes ──────────────────────────────────────────

  courseIntakes: createTRPCRouter({
    create: adminProcedure
      .input(z.object({
        courseId: z.string(),
        intakeDate: z.date(),
        applyByDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.insert(schema.platformCourseIntakes).values(input as any)
        return { success: true }
      }),

    deleteByCourse: adminProcedure
      .input(z.object({ courseId: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.platformCourseIntakes)
          .where(eq(schema.platformCourseIntakes.courseId, input.courseId))
        return { success: true }
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

        return db.select().from(schema.countries)
          .where(conditions.length > 0 ? and(...conditions) : undefined as any)
          .orderBy(schema.countries.name)
      }),

    getById: adminProcedure.input(z.object({ code: z.string() })).query(async ({ input }) => {
return db.select().from(schema.countries)
          .where(eq(schema.countries.code, input.code))
          .limit(1)
          .then((rows) => rows[0] || null)
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

  // ─── Deadlines ────────────────────────────────────────────

  deadlines: createTRPCRouter({
    list: adminProcedure
      .input(z.object({ search: z.string().trim().max(255).optional(), category: z.string().max(50).optional() }))
      .query(async ({ input }) => {
        const conditions: any[] = []
        if (input.search) {
          conditions.push(or(like(schema.deadlines.title, `%${input.search}%`), isNull(schema.deadlines.studentId), eq(schema.users.name, input.search)))
        }
        if (input.category) {
          conditions.push(eq(schema.deadlines.category, input.category))
        }
        const rows = await db
          .select({
            id: schema.deadlines.id,
            studentId: schema.deadlines.studentId,
            title: schema.deadlines.title,
            description: schema.deadlines.description,
            category: schema.deadlines.category,
            dueAt: schema.deadlines.dueAt,
            relatedUniversity: schema.deadlines.relatedUniversity,
            relatedCourse: schema.deadlines.relatedCourse,
            isActive: schema.deadlines.isActive,
            remindDaysBefore: schema.deadlines.remindDaysBefore,
            createdAt: schema.deadlines.createdAt,
            studentName: schema.users.name,
          })
          .from(schema.deadlines)
          .leftJoin(schema.studentProfiles, eq(schema.deadlines.studentId, schema.studentProfiles.id))
          .leftJoin(schema.users, eq(schema.studentProfiles.userId, schema.users.id))
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(asc(schema.deadlines.dueAt))
        return rows.map((r: any) => ({ ...r, dueAt: r.dueAt?.toISOString?.() ?? r.dueAt }))
      }),

    students: adminProcedure.query(async () => {
      const rows = await db
        .select({ id: schema.studentProfiles.id, name: schema.users.name, email: schema.users.email })
        .from(schema.studentProfiles)
        .leftJoin(schema.users, eq(schema.studentProfiles.userId, schema.users.id))
        .orderBy(asc(schema.users.name))
      return rows.map((r: any) => ({ id: r.id, name: r.name ?? 'Student', email: r.email ?? '' }))
    }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().trim().min(1, 'Title is required').max(255),
          description: z.string().trim().max(5000).optional(),
          category: z.enum(['APPLICATION', 'DOCUMENT', 'VISA', 'SCHOLARSHIP', 'EXAM', 'OTHER']).default('OTHER'),
          dueAt: z.string().min(1),
          studentId: z.string().max(25).nullable().optional(),
          relatedUniversity: z.string().trim().max(255).optional(),
          relatedCourse: z.string().trim().max(255).optional(),
          isActive: z.boolean().default(true),
          remindDaysBefore: z.number().int().min(0).max(365).default(7),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const dueAt = new Date(input.dueAt)
        if (Number.isNaN(dueAt.getTime())) throw new Error('Invalid due date')
        await db.insert(schema.deadlines).values({
          title: input.title,
          description: input.description ?? null,
          category: input.category,
          dueAt,
          studentId: input.studentId || null,
          relatedUniversity: input.relatedUniversity ?? null,
          relatedCourse: input.relatedCourse ?? null,
          isActive: input.isActive,
          remindDaysBefore: input.remindDaysBefore,
          createdBy: ctx.session.user.id,
        })
        return { success: true }
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.string().min(1),
          title: z.string().trim().min(1).max(255).optional(),
          description: z.string().trim().max(5000).nullable().optional(),
          category: z.enum(['APPLICATION', 'DOCUMENT', 'VISA', 'SCHOLARSHIP', 'EXAM', 'OTHER']).optional(),
          dueAt: z.string().min(1).optional(),
          studentId: z.string().max(25).nullable().optional(),
          relatedUniversity: z.string().trim().max(255).nullable().optional(),
          relatedCourse: z.string().trim().max(255).nullable().optional(),
          isActive: z.boolean().optional(),
          remindDaysBefore: z.number().int().min(0).max(365).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const updates: any = {}
        if (input.title !== undefined) updates.title = input.title
        if (input.description !== undefined) updates.description = input.description
        if (input.category !== undefined) updates.category = input.category
        if (input.dueAt !== undefined) {
          const dueAt = new Date(input.dueAt)
          if (Number.isNaN(dueAt.getTime())) throw new Error('Invalid due date')
          updates.dueAt = dueAt
        }
        if (input.studentId !== undefined) updates.studentId = input.studentId || null
        if (input.relatedUniversity !== undefined) updates.relatedUniversity = input.relatedUniversity || null
        if (input.relatedCourse !== undefined) updates.relatedCourse = input.relatedCourse || null
        if (input.isActive !== undefined) updates.isActive = input.isActive
        if (input.remindDaysBefore !== undefined) updates.remindDaysBefore = input.remindDaysBefore
        updates.updatedAt = new Date()
        if (!Object.keys(updates).length) throw new Error('Nothing to update')
        await db.update(schema.deadlines).set(updates).where(eq(schema.deadlines.id, input.id))
        return { success: true }
      }),

    remove: adminProcedure
      .input(z.object({ id: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await db.delete(schema.deadlines).where(eq(schema.deadlines.id, input.id))
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
          status: z.enum(['PENDING', 'UPLOADED', 'VERIFIED', 'REJECTED']).optional(),
          limit: z.number().min(1).max(200).default(100),
        })
      )
      .query(async ({ input }) => {
        const conditions: any[] = []
        if (input.status) conditions.push(eq(schema.studentDocuments.status, input.status))
        if (input.search) {
          const s = `%${input.search}%`
          conditions.push(
            or(
              like(schema.users.name, s),
              like(schema.users.email, s),
              like(schema.studentDocuments.label, s)
            )
          )
        }

        const rows = await db
          .select({
            id: schema.studentDocuments.id,
            studentId: schema.studentDocuments.studentId,
            applicationId: schema.studentDocuments.applicationId,
            category: schema.studentDocuments.category,
            label: schema.studentDocuments.label,
            fileUrl: schema.studentDocuments.fileUrl,
            fileName: schema.studentDocuments.fileName,
            fileSize: schema.studentDocuments.fileSize,
            status: schema.studentDocuments.status,
            rejectionReason: schema.studentDocuments.rejectionReason,
            uploadedAt: schema.studentDocuments.uploadedAt,
            updatedAt: schema.studentDocuments.updatedAt,
            studentName: schema.users.name,
            studentEmail: schema.users.email,
            highestEducation: schema.studentProfiles.highestEducation,
          })
          .from(schema.studentDocuments)
          .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.id, schema.studentDocuments.studentId))
          .leftJoin(schema.users, eq(schema.users.id, schema.studentProfiles.userId))
          .where(conditions.length ? and(...conditions) : undefined as any)
          .orderBy(desc(schema.studentDocuments.updatedAt))
          .limit(input.limit)

        return rows.map((row: any) => ({
          ...row,
          level: applicantLevelFromEducation(row.highestEducation),
        }))
      }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.string().min(1),
          status: z.enum(['PENDING', 'UPLOADED', 'VERIFIED', 'REJECTED']),
          rejectionReason: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(schema.studentDocuments)
          .set({
            status: input.status,
            rejectionReason: input.status === 'REJECTED' ? input.rejectionReason?.trim() || null : null,
          })
          .where(eq(schema.studentDocuments.id, input.id))
        return { success: true }
      }),
  }),

  // ─── Branches CRUD ─────────────────────────────────────────

  branches: createTRPCRouter({
    list: superAdminProcedure
      .input(
        z.object({
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const conditions = []
        if (input.search) {
          conditions.push(
            or(
              like(schema.branches.name, `%${input.search}%`),
              like(schema.branches.code, `%${input.search}%`),
              like(schema.branches.country, `%${input.search}%`),
              like(schema.branches.city, `%${input.search}%`)
            )
          )
        }
        return db.select().from(schema.branches)
          .where(conditions.length > 0 ? and(...conditions) : undefined as any)
          .orderBy(desc(schema.branches.createdAt))
      }),

    getById: superAdminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.select().from(schema.branches)
          .where(eq(schema.branches.id, input.id))
          .limit(1)
          .then((rows) => rows[0] || null)
      }),

    create: superAdminProcedure
      .input(
        z.object({
          code: z.string().min(1).max(10),
          name: z.string().min(1),
          country: z.string().min(1),
          city: z.string().min(1),
          address: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().email().optional().or(z.literal('')),
          status: z.enum(['ACTIVE', 'INACTIVE', 'SETUP', 'CLOSED']).default('ACTIVE'),
          managerName: z.string().optional(),
          counselors: z.number().default(0),
          applications: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(schema.branches).values(input as any)
        return { success: true }
      }),

    update: superAdminProcedure
      .input(
        z.object({
          id: z.string(),
          code: z.string().min(1).max(10).optional(),
          name: z.string().min(1).optional(),
          country: z.string().min(1).optional(),
          city: z.string().min(1).optional(),
          address: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().email().optional().or(z.literal('')),
          status: z.enum(['ACTIVE', 'INACTIVE', 'SETUP', 'CLOSED']).optional(),
          managerName: z.string().optional(),
          counselors: z.number().optional(),
          applications: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        await db.update(schema.branches).set(data as any).where(eq(schema.branches.id, id))
        return { success: true }
      }),

    delete: superAdminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.delete(schema.branches).where(eq(schema.branches.id, input.id))
        return { success: true }
      }),
  }),

  // ─── Revenue (super admin) ────────────────────────────────
  revenue: createTRPCRouter({
    getOverview: superAdminProcedure.query(async () => {
      const [totalAgg] = await db
        .select({
          paid: sql<number>`COALESCE(SUM(${schema.bookingSessions.amountPaid}), 0)` as any,
          cnt: count() as any,
        })
        .from(schema.bookingSessions)
        .where(sql`${schema.bookingSessions.amountPaid} > 0` as any)

      const firstOfMonth = new Date()
      firstOfMonth.setDate(1)
      firstOfMonth.setHours(0, 0, 0, 0)

      const [monthAgg] = await db
        .select({
          paid: sql<number>`COALESCE(SUM(${schema.bookingSessions.amountPaid}), 0)` as any,
          cnt: count() as any,
        })
        .from(schema.bookingSessions)
        .where(
          and(
            sql`${schema.bookingSessions.amountPaid} > 0` as any,
            gte(schema.bookingSessions.createdAt, firstOfMonth)
          )
        )

      const recent = await db
        .select({
          id: schema.bookingSessions.id,
          amountPaid: schema.bookingSessions.amountPaid,
          createdAt: schema.bookingSessions.createdAt,
          status: schema.bookingSessions.status,
          counselorId: schema.bookingSessions.counselorId,
          studentName: schema.users.name,
        })
        .from(schema.bookingSessions)
        .leftJoin(schema.studentProfiles, eq(schema.bookingSessions.studentId, schema.studentProfiles.id))
        .leftJoin(schema.users, eq(schema.studentProfiles.userId, schema.users.id))
        .where(sql`${schema.bookingSessions.amountPaid} > 0` as any)
        .orderBy(desc(schema.bookingSessions.createdAt))
        .limit(15)

      const counselorIds = Array.from(new Set(recent.map((r: any) => r.counselorId).filter(Boolean)))
      let counselorMap = new Map<string, string>()
      if (counselorIds.length) {
        const counselorRows = await db
          .select({ id: schema.counselorProfiles.id, name: schema.users.name })
          .from(schema.counselorProfiles)
          .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
          .where(inArray(schema.counselorProfiles.id, counselorIds))
        counselorMap = new Map(counselorRows.map((c: any) => [c.id, c.name || 'Counselor']))
      }

      return {
        totalRevenue: Number(totalAgg?.paid ?? 0),
        paidSessions: Number(totalAgg?.cnt ?? 0),
        thisMonthRevenue: Number(monthAgg?.paid ?? 0),
        thisMonthSessions: Number(monthAgg?.cnt ?? 0),
        recentTransactions: recent.map((r: any) => ({
          id: r.id,
          amountPaid: r.amountPaid || 0,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
          status: r.status,
          studentName: r.studentName || 'Student',
          counselorName: counselorMap.get(r.counselorId) || 'Counselor',
        })),
      }
    }),
  }),

  // ─── Settings (admin profile) ─────────────────────────────
  settings: createTRPCRouter({
    getProfile: adminProcedure.query(async ({ ctx }) => {
      const [user] = await db
        .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, image: schema.users.image })
        .from(schema.users)
        .where(eq(schema.users.id, ctx.session.user.id))
        .limit(1)
      return user ?? null
    }),

    updateProfile: adminProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(100),
          email: z.string().email().max(255),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Check email uniqueness if it changed.
        const [existing] = await db
          .select({ id: schema.users.id })
          .from(schema.users)
          .where(and(eq(schema.users.email, input.email), ne(schema.users.id, ctx.session.user.id)))
          .limit(1)
        if (existing) throw new Error('That email is already in use')

        await db
          .update(schema.users)
          .set({ name: input.name, email: input.email, updatedAt: new Date() })
          .where(eq(schema.users.id, ctx.session.user.id))
        return { success: true }
      }),
  }),

  // ─── Super Admin Only ────────────────────────────────────
  super: createTRPCRouter({
    getAdmins: superAdminProcedure.query(async () => {
      const admins = await db.query.users.findMany({
        where: (u: any, { or: _or, eq: _eq }: any) =>
          _or(_eq(u.role, 'ADMIN'), _eq(u.role, 'SUPER_ADMIN')),
        orderBy: [desc(schema.users.createdAt) as any],
      })
      return admins.map((a: any) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role,
        emailVerified: a.emailVerified,
        createdAt: a.createdAt,
      }))
    }),

    getAllUsers: superAdminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          role: z.enum(['STUDENT', 'COUNSELOR', 'ADMIN', 'SUPER_ADMIN']).optional(),
          limit: z.number().min(1).max(200).default(100),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        const conditions: any[] = []
        if (input.role) conditions.push(eq(schema.users.role, input.role))
        if (input.search) {
          conditions.push(
            or(
              like(schema.users.name, `%${input.search}%`),
              like(schema.users.email, `%${input.search}%`)
            )
          )
        }
        const users = await db.query.users.findMany({
          where: conditions.length > 0 ? and(...conditions) : undefined,
          orderBy: [desc(schema.users.createdAt) as any],
          limit: input.limit,
          offset: input.offset,
          columns: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            image: true,
          },
        })
        const totalRes = await db
          .select({ value: count() as any })
          .from(schema.users)
          .where(conditions.length > 0 ? and(...conditions) : undefined as any)
        return {
          users,
          total: totalRes[0]?.value || 0,
        }
      }),

    updateUserRole: superAdminProcedure
      .input(
        z.object({
          userId: z.string(),
          role: z.enum(['STUDENT', 'COUNSELOR', 'ADMIN', 'SUPER_ADMIN']),
        })
      )
      .mutation(async ({ input }) => {
        const user = await db.query.users.findFirst({
          where: (u: any, { eq: _eq }: any) => _eq(u.id, input.userId),
          columns: { id: true, role: true },
        })
        if (!user) throw new Error('User not found')

        // Prevent demoting the last super admin
        if ((user as any).role === 'SUPER_ADMIN' && input.role !== 'SUPER_ADMIN') {
          const superAdminCount = await db
            .select({ value: count() as any })
            .from(schema.users)
            .where(eq(schema.users.role, 'SUPER_ADMIN'))
          if (superAdminCount[0]?.value <= 1) {
            throw new Error('Cannot demote the last Super Admin')
          }
        }

        await db
          .update(schema.users)
          .set({ role: input.role })
          .where(eq(schema.users.id, input.userId))
        return { success: true }
      }),

    deleteUser: superAdminProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        const user = await db.query.users.findFirst({
          where: (u: any, { eq: _eq }: any) => _eq(u.id, input.userId),
          columns: { id: true, role: true },
        })
        if (!user) throw new Error('User not found')
        if ((user as any).role === 'SUPER_ADMIN') throw new Error('Cannot delete a Super Admin')

        // Clean up related records
        const studentProfile = await db.query.studentProfiles.findFirst({
          where: (s: any, { eq: _eq }: any) => _eq(s.userId, input.userId),
          columns: { id: true },
        })
        if (studentProfile) {
          await db.delete(schema.studentProfiles).where(eq(schema.studentProfiles.id, studentProfile.id) as any)
        }
        const counselorProfile = await db.query.counselorProfiles.findFirst({
          where: (c: any, { eq: _eq }: any) => _eq(c.userId, input.userId),
          columns: { id: true },
        })
        if (counselorProfile) {
          await db.delete(schema.counselorProfiles).where(eq(schema.counselorProfiles.id, counselorProfile.id) as any)
        }
        await db.delete(schema.accounts).where(eq(schema.accounts.userId, input.userId) as any)
        await db.delete(schema.sessions).where(eq(schema.sessions.userId, input.userId) as any)
        await db.delete(schema.users).where(eq(schema.users.id, input.userId))
        return { success: true }
      }),

    deleteAdmin: superAdminProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        const user = await db.query.users.findFirst({
          where: (u: any, { eq: _eq }: any) => _eq(u.id, input.userId),
        })
        if (!user) throw new Error('User not found')
        if ((user as any).role === 'SUPER_ADMIN') throw new Error('Cannot delete a Super Admin')
        await db.delete(schema.users).where(eq(schema.users.id, input.userId))
        return { success: true }
      }),

    getPlatformStats: superAdminProcedure.query(async () => {
      const [totalUsers, studentCount, counselorCount, adminCount, universitiesCount, upcomingSessionsCount] = await Promise.all([
        db.select({ value: count() as any }).from(schema.users),
        db.select({ value: count() as any }).from(schema.users).where(eq(schema.users.role, 'STUDENT')),
        db.select({ value: count() as any }).from(schema.users).where(eq(schema.users.role, 'COUNSELOR')),
        db.select({ value: count() as any }).from(schema.users).where(or(eq(schema.users.role, 'ADMIN'), eq(schema.users.role, 'SUPER_ADMIN'))),
        db.select({ value: count() as any }).from(schema.universities).where(eq(schema.universities.isActive, true)),
        db.select({ value: count() as any }).from(schema.bookingSessions),
      ])

      return {
        totalUsers: totalUsers[0]?.value || 0,
        students: studentCount[0]?.value || 0,
        counselors: counselorCount[0]?.value || 0,
        admins: adminCount[0]?.value || 0,
        universities: universitiesCount[0]?.value || 0,
        upcomingSessions: upcomingSessionsCount[0]?.value || 0,
      }
    }),
  }),
})
