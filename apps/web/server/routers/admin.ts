import { createTRPCRouter, adminProcedure } from '@/lib/trpc'

export const adminRouter = createTRPCRouter({
  getMetrics: adminProcedure.query(() => {
    return { users: 0, applications: 0 }
  }),
})
