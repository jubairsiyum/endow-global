import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { schema } from '@endow/db'
import { eq as _eq, and as _and, ne as _ne, desc as _desc, or as _or } from 'drizzle-orm'
const eq = _eq as any
const and = _and as any
const ne = _ne as any
const desc = _desc as any
const or = _or as any
import { z } from 'zod'
import { hash as bcryptHash } from 'bcryptjs'
import { autoAssignCounselor, notifyStudentCounselorAssigned } from '@/lib/counselor-assignment'
import { notifyCounselorNewStudent } from '@/lib/notify'
import { syncStudentInquiriesToApplications } from '@/server/utils/syncStudentApplications'

const BCRYPT_SALT_ROUNDS = 12

// Unicode-aware name: Latin letters (incl. accents), spaces, hyphens,
// apostrophes and periods only.
const NAME_PATTERN = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF][A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s'’.-]{1,99}$/

function normalizePhone(value: string): string {
  return value.replace(/[\s.-]/g, '').replace(/^(?:\+|00)(\d)/, '$1')
}

function isValidPhone(value: string): boolean {
  if (!value) return true
  return /^(?!0+$)\d{7,15}$/.test(normalizePhone(value))
}

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const userEmail = ctx.session.user.email

    // 1. Sync any existing inquiries to student profile & applications
    await syncStudentInquiriesToApplications(ctx.db, ctx.session.user).catch((err) => {
      console.error('[getProfile] Sync error:', err)
    })

    // 2. Query user and studentProfile
    const rows = await ctx.db
      .select({ user: schema.users, studentProfile: schema.studentProfiles })
      .from(schema.users)
      .leftJoin(schema.studentProfiles, eq(schema.studentProfiles.userId, schema.users.id))
      .where(eq(schema.users.id, userId))
      .limit(1)
    const row = rows[0]
    if (!row) return null

    // 3. Find latest student inquiry for this user (by userId or email)
    const inqConditions = [eq(schema.studentInquiries.userId, userId)]
    if (userEmail) {
      inqConditions.push(eq(schema.studentInquiries.email, userEmail.trim()))
    }
    const [latestInquiry] = await ctx.db
      .select()
      .from(schema.studentInquiries)
      .where(or(...inqConditions))
      .orderBy(desc(schema.studentInquiries.submittedAt))
      .limit(1)

    // 4. Fetch student documents
    const studentDocs = row.studentProfile?.id
      ? await ctx.db
          .select()
          .from(schema.studentDocuments)
          .where(eq(schema.studentDocuments.studentId, row.studentProfile.id))
      : []

    return {
      ...row.user,
      studentProfile: row.studentProfile
        ? {
            ...row.studentProfile,
            interestedProgram: row.studentProfile.interestedProgram || latestInquiry?.applyingTo || null,
          }
        : null,
      latestInquiry: latestInquiry || null,
      documents: studentDocs,
    }
  }),

  setPassword: protectedProcedure
    .input(z.object({ password: z.string().min(8).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const hashed = await bcryptHash(input.password, BCRYPT_SALT_ROUNDS)

      const existing = await ctx.db.query.accounts.findFirst({
        where: (a, { eq, and }) => and(eq(a.userId, userId), eq(a.providerId, 'credential')),
      })

      if (existing) {
        await ctx.db
          .update(schema.accounts)
          .set({ password: hashed })
          .where(eq(schema.accounts.id, existing.id))
      } else {
        await ctx.db.insert(schema.accounts).values({
          userId,
          providerId: 'credential',
          accountId: userId,
          password: hashed,
        })
      }

      return { success: true }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .trim()
          .min(2, 'Full name must be at least 2 characters')
          .max(100, 'Full name is too long')
          .regex(NAME_PATTERN, 'Full name contains invalid characters')
          .optional(),
        nationality: z.string().trim().max(100).optional(),
        countryOfResidence: z.string().trim().max(100).optional(),
        phone: z
          .string()
          .trim()
          .max(30)
          .superRefine((value, ctx) => {
            if (!value) return
            if (!isValidPhone(value)) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid phone number' })
            }
          })
          .optional(),
        dob: z.string().trim().max(50).optional(),
        gender: z.string().trim().max(20).optional(),
        whatsapp: z.string().trim().max(50).optional(),
        fatherName: z.string().trim().max(255).optional(),
        motherName: z.string().trim().max(255).optional(),
        hometown: z.string().trim().max(255).optional(),
        addressLine1: z.string().trim().max(500).optional(),
        addressLine2: z.string().trim().max(500).optional(),
        city: z.string().trim().max(100).optional(),
        state: z.string().trim().max(100).optional(),
        zipCode: z.string().trim().max(20).optional(),
        sscYear: z.string().trim().max(10).optional(),
        sscResult: z.string().trim().max(50).optional(),
        hscYear: z.string().trim().max(10).optional(),
        hscResult: z.string().trim().max(50).optional(),
        bachelorsYear: z.string().trim().max(10).optional(),
        bachelorsResult: z.string().trim().max(50).optional(),
        mastersYear: z.string().trim().max(10).optional(),
        mastersResult: z.string().trim().max(50).optional(),
        englishTest: z.string().trim().max(50).optional(),
        topikLevel: z.string().trim().max(20).optional(),
        targetCountries: z.array(z.string()).optional(),
        targetSubjects: z.array(z.string()).optional(),
        budgetMin: z.number().nonnegative().nullable().optional(),
        budgetMax: z.number().nonnegative().nullable().optional(),
        gpa: z.number().min(0, 'GPA must be between 0 and 5').max(5, 'GPA must be between 0 and 5').nullable().optional(),
        ieltsScore: z.number().min(0, 'IELTS band must be between 0 and 9').max(9, 'IELTS band must be between 0 and 9').nullable().optional(),
        toeflScore: z.number().int('TOEFL score must be a whole number').min(0, 'TOEFL score must be between 0 and 120').max(120, 'TOEFL score must be between 0 and 120').nullable().optional(),
        satScore: z.number().int('SAT score must be a whole number').min(0, 'SAT score must be between 0 and 1600').max(1600, 'SAT score must be between 0 and 1600').nullable().optional(),
        highestEducation: z.enum(['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD']).optional(),
        interestedProgram: z.string().trim().max(100).optional(),
        preferredIntakeYear: z.number().int().min(2020).max(2100).optional(),
        preferredIntakeMonth: z.string().trim().max(50).optional(),
        image: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const userEmail = ctx.session.user.email

      // Update user name/image if provided
      const userUpdates: Record<string, unknown> = {}
      if (input.name) userUpdates.name = input.name
      if (input.image !== undefined) userUpdates.image = input.image
      if (Object.keys(userUpdates).length > 0) {
        await ctx.db
          .update(schema.users)
          .set(userUpdates)
          .where(eq(schema.users.id, userId))
      }

      // Find or create student profile
      const existing = await ctx.db.query.studentProfiles.findFirst({
        where: (sp, { eq }) => eq(sp.userId, userId),
      })

      if (existing) {
        let assignedCounselorId = existing.assignedCounselorId
        if (!assignedCounselorId) {
          assignedCounselorId = await autoAssignCounselor(ctx.db, schema, input)
        }
        await ctx.db
          .update(schema.studentProfiles)
          .set({
            ...(assignedCounselorId && { assignedCounselorId }),
            ...(input.nationality !== undefined && { nationality: input.nationality }),
            ...(input.countryOfResidence !== undefined && { countryOfResidence: input.countryOfResidence }),
            ...(input.phone !== undefined && { phone: input.phone }),
            ...(input.targetCountries !== undefined && { targetCountries: input.targetCountries }),
            ...(input.targetSubjects !== undefined && { targetSubjects: input.targetSubjects }),
            ...(input.budgetMin !== undefined && { budgetMin: input.budgetMin }),
            ...(input.budgetMax !== undefined && { budgetMax: input.budgetMax }),
            ...(input.gpa !== undefined && { gpa: input.gpa }),
            ...(input.ieltsScore !== undefined && { ieltsScore: input.ieltsScore }),
            ...(input.toeflScore !== undefined && { toeflScore: input.toeflScore }),
            ...(input.satScore !== undefined && { satScore: input.satScore }),
            ...(input.highestEducation !== undefined && { highestEducation: input.highestEducation }),
            ...(input.interestedProgram !== undefined && { interestedProgram: input.interestedProgram }),
            ...(input.preferredIntakeYear !== undefined && { preferredIntakeYear: input.preferredIntakeYear }),
            ...(input.preferredIntakeMonth !== undefined && { preferredIntakeMonth: input.preferredIntakeMonth }),
            completionPercent: Math.min(
              Math.round(
                ([
                  input.name || ctx.session.user.name,
                  input.nationality ?? existing.nationality,
                  input.countryOfResidence ?? existing.countryOfResidence,
                  input.phone ?? existing.phone,
                  input.highestEducation ?? existing.highestEducation,
                  (input.gpa ?? existing.gpa) != null && Number(input.gpa ?? existing.gpa) > 0,
                  ((input.ieltsScore ?? existing.ieltsScore) != null && Number(input.ieltsScore ?? existing.ieltsScore) > 0) ||
                    ((input.toeflScore ?? existing.toeflScore) != null && Number(input.toeflScore ?? existing.toeflScore) > 0) ||
                    ((input.satScore ?? existing.satScore) != null && Number(input.satScore ?? existing.satScore) > 0),
                  Array.isArray(input.targetCountries ?? existing.targetCountries) && (input.targetCountries ?? (existing.targetCountries as any[])).length > 0,
                  input.image || ctx.session.user.image,
                ].filter(Boolean).length /
                  9) *
                  100
              ),
              100
            ),
          })
          .where(eq(schema.studentProfiles.userId, userId))

        if (!existing.assignedCounselorId && assignedCounselorId) {
          try {
            await notifyCounselorNewStudent(ctx.db, schema, {
              counselorId: assignedCounselorId,
              studentName: input.name || ctx.session.user.name || 'New student',
              studentEmail: ctx.session.user.email,
              studentPhone: input.phone,
            })
            await notifyStudentCounselorAssigned(ctx.db, schema, {
              studentUserId: userId,
              counselorName: 'Your assigned counselor',
            })
          } catch (error) {
            console.error('[assignment] Failed to notify counselor:', error)
          }
        }
      } else {
        const assignedCounselorId = await autoAssignCounselor(ctx.db, schema, input)
        await ctx.db.insert(schema.studentProfiles).values({
          userId,
          assignedCounselorId,
          nationality: input.nationality,
          countryOfResidence: input.countryOfResidence,
          phone: input.phone,
          targetCountries: input.targetCountries ?? [],
          targetSubjects: input.targetSubjects ?? [],
          budgetMin: input.budgetMin,
          budgetMax: input.budgetMax,
          gpa: input.gpa,
          ieltsScore: input.ieltsScore,
          toeflScore: input.toeflScore,
          satScore: input.satScore,
          highestEducation: input.highestEducation ?? 'HIGH_SCHOOL',
          interestedProgram: input.interestedProgram,
          preferredIntakeYear: input.preferredIntakeYear,
          preferredIntakeMonth: input.preferredIntakeMonth,
        })
        if (assignedCounselorId) {
          try {
            await notifyCounselorNewStudent(ctx.db, schema, {
              counselorId: assignedCounselorId,
              studentName: input.name || ctx.session.user.name || 'New student',
              studentEmail: ctx.session.user.email,
              studentPhone: input.phone,
            })
            await notifyStudentCounselorAssigned(ctx.db, schema, {
              studentUserId: userId,
              counselorName: 'Your assigned counselor',
            })
          } catch (error) {
            console.error('[assignment] Failed to notify counselor:', error)
          }
        }
      }

      // Sync personal & academic records to studentInquiries
      const inqConditions = [eq(schema.studentInquiries.userId, userId)]
      if (userEmail) {
        inqConditions.push(eq(schema.studentInquiries.email, userEmail.trim()))
      }
      const existingInquiries = await ctx.db
        .select({ id: schema.studentInquiries.id })
        .from(schema.studentInquiries)
        .where(or(...inqConditions))

      const fullName = (input.name || ctx.session.user.name || 'Student').trim()
      const parts = fullName.split(/\s+/)
      const givenName = parts[0] || 'Student'
      const surname = parts.slice(1).join(' ') || parts[0] || 'User'

      const inquiryUpdates: Record<string, any> = {
        userId,
        givenName,
        surname,
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.whatsapp !== undefined && { whatsapp: input.whatsapp }),
        ...(input.dob !== undefined && { dob: input.dob }),
        ...(input.gender !== undefined && { gender: input.gender }),
        ...(input.fatherName !== undefined && { fatherName: input.fatherName }),
        ...(input.motherName !== undefined && { motherName: input.motherName }),
        ...(input.hometown !== undefined && { hometown: input.hometown }),
        ...(input.nationality !== undefined && { nationality: input.nationality }),
        ...(input.countryOfResidence !== undefined && { country: input.countryOfResidence }),
        ...(input.addressLine1 !== undefined && { addressLine1: input.addressLine1 }),
        ...(input.addressLine2 !== undefined && { addressLine2: input.addressLine2 }),
        ...(input.city !== undefined && { city: input.city }),
        ...(input.state !== undefined && { state: input.state }),
        ...(input.zipCode !== undefined && { zipCode: input.zipCode }),
        ...(input.sscYear !== undefined && { sscYear: input.sscYear }),
        ...(input.sscResult !== undefined && { sscResult: input.sscResult }),
        ...(input.hscYear !== undefined && { hscYear: input.hscYear }),
        ...(input.hscResult !== undefined && { hscResult: input.hscResult }),
        ...(input.bachelorsYear !== undefined && { bachelorsYear: input.bachelorsYear }),
        ...(input.bachelorsResult !== undefined && { bachelorsResult: input.bachelorsResult }),
        ...(input.mastersYear !== undefined && { mastersYear: input.mastersYear }),
        ...(input.mastersResult !== undefined && { mastersResult: input.mastersResult }),
        ...(input.englishTest !== undefined && { englishTest: input.englishTest }),
        ...(input.ieltsScore !== undefined && { ieltsScore: input.ieltsScore != null ? String(input.ieltsScore) : null }),
        ...(input.toeflScore !== undefined && { toeflScore: input.toeflScore != null ? String(input.toeflScore) : null }),
        ...(input.satScore !== undefined && { satScore: input.satScore != null ? String(input.satScore) : null }),
        ...(input.topikLevel !== undefined && { topikLevel: input.topikLevel }),
        ...(input.interestedProgram !== undefined && { applyingTo: input.interestedProgram }),
        ...(input.image !== undefined && { photoUrl: input.image }),
      }

      if (existingInquiries.length > 0) {
        for (const inq of existingInquiries) {
          await ctx.db
            .update(schema.studentInquiries)
            .set(inquiryUpdates)
            .where(eq(schema.studentInquiries.id, inq.id))
            .catch((err: any) => {
              console.error('[updateProfile] Failed to update inquiry:', err)
            })
        }
      } else {
        const newInquiryId =
          globalThis.crypto?.randomUUID?.() ||
          Math.random().toString(36).substring(2) + Date.now().toString(36)
        await ctx.db
          .insert(schema.studentInquiries)
          .values({
            id: newInquiryId,
            userId,
            email: (userEmail || ctx.session.user.email || '').trim(),
            surname,
            givenName,
            phone: input.phone || existing?.phone || 'N/A',
            country: input.countryOfResidence || existing?.countryOfResidence || 'Bangladesh',
            ...inquiryUpdates,
          })
          .catch((err: any) => {
            console.error('[updateProfile] Failed to insert inquiry:', err)
          })
      }
      await syncStudentInquiriesToApplications(ctx.db, ctx.session.user).catch((err: any) => {
        console.error('[updateProfile] Failed to sync student applications:', err)
      })

      return { success: true }
    }),

  // Role-agnostic profile update for the signed-in user. Updates the `users`
  // record directly (name/email/avatar) so it works for students, counselors
  // and admins alike, without touching role-specific profile tables.
  updateOwnProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(2).max(100).optional(),
        email: z.string().email().max(255).optional(),
        image: z.string().max(500).nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const updates: Record<string, unknown> = {}

      if (input.name !== undefined) updates.name = input.name.trim()
      if (input.email !== undefined) {
        const [existing] = await ctx.db
          .select({ id: schema.users.id })
          .from(schema.users)
          .where(and(eq(schema.users.email, input.email.trim()), ne(schema.users.id, userId)))
          .limit(1)
        if (existing) throw new Error('That email is already in use')
        updates.email = input.email.trim()
      }
      if (input.image !== undefined) updates.image = input.image

      if (Object.keys(updates).length > 0) {
        await ctx.db.update(schema.users).set(updates).where(eq(schema.users.id, userId))
      }
      return { success: true }
    }),
})
