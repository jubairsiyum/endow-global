'use client'

import { motion } from 'framer-motion'
import { trpc } from '@/lib/trpc-client'
import { FileText, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ApplicationPage() {
  const { data: applications, isLoading } = trpc.application.getAll.useQuery()

  const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    DRAFT: { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', label: 'Draft' },
    IN_PROGRESS: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', label: 'In Progress' },
    SUBMITTED: { icon: ArrowRight, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', label: 'Submitted' },
    UNDER_REVIEW: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Under Review' },
    DOCUMENTS_REQUIRED: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Docs Required' },
    ACCEPTED: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10', label: 'Accepted' },
    REJECTED: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', label: 'Rejected' },
    WAITLISTED: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', label: 'Waitlisted' },
    WITHDRAWN: { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800', label: 'Withdrawn' },
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Application</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your application status and progress</p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="space-y-4"
        >
          {(applications as any[])?.length ? (
            (applications as any[]).map((app: any) => {
              const status = statusConfig[app.status] || statusConfig.DRAFT
              const Icon = status.icon
              return (
                <div key={app.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#11131a]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${status.bg}`}>
                        <Icon size={18} className={status.color} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {app.course?.name || 'Application'}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {app.course?.university?.name || 'University'} — {app.course?.university?.country || ''}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            Step {app.currentStep || 0} of {app.totalSteps || 0}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            Updated {app.updatedAt ? formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true }) : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {app.counselorNotes && (
                    <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 dark:bg-[#1a1d25]">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Counselor Notes</p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{app.counselorNotes}</p>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-[#11131a]">
              <FileText size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No Applications Yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Browse courses and start your first application to study abroad.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
