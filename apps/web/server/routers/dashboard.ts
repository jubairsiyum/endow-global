import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import {
  eq as _eq,
  and as _and,
  sql as _sql,
  inArray as _inArray,
  ne as _ne,
  desc as _desc,
  asc as _asc,
  gte as _gte,
} from 'drizzle-orm'
import { z } from 'zod'

const eq = _eq as any
const and = _and as any
const sql = _sql as any
const inArray = _inArray as any
const ne = _ne as any
const desc = _desc as any
const asc = _asc as any
const gte = _gte as any

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

async function resolveStudent(ctx: any) {
  const rows = await ctx.db
    .select({ user: schema.users, profile: schema.studentProfiles })
    .from(schema.users)
    .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.userId, schema.users.id))
    .where(eq(schema.users.id, ctx.session.user.id))
    .limit(1)
  const row = rows[0]
  return row ? { ...row.user, studentProfile: row.profile } : null
}

function groupByCourse<T extends { courseId: string | null }>(rows: T[]) {
  return rows.reduce<Record<string, T[]>>((groups, row) => {
    if (row.courseId) (groups[row.courseId] ??= []).push(row)
    return groups
  }, {})
}

function daysUntil(date: Date | string | null | undefined): number | null {
  if (!date) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

// ─────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────

export const dashboardRouter = createTRPCRouter({
  // ── Aggregate overview for the landing page ────────────────
  overview: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const user = await resolveStudent(ctx)
    const profile = user?.studentProfile ?? null
    const studentId = profile?.id ?? null

    if (!studentId) {
      return {
        user: { id: user?.id, name: user?.name, email: user?.email, image: user?.image },
        profile: null,
        counselor: null,
        stats: {
          applications: 0,
          shortlisted: 0,
          matches: 0,
          documentsUploaded: 0,
          documentsTotal: 0,
          unreadMessages: 0,
          unreadNotifications: 0,
          upcomingSessions: 0,
          applicationProgress: 0,
          daysUntilNextDeadline: null,
        },
        applications: [],
        shortlisted: [],
        matches: [],
        upcomingSessions: [],
        documents: [],
        notifications: [],
        deadlines: [],
      }
    }

    const now = new Date()

    const [applicationRows, intakeRows, shortlistRows, matchRows, sessionRows, documents, notifications, counselorRows, unreadMessages, unreadNotifications] = await Promise.all([
      ctx.db.select({
        id: schema.applications.id,
        studentId: schema.applications.studentId,
        courseId: schema.applications.courseId,
        counselorId: schema.applications.counselorId,
        status: schema.applications.status,
        currentStep: schema.applications.currentStep,
        totalSteps: schema.applications.totalSteps,
        documentsUrls: schema.applications.documentsUrls,
        submittedAt: schema.applications.submittedAt,
        counselorNotes: schema.applications.counselorNotes,
        createdAt: schema.applications.createdAt,
        updatedAt: schema.applications.updatedAt,
        courseName: schema.courses.name,
        courseSlug: schema.courses.slug,
        courseDeadline: schema.courses.applicationDeadline,
        universityName: schema.universities.name,
        universityCountry: schema.universities.country,
      }).from(schema.applications)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.applications.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.applications.studentId, studentId))
        .orderBy(desc(schema.applications.updatedAt)),
      ctx.db.select().from(schema.platformCourseIntakes).where(inArray(schema.platformCourseIntakes.courseId, ctx.db.select({ id: schema.applications.courseId }).from(schema.applications).where(eq(schema.applications.studentId, studentId)))),
      ctx.db.select({
        id: schema.shortlistedCourses.id,
        studentId: schema.shortlistedCourses.studentId,
        courseId: schema.shortlistedCourses.courseId,
        notes: schema.shortlistedCourses.notes,
        createdAt: schema.shortlistedCourses.createdAt,
        courseName: schema.courses.name,
        courseSlug: schema.courses.slug,
        subject: schema.courses.subject,
        level: schema.courses.level,
        duration: schema.courses.duration,
        tuitionFee: schema.courses.tuitionFee,
        currency: schema.courses.currency,
        hasScholarship: schema.courses.hasScholarship,
        universityName: schema.universities.name,
        universityCountry: schema.universities.country,
        universityCity: schema.universities.city,
      }).from(schema.shortlistedCourses)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.shortlistedCourses.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.shortlistedCourses.studentId, studentId))
        .orderBy(desc(schema.shortlistedCourses.createdAt)),
      ctx.db.select({
        id: schema.matchResults.id,
        studentId: schema.matchResults.studentId,
        courseId: schema.matchResults.courseId,
        score: schema.matchResults.score,
        matchReasons: schema.matchResults.matchReasons,
        courseName: schema.courses.name,
        courseSlug: schema.courses.slug,
        tuitionFee: schema.courses.tuitionFee,
        currency: schema.courses.currency,
        hasScholarship: schema.courses.hasScholarship,
        universityName: schema.universities.name,
        universityCountry: schema.universities.country,
      }).from(schema.matchResults)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.matchResults.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.matchResults.studentId, studentId))
        .orderBy(desc(schema.matchResults.score)),
      ctx.db.select({
        id: schema.bookingSessions.id,
        studentId: schema.bookingSessions.studentId,
        counselorId: schema.bookingSessions.counselorId,
        scheduledAt: schema.bookingSessions.scheduledAt,
        duration: schema.bookingSessions.duration,
        status: schema.bookingSessions.status,
        meetingUrl: schema.bookingSessions.meetingUrl,
        notes: schema.bookingSessions.notes,
        counselorName: schema.users.name,
      }).from(schema.bookingSessions)
        .leftJoin(schema.counselorProfiles, eq(schema.counselorProfiles.id, schema.bookingSessions.counselorId))
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(and(eq(schema.bookingSessions.studentId, studentId), eq(schema.bookingSessions.status, 'SCHEDULED'), gte(schema.bookingSessions.scheduledAt, now)))
        .orderBy(asc(schema.bookingSessions.scheduledAt)),
      ctx.db.query.studentDocuments.findMany({ where: (d: any, { eq }: any) => eq(d.studentId, studentId), orderBy: (d: any, { asc }: any) => [asc(d.createdAt)] }),
      ctx.db.query.notifications.findMany({ where: (n: any, { eq }: any) => eq(n.userId, userId), orderBy: (n: any, { desc }: any) => [desc(n.createdAt)], limit: 10 }),
      ctx.db.select({ id: schema.counselorProfiles.id, name: schema.users.name, rating: schema.counselorProfiles.rating }).from(schema.counselorProfiles).leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId)).where(eq(schema.counselorProfiles.id, profile.assignedCounselorId as string)),
      ctx.db
        .select({ c: sql<number>`count(*)` })
        .from(schema.messages)
        .innerJoin(schema.conversations, eq(schema.messages.conversationId, schema.conversations.id))
        .where(
          and(
            eq(schema.conversations.studentId, studentId),
            eq(schema.messages.isRead, false),
            ne(schema.messages.senderId, userId)
          )
        )
        .then((r: any) => Number(r[0]?.c ?? 0)),
      ctx.db
        .select({ c: sql<number>`count(*)` })
        .from(schema.notifications)
        .where(and(eq(schema.notifications.userId, userId), eq(schema.notifications.isRead, false)))
        .then((r: any) => Number(r[0]?.c ?? 0)),
    ])

    const intakesByCourse = groupByCourse(intakeRows as any[])
    const applications = (applicationRows as any[]).map((row) => ({
      ...row,
      course: row.courseId ? {
        name: row.courseName,
        slug: row.courseSlug,
        applicationDeadline: row.courseDeadline,
        university: { name: row.universityName, country: row.universityCountry },
        intakes: intakesByCourse[row.courseId] ?? [],
      } : null,
    }))
    const shortlisted = (shortlistRows as any[]).map((row) => ({
      ...row,
      course: { id: row.courseId, name: row.courseName, slug: row.courseSlug, subject: row.subject, level: row.level, duration: row.duration, tuitionFee: row.tuitionFee, currency: row.currency, hasScholarship: row.hasScholarship, university: { name: row.universityName, country: row.universityCountry, city: row.universityCity } },
    }))
    const matches = (matchRows as any[]).map((row) => ({
      ...row,
      course: { name: row.courseName, slug: row.courseSlug, tuitionFee: row.tuitionFee, currency: row.currency, hasScholarship: row.hasScholarship, university: { name: row.universityName, country: row.universityCountry } },
    }))
    const upcomingSessions = (sessionRows as any[]).map((row) => ({ ...row, counselor: { user: { name: row.counselorName } } }))

    const documentsTotal = documents.length
    const documentsUploaded = documents.filter((d: any) => d.status === 'VERIFIED' || d.status === 'UPLOADED').length

    // Application progress: average of step progress across applications
    let applicationProgress = profile?.completionPercent ?? 0
    if (applications.length) {
      const avg =
        applications.reduce((acc: number, a: any) => {
          const total = a.totalSteps || 5
          const step = Math.min(Math.max(a.currentStep || 0, 0), total)
          return acc + (step / total) * 100
        }, 0) / applications.length
      applicationProgress = Math.max(applicationProgress, Math.round(avg))
    }

    // Deadlines: application deadlines + intake apply-by dates
    const deadlines: any[] = []
    for (const app of applications) {
      const course = app.course as any
      if (course?.applicationDeadline) {
        const d = daysUntil(course.applicationDeadline)
        if (d !== null && d >= 0) {
          deadlines.push({
            id: `app-${app.id}`,
            label: `${course.name} — application deadline`,
            dueDate: course.applicationDeadline,
            dueIn: d,
          })
        }
      }
      if (course?.intakes?.length) {
        for (const intake of course.intakes) {
          if (intake.applyByDate) {
            const d = daysUntil(intake.applyByDate)
            if (d !== null && d >= 0) {
              deadlines.push({
                id: `intake-${intake.id}`,
                label: `${course.name} — apply by (intake)`,
                dueDate: intake.applyByDate,
                dueIn: d,
              })
            }
          }
        }
      }
    }
    deadlines.sort((a, b) => a.dueIn - b.dueIn)
    const daysUntilNextDeadline = deadlines.length ? deadlines[0].dueIn : null

    return {
      user: { id: user?.id, name: user?.name, email: user?.email, image: user?.image },
      profile: {
        id: profile.id,
        completionPercent: profile.completionPercent,
        nationality: profile.nationality,
        countryOfResidence: profile.countryOfResidence,
        targetCountries: profile.targetCountries,
        preferredIntakeMonth: profile.preferredIntakeMonth,
        preferredIntakeYear: profile.preferredIntakeYear,
        highestEducation: profile.highestEducation,
        gpa: profile.gpa,
        ieltsScore: profile.ieltsScore,
        referralCode: profile.referralCode,
        referralBalance: profile.referralBalance,
      },
      counselor: (counselorRows as any[])[0]
        ? {
            id: (counselorRows as any[])[0].id,
            name: (counselorRows as any[])[0].name ?? 'Your counselor',
            rating: (counselorRows as any[])[0].rating,
          }
        : null,
      stats: {
        applications: applications.length,
        shortlisted: shortlisted.length,
        matches: matches.length,
        documentsUploaded,
        documentsTotal,
        unreadMessages,
        unreadNotifications,
        upcomingSessions: upcomingSessions.length,
        applicationProgress,
        daysUntilNextDeadline,
      },
      applications,
      shortlisted,
      matches,
      upcomingSessions,
      documents,
      notifications,
      deadlines,
    }
  }),

  // ── Documents ──────────────────────────────────────────────
  documents: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      return ctx.db.query.studentDocuments.findMany({
        where: (d: any, { eq }: any) => eq(d.studentId, studentId),
        orderBy: (d: any, { asc }: any) => [asc(d.createdAt)],
      })
    }),
    add: protectedProcedure
      .input(
        z.object({
          label: z.string().min(1).max(255),
          category: z.string().max(100).default('OTHER'),
          applicationId: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        const inserted = await ctx.db
          .insert(schema.studentDocuments)
          .values({
            studentId,
            label: input.label,
            category: input.category,
            applicationId: input.applicationId ?? null,
            status: 'PENDING',
          })
          .$returningId()
        return { success: true, id: (inserted as any)?.[0]?.id }
      }),
    upload: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          fileUrl: z.string().min(1),
          fileName: z.string().max(255).optional(),
          fileSize: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        await ctx.db
          .update(schema.studentDocuments)
          .set({
            fileUrl: input.fileUrl,
            fileName: input.fileName ?? null,
            fileSize: input.fileSize ?? null,
            status: 'UPLOADED',
            uploadedAt: new Date(),
            rejectionReason: null,
          })
          .where(and(eq(schema.studentDocuments.id, input.id), eq(schema.studentDocuments.studentId, studentId)))
        return { success: true }
      }),
    remove: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        await ctx.db
          .delete(schema.studentDocuments)
          .where(and(eq(schema.studentDocuments.id, input.id), eq(schema.studentDocuments.studentId, studentId)))
        return { success: true }
      }),
  }),

  // ── Appointments / Sessions ────────────────────────────────
  sessions: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      const rows = await ctx.db.select({
        id: schema.bookingSessions.id,
        studentId: schema.bookingSessions.studentId,
        counselorId: schema.bookingSessions.counselorId,
        scheduledAt: schema.bookingSessions.scheduledAt,
        duration: schema.bookingSessions.duration,
        status: schema.bookingSessions.status,
        meetingUrl: schema.bookingSessions.meetingUrl,
        notes: schema.bookingSessions.notes,
        counselorName: schema.users.name,
      }).from(schema.bookingSessions)
        .leftJoin(schema.counselorProfiles, eq(schema.counselorProfiles.id, schema.bookingSessions.counselorId))
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(eq(schema.bookingSessions.studentId, studentId))
        .orderBy(desc(schema.bookingSessions.scheduledAt))
      return rows.map((row: any) => ({ ...row, counselor: { user: { name: row.counselorName } } }))
    }),
    counselors: protectedProcedure.query(async ({ ctx }) => {
      const rows = await ctx.db.select({
        id: schema.counselorProfiles.id,
        name: schema.users.name,
        rating: schema.counselorProfiles.rating,
        expertiseCountries: schema.counselorProfiles.expertiseCountries,
        sessionRate: schema.counselorProfiles.sessionRate,
      }).from(schema.counselorProfiles)
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(eq(schema.counselorProfiles.isAvailable, true))
      return rows.map((c: any) => ({
        id: c.id,
        name: c.name ?? 'Counselor',
        rating: c.rating,
        expertiseCountries: c.expertiseCountries,
        sessionRate: c.sessionRate,
      }))
    }),
    book: protectedProcedure
      .input(
        z.object({
          counselorId: z.string().min(1),
          scheduledAt: z.string().min(1),
          duration: z.number().min(15).max(120).default(60),
          notes: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        const scheduledAt = new Date(input.scheduledAt)
        if (Number.isNaN(scheduledAt.getTime())) throw new Error('Invalid date')
        await ctx.db.insert(schema.bookingSessions).values({
          studentId,
          counselorId: input.counselorId,
          scheduledAt,
          duration: input.duration,
          notes: input.notes ?? null,
          status: 'SCHEDULED',
        })
        return { success: true }
      }),
    cancel: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        await ctx.db
          .update(schema.bookingSessions)
          .set({ status: 'CANCELLED' })
          .where(and(eq(schema.bookingSessions.id, input.id), eq(schema.bookingSessions.studentId, studentId)))
        return { success: true }
      }),
  }),

  // ── Messaging ──────────────────────────────────────────────
  messages: createTRPCRouter({
    conversations: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      const convos = await ctx.db.select({
        id: schema.conversations.id,
        studentId: schema.conversations.studentId,
        counselorId: schema.conversations.counselorId,
        lastMessageAt: schema.conversations.lastMessageAt,
        lastMessage: schema.conversations.lastMessage,
        counselorName: schema.users.name,
      }).from(schema.conversations)
        .leftJoin(schema.counselorProfiles, eq(schema.counselorProfiles.id, schema.conversations.counselorId))
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(eq(schema.conversations.studentId, studentId))
        .orderBy(desc(schema.conversations.lastMessageAt))
      const conversationIds = convos.map((c: any) => c.id)
      let unread: any[] = []
      if (conversationIds.length) {
        unread = await ctx.db
          .select({ conversationId: schema.messages.conversationId, c: sql<number>`count(*)` })
          .from(schema.messages)
          .where(
            and(
              inArray(schema.messages.conversationId, conversationIds),
              eq(schema.messages.isRead, false),
              ne(schema.messages.senderId, ctx.session.user.id)
            )
          )
          .groupBy(schema.messages.conversationId)
      }
      const unreadMap = new Map(unread.map((u: any) => [u.conversationId, Number(u.c)]))
      return convos.map((c: any) => ({ ...c, counselor: { user: { name: c.counselorName } }, unread: unreadMap.get(c.id) ?? 0 }))
    }),
    thread: protectedProcedure
      .input(z.object({ conversationId: z.string() }))
      .query(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        const convoRows = await ctx.db.select({
          id: schema.conversations.id,
          studentId: schema.conversations.studentId,
          counselorId: schema.conversations.counselorId,
          lastMessageAt: schema.conversations.lastMessageAt,
          lastMessage: schema.conversations.lastMessage,
          counselorName: schema.users.name,
        }).from(schema.conversations)
          .leftJoin(schema.counselorProfiles, eq(schema.counselorProfiles.id, schema.conversations.counselorId))
          .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
          .where(and(eq(schema.conversations.id, input.conversationId), eq(schema.conversations.studentId, studentId)))
          .limit(1)
        const convo = convoRows[0]
        if (!convo) return { conversation: null, messages: [] }
        const messages = await ctx.db.query.messages.findMany({
          where: (m: any, { eq }: any) => eq(m.conversationId, input.conversationId),
          orderBy: (m: any, { asc }: any) => [asc(m.createdAt)],
        })
        return { conversation: { ...convo, counselor: { user: { name: convo.counselorName } } }, messages }
      }),
    send: protectedProcedure
      .input(
        z.object({
          counselorId: z.string().min(1),
          content: z.string().min(1).max(4000),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        const userId = ctx.session.user.id

        const convo = await ctx.db.query.conversations.findFirst({
          where: (c: any, { eq, and }: any) =>
            and(eq(c.studentId, studentId), eq(c.counselorId, input.counselorId)),
        })

        let conversationId: string
        if (!convo) {
          const inserted = await ctx.db
            .insert(schema.conversations)
            .values({
              studentId,
              counselorId: input.counselorId,
              lastMessage: input.content,
              lastMessageAt: new Date(),
            })
            .$returningId()
          conversationId = (inserted as any)[0]?.id
        } else {
          conversationId = convo.id
          await ctx.db
            .update(schema.conversations)
            .set({ lastMessage: input.content, lastMessageAt: new Date() })
            .where(eq(schema.conversations.id, conversationId))
        }

        await ctx.db.insert(schema.messages).values({
          conversationId,
          senderId: userId,
          content: input.content,
          isRead: false,
        })

        return { success: true, conversationId }
      }),
    markRead: protectedProcedure
      .input(z.object({ conversationId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id
        await ctx.db
          .update(schema.messages)
          .set({ isRead: true })
          .where(
            and(
              eq(schema.messages.conversationId, input.conversationId),
              ne(schema.messages.senderId, userId)
            )
          )
        return { success: true }
      }),
  }),

  // ── Notifications ──────────────────────────────────────────
  notifications: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      return ctx.db.query.notifications.findMany({
        where: (n: any, { eq }: any) => eq(n.userId, ctx.session.user.id),
        orderBy: (n: any, { desc }: any) => [desc(n.createdAt)],
        limit: 30,
      })
    }),
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      const r = await ctx.db
        .select({ c: sql<number>`count(*)` })
        .from(schema.notifications)
        .where(
          and(eq(schema.notifications.userId, ctx.session.user.id), eq(schema.notifications.isRead, false))
        )
      return Number(r[0]?.c ?? 0)
    }),
    markRead: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db
          .update(schema.notifications)
          .set({ isRead: true })
          .where(and(eq(schema.notifications.id, input.id), eq(schema.notifications.userId, ctx.session.user.id)))
        return { success: true }
      }),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
      await ctx.db
        .update(schema.notifications)
        .set({ isRead: true })
        .where(eq(schema.notifications.userId, ctx.session.user.id))
      return { success: true }
    }),
  }),

  // ── Shortlist ──────────────────────────────────────────────
  shortlist: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      const rows = await ctx.db.select({
        id: schema.shortlistedCourses.id,
        studentId: schema.shortlistedCourses.studentId,
        courseId: schema.shortlistedCourses.courseId,
        notes: schema.shortlistedCourses.notes,
        createdAt: schema.shortlistedCourses.createdAt,
        courseName: schema.courses.name,
        courseSlug: schema.courses.slug,
        subject: schema.courses.subject,
        level: schema.courses.level,
        duration: schema.courses.duration,
        tuitionFee: schema.courses.tuitionFee,
        currency: schema.courses.currency,
        hasScholarship: schema.courses.hasScholarship,
        universityName: schema.universities.name,
        universityCountry: schema.universities.country,
        universityCity: schema.universities.city,
      }).from(schema.shortlistedCourses)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.shortlistedCourses.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.shortlistedCourses.studentId, studentId))
        .orderBy(desc(schema.shortlistedCourses.createdAt))
      return rows.map((row: any) => ({ ...row, course: { id: row.courseId, name: row.courseName, slug: row.courseSlug, subject: row.subject, level: row.level, duration: row.duration, tuitionFee: row.tuitionFee, currency: row.currency, hasScholarship: row.hasScholarship, university: { name: row.universityName, country: row.universityCountry, city: row.universityCity } } }))
    }),
    add: protectedProcedure
      .input(z.object({ courseId: z.string().min(1), notes: z.string().max(500).optional() }))
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        const existing = await ctx.db.query.shortlistedCourses.findFirst({
          where: (s: any, { eq, and }: any) =>
            and(eq(s.studentId, studentId), eq(s.courseId, input.courseId)),
        })
        if (existing) return { success: true, already: true }
        await ctx.db.insert(schema.shortlistedCourses).values({
          studentId,
          courseId: input.courseId,
          notes: input.notes ?? null,
        })
        return { success: true }
      }),
    remove: protectedProcedure
      .input(z.object({ courseId: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        await ctx.db
          .delete(schema.shortlistedCourses)
          .where(and(eq(schema.shortlistedCourses.studentId, studentId), eq(schema.shortlistedCourses.courseId, input.courseId)))
        return { success: true }
      }),
  }),

  // ── AI Matches / Recommendations ───────────────────────────
  matches: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      const rows = await ctx.db.select({
        id: schema.matchResults.id,
        studentId: schema.matchResults.studentId,
        courseId: schema.matchResults.courseId,
        score: schema.matchResults.score,
        matchReasons: schema.matchResults.matchReasons,
        courseName: schema.courses.name,
        courseSlug: schema.courses.slug,
        tuitionFee: schema.courses.tuitionFee,
        currency: schema.courses.currency,
        hasScholarship: schema.courses.hasScholarship,
        universityName: schema.universities.name,
        universityCountry: schema.universities.country,
      }).from(schema.matchResults)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.matchResults.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.matchResults.studentId, studentId))
        .orderBy(desc(schema.matchResults.score))
        .limit(6)
      return rows.map((row: any) => ({ ...row, course: { name: row.courseName, slug: row.courseSlug, tuitionFee: row.tuitionFee, currency: row.currency, hasScholarship: row.hasScholarship, university: { name: row.universityName, country: row.universityCountry } } }))
    }),
  }),
})
