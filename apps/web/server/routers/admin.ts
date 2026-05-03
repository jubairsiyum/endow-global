import { z } from 'zod'
import { createTRPCRouter, adminProcedure } from '../trpc'
import { indexCourse } from '@/lib/typesense'
import { stripe } from '@/lib/stripe'
import { sendEmail } from '@/lib/resend'
import Newsletter from '@/emails/Newsletter'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { slugify } from '@/lib/utils'

const universitySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  country: z.string().min(2),
  city: z.string().min(2),
  logo: z.string().url().nullable().optional(),
  coverImage: z.string().url().nullable().optional(),
  description: z.string().min(10),
  ranking: z.number().int().nullable().optional(),
  website: z.string().url().nullable().optional(),
  established: z.number().int().nullable().optional(),
  totalStudents: z.number().int().nullable().optional(),
  internationalPercent: z.number().nullable().optional(),
})

const courseSchema = z.object({
  universityId: z.string(),
  name: z.string().min(2),
  slug: z.string().optional(),
  subject: z.string().min(2),
  level: z.string(),
  duration: z.number().int().min(1),
  durationUnit: z.string(),
  tuitionFee: z.number().int().min(0),
  currency: z.string().min(2),
  applicationDeadline: z.date().nullable().optional(),
  startDate: z.date().nullable().optional(),
  language: z.string().min(2),
  requirements: z.array(z.string()).default([]),
  hasScholarship: z.boolean().default(false),
  scholarshipDetails: z.string().nullable().optional(),
  description: z.string().min(10),
})

async function embedCourse(course: any) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'endow-courses')

  const text =
    `Course: ${course.name}. Subject: ${course.subject}. Level: ${course.level}. ` +
    `University: ${course.university.name}. Country: ${course.university.country}. ` +
    `Duration: ${course.duration} ${course.durationUnit}. Tuition: ${course.tuitionFee} ${course.currency}. ` +
    `Requirements: ${course.requirements.join(', ')}. ` +
    `Scholarship: ${course.hasScholarship ? 'Yes - ' + course.scholarshipDetails : 'No'}. ` +
    `Description: ${course.description}`

  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })

  await index.upsert([
    {
      id: course.id,
      values: embeddingResponse.data[0].embedding,
      metadata: {
        courseId: course.id,
        name: course.name,
        subject: course.subject,
        level: course.level,
        country: course.university.country,
        tuitionFee: course.tuitionFee,
        hasScholarship: course.hasScholarship,
        universityName: course.university.name,
        universitySlug: course.university.slug,
        slug: course.slug,
      },
    },
  ])
}

export const adminRouter = createTRPCRouter({
  getMetrics: adminProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [users, applications, sessions, revenue] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.application.count(),
      ctx.prisma.bookingSession.count(),
      ctx.prisma.bookingSession.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { amountPaid: true },
      }),
    ])

    return {
      users,
      applications,
      sessions,
      revenue: revenue._sum.amountPaid || 0,
    }
  }),

  createUniversity: adminProcedure.input(universitySchema).mutation(async ({ ctx, input }) => {
    const slug = input.slug || slugify(input.name)
    return ctx.prisma.university.create({
      data: { ...input, slug, isActive: true },
    })
  }),

  updateUniversity: adminProcedure
    .input(universitySchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const slug = data.slug || slugify(data.name)

      const university = await ctx.prisma.university.update({
        where: { id },
        data: { ...data, slug },
      })

      const courses = await ctx.prisma.course.findMany({
        where: { universityId: id },
        include: { university: true },
      })

      await Promise.all(courses.map((course) => indexCourse({
        id: course.id,
        name: course.name,
        subject: course.subject,
        level: course.level,
        country: course.university.country,
        city: course.university.city,
        universityName: course.university.name,
        universitySlug: course.university.slug,
        slug: course.slug,
        tuitionFee: course.tuitionFee,
        currency: course.currency,
        duration: course.duration,
        durationUnit: course.durationUnit,
        hasScholarship: course.hasScholarship,
        language: course.language,
        description: course.description,
        applicationDeadline: course.applicationDeadline,
        isActive: course.isActive,
      })))

      return university
    }),

  deleteUniversity: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.university.update({
        where: { id: input.id },
        data: { isActive: false },
      })

      await ctx.prisma.course.updateMany({
        where: { universityId: input.id },
        data: { isActive: false },
      })

      return { success: true }
    }),

  createCourse: adminProcedure.input(courseSchema).mutation(async ({ ctx, input }) => {
    const slug = input.slug || slugify(`${input.name}-${input.universityId}`)

    const course = await ctx.prisma.course.create({
      data: {
        ...input,
        slug,
        isActive: true,
      },
      include: { university: true },
    })

    await indexCourse({
      id: course.id,
      name: course.name,
      subject: course.subject,
      level: course.level,
      country: course.university.country,
      city: course.university.city,
      universityName: course.university.name,
      universitySlug: course.university.slug,
      slug: course.slug,
      tuitionFee: course.tuitionFee,
      currency: course.currency,
      duration: course.duration,
      durationUnit: course.durationUnit,
      hasScholarship: course.hasScholarship,
      language: course.language,
      description: course.description,
      applicationDeadline: course.applicationDeadline,
      isActive: course.isActive,
    })

    await embedCourse(course)
    return course
  }),

  updateCourse: adminProcedure
    .input(courseSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const slug = data.slug || slugify(`${data.name}-${data.universityId}`)

      const course = await ctx.prisma.course.update({
        where: { id },
        data: { ...data, slug },
        include: { university: true },
      })

      await indexCourse({
        id: course.id,
        name: course.name,
        subject: course.subject,
        level: course.level,
        country: course.university.country,
        city: course.university.city,
        universityName: course.university.name,
        universitySlug: course.university.slug,
        slug: course.slug,
        tuitionFee: course.tuitionFee,
        currency: course.currency,
        duration: course.duration,
        durationUnit: course.durationUnit,
        hasScholarship: course.hasScholarship,
        language: course.language,
        description: course.description,
        applicationDeadline: course.applicationDeadline,
        isActive: course.isActive,
      })

      await embedCourse(course)
      return course
    }),

  getAllUsers: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        perPage: z.number().int().min(10).max(100).default(20),
        role: z.string().optional(),
        query: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {}
      if (input.role) where.role = input.role
      if (input.query) {
        where.OR = [
          { email: { contains: input.query, mode: 'insensitive' } },
          { name: { contains: input.query, mode: 'insensitive' } },
        ]
      }

      const skip = (input.page - 1) * input.perPage

      const [users, total] = await Promise.all([
        ctx.prisma.user.findMany({
          where,
          skip,
          take: input.perPage,
          orderBy: { createdAt: 'desc' },
        }),
        ctx.prisma.user.count({ where }),
      ])

      return { users, total, page: input.page, totalPages: Math.ceil(total / input.perPage) }
    }),

  updateUserRole: adminProcedure
    .input(z.object({ userId: z.string(), role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      })
    }),

  getAllCounselors: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.counselorProfile.findMany({
      include: {
        user: true,
        _count: { select: { assignedStudents: true } },
      },
      orderBy: { totalStudents: 'desc' },
    })
  }),

  sendNewsletter: adminProcedure
    .input(
      z.object({
        subject: z.string().min(3),
        previewText: z.string().min(3),
        htmlContent: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscribers = await ctx.prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
      })
      const emails = subscribers.map((s) => s.email)

      if (!emails.length) return { sent: 0 }

      await sendEmail({
        to: emails,
        subject: input.subject,
        react: Newsletter({
          subject: input.subject,
          previewText: input.previewText,
          htmlContent: input.htmlContent,
        }),
      })

      return { sent: emails.length }
    }),
})
