'use client'

import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { confirmToast } from '@/components/ui/confirmToast'
import { trpc } from '@/lib/trpc-client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface StudentUser {
  name?: string | null
  email?: string | null
}

interface StudentRecord {
  user?: StudentUser | null
}

interface CounselorUser {
  name?: string | null
}

interface CounselorRecord {
  user?: CounselorUser | null
}

interface UniversityRecord {
  name?: string | null
}

interface CourseRecord {
  name?: string | null
  university?: UniversityRecord | null
}

interface ApplicationData {
  id: string
  status?: string | null
  submittedAt?: string | Date | null
  currentStep?: number | null
  totalSteps?: number | null
  personalStatement?: string | null
  documentsUrls?: string[] | null
  counselorNotes?: string | null
  student?: StudentRecord | null
  counselor?: CounselorRecord | null
  course?: CourseRecord | null
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: rawApp, isLoading, refetch } = trpc.admin.applications.getById.useQuery({ id })

  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const statusMutation = trpc.admin.applications.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Status updated')
      refetch()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update status'),
  })

  const notesMutation = trpc.admin.applications.addNotes.useMutation({
    onSuccess: () => {
      toast.success('Notes saved')
      setIsEditingNotes(false)
      refetch()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to save notes'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="h-10 w-20 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1 space-y-2">
            <div className="h-9 w-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-72 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-44 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                <div className="h-3 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-20 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mb-4 h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const app = rawApp as ApplicationData | undefined

  if (!app) {
    return (
      <div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">
        Application not found
      </div>
    )
  }

  const handleStatusChange = (newStatus: string) => {
    confirmToast({
      title: 'Change application status',
      description: `Are you sure you want to change the status to ${newStatus.replace(/_/g, ' ')}?`,
      confirmLabel: 'Change status',
      onConfirm: () => statusMutation.mutate({ id, status: newStatus as any }),
    })
  }

  const handleSaveNotes = () => {
    notesMutation.mutate({ id, notes })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
        >
          Back
        </button>
        <div className="flex-1">
          <PageHeader
            title={`Application: ${app.course?.name || 'Course'}`}
            description={`${app.course?.university?.name || 'University'} • ${
              app.student?.user?.name || 'Student'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: DETAILS & DOCUMENTS */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Application Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.student?.user?.name || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {app.student?.user?.email || ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Counselor</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.counselor?.user?.name || 'Unassigned'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Submitted At</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.submittedAt
                    ? new Date(app.submittedAt).toLocaleString()
                    : 'Not submitted yet'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Step</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.currentStep ?? 0} / {app.totalSteps ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Personal Statement</p>
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-800 dark:bg-[#09090b]/60 dark:text-gray-200">
                {app.personalStatement || 'No personal statement provided.'}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
            {Array.isArray(app.documentsUrls) && app.documentsUrls.length > 0 ? (
              <ul className="space-y-2">
                {app.documentsUrls.map((docUrl, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[#c41e3a] hover:underline dark:text-[#e05266]"
                    >
                      Document {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No documents uploaded.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STATUS & NOTES */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Status</h2>
            <div className="mb-4">
              <StatusBadge status={app.status || 'PENDING'} />
            </div>

            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Change Status:</p>
            <select
              aria-label="Change application status"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
              value={app.status || 'DRAFT'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusMutation.isPending}
            >
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="DOCUMENTS_REQUIRED">Documents Required</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
            {statusMutation.isPending && (
              <p className="mt-2 text-xs font-medium text-[#c41e3a]">Updating...</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Counselor Notes
            </h2>

            {!isEditingNotes ? (
              <div>
                <div className="mb-4 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {app.counselorNotes || 'No notes yet.'}
                </div>
                <button
                  onClick={() => {
                    setNotes(app.counselorNotes || '')
                    setIsEditingNotes(true)
                  }}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#c41e3a] transition-colors hover:bg-red-50 dark:border-white/[0.08] dark:text-[#e05266] dark:hover:bg-white/[0.06]"
                >
                  Edit Notes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter internal notes here..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={notesMutation.isPending}
                    style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                  >
                    {notesMutation.isPending ? 'Saving...' : 'Save Notes'}
                  </button>
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
