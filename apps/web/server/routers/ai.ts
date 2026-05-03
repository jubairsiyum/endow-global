import { createTRPCRouter, protectedProcedure } from '../trpc'

export const aiRouter = createTRPCRouter({
  getMatches: protectedProcedure.query(({ ctx }) => {
    return []
  }),
})
