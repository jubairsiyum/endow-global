import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function authorizeApplicationAccess(ctx: any, applicationId: string, mode: 'read' | 'write' = 'read') {
  // Fetch application and enforce access rules
  const app = await db.query.applications.findFirst({
    where: (a, { eq }) => eq(a.id, applicationId),
  })
  if (!app) throw new Error('NOT_FOUND')

  const user = ctx.session?.user
  if (!user) throw new Error('UNAUTHORIZED')

  if (user.role === 'ADMIN') return app

  if (user.role === 'COUNSELOR') {
    // counselor can access if assigned
    if (app.counselorId === user.id) return app
    throw new Error('FORBIDDEN')
  }

  // STUDENT - owner only
  const profile = await db.query.studentProfiles.findFirst({ where: (sp, { eq }) => eq(sp.userId, user.id) })
  if (!profile) throw new Error('FORBIDDEN')
  if (app.studentId !== profile.id) throw new Error('FORBIDDEN')

  return app
}
