import { createBooking } from '@/lib/booking'
import {
  applicantLevelFromEducation,
  DOCUMENT_REQUIREMENTS,
  getRequiredDocuments,
  requirementKey,
  type ApplicantLevel,
} from '@/lib/documents'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { cleanCounselorNotes } from '@/lib/utils'
import { schema } from '@endow/db'
import {
  and as _and,
  asc as _asc,
  desc as _desc,
  eq as _eq,
  gte as _gte,
  lte as _lte,
  inArray as _inArray,
  isNull as _isNull,
  ne as _ne,
  or as _or,
  sql as _sql,
} from 'drizzle-orm'
import { z } from 'zod'
import { hasMatchSignals, normalizeInterestedProgramToLevels, scoreCourse, scoreUniversity } from '../utils/courseMatch'
import { syncStudentInquiriesToApplications } from '../utils/syncStudentApplications'

const eq = _eq as any
const and = _and as any
const sql = _sql as any
const inArray = _inArray as any
const ne = _ne as any
const desc = _desc as any
const asc = _asc as any
const gte = _gte as any
const lte = _lte as any
const or = _or as any
const isNull = _isNull as any

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

// ─────────────────────────────────────────────────────────────
// Appointment validation helpers
// ─────────────────────────────────────────────────────────────

const MIN_LEAD_MINUTES = 30

function normalizeScheduledAt(value: string | Date): Date {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date and time')
  return date
}

function assertFutureDate(date: Date) {
  if (date.getTime() <= Date.now()) throw new Error('Please choose a time in the future')
}

function assertLeadTime(date: Date) {
  if (date.getTime() < Date.now() + MIN_LEAD_MINUTES * 60 * 1000) {
    throw new Error(`Bookings must be made at least ${MIN_LEAD_MINUTES} minutes in advance`)
  }
}

// Reject any overlapping SCHEDULED session for the same student or the same
// counselor within a minute of the requested window.
async function assertNoConflict(
  ctx: any,
  {
    studentId,
    counselorId,
    scheduledAt,
    duration,
  }: { studentId: string; counselorId: string; scheduledAt: Date; duration: number }
) {
  const requestedStart = scheduledAt.getTime()
  const requestedEnd = requestedStart + duration * 60 * 1000

  const candidates = await ctx.db
    .select({
      id: schema.bookingSessions.id,
      studentId: schema.bookingSessions.studentId,
      counselorId: schema.bookingSessions.counselorId,
      scheduledAt: schema.bookingSessions.scheduledAt,
      duration: schema.bookingSessions.duration,
    })
    .from(schema.bookingSessions)
    .where(
      and(
        eq(schema.bookingSessions.status, 'SCHEDULED'),
        or(
          eq(schema.bookingSessions.studentId, studentId),
          eq(schema.bookingSessions.counselorId, counselorId)
        )
      )
    )

  const conflict = candidates.find((c: any) => {
    const existingStart = c.scheduledAt.getTime()
    const existingEnd = existingStart + (c.duration ?? 60) * 60 * 1000
    // 60s grace so consecutive-but-not-overlapping bookings are allowed
    return existingStart < requestedEnd - 60 * 1000 && existingEnd > requestedStart + 60 * 1000
  })

  if (conflict) {
    if (conflict.studentId === studentId)
      throw new Error('You already have an overlapping session at this time')
    throw new Error('This counselor already has a session at that time')
  }
}

// Make sure every document on the current programme's checklist exists as a
// student document row (PENDING until uploaded), then return the full list.
async function ensureDocumentChecklist(ctx: any, studentId: string) {
  const [profile] = await ctx.db
    .select({
      id: schema.studentProfiles.id,
      userId: schema.studentProfiles.userId,
      highestEducation: schema.studentProfiles.highestEducation,
      ieltsScore: schema.studentProfiles.ieltsScore,
      toeflScore: schema.studentProfiles.toeflScore,
      satScore: schema.studentProfiles.satScore,
      greScore: schema.studentProfiles.greScore,
    })
    .from(schema.studentProfiles)
    .where(eq(schema.studentProfiles.id, studentId))
    .limit(1)

  // 1. Check student's active applications to determine target program level
  const [recentApp] = await ctx.db
    .select({
      level: schema.courses.level,
    })
    .from(schema.applications)
    .innerJoin(schema.courses, eq(schema.courses.id, schema.applications.courseId))
    .where(eq(schema.applications.studentId, studentId))
    .orderBy(desc(schema.applications.createdAt))
    .limit(1)

  // 2. Check student's latest inquiry if exists
  let inq: any = null
  if (profile?.userId) {
    const [foundInq] = await ctx.db
      .select({
        applyingTo: schema.studentInquiries.applyingTo,
        englishTest: schema.studentInquiries.englishTest,
        ieltsScore: schema.studentInquiries.ieltsScore,
        toeflScore: schema.studentInquiries.toeflScore,
        satScore: schema.studentInquiries.satScore,
        topikLevel: schema.studentInquiries.topikLevel,
        sscYear: schema.studentInquiries.sscYear,
        sscResult: schema.studentInquiries.sscResult,
        hscYear: schema.studentInquiries.hscYear,
        hscResult: schema.studentInquiries.hscResult,
        bachelorsYear: schema.studentInquiries.bachelorsYear,
        bachelorsResult: schema.studentInquiries.bachelorsResult,
        mastersYear: schema.studentInquiries.mastersYear,
        mastersResult: schema.studentInquiries.mastersResult,
      })
      .from(schema.studentInquiries)
      .where(eq(schema.studentInquiries.userId, profile.userId))
      .orderBy(desc(schema.studentInquiries.submittedAt))
      .limit(1)
    if (foundInq) inq = foundInq
  }

  // 3. Determine level
  let level: ApplicantLevel = 'UNDERGRADUATE'
  if (recentApp?.level) {
    if (recentApp.level === 'POSTGRADUATE' || recentApp.level === 'PHD') {
      level = 'POSTGRADUATE'
    } else {
      level = 'UNDERGRADUATE'
    }
  } else if (inq?.applyingTo) {
    if (inq.applyingTo === 'Masters' || inq.applyingTo === 'Doctorate') {
      level = 'POSTGRADUATE'
    } else {
      level = 'UNDERGRADUATE'
    }
  } else {
    level = applicantLevelFromEducation(profile?.highestEducation)
  }

  const required = getRequiredDocuments(level, profile, inq)

  const fetchItems = () =>
    ctx.db.query.studentDocuments.findMany({
      where: (d: any, { eq }: any) => eq(d.studentId, studentId),
      orderBy: (d: any, { asc }: any) => [asc(d.createdAt)],
    })

  let items = await fetchItems()

  // Gracefully migrate legacy generic language row if a file was uploaded and exactly 1 language test is required
  const languageReqs = required.filter((r) => r.category === 'Language Proficiency')
  if (languageReqs.length === 1) {
    const legacyUploaded = items.find(
      (d: any) =>
        d.fileUrl &&
        (d.label === 'Language Test Certificate (IELTS/TOEFL/TOPIK)' ||
          d.label === 'Language Test Certificate')
    )
    if (legacyUploaded) {
      await ctx.db
        .update(schema.studentDocuments)
        .set({ label: languageReqs[0].label })
        .where(eq(schema.studentDocuments.id, legacyUploaded.id))
      items = await fetchItems()
    }
  }

  const existing = new Set(items.map((d: any) => requirementKey(d.category, d.label)))
  const toCreate = required.filter((r) => !existing.has(requirementKey(r.category, r.label)))

  if (toCreate.length) {
    await ctx.db.insert(schema.studentDocuments).values(
      toCreate.map((r) => ({
        studentId,
        category: r.category,
        label: r.label,
        status: 'PENDING',
      })) as any
    )
  }

  // Clean up any empty/pending checklist items that are not in the current required list
  const requiredKeys = new Set(required.map((r) => requirementKey(r.category, r.label)))
  const obsoletePending = items.filter(
    (d: any) =>
      !d.fileUrl && d.status === 'PENDING' && !requiredKeys.has(requirementKey(d.category, d.label))
  )
  if (obsoletePending.length > 0) {
    await ctx.db.delete(schema.studentDocuments).where(
      inArray(
        schema.studentDocuments.id,
        obsoletePending.map((d: any) => d.id)
      )
    )
  }

  return { level, requirements: required, items: await fetchItems() }
}

function daysUntil(date: Date | string | null | undefined): number | null {
  if (!date) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

async function computeStudentMatches(ctx: any, profile: any) {
  if (!profile || !hasMatchSignals(profile)) return { matches: [], universities: [] }

  const interestedProgram = profile.interestedProgram
  const targetLevels = normalizeInterestedProgramToLevels(interestedProgram)

  const conditions = [eq(schema.courses.isActive, true)]

  // Strict optimization: if student specified an interested program (e.g. Masters), only query matching course levels
  if (targetLevels && targetLevels.length > 0) {
    conditions.push(inArray(schema.courses.level, targetLevels))
  }

  // Budget optimization: if student set a maximum budget, filter courses within reasonable range
  if (profile.budgetMax && Number(profile.budgetMax) > 0) {
    const maxFee = Math.round(Number(profile.budgetMax) * 1.15)
    conditions.push(lte(schema.courses.tuitionFee, maxFee))
  }

  const rows = await ctx.db
    .select({
      id: schema.courses.id,
      name: schema.courses.name,
      slug: schema.courses.slug,
      subject: schema.courses.subject,
      level: schema.courses.level,
      duration: schema.courses.duration,
      tuitionFee: schema.courses.tuitionFee,
      currency: schema.courses.currency,
      hasScholarship: schema.courses.hasScholarship,
      englishTestWaiver: schema.courses.englishTestWaiver,
      expressOffer: schema.courses.expressOffer,
      startDate: schema.courses.startDate,
      universityId: schema.universities.id,
      universityName: schema.universities.name,
      universitySlug: schema.universities.slug,
      universityCountry: schema.universities.country,
      universityCity: schema.universities.city,
      universityLogo: schema.universities.logo,
      universityRanking: schema.universities.ranking,
    })
    .from(schema.courses)
    .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
    .where(and(...conditions))

  const scored = rows
    .map((row: any) => {
      const result = scoreCourse(profile, row)
      return {
        id: row.id,
        score: result.score,
        matchReasons: result.reasons,
        course: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          subject: row.subject,
          level: row.level,
          tuitionFee: row.tuitionFee,
          currency: row.currency,
          hasScholarship: row.hasScholarship,
          university: {
            id: row.universityId,
            name: row.universityName,
            country: row.universityCountry,
            city: row.universityCity,
          },
        },
        university: {
          id: row.universityId,
          name: row.universityName,
          slug: row.universitySlug,
          country: row.universityCountry,
          city: row.universityCity,
          logo: row.universityLogo,
          ranking: row.universityRanking,
        },
      }
    })
    .filter((match: any) => match.score >= 30)
    .sort((a: any, b: any) => b.score - a.score)

  // Aggregate course scores into university-level recommendations
  const universityMap = new Map<string, any>()
  for (const match of scored) {
    const uniId = match.university.id
    if (!uniId) continue
    if (!universityMap.has(uniId)) {
      universityMap.set(uniId, {
        ...match.university,
        courseScores: [] as number[],
        topCourse: match.course,
      })
    }
    const entry = universityMap.get(uniId)
    entry.courseScores.push(match.score)
  }

  const universities = Array.from(universityMap.values())
    .map((uni) => {
      const result = scoreUniversity(
        profile,
        { country: uni.country, ranking: uni.ranking },
        uni.courseScores.map((s: number) => ({ score: s }))
      )
      return {
        id: uni.id,
        name: uni.name,
        slug: uni.slug,
        country: uni.country,
        city: uni.city,
        logo: uni.logo,
        ranking: uni.ranking,
        matchScore: result.score,
        matchReasons: result.reasons,
        matchedCourseCount: uni.courseScores.length,
        topCourse: uni.topCourse,
      }
    })
    .filter((uni: any) => uni.matchScore >= 30)
    .sort((a: any, b: any) => b.matchScore - a.matchScore)
    .slice(0, 6)

  return { matches: scored, universities }
}

// ─────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────

export const dashboardRouter = createTRPCRouter({
  // ── Aggregate overview for the landing page ────────────────
  overview: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const user = await resolveStudent(ctx)
    let profile = user?.studentProfile ?? null

    // Sync any submitted inquiries into applications & refresh profile signals
    const syncRes = await syncStudentInquiriesToApplications(ctx.db, ctx.session.user, profile)
    profile = syncRes.profile || profile
    const studentId = profile?.id ?? null

    const inqConditions = [eq(schema.studentInquiries.userId, userId)]
    if (ctx.session.user.email) {
      inqConditions.push(eq(schema.studentInquiries.email, ctx.session.user.email.trim()))
    }
    const [latestInquiry] = await ctx.db
      .select()
      .from(schema.studentInquiries)
      .where(or(...inqConditions))
      .orderBy(desc(schema.studentInquiries.submittedAt))
      .limit(1)

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
          unreadNotifications: 0,
          upcomingSessions: 0,
          applicationProgress: 0,
          daysUntilNextDeadline: null,
        },
        applications: [],
        shortlisted: [],
        matches: [],
        recommendedUniversities: [],
        upcomingSessions: [],
        documents: [],
        notifications: [],
        deadlines: [],
      }
    }

    const now = new Date()

    const [
      applicationRows,
      intakeRows,
      shortlistRows,
      matchData,
      sessionRows,
      documents,
      notifications,
      counselorRows,
      unreadNotifications,
    ] = await Promise.all([
      ctx.db
        .select({
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
        })
        .from(schema.applications)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.applications.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.applications.studentId, studentId))
        .orderBy(desc(schema.applications.updatedAt)),
      ctx.db
        .select()
        .from(schema.platformCourseIntakes)
        .where(
          inArray(
            schema.platformCourseIntakes.courseId,
            ctx.db
              .select({ id: schema.applications.courseId })
              .from(schema.applications)
              .where(eq(schema.applications.studentId, studentId))
          )
        ),
      ctx.db
        .select({
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
        })
        .from(schema.shortlistedCourses)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.shortlistedCourses.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.shortlistedCourses.studentId, studentId))
        .orderBy(desc(schema.shortlistedCourses.createdAt)),
      computeStudentMatches(ctx, profile),
      ctx.db
        .select({
          id: schema.bookingSessions.id,
          studentId: schema.bookingSessions.studentId,
          counselorId: schema.bookingSessions.counselorId,
          scheduledAt: schema.bookingSessions.scheduledAt,
          duration: schema.bookingSessions.duration,
          status: schema.bookingSessions.status,
          meetingUrl: schema.bookingSessions.meetingUrl,
          notes: schema.bookingSessions.notes,
          counselorName: schema.users.name,
        })
        .from(schema.bookingSessions)
        .leftJoin(
          schema.counselorProfiles,
          eq(schema.counselorProfiles.id, schema.bookingSessions.counselorId)
        )
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(
          and(
            eq(schema.bookingSessions.studentId, studentId),
            eq(schema.bookingSessions.status, 'SCHEDULED'),
            gte(schema.bookingSessions.scheduledAt, now)
          )
        )
        .orderBy(asc(schema.bookingSessions.scheduledAt)),
      ensureDocumentChecklist(ctx, studentId).then((r) => r.items),
      ctx.db.query.notifications.findMany({
        where: (n: any, { eq }: any) => eq(n.userId, userId),
        orderBy: (n: any, { desc }: any) => [desc(n.createdAt)],
        limit: 10,
      }),
      ctx.db
        .select({
          id: schema.counselorProfiles.id,
          name: schema.users.name,
          rating: schema.counselorProfiles.rating,
        })
        .from(schema.counselorProfiles)
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(eq(schema.counselorProfiles.id, profile.assignedCounselorId as string)),
      ctx.db
        .select({ c: sql<number>`count(*)` })
        .from(schema.notifications)
        .where(and(eq(schema.notifications.userId, userId), eq(schema.notifications.isRead, false)))
        .then((r: any) => Number(r[0]?.c ?? 0)),
    ])

    const intakesByCourse = groupByCourse(intakeRows as any[])
    const matches = matchData.matches ?? []
    const recommendedUniversities = matchData.universities ?? []
    const applications = (applicationRows as any[]).map((row) => ({
      counselorNotes: cleanCounselorNotes(row.counselorNotes),
      ...row,
      course: row.courseId
        ? {
            id: row.courseId,
            name: row.courseName,
            slug: row.courseSlug,
            applicationDeadline: row.courseDeadline,
            university: { name: row.universityName, country: row.universityCountry },
            intakes: intakesByCourse[row.courseId] ?? [],
          }
        : null,
    }))
    const shortlisted = (shortlistRows as any[]).map((row) => ({
      ...row,
      course: {
        id: row.courseId,
        name: row.courseName,
        slug: row.courseSlug,
        subject: row.subject,
        level: row.level,
        duration: row.duration,
        tuitionFee: row.tuitionFee,
        currency: row.currency,
        hasScholarship: row.hasScholarship,
        university: {
          name: row.universityName,
          country: row.universityCountry,
          city: row.universityCity,
        },
      },
    }))
    const upcomingSessions = (sessionRows as any[]).map((row) => ({
      ...row,
      counselor: { user: { name: row.counselorName } },
    }))

    const documentsTotal = documents.length
    const documentsVerified = documents.filter((d: any) => d.status === 'VERIFIED').length
    const documentsUploaded = documents.filter(
      (d: any) => d.status === 'VERIFIED' || d.status === 'UPLOADED'
    ).length
    const documentsInReview = documents.filter(
      (d: any) => d.status === 'UPLOADED' || (d.status === 'PENDING' && !!d.fileUrl)
    ).length
    const documentsPending = documents.filter(
      (d: any) =>
        (!d.fileUrl && d.status === 'PENDING') || d.status === 'MISSING' || d.status === 'REJECTED'
    ).length

    // 1. Dynamic Application Progress Breakdown (strictly for application lifecycle)
    let appProgressBreakdown = {
      submittedPercent: 0,
      inReviewPercent: 0,
      remainingPercent: 100,
      overallPercent: 0,
      currentStep: 0,
      totalSteps: 5,
      status: 'NONE',
    }

    if (applications.length > 0) {
      const activeApp = applications[0]
      const totalSteps = activeApp?.totalSteps || 5
      const currentStep = activeApp?.currentStep || 1
      const rawStatus = (activeApp?.status || 'DRAFT').toUpperCase()

      if (rawStatus === 'ACCEPTED' || rawStatus === 'ENROLLED') {
        appProgressBreakdown = {
          submittedPercent: 100,
          inReviewPercent: 0,
          remainingPercent: 0,
          overallPercent: 100,
          currentStep: totalSteps,
          totalSteps,
          status: rawStatus,
        }
      } else if (rawStatus === 'UNDER_REVIEW') {
        appProgressBreakdown = {
          submittedPercent: 60,
          inReviewPercent: 40,
          remainingPercent: 0,
          overallPercent: 100,
          currentStep: totalSteps,
          totalSteps,
          status: rawStatus,
        }
      } else if (rawStatus === 'SUBMITTED') {
        appProgressBreakdown = {
          submittedPercent: 100,
          inReviewPercent: 0,
          remainingPercent: 0,
          overallPercent: 100,
          currentStep: totalSteps,
          totalSteps,
          status: rawStatus,
        }
      } else {
        // DRAFT / IN_PROGRESS
        const completed = Math.max(0, currentStep - 1)
        const submitted = Math.round((completed / totalSteps) * 100)
        const inReview = Math.round((1 / totalSteps) * 100)
        const remaining = Math.max(0, 100 - submitted - inReview)
        appProgressBreakdown = {
          submittedPercent: submitted,
          inReviewPercent: inReview,
          remainingPercent: remaining,
          overallPercent: Math.round((currentStep / totalSteps) * 100),
          currentStep,
          totalSteps,
          status: rawStatus,
        }
      }
    }

    // 2. Document Checklist Progress (strictly for student documents)
    const docProgress = {
      total: documentsTotal,
      uploaded: documentsUploaded,
      verified: documentsVerified,
      inReview: documentsInReview,
      pending: documentsPending,
      percent: documentsTotal > 0 ? Math.round((documentsUploaded / documentsTotal) * 100) : 0,
    }

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
        targetSubjects: profile.targetSubjects,
        budgetMin: profile.budgetMin,
        budgetMax: profile.budgetMax,
        preferredIntakeMonth: profile.preferredIntakeMonth,
        preferredIntakeYear: profile.preferredIntakeYear,
        highestEducation: profile.highestEducation,
        interestedProgram: profile.interestedProgram || latestInquiry?.applyingTo || null,
        gpa: profile.gpa,
        sscResult: latestInquiry?.sscResult || null,
        sscYear: latestInquiry?.sscYear || null,
        hscResult: latestInquiry?.hscResult || null,
        hscYear: latestInquiry?.hscYear || null,
        bachelorsResult: latestInquiry?.bachelorsResult || null,
        bachelorsYear: latestInquiry?.bachelorsYear || null,
        mastersResult: latestInquiry?.mastersResult || null,
        mastersYear: latestInquiry?.mastersYear || null,
        englishTest: latestInquiry?.englishTest || null,
        topikLevel: latestInquiry?.topikLevel || null,
        ieltsScore: profile.ieltsScore,
        toeflScore: profile.toeflScore,
        satScore: profile.satScore,
        greScore: profile.greScore,
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
        unreadNotifications,
        upcomingSessions: upcomingSessions.length,
        applicationProgress,
        daysUntilNextDeadline,
        appProgressBreakdown,
        docProgress,
      },
      applications,
      shortlisted,
      matches,
      recommendedUniversities,
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
      if (!studentId) return { level: 'UNDERGRADUATE' as const, items: [] }
      return ensureDocumentChecklist(ctx, studentId)
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
        // Only accept files produced by our private upload endpoint — this
        // stops a student from pointing their document at an arbitrary URL.
        if (!input.fileUrl.startsWith('/api/files/') || input.fileUrl.includes('..')) {
          throw new Error('Invalid file url')
        }
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
          .where(
            and(
              eq(schema.studentDocuments.id, input.id),
              eq(schema.studentDocuments.studentId, studentId)
            )
          )
        return { success: true }
      }),
    uploadDirect: protectedProcedure
      .input(
        z.object({
          label: z.string().min(1).max(255),
          category: z.string().max(100).default('OTHER'),
          fileUrl: z.string().min(1),
          fileName: z.string().max(255).optional(),
          fileSize: z.number().optional(),
          applicationId: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        if (!input.fileUrl.startsWith('/api/files/') || input.fileUrl.includes('..')) {
          throw new Error('Invalid file url')
        }
        const inserted = await ctx.db
          .insert(schema.studentDocuments)
          .values({
            studentId,
            label: input.label,
            category: input.category,
            applicationId: input.applicationId ?? null,
            fileUrl: input.fileUrl,
            fileName: input.fileName ?? null,
            fileSize: input.fileSize ?? null,
            status: 'UPLOADED',
            uploadedAt: new Date(),
          })
          .$returningId()
        return { success: true, id: (inserted as any)?.[0]?.id }
      }),
    remove: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')
        await ctx.db
          .delete(schema.studentDocuments)
          .where(
            and(
              eq(schema.studentDocuments.id, input.id),
              eq(schema.studentDocuments.studentId, studentId)
            )
          )
        return { success: true }
      }),
  }),

  // ── Appointments / Sessions ────────────────────────────────
  sessions: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      const rows = await ctx.db
        .select({
          id: schema.bookingSessions.id,
          studentId: schema.bookingSessions.studentId,
          counselorId: schema.bookingSessions.counselorId,
          scheduledAt: schema.bookingSessions.scheduledAt,
          duration: schema.bookingSessions.duration,
          status: schema.bookingSessions.status,
          meetingUrl: schema.bookingSessions.meetingUrl,
          notes: schema.bookingSessions.notes,
          createdAt: schema.bookingSessions.createdAt,
          counselorName: schema.users.name,
          counselorImage: schema.users.image,
          counselorRating: schema.counselorProfiles.rating,
        })
        .from(schema.bookingSessions)
        .leftJoin(
          schema.counselorProfiles,
          eq(schema.counselorProfiles.id, schema.bookingSessions.counselorId)
        )
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(eq(schema.bookingSessions.studentId, studentId))
        .orderBy(desc(schema.bookingSessions.scheduledAt))
      return rows.map((row: any) => ({
        ...row,
        counselor: {
          id: row.counselorId,
          rating: row.counselorRating,
          user: { name: row.counselorName, image: row.counselorImage },
        },
      }))
    }),
    counselors: protectedProcedure.query(async ({ ctx }) => {
      const rows = await ctx.db
        .select({
          id: schema.counselorProfiles.id,
          name: schema.users.name,
          image: schema.users.image,
          bio: schema.counselorProfiles.bio,
          rating: schema.counselorProfiles.rating,
          expertiseCountries: schema.counselorProfiles.expertiseCountries,
          expertiseSubjects: schema.counselorProfiles.expertiseSubjects,
          languages: schema.counselorProfiles.languages,
          sessionRate: schema.counselorProfiles.sessionRate,
          isAvailable: schema.counselorProfiles.isAvailable,
        })
        .from(schema.counselorProfiles)
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(eq(schema.counselorProfiles.isAvailable, true))
      return rows.map((c: any) => ({
        id: c.id,
        name: c.name ?? 'Counselor',
        image: c.image,
        bio: c.bio,
        rating: c.rating,
        expertiseCountries: c.expertiseCountries,
        expertiseSubjects: c.expertiseSubjects,
        languages: c.languages,
        sessionRate: c.sessionRate,
        isAvailable: c.isAvailable,
      }))
    }),
    assigned: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const assignedId = user?.studentProfile?.assignedCounselorId
      if (!assignedId) return null
      const [counselor] = await ctx.db
        .select({
          id: schema.counselorProfiles.id,
          name: schema.users.name,
          image: schema.users.image,
          rating: schema.counselorProfiles.rating,
          expertiseCountries: schema.counselorProfiles.expertiseCountries,
          sessionRate: schema.counselorProfiles.sessionRate,
        })
        .from(schema.counselorProfiles)
        .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
        .where(eq(schema.counselorProfiles.id, assignedId))
        .limit(1)
      return counselor
        ? {
            id: counselor.id,
            name: counselor.name ?? 'Counselor',
            image: counselor.image,
            rating: counselor.rating,
            expertiseCountries: counselor.expertiseCountries,
            sessionRate: counselor.sessionRate,
          }
        : null
    }),
    book: protectedProcedure
      .input(
        z.object({
          counselorId: z.string().min(1),
          scheduledAt: z.string().min(1),
          duration: z.number().int().min(15).max(120).default(60),
          notes: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')

        const result = await createBooking({
          db: ctx.db,
          student: {
            userId: ctx.session.user.id,
            profileId: studentId,
            name: (ctx.session.user as any).name || user?.name || 'Student',
            email: (ctx.session.user as any).email || '',
            phone: (user?.studentProfile as any)?.phone,
            assignedCounselorId: (user?.studentProfile as any)?.assignedCounselorId,
          },
          counselorId: input.counselorId,
          scheduledAt: input.scheduledAt,
          duration: input.duration,
          notes: input.notes,
        })

        return {
          success: true,
          id: result.booking.id,
          meetingUrl: result.booking.meetingUrl,
          emailNotification: result.emailNotification,
        }
      }),
    reschedule: protectedProcedure
      .input(
        z.object({
          id: z.string().min(1),
          scheduledAt: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')

        const [session] = await ctx.db
          .select({
            id: schema.bookingSessions.id,
            counselorId: schema.bookingSessions.counselorId,
            status: schema.bookingSessions.status,
            duration: schema.bookingSessions.duration,
          })
          .from(schema.bookingSessions)
          .where(
            and(
              eq(schema.bookingSessions.id, input.id),
              eq(schema.bookingSessions.studentId, studentId)
            )
          )
          .limit(1)
        if (!session) throw new Error('Session not found')
        if (session.status !== 'SCHEDULED')
          throw new Error('Only scheduled sessions can be rescheduled')

        const scheduledAt = normalizeScheduledAt(input.scheduledAt)
        assertFutureDate(scheduledAt)
        assertLeadTime(scheduledAt)

        await assertNoConflict(ctx, {
          studentId,
          counselorId: session.counselorId,
          scheduledAt,
          duration: session.duration ?? 60,
        })

        await ctx.db
          .update(schema.bookingSessions)
          .set({ scheduledAt, updatedAt: new Date() })
          .where(eq(schema.bookingSessions.id, session.id))
        return { success: true }
      }),
    cancel: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await resolveStudent(ctx)
        const studentId = user?.studentProfile?.id
        if (!studentId) throw new Error('No student profile found')

        const [session] = await ctx.db
          .select({ id: schema.bookingSessions.id, status: schema.bookingSessions.status })
          .from(schema.bookingSessions)
          .where(
            and(
              eq(schema.bookingSessions.id, input.id),
              eq(schema.bookingSessions.studentId, studentId)
            )
          )
          .limit(1)
        if (!session) throw new Error('Session not found')
        if (session.status !== 'SCHEDULED')
          throw new Error('Only scheduled sessions can be cancelled')

        await ctx.db
          .update(schema.bookingSessions)
          .set({ status: 'CANCELLED', updatedAt: new Date() })
          .where(eq(schema.bookingSessions.id, session.id))
        return { success: true }
      }),
  }),

  // ── Deadlines (admin-managed, read for students) ───────────
  deadlines: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      const now = Date.now()
      const rows = await ctx.db
        .select({
          id: schema.deadlines.id,
          title: schema.deadlines.title,
          description: schema.deadlines.description,
          category: schema.deadlines.category,
          dueAt: schema.deadlines.dueAt,
          relatedUniversity: schema.deadlines.relatedUniversity,
          relatedCourse: schema.deadlines.relatedCourse,
          remindDaysBefore: schema.deadlines.remindDaysBefore,
        })
        .from(schema.deadlines)
        .where(
          and(
            eq(schema.deadlines.isActive, true),
            or(eq(schema.deadlines.studentId, studentId), isNull(schema.deadlines.studentId))
          )
        )
        .orderBy(asc(schema.deadlines.dueAt))
      return rows
        .filter((row: any) => new Date(row.dueAt).getTime() >= now - 30 * 24 * 60 * 60 * 1000)
        .map((row: any) => ({ ...row, dueAt: new Date(row.dueAt).toISOString() }))
    }),
    summary: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return { total: 0, dueSoon: 0 }
      const now = Date.now()
      const in7Days = now + 7 * 24 * 60 * 60 * 1000
      const rows = await ctx.db
        .select({ id: schema.deadlines.id, dueAt: schema.deadlines.dueAt })
        .from(schema.deadlines)
        .where(
          and(
            eq(schema.deadlines.isActive, true),
            or(eq(schema.deadlines.studentId, studentId), isNull(schema.deadlines.studentId))
          )
        )
      const withDate = rows.map((r: any) => ({ ...r, dueMs: new Date(r.dueAt).getTime() }))
      const active = withDate.filter((r: any) => r.dueMs >= now)
      return {
        total: active.length,
        dueSoon: active.filter((r: any) => r.dueMs <= in7Days).length,
      }
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
          and(
            eq(schema.notifications.userId, ctx.session.user.id),
            eq(schema.notifications.isRead, false)
          )
        )
      return Number(r[0]?.c ?? 0)
    }),
    markRead: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db
          .update(schema.notifications)
          .set({ isRead: true })
          .where(
            and(
              eq(schema.notifications.id, input.id),
              eq(schema.notifications.userId, ctx.session.user.id)
            )
          )
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
      const rows = await ctx.db
        .select({
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
        })
        .from(schema.shortlistedCourses)
        .leftJoin(schema.courses, eq(schema.courses.id, schema.shortlistedCourses.courseId))
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(eq(schema.shortlistedCourses.studentId, studentId))
        .orderBy(desc(schema.shortlistedCourses.createdAt))
      return rows.map((row: any) => ({
        ...row,
        course: {
          id: row.courseId,
          name: row.courseName,
          slug: row.courseSlug,
          subject: row.subject,
          level: row.level,
          duration: row.duration,
          tuitionFee: row.tuitionFee,
          currency: row.currency,
          hasScholarship: row.hasScholarship,
          university: {
            name: row.universityName,
            country: row.universityCountry,
            city: row.universityCity,
          },
        },
      }))
    }),

    ids: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      const studentId = user?.studentProfile?.id
      if (!studentId) return []
      const rows = await ctx.db
        .select({ courseId: schema.shortlistedCourses.courseId })
        .from(schema.shortlistedCourses)
        .where(eq(schema.shortlistedCourses.studentId, studentId))
      return rows.map((r) => r.courseId)
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
          .where(
            and(
              eq(schema.shortlistedCourses.studentId, studentId),
              eq(schema.shortlistedCourses.courseId, input.courseId)
            )
          )
        return { success: true }
      }),
  }),

  // ── AI Matches / Recommendations ───────────────────────────
  matches: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = await resolveStudent(ctx)
      let profile = user?.studentProfile ?? null

      // Sync any submitted inquiries into applications & refresh profile signals
      const syncRes = await syncStudentInquiriesToApplications(ctx.db, ctx.session.user, profile)
      profile = syncRes.profile || profile
      if (!profile) return []
      const matches = await computeStudentMatches(ctx, profile)
      return matches.matches.slice(0, 12)
    }),
  }),
})
