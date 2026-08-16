import type { ComponentType } from 'react'

export type ApplicationStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENTS_REQUIRED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WAITLISTED'
  | 'WITHDRAWN'

export type DocumentStatus = 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'

export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

export interface StatusConfig {
  label: string
  /** text + border tint classes */
  color: string
  /** background tint classes */
  bg: string
  /** solid dot color class */
  dot: string
  emoji: string
}

export const APPLICATION_STATUS: Record<ApplicationStatus, StatusConfig> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-700/40', dot: 'bg-gray-400', emoji: '✍️' },
  IN_PROGRESS: { label: 'In progress', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-500/10', dot: 'bg-blue-500', emoji: '🚧' },
  SUBMITTED: { label: 'Submitted', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-500/10', dot: 'bg-purple-500', emoji: '📨' },
  UNDER_REVIEW: { label: 'Under review', color: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-500/10', dot: 'bg-amber-500', emoji: '🔍' },
  DOCUMENTS_REQUIRED: { label: 'Docs needed', color: 'text-red-600 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-500/10', dot: 'bg-red-500', emoji: '📄' },
  ACCEPTED: { label: 'Accepted 🎉', color: 'text-green-600 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-500/10', dot: 'bg-green-500', emoji: '🎓' },
  REJECTED: { label: 'Rejected', color: 'text-red-600 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-500/10', dot: 'bg-red-500', emoji: '💔' },
  WAITLISTED: { label: 'Waitlisted', color: 'text-orange-600 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-500/10', dot: 'bg-orange-500', emoji: '⏳' },
  WITHDRAWN: { label: 'Withdrawn', color: 'text-gray-400 dark:text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800', dot: 'bg-gray-300', emoji: '🚪' },
}

export const DOCUMENT_STATUS: Record<DocumentStatus, StatusConfig> = {
  PENDING: { label: 'Pending', color: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-500/10', dot: 'bg-amber-500', emoji: '⏳' },
  UPLOADED: { label: 'Uploaded', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-500/10', dot: 'bg-blue-500', emoji: '📤' },
  VERIFIED: { label: 'Verified', color: 'text-green-600 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-500/10', dot: 'bg-green-500', emoji: '✅' },
  REJECTED: { label: 'Rejected', color: 'text-red-600 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-500/10', dot: 'bg-red-500', emoji: '⚠️' },
}

export const SESSION_STATUS: Record<SessionStatus, StatusConfig> = {
  SCHEDULED: { label: 'Scheduled', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-500/10', dot: 'bg-blue-500', emoji: '🗓️' },
  COMPLETED: { label: 'Completed', color: 'text-green-600 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-500/10', dot: 'bg-green-500', emoji: '🎉' },
  CANCELLED: { label: 'Cancelled', color: 'text-gray-400 dark:text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800', dot: 'bg-gray-300', emoji: '❌' },
  NO_SHOW: { label: 'No show', color: 'text-red-600 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-500/10', dot: 'bg-red-500', emoji: '👻' },
}

export const NOTIFICATION_EMOJI: Record<string, string> = {
  SESSION_REMINDER: '🗓️',
  APPLICATION_UPDATE: '📬',
  NEW_MESSAGE: '💬',
  MATCH_READY: '✨',
  REFERRAL_EARNED: '💰',
  SYSTEM: '🔔',
}

export interface StatusBadgeProps {
  status: string
  config: Record<string, StatusConfig>
}

// Helper to format file sizes
export function formatBytes(bytes?: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export type IconComponent = ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>
