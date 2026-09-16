import type { db as dbInstance, schema } from '@endow/db'

export type InAppNotificationType =
  | 'SESSION_REMINDER'
  | 'APPLICATION_UPDATE'
  | 'NEW_MESSAGE'
  | 'MATCH_READY'
  | 'REFERRAL_EARNED'
  | 'SYSTEM'

export async function createInAppNotification(
  database: typeof dbInstance,
  tables: typeof schema,
  notification: {
    userId: string
    type: InAppNotificationType
    title: string
    body: string
    data?: Record<string, unknown>
  }
) {
  await database.insert(tables.notifications).values(notification)
}
