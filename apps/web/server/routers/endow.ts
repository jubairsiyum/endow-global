import { logAdminActivity } from '@/lib/audit'
import { db, schema } from '@/lib/db'
import { createInAppNotification } from '@/lib/in-app-notifications'
import {
  adminWithPermission,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/lib/trpc'
import { TRPCError } from '@trpc/server'
import {
  and as _and,
  count as _count,
  desc as _desc,
  eq as _eq,
  isNull as _isNull,
  ne as _ne,
  notInArray as _notInArray,
  or as _or,
  sql as _sql,
} from 'drizzle-orm'
import { z } from 'zod'
const eq = _eq as any
const sql = _sql as any
const desc = _desc as any
const and = _and as any
const or = _or as any
const count = _count as any
const isNull = _isNull as any
const ne = _ne as any
const notInArray = _notInArray as any

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // max 3 per minute per IP

const inquiryInput = z.object({
  surname: z.string().min(1).max(255),
  givenName: z.string().min(1).max(255),
  dob: z.string().max(50).optional(),
  gender: z.string().max(20).optional(),
  phone: z.string().min(1).max(50),
  whatsapp: z.string().max(50).optional(),
  email: z.string().email().max(255),
  fatherName: z.string().max(255).optional(),
  motherName: z.string().max(255).optional(),
  addressLine1: z.string().max(500).optional(),
  addressLine2: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  country: z.string().min(1).max(100),
  applyingTo: z.string().max(50).optional(),
  sscYear: z.string().max(10).optional(),
  sscResult: z.string().max(50).optional(),
  hscYear: z.string().max(10).optional(),
  hscResult: z.string().max(50).optional(),
  bachelorsYear: z.string().max(10).optional(),
  bachelorsResult: z.string().max(50).optional(),
  mastersYear: z.string().max(10).optional(),
  mastersResult: z.string().max(50).optional(),
  hometown: z.string().max(255).optional(),
  nationality: z.string().max(100).optional(),
  targetCountry: z.string().max(100).optional(),
  targetUniversity: z.string().max(255).optional(),
  courseName: z.string().max(255).optional(),
  courseSlug: z.string().max(255).optional(),
  reasonToChoose: z.string().max(5000).optional(),
  englishTest: z.string().max(50).optional(),
  ieltsScore: z.string().max(10).optional(),
  toeflScore: z.string().max(10).optional(),
  satScore: z.string().max(10).optional(),
  topikLevel: z.string().max(10).optional(),
  heardFrom: z.string().max(100).optional(),
  referralName: z.string().max(255).optional(),
  photoUrl: z.string().max(500).optional(),
  documents: z
    .array(
      z.object({
        category: z.string(),
        label: z.string(),
        fileUrl: z.string(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
      })
    )
    .optional(),
})

function getIP(ctx: any): string {
  try {
    const forwarded = ctx.headers?.get?.('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    const realIp = ctx.headers?.get?.('x-real-ip')
    if (realIp) return realIp
    return '0.0.0.0'
  } catch {
    return '0.0.0.0'
  }
}

export const endowRouter = createTRPCRouter({
  getOverview: protectedProcedure
    .input(z.object({ studentId: z.string(), persist: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      /* unchanged */ return null
    }),

  submitInquiry: publicProcedure.input(inquiryInput).mutation(async ({ input, ctx }) => {
    const ip = getIP(ctx)

    // Rate limit check
    const recentCount = await db
      .select({ c: count() })
      .from(schema.studentInquiries)
      .where(
        and(
          eq(schema.studentInquiries.ipAddress, ip),
          sql`${schema.studentInquiries.submittedAt} > DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 MINUTE)`
        )
      )
      .limit(1)
      .then((r) => Number(r[0]?.c || 0))

    if (recentCount >= RATE_LIMIT_MAX) {
      throw new Error('Too many requests. Please try again later.')
    }

    // Academic scores bounds: SSC & HSC max GPA 5.00, Higher Study (BSc, MSc, BBA, etc.) max CGPA 4.00
    if (input.sscResult && input.sscResult.trim()) {
      const ssc = parseFloat(input.sscResult.trim())
      if (!isNaN(ssc) && (ssc < 0 || ssc > 5)) {
        throw new Error('SSC result must be a GPA between 0.00 and 5.00')
      }
    }
    if (input.hscResult && input.hscResult.trim()) {
      const hsc = parseFloat(input.hscResult.trim())
      if (!isNaN(hsc) && (hsc < 0 || hsc > 5)) {
        throw new Error('HSC result must be a GPA between 0.00 and 5.00')
      }
    }
    if (input.bachelorsResult && input.bachelorsResult.trim()) {
      const bac = parseFloat(input.bachelorsResult.trim())
      if (!isNaN(bac) && (bac < 0 || bac > 4)) {
        throw new Error(
          "Bachelor's result (BSc, BBA, BA Hons, etc.) must be a CGPA between 0.00 and 4.00"
        )
      }
    }
    if (input.mastersResult && input.mastersResult.trim()) {
      const mas = parseFloat(input.mastersResult.trim())
      if (!isNaN(mas) && (mas < 0 || mas > 4)) {
        throw new Error("Master's result (MSc, MBA, MA, etc.) must be a CGPA between 0.00 and 4.00")
      }
    }

    let userId = ctx.session?.user?.id || null
    if (!userId && input.email) {
      try {
        const [u] = await db
          .select({ id: schema.users.id })
          .from(schema.users)
          .where(eq(schema.users.email, input.email.trim().toLowerCase()))
          .limit(1)
        if (u) userId = u.id
      } catch {
        // non-blocking
      }
    }

    const inqId = globalThis.crypto.randomUUID()
    const submittedAt = new Date()

    // ── ALWAYS PERSIST INQUIRY (for Admin Inquiries dashboard, Lead logs, and Student profile synchronization) ──
    await db.insert(schema.studentInquiries).values({
      id: inqId,
      userId: userId || null,
      ipAddress: ip,
      submittedAt,
      surname: input.surname,
      givenName: input.givenName,
      dob: input.dob,
      gender: input.gender,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email.trim().toLowerCase(),
      fatherName: input.fatherName,
      motherName: input.motherName,
      hometown: input.hometown,
      nationality: input.nationality,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      country: input.country,
      applyingTo: input.applyingTo,
      sscYear: input.sscYear,
      sscResult: input.sscResult,
      hscYear: input.hscYear,
      hscResult: input.hscResult,
      bachelorsYear: input.bachelorsYear,
      bachelorsResult: input.bachelorsResult,
      mastersYear: input.mastersYear,
      mastersResult: input.mastersResult,
      targetCountry: input.targetCountry,
      targetUniversity: input.targetUniversity,
      courseName: input.courseName,
      courseSlug: input.courseSlug,
      reasonToChoose: input.reasonToChoose,
      englishTest: input.englishTest,
      ieltsScore: input.ieltsScore,
      toeflScore: input.toeflScore,
      satScore: input.satScore,
      topikLevel: input.topikLevel,
      heardFrom: input.heardFrom,
      referralName: input.referralName,
      photoUrl: input.photoUrl || null,
    } as any)

    if (!userId) {
      // Guest inquiry submitted without login or registered user record
      await logAdminActivity({
        action: 'application.submit',
        actor: { id: 'guest', email: input.email, role: 'STUDENT' },
        target: { id: input.targetUniversity || 'direct-apply', type: 'inquiry' },
      }).catch(() => {})

      return {
        success: true,
        message: 'Your inquiry has been submitted! Our counseling team will contact you shortly.',
      }
    }

    // ── LOGGED-IN / REGISTERED SUBMISSION (COURSE APPLICATION) ─────────────
    // 1. Ensure student profile exists
    let [studentProf] = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, userId))
      .limit(1)

    if (!studentProf) {
      const profileId = globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 24)
      await db.insert(schema.studentProfiles).values({
        id: profileId,
        userId,
        targetCountries: input.targetCountry ? [input.targetCountry] : ['South Korea'],
        highestEducation: 'HIGH_SCHOOL',
        referralCode: globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 12),
      } as any)
      const [created] = await db
        .select()
        .from(schema.studentProfiles)
        .where(eq(schema.studentProfiles.id, profileId))
        .limit(1)
      studentProf = created
    }

    // 2. Resolve target course
    let targetCourseId: string | null = null
    let matchedUniId: string | null = null

    if (input.courseSlug) {
      const [c] = await db
        .select({ id: schema.courses.id })
        .from(schema.courses)
        .where(eq(schema.courses.slug, input.courseSlug))
        .limit(1)
      if (c) targetCourseId = c.id
    }
    if (!targetCourseId && input.courseName) {
      const cName = input.courseName.trim()
      const [c] = await db
        .select({ id: schema.courses.id })
        .from(schema.courses)
        .where(
          or(eq(schema.courses.name, cName), sql`${schema.courses.name} LIKE ${'%' + cName + '%'}`)
        )
        .limit(1)
      if (c) targetCourseId = c.id
    }
    if (input.targetUniversity) {
      const [uni] = await db
        .select({ id: schema.universities.id })
        .from(schema.universities)
        .where(
          or(
            eq(schema.universities.name, input.targetUniversity),
            sql`${schema.universities.name} LIKE ${'%' + input.targetUniversity + '%'}`
          )
        )
        .limit(1)
      if (uni) {
        matchedUniId = uni.id
        if (!targetCourseId) {
          const [c] = await db
            .select({ id: schema.courses.id })
            .from(schema.courses)
            .where(eq(schema.courses.universityId, uni.id))
            .limit(1)
          if (c) targetCourseId = c.id
        }
      }
    }
    if (!targetCourseId) {
      const [anyActive] = await db
        .select({ id: schema.courses.id })
        .from(schema.courses)
        .where(eq(schema.courses.isActive, true))
        .limit(1)
      if (anyActive) targetCourseId = anyActive.id
    }

    if (!targetCourseId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not match course for application. Please select a valid course.',
      })
    }

    // 3. Prevent duplicate active applications for the same course
    const existingRows = await db
      .select({ id: schema.applications.id, status: schema.applications.status })
      .from(schema.applications)
      .where(
        and(
          eq(schema.applications.studentId, studentProf.id),
          eq(schema.applications.courseId, targetCourseId)
        )
      )
      .limit(1)
    let existingApp: { id: string; status: any } | undefined = existingRows[0]

    // If course was auto-resolved via university/fallback and student already applied to it,
    // find another course slot at that university or active courses so they can submit a new application
    if (existingApp && existingApp.status !== 'WITHDRAWN' && !input.courseSlug) {
      const activeAppCourseIds = await db
        .select({ courseId: schema.applications.courseId })
        .from(schema.applications)
        .where(
          and(
            eq(schema.applications.studentId, studentProf.id),
            ne(schema.applications.status, 'WITHDRAWN')
          )
        )
        .then((rows) => rows.map((r) => r.courseId))

      let altCourse: { id: string } | undefined
      if (matchedUniId) {
        const [uniC] = await db
          .select({ id: schema.courses.id })
          .from(schema.courses)
          .where(
            and(
              eq(schema.courses.universityId, matchedUniId),
              eq(schema.courses.isActive, true),
              notInArray(schema.courses.id, activeAppCourseIds.length ? activeAppCourseIds : ['__none__'])
            )
          )
          .limit(1)
        altCourse = uniC
      }
      if (!altCourse) {
        const [anyOther] = await db
          .select({ id: schema.courses.id })
          .from(schema.courses)
          .where(
            and(
              eq(schema.courses.isActive, true),
              notInArray(schema.courses.id, activeAppCourseIds.length ? activeAppCourseIds : ['__none__'])
            )
          )
          .limit(1)
        altCourse = anyOther
      }
      if (altCourse) {
        targetCourseId = altCourse.id
        existingApp = undefined
      }
    }

    if (existingApp && existingApp.status !== 'WITHDRAWN') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'You have already submitted an active application for this course. You can track your application in your dashboard.',
      })
    }

    const appId = globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 24)
    const personalInfoObj = {
      inquiryId: inqId,
      surname: input.surname,
      givenName: input.givenName,
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      whatsapp: input.whatsapp || null,
      gender: input.gender || null,
      dob: input.dob || null,
      fatherName: input.fatherName || null,
      motherName: input.motherName || null,
      hometown: input.hometown || null,
      nationality: input.nationality || 'Bangladeshi',
      addressLine1: input.addressLine1 || null,
      addressLine2: input.addressLine2 || null,
      city: input.city || null,
      state: input.state || null,
      zipCode: input.zipCode || null,
      country: input.country || 'Bangladesh',
      photoUrl: input.photoUrl || null,
      heardFrom: input.heardFrom || null,
      referralName: input.referralName || null,
      reasonToChoose: input.reasonToChoose || null,
    }

    const academicHistoryObj = {
      applyingTo: input.applyingTo || null,
      sscYear: input.sscYear || null,
      sscResult: input.sscResult || null,
      hscYear: input.hscYear || null,
      hscResult: input.hscResult || null,
      bachelorsYear: input.bachelorsYear || null,
      bachelorsResult: input.bachelorsResult || null,
      mastersYear: input.mastersYear || null,
      mastersResult: input.mastersResult || null,
      englishTest: input.englishTest || 'None',
      ieltsScore: input.ieltsScore || null,
      toeflScore: input.toeflScore || null,
      satScore: input.satScore || null,
      topikLevel: input.topikLevel || null,
      targetUniversity: input.targetUniversity || null,
      targetCountry: input.targetCountry || null,
      courseName: input.courseName || null,
      courseSlug: input.courseSlug || null,
    }

    const cNotes =
      [
        input.reasonToChoose ? `Reason to choose: ${input.reasonToChoose}` : null,
        input.targetUniversity ? `Target University: ${input.targetUniversity}` : null,
      ]
        .filter(Boolean)
        .join(' | ') || null

    const docUrls = Array.isArray(input.documents)
      ? input.documents.map((d) => d.fileUrl).filter(Boolean)
      : []

    if (existingApp && existingApp.status === 'WITHDRAWN') {
      await db
        .update(schema.applications)
        .set({
          status: 'SUBMITTED',
          currentStep: 5,
          totalSteps: 5,
          submittedAt,
          personalInfo: personalInfoObj,
          academicHistory: academicHistoryObj,
          personalStatement: input.reasonToChoose || null,
          documentsUrls: docUrls,
          counselorNotes: cNotes,
        })
        .where(eq(schema.applications.id, existingApp.id))
    } else {
      await db.insert(schema.applications).values({
        id: appId,
        studentId: studentProf.id,
        courseId: targetCourseId,
        status: 'SUBMITTED',
        currentStep: 5,
        totalSteps: 5,
        submittedAt,
        personalInfo: personalInfoObj,
        academicHistory: academicHistoryObj,
        personalStatement: input.reasonToChoose || null,
        documentsUrls: docUrls,
        counselorNotes: cNotes,
      })
    }

    // 4. Persist any uploaded files into studentDocuments
    if (Array.isArray(input.documents) && input.documents.length > 0) {
      for (const doc of input.documents) {
        if (doc.fileUrl) {
          await db
            .insert(schema.studentDocuments)
            .values({
              studentId: studentProf.id,
              applicationId: existingApp ? existingApp.id : appId,
              category: doc.category || 'Academic Certificates',
              label: doc.label || 'Document',
              fileUrl: doc.fileUrl,
              fileName: doc.fileName || doc.label,
              status: 'UPLOADED',
            })
            .catch(() => {})
        }
      }
    }

    // 5. Update user profile details
    const userUpdates: Record<string, any> = {}
    if (input.photoUrl) userUpdates.image = input.photoUrl
    const fullName = `${input.givenName || ''} ${input.surname || ''}`.trim()
    if (fullName) userUpdates.name = fullName
    if (Object.keys(userUpdates).length > 0) {
      await db
        .update(schema.users)
        .set(userUpdates)
        .where(eq(schema.users.id, userId))
        .catch(() => {})
    }

    // 6. Update student profile signals
    const profileUpdates: Record<string, any> = {}
    if (input.phone) profileUpdates.phone = input.phone
    if (input.nationality) profileUpdates.nationality = input.nationality
    if (input.country) profileUpdates.countryOfResidence = input.country
    if (input.applyingTo) profileUpdates.interestedProgram = input.applyingTo
    if (input.ieltsScore) profileUpdates.ieltsScore = parseFloat(input.ieltsScore) || undefined
    if (input.toeflScore) profileUpdates.toeflScore = parseInt(input.toeflScore) || undefined
    if (input.satScore) profileUpdates.satScore = parseInt(input.satScore) || undefined
    const gpaVal = input.bachelorsResult || input.hscResult || input.sscResult
    if (gpaVal) profileUpdates.gpa = parseFloat(gpaVal) || undefined
    if (Object.keys(profileUpdates).length > 0) {
      await db
        .update(schema.studentProfiles)
        .set(profileUpdates)
        .where(eq(schema.studentProfiles.id, studentProf.id))
        .catch(() => {})
    }

    await createInAppNotification(db, schema, {
      userId,
      type: 'APPLICATION_UPDATE',
      title: 'Course application submitted',
      body: 'Your course application was submitted successfully and is now live on your student dashboard.',
      data: {
        university: input.targetUniversity,
        courseName: input.courseName,
        applicationId: existingApp ? existingApp.id : appId,
      },
    }).catch(() => {})

    await logAdminActivity({
      action: 'application.submit',
      actor: { id: userId, email: input.email, role: 'STUDENT' },
      target: { id: targetCourseId, type: 'application' },
    }).catch(() => {})

    return {
      success: true,
      message:
        'Course application submitted! You can track your admission status in your student dashboard.',
    }
  }),

  getCoursesForUniversity: publicProcedure
    .input(z.object({ universityName: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (!input.universityName) return []
      const rows = await ctx.db
        .select({
          id: schema.courses.id,
          name: schema.courses.name,
          slug: schema.courses.slug,
          level: schema.courses.level,
          subject: schema.courses.subject,
        })
        .from(schema.courses)
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(
          and(
            eq(schema.courses.isActive, true),
            or(
              eq(schema.universities.name, input.universityName),
              sql`${schema.universities.name} LIKE ${'%' + input.universityName + '%'}`
            )
          )
        )
        .orderBy(schema.courses.name)
      return rows
    }),

  listInquiries: adminWithPermission('dashboard:view').query(async () => {
    return db
      .select()
      .from(schema.studentInquiries)
      .orderBy(desc(schema.studentInquiries.submittedAt))
      .limit(500)
  }),

  getInquiryById: adminWithPermission('dashboard:view')
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [inquiry] = await db
        .select()
        .from(schema.studentInquiries)
        .where(eq(schema.studentInquiries.id, input.id))
        .limit(1)

      if (!inquiry) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Inquiry not found',
        })
      }

      let userAccount = null
      if (inquiry.userId) {
        try {
          const [user] = await db
            .select({
              id: schema.users.id,
              name: schema.users.name,
              email: schema.users.email,
              role: schema.users.role,
              image: schema.users.image,
              createdAt: schema.users.createdAt,
            })
            .from(schema.users)
            .where(eq(schema.users.id, inquiry.userId))
            .limit(1)
          userAccount = user || null
        } catch {
          // ignore
        }
      }

      return {
        ...inquiry,
        userAccount,
      }
    }),

  deleteInquiry: adminWithPermission('dashboard:view')
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(schema.studentInquiries).where(eq(schema.studentInquiries.id, input.id))
      return { success: true }
    }),
})
