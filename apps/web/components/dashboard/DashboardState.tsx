'use client'

import { Inbox, RefreshCw, TriangleAlert } from 'lucide-react'

interface LoadingProps {
  rows?: number
  className?: string
}

export function DashboardLoading({ rows = 3, className = '' }: LoadingProps) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
      ))}
    </div>
  )
}

interface ErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function DashboardError({
  title = 'We could not load this area',
  message = 'Check your connection and try again. Your data has not been changed.',
  onRetry,
}: ErrorProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/70 px-5 py-10 text-center dark:border-red-900/60 dark:bg-red-950/20" role="alert">
      <TriangleAlert size={28} className="mx-auto text-red-500" aria-hidden />
      <h2 className="mt-3 text-base font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-gray-600 dark:text-gray-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <RefreshCw size={15} /> Try again
        </button>
      )}
    </div>
  )
}

export function DashboardEmpty({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-12 text-center dark:border-gray-700 dark:bg-[#12141c]">
      <Inbox size={30} className="mx-auto text-gray-300 dark:text-gray-600" aria-hidden />
      <h2 className="mt-3 text-base font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
