'use server'

import { redis } from './redis'

const AUDIT_KEY = 'admin_audit_log'
const AUDIT_TTL = 60 * 60 * 24 * 90 // 90 days

export type AuditAction =
  | 'login.success'
  | 'login.failed'
  | 'login.locked'
  | 'logout'
  | 'user.role_change'
  | 'user.delete'
  | 'user.create'
  | 'course.create'
  | 'course.update'
  | 'course.delete'
  | 'university.create'
  | 'university.update'
  | 'university.delete'
  | 'settings.update'

interface AuditEntry {
  timestamp: string
  action: AuditAction
  actor: { id: string; email: string; role: string }
  target?: { id: string; type: string; detail?: string }
  ip?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export async function logAdminActivity(entry: Omit<AuditEntry, 'timestamp'>): Promise<void> {
  try {
    const fullEntry: AuditEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    }

    const key = `${AUDIT_KEY}:${fullEntry.actor.id}:${Date.now()}`
    const value = JSON.stringify(fullEntry)
    await redis.setex(key, AUDIT_TTL, value)
  } catch {
    // Audit logging is best-effort; never block application flow
  }
}

export async function getAdminActivityLog(
  actorId?: string,
  limit = 100
): Promise<AuditEntry[]> {
  try {
    const pattern = actorId
      ? `${AUDIT_KEY}:${actorId}:*`
      : `${AUDIT_KEY}:*`

    const keys: string[] = []
    let cursor = 0
    do {
      const [nextKey, pageKeys] = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      })
      cursor = Number(nextKey)
      keys.push(...pageKeys)
    } while (cursor !== 0)

    if (keys.length === 0) return []

    const values: unknown[] = await redis.mget(...keys)
    const entries = (values as (string | null)[])
      .map((v: string | null) => {
        if (!v) return null
        try {
          return JSON.parse(v) as AuditEntry
        } catch {
          return null
        }
      })
      .filter((e: AuditEntry | null): e is AuditEntry => e !== null)
      .sort(
        (a: AuditEntry, b: AuditEntry) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit)

    return entries
  } catch {
    return []
  }
}
