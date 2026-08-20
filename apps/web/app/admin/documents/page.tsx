'use client'

import { useState, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, ExternalLink, Check, X, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

import { trpc } from '@/lib/trpc-client'
import { APPLICANT_LEVEL_LABEL } from '@/lib/documents'
import { DOCUMENT_STATUS, formatBytes } from '@/lib/dashboard'
import type { DocumentStatus } from '@/lib/dashboard'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'

type StatusFilter = 'all' | 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'

const TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'UPLOADED', label: 'Uploaded' },
  { value: 'VERIFIED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]

export default function AdminDocumentsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<StatusFilter>('all')
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const { data, isLoading, isError } = trpc.admin.documents.list.useQuery({
    search: search || undefined,
    status: tab === 'all' ? undefined : tab,
  })

  const updateStatus = trpc.admin.documents.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Document status updated')
      utils.admin.documents.list.invalidate()
      setRejectingId(null)
      setRejectReason('')
      setBusyId(null)
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to update')
      setBusyId(null)
    },
  })

  const docs = data ?? []

  const needsReview = docs.filter((d) => d.status === 'UPLOADED').length

  function approve(doc: any) {
    setBusyId(doc.id)
    updateStatus.mutate({ id: doc.id, status: 'VERIFIED' })
  }

  function confirmReject(doc: any) {
    if (!rejectReason.trim()) {
      toast.error('Please add a reason for rejecting')
      return
    }
    setBusyId(doc.id)
    updateStatus.mutate({ id: doc.id, status: 'REJECTED', rejectionReason: rejectReason.trim() })
  }

  function resetToReview(doc: any) {
    setBusyId(doc.id)
    updateStatus.mutate({ id: doc.id, status: 'UPLOADED' })
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            Documents
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500">Review student-provided documents — approve or reject with feedback</p>
        </div>
        {needsReview > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <ShieldCheck size={13} /> {needsReview} ready for review
          </span>
        )}
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value)
                setRejectingId(null)
              }}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${tab === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[280px]">
            <SAInput placeholder="Search student, email, document..." icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); setTab('all'); setRejectingId(null) }}>
            <RotateCcw size={12} /> Reset
          </SAButton>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertTriangle size={28} style={{ color: '#F0625B' }} />
            <p className="mt-3 text-sm font-medium text-red-500">Failed to load documents</p>
            <SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.documents.list.invalidate()}>
              Retry
            </SAButton>
          </div>
        ) : docs.length === 0 ? (
          <div className="py-20 text-center">
            <FileText size={28} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              {search || tab !== 'all' ? 'No documents match your filters.' : 'No documents yet. Students upload these from their dashboard.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Student', 'Document', 'File', 'Status', 'Level', 'Updated', 'Actions'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-gray-100">
                {docs.map((doc: any) => {
                  const config = DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING
                  const submitted = Boolean(doc.fileUrl)
                  const reviewing = rejectingId === doc.id
                  const busy = busyId === doc.id
                  return (
                    <Fragment key={doc.id}>
                      <tr className="hover:bg-gray-50 transition-colors align-top">
                        <td className="px-3 py-3">
                          <p className="max-w-[180px] truncate text-[13px] font-medium text-gray-900">{doc.studentName || 'Unknown'}</p>
                          <p className="max-w-[180px] truncate text-[11px] text-gray-500">{doc.studentEmail || ''}</p>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-start gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                              <FileText size={14} className="text-rose-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[200px] truncate text-[13px] font-medium text-gray-900">{doc.label}</p>
                              <p className="text-[11px] text-gray-400">{doc.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          {submitted ? (
                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-[12px] text-gray-700">{doc.fileName ?? doc.fileUrl.split('/').pop()}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[11px] text-gray-400">{formatBytes(doc.fileSize)}</span>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                                >
                                  <ExternalLink size={11} /> Open
                                </a>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400">Not uploaded</span>
                          )}
                          {doc.status === 'REJECTED' && doc.rejectionReason && (
                            <p className="mt-1 rounded bg-red-50 px-2 py-1 text-[11px] text-red-600">{doc.rejectionReason}</p>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.color} ${config.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} /> {config.label}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                            {APPLICANT_LEVEL_LABEL[doc.level as 'UNDERGRADUATE' | 'POSTGRADUATE'] ?? doc.level}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[12px] text-gray-500">
                          {doc.uploadedAt
                            ? formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })
                            : doc.updatedAt
                              ? formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })
                              : '—'}
                        </td>
                        <td className="px-3 py-3">
                          {!submitted ? (
                            <span className="text-[11px] text-gray-400">—</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {(doc.status === 'UPLOADED' || doc.status === 'REJECTED') && (
                                <>
                                  <SAButton variant="primary" size="sm" onClick={() => approve(doc)} disabled={busy}>
                                    {busy ? '...' : <><Check size={12} /> Approve</>}
                                  </SAButton>
                                  <SAButton
                                    variant={doc.status === 'REJECTED' ? 'secondary' : 'danger'}
                                    size="sm"
                                    onClick={() => {
                                      if (reviewing) {
                                        setRejectingId(null)
                                        setRejectReason('')
                                      } else {
                                        setRejectingId(doc.id)
                                        setRejectReason('')
                                      }
                                    }}
                                    disabled={!reviewing && busy}
                                  >
                                    <X size={12} /> Reject
                                  </SAButton>
                                </>
                              )}
                              {doc.status === 'VERIFIED' && (
                                <>
                                  <SAButton variant="secondary" size="sm" onClick={() => resetToReview(doc)} disabled={busy}>
                                    <RotateCcw size={12} /> Reset
                                  </SAButton>
                                  <SAButton variant="danger" size="sm" onClick={() => setRejectingId(doc.id)} disabled={busy}>
                                    <X size={12} /> Reject
                                  </SAButton>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                      {reviewing && (
                        <tr className="bg-amber-50/50">
                          <td colSpan={7} className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') confirmReject(doc)
                                  if (e.key === 'Escape') {
                                    setRejectingId(null)
                                    setRejectReason('')
                                  }
                                }}
                                placeholder="Reason for rejection (e.g. Upload a clear colour scan)"
                                className="w-full max-w-md rounded-md border border-amber-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-amber-400"
                              />
                              <SAButton variant="danger" size="sm" onClick={() => confirmReject(doc)} disabled={busy || !rejectReason.trim()}>
                                Confirm Reject
                              </SAButton>
                              <SAButton variant="ghost" size="sm" onClick={() => { setRejectingId(null); setRejectReason('') }} disabled={busy}>
                                Cancel
                              </SAButton>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}