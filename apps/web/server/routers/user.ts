import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { EducationLevel, UserRole } from '@endow/types'
import { embedStudentProfile } from '@endow/ai-worker/src/embed-profile'

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).nullable().optional(),
  image: z.string().url().nullable().optional(),
})

const updateStudentProfileSchema = z
  .object({
    targetCountries: z.array(z.string()).optional(),
    targetSubjects: z.array(z.string()).optional(),
    budgetMin: z.number().int().min(0).nullable().optional(),
    budgetMax: z.number().int().min(0).nullable().optional(),
    gpa: z.number().min(0).max(4).nullable().optional(),
    ieltsScore: z.number().min(0).max(9).nullable().optional(),
    toeflScore: z.number().int().min(0).max(120).nullable().optional(),
    satScore: z.number().int().min(0).max(1600).nullable().optional(),
    greScore: z.number().int().min(0).max(340).nullable().optional(),
    preferredIntakeMonth: z.string().nullable().optional(),
    preferredIntakeYear: z.number().int().min(2020).max(2100).nullable().optional(),
    nationality: z.string().nullable().optional(),
    highestEducation: z.nativeEnum(EducationLevel).optional(),
    workExperienceYears: z.number().int().min(0).max(60).optional(),
  })
  .partial()

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

function calculateCompletionPercent(profile: {
  nationality?: string | null
  targetCountries?: string[]
  targetSubjects?: string[]
  budgetMin?: number | null
  budgetMax?: number | null
  gpa?: number | null
  ieltsScore?: number | null
  highestEducation?: EducationLevel
  workExperienceYears?: number | null
  preferredIntakeMonth?: string | null
  preferredIntakeYear?: number | null
  toeflScore?: number | null
  satScore?: number | null
  greScore?: number | null
}) {
  const altTestScoreFilled =
    isFilled(profile.toeflScore) || isFilled(profile.satScore) || isFilled(profile.greScore)

  const fields = [
    profile.nationality,
    profile.targetCountries,
    profile.targetSubjects,
    profile.budgetMin,
    profile.budgetMax,
    profile.gpa,
    profile.ieltsScore,
    profile.highestEducation,
    profile.workExperienceYears,
    profile.preferredIntakeMonth,
    profile.preferredIntakeYear,
    altTestScoreFilled ? 'yes' : null,
  ]

  const filledFields = fields.filter(isFilled).length
  return Math.round((filledFields / 12) * 100)
}

async function autoAssignCounselor(prisma: any, studentId: string) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
  })

  if (!student || student.assignedCounselorId) return null

  const counselors = await prisma.counselorProfile.findMany({
    where: { isAvailable: true },
    orderBy: { totalStudents: 'asc' },
  })

  const scored = counselors.map((c: any) => {
    let score = 0
    const countryOverlap = student.targetCountries.filter((co: string) =>
      c.expertiseCountries.includes(co)
    ).length
    const subjectOverlap = student.targetSubjects.filter((s: string) =>
      c.expertiseSubjects.includes(s)
    ).length
    score += countryOverlap * 3
    score += subjectOverlap * 2
    score -= c.totalStudents * 0.1
    return { counselor: c, score }
  })

  scored.sort((a: any, b: any) => b.score - a.score)
  const best = scored[0]?.counselor
  if (!best) return null

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: { assignedCounselorId: best.id },
  })

  await prisma.counselorProfile.update({
    where: { id: best.id },
    data: { totalStudents: { increment: 1 } },
  })

  return best.id
}

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { studentProfile: true, counselorProfile: true },
    })
  }),

  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    return ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: input,
    })
  }),

  getStudentProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
  }),

  updateStudentProfile: protectedProcedure
    .input(updateStudentProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.studentProfile.findUnique({
        where: { userId: ctx.session.user.id },
      })

      if (!existing) {
        throw new Error('Student profile not found')
      }

      const merged = { ...existing, ...input }
      const completionPercent = calculateCompletionPercent(merged)

      const updated = await ctx.prisma.studentProfile.update({
        where: { id: existing.id },
        data: { ...input, completionPercent },
      })

      if (!updated.assignedCounselorId) {
        await autoAssignCounselor(ctx.prisma, updated.id)
      }

      return updated
    }),

  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    const profile = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })

    if (!profile) {
      throw new Error('Student profile not found')
    }

    await ctx.prisma.studentProfile.update({
      where: { id: profile.id },
      data: { completionPercent: 100 },
    })

    await embedStudentProfile(profile.id)
    return { success: true }
  }),

  registerFCMToken: protectedProcedure
    .input(z.object({ token: z.string().min(5) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { fcmToken: input.token },
      })
    }),
})
