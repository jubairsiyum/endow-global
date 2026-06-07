'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: app, isLoading, refetch } = trpc.admin.applications.getById.useQuery({ id })

  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const statusMutation = trpc.admin.applications.updateStatus.useMutation({
    onSuccess: () => refetch(),
  })

  const notesMutation = trpc.admin.applications.addNotes.useMutation({
    onSuccess: () => {
      setIsEditingNotes(false)
      refetch()
    },
  })

  if (isLoading) {
    return <div className="py-20 text-center">Loading application details...</div>
  }

  if (!app) {
    return <div className="py-20 text-center">Application not found</div>
  }

  const handleStatusChange = (newStatus: any) => {
    if (confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      statusMutation.mutate({ id, status: newStatus })
    }
  }

  const handleSaveNotes = () => {
    notesMutation.mutate({ id, notes })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#1a1d25]"
        >
          Back
        </button>
        <div className="flex-1">
          <PageHeader
            title={`Application: ${app.course?.name}`}
            description={`${app.course?.university?.name} • ${app.student?.user?.name}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: DETAILS & DOCUMENTS */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Application Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.student?.user?.name}
                </p>
                <p className="text-xs text-gray-500">{app.student?.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Counselor</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.counselor?.user?.name || 'Unassigned'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted At</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.submittedAt
                    ? new Date(app.submittedAt).toLocaleString()
                    : 'Not submitted yet'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Step</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {app.currentStep} / {app.totalSteps}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-500">Personal Statement</p>
              <div className="rounded-lg bg-gray-50 p-4 text-sm dark:bg-[#222530]">
                {app.personalStatement || 'No personal statement provided.'}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
            {Array.isArray(app.documentsUrls) && app.documentsUrls.length > 0 ? (
              <ul className="space-y-2">
                {app.documentsUrls.map((docUrl: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Document {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STATUS & NOTES */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Status</h2>
            <div className="mb-4">
              <StatusBadge status={app.status} />
            </div>

            <p className="mb-2 text-sm text-gray-500">Change Status:</p>
            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-[#222530]"
              value={app.status}
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
            {statusMutation.isPending && <p className="mt-2 text-xs text-primary">Updating...</p>}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
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
                  className="rounded-xl border px-4 py-2 text-sm text-primary hover:bg-primary/5"
                >
                  Edit Notes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-700 dark:bg-[#222530]"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter internal notes here..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={notesMutation.isPending}
                    className="rounded-xl bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {notesMutation.isPending ? 'Saving...' : 'Save Notes'}
                  </button>
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#1a1d25]"
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
