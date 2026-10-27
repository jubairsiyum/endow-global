'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  GraduationCap,
  Building2,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

import { trpc } from '@/lib/trpc-client'
import { cleanCounselorNotes } from '@/lib/utils'
import { APPLICATION_STATUS } from '@/lib/dashboard'
import type { ApplicationStatus } from '@/lib/dashboard'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, btnSecondary, progressTrack, progressFill } from '@/components/dashboard/ui'

type Filter = 'all' | 'active' | 'submitted' | 'decided'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'In progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'decided', label: 'Decided' },
]

const FILTER_STATUS: Record<Exclude<Filter, 'all'>, string[]> = {
  active: ['DRAFT', 'IN_PROGRESS', 'DOCUMENTS_REQUIRED', 'UNDER_REVIEW'],
  submitted: ['SUBMITTED', 'WAITLISTED'],
  decided: ['ACCEPTED', 'REJECTED', 'WITHDRAWN'],
}

export default function ApplicationPage() {
  const { data, isLoading, isError, refetch } = trpc.application.getAll.useQuery()
  const applications = (data ?? []) as any[]
  const [filter, setFilter] = useState<Filter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const countFor = (value: Filter) =>
    value === 'all'
      ? applications.length
      : applications.filter((a) => FILTER_STATUS[value].includes(a.status)).length

  const visibleApplications = applications.filter((application) =>
    filter === 'all' ? true : FILTER_STATUS[filter].includes(application.status)
  )

  const toggleExpand = (id: string) => {
    setExpandedId((curr) => (curr === id ? null : id))
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <StudentPageHeader
        eyebrow="Your journey"
        title="My applications"
        description="Track every application, one step at a time. We'll keep the next action clear."
        action={
          <div className="flex items-center gap-2">
            <Link href="/apply-now" className={btnPrimary}>
              New Application
            </Link>
            <Link href="/courses" className={btnSecondary}>
              Explore courses
            </Link>
          </div>
        }
      />

      <div
        className={`${studentPanel} flex gap-1 overflow-x-auto p-1.5`}
        role="tablist"
        aria-label="Application filters"
      >
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            onClick={() => setFilter(value)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 ${
              filter === value
                ? 'bg-rose-600 text-white'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            {label} <span className="ml-1 text-xs opacity-70">{countFor(value)}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <DashboardLoading rows={2} />
      ) : isError ? (
        <DashboardError onRetry={() => refetch()} />
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <GraduationCap size={36} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No applications yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Your dream degree is waiting. Submit an application through Apply Now or explore courses today.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link href="/apply-now" className={btnPrimary}>
              Apply Now
            </Link>
            <Link href="/courses" className={btnSecondary}>
              Explore courses
            </Link>
          </div>
        </div>
      ) : visibleApplications.length === 0 ? (
        <div className={`${studentPanel} py-14 text-center`}>
          <GraduationCap size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">
            Nothing in this view
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try another filter to see your applications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleApplications.map((app: any, i: number) => {
            const status =
              APPLICATION_STATUS[app.status as ApplicationStatus] ?? APPLICATION_STATUS.DRAFT
            const total = app.totalSteps || 5
            const step = Math.min(Math.max(app.currentStep || 0, 0), total)
            const pct = Math.round((step / total) * 100)
            const isExpanded = expandedId === app.id
            const pInfo = typeof app.personalInfo === 'string' ? JSON.parse(app.personalInfo) : app.personalInfo
            const aHist = typeof app.academicHistory === 'string' ? JSON.parse(app.academicHistory) : app.academicHistory

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`${studentPanel} overflow-hidden p-5 transition-shadow hover:shadow-md`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300">
                      {app.course?.university?.logo ? (
                        <img
                          src={app.course.university.logo}
                          alt=""
                          className="h-8 w-8 rounded-lg object-contain"
                        />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">
                          {app.course?.name || 'Study Abroad Application'}
                        </h3>
                        {app.course?.level && (
                          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                            {app.course.level}
                          </span>
                        )}
                        {aHist?.applyingTo && (
                          <span className="rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                            {aHist.applyingTo}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Building2 size={14} className="shrink-0 text-gray-400" />
                        <span>
                          {app.course?.university?.name || aHist?.targetUniversity || 'University'}
                        </span>
                        <span>·</span>
                        <span>
                          {app.course?.university?.country || aHist?.targetCountry || 'South Korea'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start">
                    <StatusPill label={status.label} config={status} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className={`${progressTrack} flex-1`}>
                    <div className={progressFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Step {step} of {total} · {pct}%
                  </span>
                </div>

                {/* Key badges / highlights */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-gray-400" />
                    Updated{' '}
                    {app.updatedAt
                      ? formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })
                      : 'Recently'}
                  </span>

                  {app.submittedAt && (
                    <span>
                      · Submitted on{' '}
                      {format(new Date(app.submittedAt), 'MMM d, yyyy')}
                    </span>
                  )}

                  {aHist?.ieltsScore && (
                    <span className="rounded-md bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 font-semibold text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
                      IELTS: {aHist.ieltsScore}
                    </span>
                  )}

                  {aHist?.bachelorsResult && (
                    <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                      Bachelor&apos;s CGPA: {aHist.bachelorsResult}
                    </span>
                  )}
                  {aHist?.hscResult && !aHist?.bachelorsResult && (
                    <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                      HSC GPA: {aHist.hscResult}
                    </span>
                  )}
                </div>

                {/* Counselor Notes */}
                {cleanCounselorNotes(app.counselorNotes) && (
                  <div className="mt-3.5 rounded-xl bg-gray-50 px-4 py-3 dark:bg-[#1a1d25] border border-gray-100 dark:border-gray-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Application Notes & Motivation
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      {cleanCounselorNotes(app.counselorNotes)}
                    </p>
                  </div>
                )}

                {/* Collapsible Application details */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(app.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={15} /> Hide Application Profile
                      </>
                    ) : (
                      <>
                        <ChevronDown size={15} /> View Full Application Profile
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard/documents"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FileCheck2 size={13} className="text-rose-600 dark:text-rose-400" />
                      Documents
                    </Link>
                    <Link
                      href="/dashboard/appointments"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Calendar size={13} className="text-blue-600 dark:text-blue-400" />
                      Book Counselor
                    </Link>
                    {app.course?.slug && (
                      <Link
                        href={`/courses/${app.course.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink size={13} />
                        View Course
                      </Link>
                    )}
                  </div>
                </div>

                {/* Expanded Details Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-gray-50/70 dark:bg-gray-900/40 p-4 border border-gray-100 dark:border-gray-800">
                        {/* Personal info */}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-green-600" />
                            Personal Details
                          </p>
                          <div className="space-y-1 leading-relaxed">
                            <p>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span>{' '}
                              {pInfo?.givenName || ''} {pInfo?.surname || ''}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>{' '}
                              {pInfo?.email || '—'}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Phone:</span>{' '}
                              {pInfo?.phone || '—'}
                            </p>
                            {pInfo?.whatsapp && (
                              <p>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">WhatsApp:</span>{' '}
                                {pInfo.whatsapp}
                              </p>
                            )}
                            <p>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Nationality:</span>{' '}
                              {pInfo?.nationality || '—'}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Country of Residence:</span>{' '}
                              {pInfo?.country || '—'}
                            </p>
                            {pInfo?.city && (
                              <p>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">City / State:</span>{' '}
                                {pInfo.city} {pInfo.state ? `, ${pInfo.state}` : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Academic info */}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                            <GraduationCap size={14} className="text-[#C41E3A]" />
                            Academic Qualifications
                          </p>
                          <div className="space-y-1 leading-relaxed">
                            <p>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Applying For:</span>{' '}
                              {aHist?.applyingTo || 'Degree Program'}
                            </p>
                            {aHist?.bachelorsYear && (
                              <p>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Bachelor&apos;s:</span>{' '}
                                Class of {aHist.bachelorsYear} (CGPA {aHist.bachelorsResult || '—'})
                              </p>
                            )}
                            {aHist?.hscYear && (
                              <p>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">HSC / A-Level:</span>{' '}
                                Class of {aHist.hscYear} (GPA {aHist.hscResult || '—'})
                              </p>
                            )}
                            {aHist?.sscYear && (
                              <p>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">SSC / O-Level:</span>{' '}
                                Class of {aHist.sscYear} (GPA {aHist.sscResult || '—'})
                              </p>
                            )}
                            {aHist?.englishTest && (
                              <p>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">English Proficiency:</span>{' '}
                                {aHist.englishTest}{' '}
                                {aHist.ieltsScore ? `(Score: ${aHist.ieltsScore})` : ''}
                                {aHist.toeflScore ? `(Score: ${aHist.toeflScore})` : ''}
                              </p>
                            )}
                            {aHist?.topikLevel && (
                              <p>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">TOPIK Level:</span>{' '}
                                {aHist.topikLevel}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
