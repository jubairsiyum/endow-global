'use client'

import { useState, useMemo, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, ExternalLink, Check, X, RotateCcw, AlertTriangle, ShieldCheck, User } from 'lucide-react'
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

interface StudentGroup {
  key: string
  name: string
  email: string
  level: string
  docs: any[]
}

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

  // Organize records by student: students are listed with their own documents
  // nested underneath, instead of one flat, mixed index.
  const students = useMemo<StudentGroup[]>(() => {
    const map = new Map<string, StudentGroup>()
    for (const doc of docs as any[]) {
      const key = doc.studentId || `unknown-${doc.studentName || 'student'}`
      let group = map.get(key)
      if (!group) {
        group = { key, name: doc.studentName || 'Unknown', email: doc.studentEmail || '', level: doc.level, docs: [] }
        map.set(key, group)
      }
      group.docs.push(doc)
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [docs])

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

  const levelColor = (level: string) => {
    switch (level) {
      case 'UNDERGRADUATE': return 'bg-blue-50 text-blue-700'
      case 'POSTGRADUATE': return 'bg-purple-50 text-purple-700'
      case 'PHD': return 'bg-rose-50 text-rose-700'
      case 'HIGH_SCHOOL': return 'bg-emerald-50 text-emerald-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const docRow = (doc: any) => {
    const config = DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING
    const submitted = Boolean(doc.fileUrl)
    const reviewing = rejectingId === doc.id
    const busy = busyId === doc.id
    return (
      <Fragment key={doc.id}>
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between border-t border-gray-100 first:border-t-0">
          {/* Left: identity + file */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                <FileText size={16} className="text-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-gray-900">{doc.label}</p>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">{doc.category}</p>
              </div>
            </div>

            <div className="mt-2 pl-12">
              {submitted ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="max-w-[200px] truncate text-[12px] text-gray-700">{doc.fileName ?? (doc.fileUrl as string).split('/').pop()}</span>
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
              ) : (
                <span className="text-[11px] text-gray-400">Not uploaded yet</span>
              )}
              {doc.status === 'REJECTED' && doc.rejectionReason && (
                <p className="mt-1 rounded bg-red-50 px-2 py-1 text-[11px] text-red-600">{doc.rejectionReason}</p>
              )}
            </div>
          </div>

          {/* Right: status + actions */}
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.color} ${config.bg}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} /> {config.label}
              </span>
              <span className="text-[11px] text-gray-400">
                {doc.uploadedAt
                  ? formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })
                  : doc.updatedAt
                    ? formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })
                    : '—'}
              </span>
            </div>

            {!submitted ? null : (
              <div className="flex flex-wrap items-center gap-1.5">
                {(doc.status === 'UPLOADED' || doc.status === 'REJECTED') && (
                  <>
                    <SAButton variant="primary" size="sm" onClick={() => approve(doc)} disabled={busy}>
                      {busy ? '...' : <><Check size={12} /> Approve</>}
                    </SAButton>
                    <SAButton
                      variant={doc.status === 'REJECTED' ? 'secondary' : 'danger'}
                      size="sm"
                      onClick={() => {
                        if (reviewing) { setRejectingId(null); setRejectReason('') }
                        else { setRejectingId(doc.id); setRejectReason('') }
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

            {reviewing && (
              <div className="flex w-full items-center gap-2 sm:justify-end">
                <input
                  autoFocus
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmReject(doc)
                    if (e.key === 'Escape') { setRejectingId(null); setRejectReason('') }
                  }}
                  placeholder="Reason for rejection…"
                  className="w-full max-w-[240px] rounded-md border border-amber-200 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-amber-400"
                />
                <SAButton variant="danger" size="sm" onClick={() => confirmReject(doc)} disabled={busy || !rejectReason.trim()}>
                  Confirm
                </SAButton>
                <SAButton variant="ghost" size="sm" onClick={() => { setRejectingId(null); setRejectReason('') }} disabled={busy}>
                  Cancel
                </SAButton>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-gray-900" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            Documents
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500">Student-provided documents, organized by student record</p>
        </div>
        {needsReview > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <ShieldCheck size={13} /> {needsReview} ready for review
          </span>
        )}
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-fit flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); setRejectingId(null) }}
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
      ) : students.length === 0 ? (
        <div className="py-20 text-center">
          <FileText size={28} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">
            {search || tab !== 'all' ? 'No documents match your filters.' : 'No documents yet. Students upload these from their dashboard.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <User size={14} className="text-gray-400" />
            {students.length} student record{students.length !== 1 ? 's' : ''} · {docs.length} document{docs.length !== 1 ? 's' : ''}
          </div>

          {students.map((group) => {
            const verified = group.docs.filter((d) => d.status === 'VERIFIED').length
            const pending = group.docs.filter((d) => d.status !== 'VERIFIED').length
            return (
              <motion.div key={group.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
                {/* Student header */}
                <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8A33D] to-[#c48b2e] text-[13px] font-bold text-white">
                      {group.name.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-gray-900">{group.name}</p>
                      <p className="truncate text-[12px] text-gray-500">{group.email || '—'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${levelColor(group.level)}`}>
                      {APPLICANT_LEVEL_LABEL[group.level as 'UNDERGRADUATE' | 'POSTGRADUATE'] ?? group.level}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                      {group.docs.length} doc{group.docs.length !== 1 ? 's' : ''}
                    </span>
                    {verified > 0 && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                        {verified} verified
                      </span>
                    )}
                    {pending > 0 && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600">
                        {pending} pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="divide-y divide-gray-50">{group.docs.map(docRow)}</div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
