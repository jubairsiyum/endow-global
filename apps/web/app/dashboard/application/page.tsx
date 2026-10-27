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
  AlertTriangle,
  Trash2,
  Loader2,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { toast } from 'sonner'

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
  const utils = trpc.useUtils()
  const { data, isLoading, isError, refetch } = trpc.application.getAll.useQuery()
  const applications = (data ?? []) as any[]
  const [filter, setFilter] = useState<Filter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [withdrawTarget, setWithdrawTarget] = useState<any | null>(null)

  const withdrawMutation = trpc.application.withdraw.useMutation({
    onSuccess: (res) => {
      toast.success(res.message || 'Application withdrawn and removed successfully.')
      setWithdrawTarget(null)
      utils.application.getAll.invalidate()
      utils.dashboard.overview.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to withdraw application. Please try again.')
    },
  })

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
              Start application
            </Link>
            <Link href="/courses" className={btnSecondary}>
              Browse catalog
            </Link>
          </div>
        </div>
      ) : visibleApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No applications found matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleApplications.map((app) => {
            const statusConfig =
              APPLICATION_STATUS[app.status as ApplicationStatus] ?? APPLICATION_STATUS.DRAFT
            const status = {
              ...statusConfig,
              label:
                app.status === 'UNDER_REVIEW'
                  ? 'Application Under Review'
                  : app.status === 'SUBMITTED'
                    ? 'Application Submitted'
                    : statusConfig.label,
            }
            const isExpanded = expandedId === app.id
            const pInfo =
              typeof app.personalInfo === 'string'
                ? JSON.parse(app.personalInfo)
                : app.personalInfo || {}
            const aHist =
              typeof app.academicHistory === 'string'
                ? JSON.parse(app.academicHistory)
                : app.academicHistory || {}

            const step = app.currentStep || 1
            const total = app.totalSteps || 5
            const pct = Math.min(100, Math.round((step / total) * 100))

            return (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${studentPanel} p-5 md:p-6 transition-all hover:border-gray-300 dark:hover:border-gray-700`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        <Sparkles size={13} />
                        {app.course?.level || 'Degree'} · {app.course?.subject || 'Academics'}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {app.course?.name || app.courseName || 'Selected Academic Program'}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                        <Building2 size={14} className="text-gray-400" />
                        {app.universityName || app.course?.university?.name || 'Partner University'}
                      </span>
                      {(app.universityCity || app.course?.university?.city) && (
                        <span>
                          · {app.universityCity || app.course?.university?.city},{' '}
                          {app.universityCountry || app.course?.university?.country || 'South Korea'}
                        </span>
                      )}
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

                {/* Collapsible Application details & Action toolbar */}
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

                  <div className="flex flex-wrap items-center gap-2">
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
                    <button
                      type="button"
                      onClick={() => setWithdrawTarget(app)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                      title="Withdraw and remove this application"
                    >
                      <Trash2 size={13} className="text-rose-600 dark:text-rose-400" />
                      Withdraw
                    </button>
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {withdrawTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#151821]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <h3 id="withdraw-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
                    Withdraw Application?
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to withdraw your application? This will permanently delete your application and all related data from the platform.
                  </p>
                </div>
              </div>

              {/* Target Course and University Details */}
              <div className="mt-5 rounded-xl border border-gray-200/70 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-[#1a1d25]">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <GraduationCap size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
                  <span className="line-clamp-1">{withdrawTarget.courseName || withdrawTarget.course?.name || 'Academic Program'}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Building2 size={14} className="shrink-0" />
                  <span className="line-clamp-1">{withdrawTarget.universityName || withdrawTarget.course?.university?.name || 'Selected University'}</span>
                </div>
              </div>

              {/* Permanent Warning Callout */}
              <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                  This action cannot be undone
                </p>
                <p className="mt-1 leading-relaxed opacity-90">
                  Once withdrawn, your application is removed from our database. If you wish to apply again, you will need to submit a new application.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={withdrawMutation.isPending}
                  onClick={() => setWithdrawTarget(null)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={withdrawMutation.isPending}
                  onClick={() => {
                    if (withdrawTarget?.id) {
                      withdrawMutation.mutate({ applicationId: withdrawTarget.id })
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-sm shadow-rose-600/20"
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Yes, Withdraw Application
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
