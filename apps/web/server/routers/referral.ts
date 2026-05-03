import { createTRPCRouter, protectedProcedure } from '../trpc'

export const referralRouter = createTRPCRouter({
  getMyCode: protectedProcedure.query(({ ctx }) => {
    return "TESTCODE"
  }),
})
