import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from './auth'
import { db } from './db'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { UserRole } from '@endow/types'
import { zodErrorToMessage } from './utils'
import { hasPermission, type Permission } from './rbac'

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
    const zodError = error.cause instanceof ZodError ? error.cause : null
    return {
      ...shape,
      message: zodError ? zodErrorToMessage(zodError) : shape.message,
      data: {
        ...shape.data,
        zodError: zodError ? zodError.flatten() : null,
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

// ─── RBAC helpers ────────────────────────────────────────────────
function parsePermissions(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as string[]
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as string[]
    } catch {
      return []
    }
  }
  return []
}

export function requirePermission(permission: Permission) {
  return protectedProcedure.use(({ ctx, next }) => {
    const role = (ctx.session as any).user?.role as UserRole
    const perms = parsePermissions((ctx.session as any).user?.permissions)
    if (role === UserRole.SUPER_ADMIN) return next({ ctx })
    // ADMIN and also COUNSELOR can have module permissions for staff delegation
    if (!hasPermission(perms, permission, role)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: `Missing permission: ${permission}` })
    }
    return next({ ctx })
  })
}

// Shorthand: admin must also have specific module permission (super admin bypasses)
export function adminWithPermission(permission: Permission) {
  return protectedProcedure.use(({ ctx, next }) => {
    const role = (ctx.session as any).user?.role as UserRole
    if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    const perms = parsePermissions((ctx.session as any).user?.permissions)
    if (role === UserRole.SUPER_ADMIN) return next({ ctx })
    if (!hasPermission(perms, permission, role)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: `Missing permission: ${permission}` })
    }
    return next({ ctx })
  })
}
