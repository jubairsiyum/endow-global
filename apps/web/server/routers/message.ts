import { createTRPCRouter, protectedProcedure } from '../trpc'

export const messageRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(({ ctx }) => {
    return []
  }),
})
