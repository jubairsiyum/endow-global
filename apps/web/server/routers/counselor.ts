import { createTRPCRouter, counselorProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq, desc as _desc, and as _and, like as _like, or as _or, count as _count, sql as _sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/mysql-core'
import { z } from 'zod'

const eq = _eq as any
const desc = _desc as any
const and = _and as any
const like = _like as any
const or = _or as any
const count = _count as any
const sql = _sql as any

async function resolveCounselorProfile(ctx: any) {
  const userId = ctx.session.user.id
  const [profile] = await ctx.db.select().from(schema.counselorProfiles).where(eq(schema.counselorProfiles.userId, userId)).limit(1)
  return profile ?? null
}

export const counselorRouter = createTRPCRouter({
  // ── Dashboard stats ────────────────────────────────────────────
  getDashboardStats: counselorProcedure.query(async ({ ctx }) => {
    const profile = await resolveCounselorProfile(ctx)
    if (!profile) return { students: 0, applications: 0, sessions: 0, sessionsWeek: 0, avgRating: null, recentStudents: [], upcomingSessions: [], applicationsByStatus: [] }

    const studentUser = alias(schema.users as any, 'student_user')

    const [studentCount, appRows, sessionCount, weekSessions, ratingRow, recentStudents, upcomingSessions] = await Promise.all([
      ctx.db.select({ value: count() as any }).from(schema.studentProfiles).where(eq(schema.studentProfiles.assignedCounselorId, profile.id)),
      ctx.db
        .select({ status: schema.applications.status, count: count() as any })
        .from(schema.applications)
        .where(eq(schema.applications.counselorId, profile.id))
        .groupBy(schema.applications.status)
        .then((r: any[]) => r)
        .catch(() => []),
      ctx.db.select({ value: count() as any }).from(schema.bookingSessions).where(eq(schema.bookingSessions.counselorId, profile.id)),
      ctx.db
        .select({ value: count() as any })
        .from(schema.bookingSessions)
        .where(and(eq(schema.bookingSessions.counselorId, profile.id), sql`${schema.bookingSessions.scheduledAt} >= NOW() AND ${schema.bookingSessions.scheduledAt} < DATE_ADD(NOW(), INTERVAL 7 DAY)` as any))
        .then((r: any) => Number(r[0]?.value ?? 0))
        .catch(() => 0),
      Promise.resolve(profile.rating),
      ctx.db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          nationality: schema.studentProfiles.nationality,
          targetCountries: schema.studentProfiles.targetCountries,
          assignedAt: schema.studentProfiles.createdAt,
        })
        .from(schema.studentProfiles)
        .leftJoin(schema.users, eq(schema.users.id, schema.studentProfiles.userId))
        .where(eq(schema.studentProfiles.assignedCounselorId, profile.id))
        .orderBy(desc(schema.studentProfiles.createdAt))
        .limit(5),
      ctx.db
        .select({
          id: schema.bookingSessions.id,
          scheduledAt: schema.bookingSessions.scheduledAt,
          status: schema.bookingSessions.status,
          duration: schema.bookingSessions.duration,
          meetingUrl: schema.bookingSessions.meetingUrl,
          studentName: studentUser.name,
        })
        .from(schema.bookingSessions)
        .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.id, schema.bookingSessions.studentId))
        .leftJoin(studentUser as any, eq((studentUser as any).id, schema.studentProfiles.userId))
        .where(and(eq(schema.bookingSessions.counselorId, profile.id), eq(schema.bookingSessions.status, 'SCHEDULED')))
        .orderBy(schema.bookingSessions.scheduledAt)
        .limit(5),
    ])

    return {
      students: Number(studentCount[0]?.value ?? 0),
      applications: (appRows as any[]).reduce((acc: number, r: any) => acc + Number(r.count ?? 0), 0),
      applicationsByStatus: appRows,
      sessions: Number(sessionCount[0]?.value ?? 0),
      sessionsWeek: Number(weekSessions ?? 0),
      avgRating: ratingRow,
      recentStudents: recentStudents.map((s: any) => ({
        id: s.id,
        name: s.name || 'Student',
        email: s.email || '',
        nationality: s.nationality,
        targetCountries: (() => { try { return typeof s.targetCountries === 'string' ? JSON.parse(s.targetCountries) : s.targetCountries ?? [] } catch { return [] } })(),
      })),
      upcomingSessions: upcomingSessions.map((s: any) => ({
        id: s.id,
        scheduledAt: s.scheduledAt,
        status: s.status,
        duration: s.duration,
        meetingUrl: s.meetingUrl,
        studentName: s.studentName || 'Student',
      })),
    }
  }),

  getAssignedStudents: counselorProcedure
    .input(z.object({ search: z.string().optional(), limit: z.number().min(1).max(100).default(20), cursor: z.string().nullish() }).optional())
    .query(async ({ ctx, input }) => {
      const profile = await resolveCounselorProfile(ctx)
      if (!profile) return { items: [], nextCursor: undefined }
      const search = input?.search
      const limit = input?.limit ?? 20
      const cursor = input?.cursor
      const conditions: any[] = [eq(schema.studentProfiles.assignedCounselorId, profile.id)]
      if (search) conditions.push(or(like(schema.users.name, `%${search}%`), like(schema.users.email, `%${search}%`)))
      if (cursor) conditions.push(sql`${schema.users.id} < ${cursor}` as any)

      const studentUser = alias(schema.users as any, 'student_user')
      const rows = await ctx.db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          image: schema.users.image,
          createdAt: schema.users.createdAt,
          studentProfileId: schema.studentProfiles.id,
          nationality: schema.studentProfiles.nationality,
          targetCountries: schema.studentProfiles.targetCountries,
          completionPercent: schema.studentProfiles.completionPercent,
        })
        .from(schema.studentProfiles)
        .leftJoin(schema.users, eq(schema.users.id, schema.studentProfiles.userId))
        .where(and(...conditions))
        .orderBy(desc(schema.users.id))
        .limit(limit + 1)

      let nextCursor: string | undefined
      let items = rows as any[]
      if (items.length > limit) {
        const nxt = items.pop() as any
        nextCursor = (nxt?.id as string) ?? undefined
      }
      return {
        items: items.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          image: r.image,
          createdAt: r.createdAt,
          nationality: r.nationality,
          targetCountries: (() => { try { return typeof r.targetCountries === 'string' ? JSON.parse(r.targetCountries) : r.targetCountries ?? [] } catch { return [] } })(),
          completionPercent: r.completionPercent,
          studentProfileId: r.studentProfileId,
        })),
        nextCursor,
      }
    }),

  getApplications: counselorProcedure
    .input(z.object({ search: z.string().optional(), status: z.string().optional(), limit: z.number().min(1).max(100).default(20), cursor: z.string().nullish() }).optional())
    .query(async ({ ctx, input }) => {
      const profile = await resolveCounselorProfile(ctx)
      if (!profile) return { items: [], nextCursor: undefined }
      const conditions: any[] = [eq(schema.applications.counselorId, profile.id)]
      if (input?.status) conditions.push(eq(schema.applications.status, input.status))
      if (input?.cursor) conditions.push(sql`${schema.applications.id} < ${input.cursor}` as any)

      const studentUser = alias(schema.users as any, 'student_user')
      const rows = await ctx.db
        .select({
          id: schema.applications.id,
          status: schema.applications.status,
          currentStep: schema.applications.currentStep,
          totalSteps: schema.applications.totalSteps,
          submittedAt: schema.applications.submittedAt,
          updatedAt: schema.applications.updatedAt,
          courseName: schema.courses.name,
          universityName: schema.universities.name,
          studentName: studentUser.name,
        } as any)
        .from(schema.applications)
        .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.id, schema.applications.studentId))
        .leftJoin(studentUser as any, eq((studentUser as any).id, schema.studentProfiles.userId))
        .leftJoin(schema.courses, eq(schema.courses.id, schema.applications.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(and(...conditions))
        .orderBy(desc(schema.applications.updatedAt))
        .limit((input?.limit ?? 20) + 1)

      let nextCursor: string | undefined
      let items = rows as any[]
      if (items.length > (input?.limit ?? 20)) {
        const nxt = items.pop()
        nextCursor = nxt.id
      }
      // Simple client-side search on course/student name
      if (input?.search) {
        const s = input.search.toLowerCase()
        items = items.filter((a: any) => (a.courseName?.toLowerCase().includes(s) || a.studentName?.toLowerCase().includes(s) || a.universityName?.toLowerCase().includes(s)))
      }
      return { items, nextCursor }
    }),

  getSessions: counselorProcedure
    .input(z.object({ status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(), limit: z.number().min(1).max(100).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const profile = await resolveCounselorProfile(ctx)
      if (!profile) return []
      const studentUser = alias(schema.users as any, 'student_user')
      const conditions: any[] = [eq(schema.bookingSessions.counselorId, profile.id)]
      if (input?.status) conditions.push(eq(schema.bookingSessions.status, input.status))

      const rows = await ctx.db
        .select({
          id: schema.bookingSessions.id,
          scheduledAt: schema.bookingSessions.scheduledAt,
          duration: schema.bookingSessions.duration,
          status: schema.bookingSessions.status,
          meetingUrl: schema.bookingSessions.meetingUrl,
          notes: schema.bookingSessions.notes,
          studentName: studentUser.name,
          studentEmail: studentUser.email,
        })
        .from(schema.bookingSessions)
        .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.id, schema.bookingSessions.studentId))
        .leftJoin(studentUser as any, eq((studentUser as any).id, schema.studentProfiles.userId))
        .where(and(...conditions))
        .orderBy(desc(schema.bookingSessions.scheduledAt))
        .limit(input?.limit ?? 20)
      return rows
    }),

  getProfile: counselorProcedure.query(async ({ ctx }) => {
    const profile = await resolveCounselorProfile(ctx)
    if (!profile) return null
    const [user] = await ctx.db.select({ name: schema.users.name, email: schema.users.email, image: schema.users.image }).from(schema.users).where(eq(schema.users.id, ctx.session.user.id)).limit(1)
    return { ...profile, user }
  }),
})
