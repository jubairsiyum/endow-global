'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

export interface SessionInfo {
  id: string
  email: string
  role: string
  name: string
}

export async function getCurrentSession(): Promise<SessionInfo | null> {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  if (!session?.user) {
    console.warn('[getCurrentSession] No session/user found')
    return null
  }

  const dbUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, session.user.id),
    columns: { role: true, email: true, name: true },
  })

  const effectiveRole = dbUser?.role ?? (session.user as Record<string, unknown>).role ?? null

  console.log(
    '[getCurrentSession] userId:',
    session.user.id,
    'dbRole:',
    dbUser?.role,
    'sessionRole:',
    (session.user as Record<string, unknown>).role
  )

  if (!effectiveRole) return null

  return {
    id: session.user.id,
    email: session.user.email,
    role: String(effectiveRole),
    name: session.user.name,
  }
}
