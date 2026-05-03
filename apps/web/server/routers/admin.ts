import { createTRPCRouter, adminProcedure } from '../trpc'

export const adminRouter = createTRPCRouter({
  getMetrics: adminProcedure.query(({ ctx }) => {
    return { users: 0, applications: 0 }
  }),
})
