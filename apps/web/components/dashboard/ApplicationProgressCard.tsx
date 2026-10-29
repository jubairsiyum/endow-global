'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Info, CheckCircle2, GraduationCap, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  applications?: any[]
  stats?: {
    applicationProgress?: number
    appProgressBreakdown?: {
      submittedPercent: number
      inReviewPercent: number
      remainingPercent: number
      overallPercent: number
      currentStep: number
      totalSteps: number
      status: string
    }
  }
}

export function ApplicationProgressCard({ applications = [], stats }: Props) {
  const [selectedAppIndex, setSelectedAppIndex] = useState(0)

  // Bound index safely
  const activeIndex = Math.min(Math.max(0, selectedAppIndex), Math.max(0, applications.length - 1))
  const activeApp = applications[activeIndex]
  const hasApp = !!activeApp

  // 1. Calculate actual application progress from database for the selected course
  const currentStep = activeApp?.currentStep ?? (hasApp ? 5 : 0)
  const totalSteps = activeApp?.totalSteps ?? 5
  const rawStatus = (activeApp?.status || 'DRAFT').toUpperCase()

  // Use global breakdown if single application and breakdown exists, otherwise calculate per-app
  const isSingleDefault = applications.length <= 1 && stats?.appProgressBreakdown

  let overallPercent = 0
  let submittedWidth = 0
  let inReviewWidth = 0
  let remainingWidth = 100

  if (isSingleDefault && stats?.appProgressBreakdown) {
    const b = stats.appProgressBreakdown
    submittedWidth = b.submittedPercent
    inReviewWidth = b.inReviewPercent
    remainingWidth = b.remainingPercent
    overallPercent = b.overallPercent
  } else if (hasApp) {
    if (rawStatus === 'ACCEPTED' || rawStatus === 'ENROLLED') {
      submittedWidth = 100
      inReviewWidth = 0
      remainingWidth = 0
      overallPercent = 100
    } else if (rawStatus === 'UNDER_REVIEW') {
      submittedWidth = 60
      inReviewWidth = 40
      remainingWidth = 0
      overallPercent = 100
    } else if (rawStatus === 'SUBMITTED') {
      submittedWidth = 100
      inReviewWidth = 0
      remainingWidth = 0
      overallPercent = 100
    } else {
      const completed = Math.max(0, currentStep - 1)
      submittedWidth = Math.round((completed / totalSteps) * 100)
      inReviewWidth = Math.round((1 / totalSteps) * 100)
      remainingWidth = Math.max(0, 100 - submittedWidth - inReviewWidth)
      overallPercent = Math.round((currentStep / totalSteps) * 100)
    }
  }

  // Human-readable status label from database
  const statusLabel = !hasApp
    ? 'No Application'
    : rawStatus === 'ACCEPTED'
      ? 'Offer Accepted'
      : rawStatus === 'UNDER_REVIEW'
        ? 'Under Review'
        : rawStatus === 'SUBMITTED'
          ? 'Application Submitted'
          : rawStatus === 'DOCUMENTS_REQUIRED'
            ? 'Documents Required'
            : 'In Preparation'

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                Application Progress
              </h3>
              {applications.length > 1 && (
                <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {applications.length} Applied Courses
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              Real-time stage completion from your university admissions file
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div
              title="Progress segments are computed dynamically from your application status in the database."
              className="cursor-pointer text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <Info size={15} />
            </div>
            <Link
              href="/dashboard/application"
              className="inline-flex shrink-0 whitespace-nowrap items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              <span>View all</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Target Application Milestone Capsule from Database */}
        {activeApp ? (
          <div className="my-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                {activeApp.course?.name || activeApp.courseName || 'Degree Program'}
              </span>
              <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                Step {currentStep} of {totalSteps} · {overallPercent}%
              </span>
            </div>
            <p className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="truncate">
                {activeApp.course?.university?.name ||
                  activeApp.universityName ||
                  'Partner University'}{' '}
                ·{' '}
                {activeApp.course?.university?.country ||
                  activeApp.universityCountry ||
                  'International'}
              </span>
              <span className="shrink-0 font-semibold text-emerald-600 dark:text-emerald-400">
                {statusLabel}
              </span>
            </p>
          </div>
        ) : (
          <div className="my-3 rounded-xl border border-dashed border-slate-200 p-3.5 text-center dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No active application found in database
            </p>
            <p className="text-[11px] text-slate-400">
              Submit an application through Apply Now to track live admission milestones.
            </p>
          </div>
        )}

        {/* Multi-Segment Horizontal Progress Bar strictly based on student application */}
        <div className="space-y-2">
          <div className="flex h-3.5 w-full gap-1 overflow-hidden rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            {/* Segment 1: Submitted (Emerald Green) */}
            <motion.div
              key={`sub-${activeIndex}`}
              initial={{ width: 0 }}
              animate={{ width: `${submittedWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-md bg-emerald-500"
              title={`Submitted: ${submittedWidth}%`}
            />

            {/* Segment 2: In Review (Brand Rose) */}
            <motion.div
              key={`rev-${activeIndex}`}
              initial={{ width: 0 }}
              animate={{ width: `${inReviewWidth}%` }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="h-full rounded-md bg-rose-600"
              title={`Under Review: ${inReviewWidth}%`}
            />

            {/* Segment 3: Remaining Steps (Light Slate) */}
            <motion.div
              key={`rem-${activeIndex}`}
              initial={{ width: 0 }}
              animate={{ width: `${remainingWidth}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="h-full rounded-md bg-slate-200 dark:bg-slate-700"
              title={`Remaining: ${remainingWidth}%`}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-emerald-500 shrink-0" />
              <span>Total Submitted ({submittedWidth}%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-rose-600 shrink-0" />
              <span>In Review ({inReviewWidth}%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-slate-300 dark:bg-slate-600 shrink-0" />
              <span>Remaining ({remainingWidth}%)</span>
            </div>
          </div>
        </div>

        {/* All Applied Courses Horizontal Scroll Shelf */}
        {applications.length > 1 && (
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                All Applied Courses ({applications.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Scroll horizontally &amp; select course
              </span>
            </div>
            <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth">
              {applications.map((app: any, idx: number) => {
                const isSel = idx === activeIndex
                const appStatus = (app.status || 'DRAFT').toUpperCase()
                const cStep = app.currentStep ?? 5
                const tSteps = app.totalSteps ?? 5
                const percent =
                  appStatus === 'SUBMITTED' ||
                  appStatus === 'UNDER_REVIEW' ||
                  appStatus === 'ACCEPTED' ||
                  appStatus === 'ENROLLED'
                    ? 100
                    : Math.round((cStep / tSteps) * 100)

                return (
                  <div
                    key={app.id || idx}
                    onClick={() => setSelectedAppIndex(idx)}
                    className={cn(
                      'group min-w-[250px] sm:min-w-[280px] max-w-[320px] shrink-0 cursor-pointer rounded-xl border p-3 transition-all text-left flex flex-col justify-between',
                      isSel
                        ? 'border-rose-400/80 bg-rose-50/40 dark:border-rose-700 dark:bg-rose-950/20 shadow-xs ring-1 ring-rose-400/30'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700'
                    )}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="min-w-0 pr-1">
                          <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                            {app.course?.name || app.courseName || `Course #${idx + 1}`}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {app.course?.university?.name ||
                              app.universityName ||
                              'University'}{' '}
                            ·{' '}
                            {app.course?.university?.country ||
                              app.universityCountry ||
                              'International'}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold',
                            appStatus === 'ACCEPTED' || appStatus === 'ENROLLED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : appStatus === 'UNDER_REVIEW'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          )}
                        >
                          {appStatus === 'UNDER_REVIEW'
                            ? 'Review'
                            : appStatus === 'ACCEPTED'
                              ? 'Accepted'
                              : 'Submitted'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Step {cStep} of {tSteps}</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{percent}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer link to applications */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <Link
          href="/dashboard/application"
          className="flex items-center justify-between gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          <span className="truncate">View full application details &amp; documents</span>
          <ChevronRight size={13} className="shrink-0" />
        </Link>
      </div>
    </div>
  )
}
