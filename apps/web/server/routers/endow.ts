import { logAdminActivity } from '@/lib/audit'
import { db, schema } from '@/lib/db'
import { createInAppNotification } from '@/lib/in-app-notifications'
import { syncStudentInquiriesToApplications } from '../utils/syncStudentApplications'
import {
  adminWithPermission,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/lib/trpc'
import { TRPCError } from '@trpc/server'
import { randomUUID } from 'crypto'
import {
  and as _and,
  count as _count,
  desc as _desc,
  eq as _eq,
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
          sql`${schema.studentInquiries.submittedAt} > DATE_SUB(NOW(), INTERVAL 1 MINUTE)`
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
          .where(eq(schema.users.email, input.email.trim()))
          .limit(1)
        if (u) userId = u.id
      } catch {
        // non-blocking
      }
    }

    await db.insert(schema.studentInquiries).values({
      id: globalThis.crypto.randomUUID(),
      userId,
      ipAddress: ip,
      submittedAt: new Date(),
      surname: input.surname,
      givenName: input.givenName,
      dob: input.dob,
      gender: input.gender,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
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

    // If user is logged in and uploaded a profile picture, update user's profile image so it shows on their dashboard
    if (userId && input.photoUrl) {
      try {
        await db
          .update(schema.users)
          .set({ image: input.photoUrl })
          .where(eq(schema.users.id, userId))
      } catch {
        // non-blocking
      }
    }

    // Automatically sync inquiries to applications and update profile match signals
    if (userId) {
      try {
        await syncStudentInquiriesToApplications(
          db,
          { id: userId, email: input.email, name: `${input.givenName} ${input.surname}` }
        )
        await createInAppNotification(db, schema, {
          userId,
          type: 'APPLICATION_UPDATE',
          title: 'Application submitted',
          body: 'Your application was submitted successfully and is now live on your student dashboard.',
          data: { university: input.targetUniversity, courseName: input.courseName },
        })
        await logAdminActivity({
          action: 'application.submit',
          actor: { id: userId, email: input.email, role: 'STUDENT' },
          target: { id: input.targetUniversity || 'direct-apply', type: 'inquiry' },
        })
      } catch (err) {
        console.error('[submitInquiry] Auto-create application error:', err)
      }
    }

    return { success: true, message: 'Application submitted! Our team will contact you shortly.' }
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
