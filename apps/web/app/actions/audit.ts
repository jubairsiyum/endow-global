'use server'

import { logAdminActivity, type AuditAction } from '@/lib/audit'

export async function logAuthEvent(
  action: AuditAction,
  actor: { id: string; email: string; role: string },
  metadata?: Record<string, unknown>
) {
  await logAdminActivity({ action, actor, metadata })
}
