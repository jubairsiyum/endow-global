import { createTRPCRouter, counselorProcedure } from '../trpc'

export const counselorRouter = createTRPCRouter({
  getAssignedStudents: counselorProcedure.query(({ ctx }) => {
    return []
  }),
})
