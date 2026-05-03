import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'

export const messageRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(({ ctx }) => {
    return []
  }),
})
