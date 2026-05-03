import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const messageRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { studentProfile: true, counselorProfile: true },
    })

    if (user?.studentProfile) {
      return ctx.prisma.conversation.findMany({
        where: { studentId: user.studentProfile.id },
        include: { counselor: { include: { user: true } } },
        orderBy: { lastMessageAt: 'desc' },
      })
    }

    if (user?.counselorProfile) {
      return ctx.prisma.conversation.findMany({
        where: { counselorId: user.counselorProfile.id },
        include: { student: { include: { user: true } } },
        orderBy: { lastMessageAt: 'desc' },
      })
    }

    return []
  }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.string(), page: z.number().int().min(1).default(1), perPage: z.number().int().min(10).max(100).default(30) }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      })
      if (!conversation) throw new Error('Conversation not found')

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { studentProfile: true, counselorProfile: true },
      })

      const canView =
        (user?.studentProfile && conversation.studentId === user.studentProfile.id) ||
        (user?.counselorProfile && conversation.counselorId === user.counselorProfile.id)

      if (!canView) throw new Error('Unauthorized')

      const skip = (input.page - 1) * input.perPage

      const [messages, total] = await Promise.all([
        ctx.prisma.message.findMany({
          where: { conversationId: input.conversationId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: input.perPage,
        }),
        ctx.prisma.message.count({ where: { conversationId: input.conversationId } }),
      ])

      return { messages, total, page: input.page, totalPages: Math.ceil(total / input.perPage) }
    }),

  send: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().min(1),
        attachmentUrl: z.string().url().nullable().optional(),
        attachmentType: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
      })
      if (!conversation) throw new Error('Conversation not found')

      const message = await ctx.prisma.message.create({
        data: {
          conversationId: input.conversationId,
          senderId: ctx.session.user.id,
          content: input.content,
          attachmentUrl: input.attachmentUrl || null,
          attachmentType: input.attachmentType || null,
        },
      })

      await ctx.prisma.conversation.update({
        where: { id: input.conversationId },
        data: { lastMessage: input.content, lastMessageAt: new Date() },
      })

      return message
    }),

  markRead: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.message.updateMany({
        where: {
          conversationId: input.conversationId,
          senderId: { not: ctx.session.user.id },
          isRead: false,
        },
        data: { isRead: true },
      })
    }),
})
