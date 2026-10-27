'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, CalendarClock, FileCheck2, FileText } from 'lucide-react'
import { useCountUp } from '@/lib/hooks/useCountUp'

interface StatProps {
  stats: {
    applications?: number
    shortlisted?: number
    documentsUploaded?: number
    documentsTotal?: number
    daysUntilNextDeadline?: number | null
    applicationProgress?: number
  }
}

export function ModernStatCards({ stats }: StatProps) {
  const applicationsCount = useCountUp(stats.applications ?? 0)
  const shortlistedCount = useCountUp(stats.shortlisted ?? 0)
  const documentsCount = useCountUp(stats.documentsUploaded ?? 0)
  const deadlineCount = useCountUp(stats.daysUntilNextDeadline ?? 0)

  const hasApplications = (stats.applications ?? 0) > 0
  const progressPercent = hasApplications
    ? Math.min(Math.max(stats.applicationProgress ?? 0, 0), 100)
    : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card 1: Active Applications */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#12141c] dark:hover:border-slate-700"
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
                <FileText size={16} />
              </div>
              <span className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-white">
                Active Applications
              </span>
            </div>
            {hasApplications ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                None
              </span>
            )}
          </div>

          <div className="my-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {Math.round(applicationsCount)}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Progress</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-rose-600 dark:bg-rose-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Card 2: Shortlisted Courses */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#12141c] dark:hover:border-slate-700"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
              <BookOpen size={16} />
            </div>
            <span className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-white">
              Shortlisted Courses
            </span>
          </div>

          <div className="my-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {Math.round(shortlistedCount)}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/shortlisted"
          className="group flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50/40 hover:text-rose-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-300"
        >
          <span>View All</span>
          <ArrowRight
            size={14}
            className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500"
          />
        </Link>
      </motion.div>

      {/* Card 3: Documents Verified */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#12141c] dark:hover:border-slate-700"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
              <FileCheck2 size={16} />
            </div>
            <span className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-white">
              Completed Documents
            </span>
          </div>

          <div className="my-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {Math.round(documentsCount)}
            </span>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              / {stats.documentsTotal ?? 0}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/documents"
          className="group flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50/40 hover:text-rose-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-300"
        >
          <span>View Documents</span>
          <ArrowRight
            size={14}
            className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500"
          />
        </Link>
      </motion.div>

      {/* Card 4: Upcoming Deadlines */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#12141c] dark:hover:border-slate-700"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
              <CalendarClock size={16} />
            </div>
            <span className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-white">
              Upcoming Deadlines
            </span>
          </div>

          <div className="my-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {stats.daysUntilNextDeadline != null
                ? `${Math.round(deadlineCount)} Days`
                : 'No Deadlines'}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/deadlines"
          className="group flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50/40 hover:text-rose-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-300"
        >
          <span>View Schedule</span>
          <ArrowRight
            size={14}
            className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500"
          />
        </Link>
      </motion.div>
    </div>
  )
}
