import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc'
import { z } from 'zod'
import { fetchStudentOverviewFromEndow } from '@/lib/endowConnect'
import { db, schema } from '@/lib/db'
import { eq as _eq, sql as _sql, desc as _desc, and as _and, or as _or, count as _count } from 'drizzle-orm'
const eq = _eq as any; const sql = _sql as any; const desc = _desc as any; const and = _and as any; const or = _or as any; const count = _count as any

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
})

function getIP(ctx: any): string {
  try {
    const forwarded = ctx.headers?.get?.('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    const realIp = ctx.headers?.get?.('x-real-ip')
    if (realIp) return realIp
    return '0.0.0.0'
  } catch { return '0.0.0.0' }
}

export const endowRouter = createTRPCRouter({
  getOverview: protectedProcedure
    .input(z.object({ studentId: z.string(), persist: z.boolean().optional() }))
    .query(async ({ input, ctx }) => { /* unchanged */ return null }),

  submitInquiry: publicProcedure
    .input(inquiryInput)
    .mutation(async ({ input, ctx }) => {
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
        .then(r => Number(r[0]?.c || 0))

      if (recentCount >= RATE_LIMIT_MAX) {
        throw new Error('Too many requests. Please try again later.')
      }

      const userId = ctx.session?.user?.id || null

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
      } as any)

      // If a signed-in student applied to a specific course, also create an
      // application record so it shows up under /dashboard/application (and in
      // the dashboard overview stats). Non-course inquiries and guests are skipped.
      if (userId && input.courseSlug) {
        try {
          const [profile] = await db
            .select({ id: schema.studentProfiles.id })
            .from(schema.studentProfiles)
            .where(eq(schema.studentProfiles.userId, userId))
            .limit(1)

          const [course] = await db
            .select({ id: schema.courses.id })
            .from(schema.courses)
            .where(eq(schema.courses.slug, input.courseSlug))
            .limit(1)

          if (profile && course) {
            const [existing] = await db
              .select({ id: schema.applications.id })
              .from(schema.applications)
              .where(
                and(
                  eq(schema.applications.studentId, profile.id),
                  eq(schema.applications.courseId, course.id)
                )
              )
              .limit(1)

            if (!existing) {
              await db.insert(schema.applications).values({
                studentId: profile.id,
                courseId: course.id,
                status: 'SUBMITTED',
                currentStep: 5,
                totalSteps: 5,
                submittedAt: new Date(),
                personalInfo: {
                  givenName: input.givenName,
                  surname: input.surname,
                  email: input.email,
                  phone: input.phone,
                  whatsapp: input.whatsapp,
                  dob: input.dob,
                  gender: input.gender,
                  nationality: input.nationality,
                  country: input.country,
                  city: input.city,
                },
                academicHistory: {
                  applyingTo: input.applyingTo,
                  sscYear: input.sscYear,
                  sscResult: input.sscResult,
                  hscYear: input.hscYear,
                  hscResult: input.hscResult,
                  bachelorsYear: input.bachelorsYear,
                  bachelorsResult: input.bachelorsResult,
                  mastersYear: input.mastersYear,
                  mastersResult: input.mastersResult,
                },
              } as any)
            }
          }
        } catch {
          // Linking the dashboard application must never fail the inquiry submission.
        }
      }

      return { success: true, message: 'Application submitted! Our team will contact you shortly.' }
    }),

  listInquiries: publicProcedure.query(async () => {
    return db.select().from(schema.studentInquiries).orderBy(desc(schema.studentInquiries.submittedAt)).limit(50)
  }),
})