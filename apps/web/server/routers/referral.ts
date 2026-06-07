import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'

export const referralRouter = createTRPCRouter({
  getMyCode: protectedProcedure.query(() => {
    return 'TESTCODE'
  }),
})
