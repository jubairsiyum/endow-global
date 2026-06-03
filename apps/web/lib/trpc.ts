import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from './auth'
import { db } from './db'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { UserRole } from '@endow/types'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth()
  return {
    db,
    session,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, session: ctx.session } })
})

export const counselorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session!.user.role !== UserRole.COUNSELOR && ctx.session!.user.role !== UserRole.ADMIN) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({ ctx })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session!.user.role !== UserRole.ADMIN) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({ ctx })
})
