'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, GraduationCap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { trpc } from '@/lib/trpc-client'
import { APPLICATION_STATUS } from '@/lib/dashboard'
import type { ApplicationStatus } from '@/lib/dashboard'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'

export default function ApplicationPage() {
  const { data, isLoading, isError, refetch } = trpc.application.getAll.useQuery()
  const applications = (data ?? []) as any[]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            My applications <span aria-hidden>🎓</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track every application, one step at a time
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <DashboardLoading rows={2} />
      ) : isError ? (
        <DashboardError onRetry={() => refetch()} />
      ) : applications.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <GraduationCap size={36} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No applications yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Your dream degree is waiting. Browse courses and start your first application today.
          </p>
          <Link
            href="/courses"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A01830]"
          >
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any, i: number) => {
            const status = APPLICATION_STATUS[app.status as ApplicationStatus] ?? APPLICATION_STATUS.DRAFT
            const total = app.totalSteps || 5
            const step = Math.min(Math.max(app.currentStep || 0, 0), total)
            const pct = Math.round((step / total) * 100)
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-premium-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#12141c]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/5">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{app.course?.name || 'Application'}</h3>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {app.course?.university?.name || 'University'} · {app.course?.university?.country || ''}
                      </p>
                    </div>
                  </div>
                  <StatusPill label={status.label} config={status} />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C41E3A] to-[#ff4d6d]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Step {step} of {total}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span>
                    Updated {app.updatedAt ? formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true }) : '—'}
                  </span>
                  {app.submittedAt && <span>· Submitted {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}</span>}
                </div>

                {app.counselorNotes && (
                  <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 dark:bg-[#1a1d25]">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">💬 Counselor notes</p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{app.counselorNotes}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
