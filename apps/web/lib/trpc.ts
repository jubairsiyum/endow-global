import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from './auth'
import { db } from './db'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { UserRole } from '@endow/types'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  })
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
  const role = (ctx.session as any).user?.role as UserRole
  if (role !== UserRole.COUNSELOR && role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({ ctx })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = (ctx.session as any).user?.role as UserRole
  if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({ ctx })
})

export const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = (ctx.session as any).user?.role as UserRole
  if (role !== UserRole.SUPER_ADMIN) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({ ctx })
})
