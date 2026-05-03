import { createTRPCRouter, publicProcedure } from '../trpc'

export const courseRouter = createTRPCRouter({
  search: publicProcedure.query(() => {
    return { hits: [], total: 0, page: 1, totalPages: 1 }
  }),
})
