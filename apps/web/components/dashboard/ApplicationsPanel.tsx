'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, FileText } from 'lucide-react'

import { APPLICATION_STATUS } from '@/lib/dashboard'
import type { ApplicationStatus } from '@/lib/dashboard'
import { StatusPill } from './StatusPill'
import { panel, viewAllLink, progressTrack, progressFill } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

interface Props {
  applications: any[]
  index?: number
}

export function ApplicationsPanel({ applications, index = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className={`${panel} p-5`}
    >
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            My applications
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {applications.length ? `${applications.length} in progress` : 'Nothing yet — start your first'}
          </p>
        </div>
        <Link href="/dashboard/application" className={viewAllLink}>
          View all <ArrowUpRight size={13} />
        </Link>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
          <FileText size={28} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">No applications yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
            Browse courses and start your first application.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {applications.slice(0, 4).map((app, i) => {
            const status = APPLICATION_STATUS[app.status as ApplicationStatus] ?? APPLICATION_STATUS.DRAFT
            const total = app.totalSteps || 5
            const step = Math.min(Math.max(app.currentStep || 0, 0), total)
            const pct = Math.round((step / total) * 100)
            return (
              <motion.li
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  href="/dashboard/application"
                  className="group block rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25] dark:hover:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {app.course?.name ?? 'Application'}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {app.course?.university?.name ?? 'University'} · {app.course?.university?.country ?? ''}
                      </p>
                    </div>
                    <StatusPill label={status.label} config={status} />
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className={`${progressTrack} flex-1`}>
                      <div className={progressFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      Step {step}/{total}
                    </span>
                  </div>
                  {app.counselorNotes && (
                    <p className="mt-3 line-clamp-2 rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                      {app.counselorNotes}
                    </p>
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>
      )}
    </motion.section>
  )
}
