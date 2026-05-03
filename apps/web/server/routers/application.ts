import { z } from 'zod'
import { ApplicationStatus } from '@endow/types'
import { createTRPCRouter, protectedProcedure, counselorProcedure } from '../trpc'

export const applicationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.studentProfile.findUnique({
        where: { userId: ctx.session.user.id },
      })
      if (!student) throw new Error('Student profile not found')

      return ctx.prisma.application.create({
        data: {
          studentId: student.id,
          courseId: input.courseId,
          status: ApplicationStatus.DRAFT,
        },
      })
    }),

  updateStep: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        step: z.number().int().min(1).max(5),
        personalInfo: z.any().optional(),
        academicHistory: z.any().optional(),
        personalStatement: z.string().nullable().optional(),
        documentsUrls: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.studentProfile.findUnique({
        where: { userId: ctx.session.user.id },
      })
      if (!student) throw new Error('Student profile not found')

      const existing = await ctx.prisma.application.findUnique({
        where: { id: input.applicationId },
      })
      if (!existing || existing.studentId !== student.id) {
        throw new Error('Application not found')
      }

      const currentStep = Math.min(Math.max(existing.currentStep, input.step + 1), existing.totalSteps)

      return ctx.prisma.application.update({
        where: { id: input.applicationId },
        data: {
          personalInfo: input.personalInfo ?? existing.personalInfo,
          academicHistory: input.academicHistory ?? existing.academicHistory,
          personalStatement: input.personalStatement ?? existing.personalStatement,
          documentsUrls: input.documentsUrls ?? existing.documentsUrls,
          currentStep,
          status: currentStep > 1 ? ApplicationStatus.IN_PROGRESS : existing.status,
        },
      })
    }),

  submit: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.studentProfile.findUnique({
        where: { userId: ctx.session.user.id },
      })
      if (!student) throw new Error('Student profile not found')

      const existing = await ctx.prisma.application.findUnique({
        where: { id: input.applicationId },
      })
      if (!existing || existing.studentId !== student.id) {
        throw new Error('Application not found')
      }

      return ctx.prisma.application.update({
        where: { id: input.applicationId },
        data: {
          status: ApplicationStatus.SUBMITTED,
          submittedAt: new Date(),
        },
      })
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const student = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!student) throw new Error('Student profile not found')

    return ctx.prisma.application.findMany({
      where: { studentId: student.id },
      include: { course: { include: { university: true } } },
      orderBy: { updatedAt: 'desc' },
    })
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const app = await ctx.prisma.application.findUnique({
        where: { id: input.id },
        include: { course: { include: { university: true } } },
      })
      if (!app) throw new Error('Application not found')
      return app
    }),

  updateStatus: counselorProcedure
    .input(
      z.object({
        applicationId: z.string(),
        status: z.nativeEnum(ApplicationStatus),
        counselorNotes: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.update({
        where: { id: input.applicationId },
        data: { status: input.status, counselorNotes: input.counselorNotes },
      })
    }),
})
