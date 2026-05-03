import { createTRPCRouter, counselorProcedure } from '@/lib/trpc'

export const counselorRouter = createTRPCRouter({
  getAssignedStudents: counselorProcedure.query(({ ctx }) => {
    return []
  }),
})
