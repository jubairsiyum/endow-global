import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'

export const aiRouter = createTRPCRouter({
  getMatches: protectedProcedure.query(({ ctx }) => {
    return []
  }),
})
