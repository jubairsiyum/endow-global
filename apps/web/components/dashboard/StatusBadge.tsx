'use client'

import type { ApplicationStatus } from '@/lib/mockData'

const STYLES: Record<ApplicationStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-200',
  'In Review': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300',
  Submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  Approved: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300',
  Rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
}

interface Props {
  status: ApplicationStatus
}

export function StatusBadge({ status }: Props) {
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  )
}
