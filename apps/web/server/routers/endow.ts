import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc'
import { z } from 'zod'
import { fetchStudentOverviewFromEndow } from '@/lib/endowConnect'
import { db, schema } from '@/lib/db'
import { eq as _eq } from 'drizzle-orm'
const eq = _eq as any

const INQUIRIES: any[] = []

export const endowRouter = createTRPCRouter({
  getOverview: protectedProcedure
    .input(z.object({ studentId: z.string(), persist: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      // Only allow fetching for the same student or staff/admin
      const requesterId = ctx.session!.user.id
      const role = ctx.session!.user.role
      if (role !== 'ADMIN' && role !== 'COUNSELOR' && requesterId !== input.studentId) {
        throw new Error('FORBIDDEN')
      }

      const overview = await fetchStudentOverviewFromEndow(input.studentId)

      if (input.persist) {
        // Map fields we know into studentProfiles
        const update: any = {}
        if (overview.nationality) update.nationality = overview.nationality
        if (overview.highestEducation) update.highestEducation = overview.highestEducation
        if (typeof overview.gpa === 'number') update.gpa = overview.gpa
        if (typeof overview.ieltsScore === 'number') update.ieltsScore = overview.ieltsScore
        if (typeof overview.toeflScore === 'number') update.toeflScore = overview.toeflScore
        if (overview.targetCountries) update.targetCountries = overview.targetCountries
        if (overview.targetSubjects) update.targetSubjects = overview.targetSubjects

        await db
          .update(schema.studentProfiles)
          .set(update)
          .where(eq(schema.studentProfiles.userId, input.studentId))
      }

      return overview
    }),

  submitInquiry: publicProcedure
    .input(z.object({
      surname: z.string().min(1),
      givenName: z.string().min(1),
      dob: z.string().optional(),
      gender: z.string().optional(),
      phone: z.string().min(1),
      whatsapp: z.string().optional(),
      email: z.string().email(),
      fatherName: z.string().optional(),
      motherName: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().min(1),
      applyingTo: z.string().optional(),
      sscYear: z.string().optional(),
      sscResult: z.string().optional(),
      hscYear: z.string().optional(),
      hscResult: z.string().optional(),
      bachelorsYear: z.string().optional(),
      bachelorsResult: z.string().optional(),
      mastersYear: z.string().optional(),
      mastersResult: z.string().optional(),
      hometown: z.string().optional(),
      nationality: z.string().optional(),
      targetCountry: z.string().optional(),
      targetUniversity: z.string().optional(),
      reasonToChoose: z.string().optional(),
      englishTest: z.string().optional(),
      ieltsScore: z.string().optional(),
      toeflScore: z.string().optional(),
      topikLevel: z.string().optional(),
      heardFrom: z.string().optional(),
      referralName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id || null
      const data = { ...input, userId, id: globalThis.crypto.randomUUID(), submittedAt: new Date().toISOString() }
      INQUIRIES.push(data)
      console.log('[Inquiry] New application:', JSON.stringify({ email: input.email, name: `${input.givenName} ${input.surname}` }))
      return { success: true, message: 'Application submitted successfully! Our team will contact you shortly.' }
    }),

  listInquiries: publicProcedure.query(async () => {
    return INQUIRIES.slice(-50).reverse()
  }),
})
