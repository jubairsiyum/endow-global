'use client'

import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Check,
  ExternalLink,
  FileText,
  RotateCcw,
  Search,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import type { DocumentStatus } from '@/lib/dashboard'
import { DOCUMENT_STATUS, formatBytes } from '@/lib/dashboard'
import { APPLICANT_LEVEL_LABEL } from '@/lib/documents'
import { trpc } from '@/lib/trpc-client'

type StatusFilter = 'all' | 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED'

const TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'UPLOADED', label: 'Uploaded' },
  { value: 'VERIFIED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]

interface DocumentRecord {
  id: string
  studentId?: string | null
  studentName?: string | null
  studentEmail?: string | null
  level: string
  label: string
  category: string
  status: DocumentStatus | string
  fileUrl?: string | null
  fileName?: string | null
  fileSize?: number | null
  rejectionReason?: string | null
  uploadedAt?: string | Date | null
  updatedAt?: string | Date | null
}

interface StudentGroup {
  key: string
  name: string
  email: string
  level: string
  docs: DocumentRecord[]
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to update')
      setBusyId(null)
    },
  })

  const docs: DocumentRecord[] = (data as DocumentRecord[]) ?? []

  // Organize records by student: students are listed with their own documents
  // nested underneath, instead of one flat, mixed index.
  const students = useMemo<StudentGroup[]>(() => {
    const map = new Map<string, StudentGroup>()
    for (const doc of docs) {
      const key = doc.studentId || `unknown-${doc.studentName || 'student'}`
      let group = map.get(key)
      if (!group) {
        group = {
          key,
          name: doc.studentName || 'Unknown',
          email: doc.studentEmail || '',
          level: doc.level,
          docs: [],
        }
        map.set(key, group)
      }
      group.docs.push(doc)
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [docs])

  const needsReview = docs.filter((d) => d.status === 'UPLOADED').length

  function approve(doc: DocumentRecord) {
    setBusyId(doc.id)
    updateStatus.mutate({ id: doc.id, status: 'VERIFIED' })
  }

  function confirmReject(doc: DocumentRecord) {
    if (!rejectReason.trim()) {
      toast.error('Please add a reason for rejecting')
      return
    }
    setBusyId(doc.id)
    updateStatus.mutate({ id: doc.id, status: 'REJECTED', rejectionReason: rejectReason.trim() })
  }

  function resetToReview(doc: DocumentRecord) {
    setBusyId(doc.id)
    updateStatus.mutate({ id: doc.id, status: 'UPLOADED' })
  }

  const levelColor = (level: string) => {
    switch (level) {
      case 'UNDERGRADUATE':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
      case 'POSTGRADUATE':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
      case 'PHD':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
      case 'HIGH_SCHOOL':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const docRow = (doc: DocumentRecord) => {
    const config = DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING
    const submitted = Boolean(doc.fileUrl)
    const reviewing = rejectingId === doc.id
    const busy = busyId === doc.id

    return (
      <Fragment key={doc.id}>
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 first:border-t-0 dark:border-white/[0.06] sm:flex-row sm:items-start sm:justify-between">
          {/* Left: identity + file */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/50">
                <FileText size={16} className="text-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-gray-900 dark:text-white">
                  {doc.label}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">{doc.category}</p>
              </div>
            </div>

            <div className="mt-2 pl-12">
              {submitted ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="max-w-[200px] truncate text-[12px] text-gray-700 dark:text-gray-300">
                    {doc.fileName ?? (doc.fileUrl as string).split('/').pop()}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {doc.fileSize ? formatBytes(doc.fileSize) : ''}
                  </span>
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <ExternalLink size={11} /> Open
                  </a>
                </div>
              ) : (
                <span className="text-[11px] text-gray-400">Not uploaded yet</span>
              )}
              {doc.status === 'REJECTED' && doc.rejectionReason && (
                <p className="mt-1 rounded bg-red-50 px-2 py-1 text-[11px] text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  {doc.rejectionReason}
                </p>
              )}
            </div>
          </div>

          {/* Right: status + actions */}
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.color} ${config.bg}`}
              >
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
                    <SAButton
                      variant="primary"
                      size="sm"
                      onClick={() => approve(doc)}
                      disabled={busy}
                    >
                      {busy ? (
                        '...'
                      ) : (
                        <>
                          <Check size={12} /> Approve
                        </>
                      )}
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
                    <SAButton
                      variant="secondary"
                      size="sm"
                      onClick={() => resetToReview(doc)}
                      disabled={busy}
                    >
                      <RotateCcw size={12} /> Reset
                    </SAButton>
                    <SAButton
                      variant="danger"
                      size="sm"
                      onClick={() => setRejectingId(doc.id)}
                      disabled={busy}
                    >
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
                    if (e.key === 'Escape') {
                      setRejectingId(null)
                      setRejectReason('')
                    }
                  }}
                  placeholder="Reason for rejection…"
                  className="w-full max-w-[240px] rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-[13px] text-gray-900 outline-none focus:border-amber-400 dark:border-amber-900/40 dark:bg-[#09090b] dark:text-white"
                />
                <SAButton
                  variant="danger"
                  size="sm"
                  onClick={() => confirmReject(doc)}
                  disabled={busy || !rejectReason.trim()}
                >
                  Confirm
                </SAButton>
                <SAButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRejectingId(null)
                    setRejectReason('')
                  }}
                  disabled={busy}
                >
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-[20px] font-bold tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk',sans-serif" }}
          >
            Documents
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            Student-provided documents, organized by student record
          </p>
        </div>
        {needsReview > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <ShieldCheck size={13} /> {needsReview} ready for review
          </span>
        )}
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-fit flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-[#18181b]">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value)
                setRejectingId(null)
              }}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                tab === t.value
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-[#09090b] dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[280px]">
            <SAInput
              placeholder="Search student, email, document..."
              icon={<Search size={14} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SAButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('')
              setTab('all')
              setRejectingId(null)
            }}
          >
            <RotateCcw size={12} /> Reset
          </SAButton>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: '#c41e3a', borderTopColor: 'transparent' }}
          />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle size={28} className="text-red-500" />
          <p className="mt-3 text-sm font-medium text-red-500">Failed to load documents</p>
          <SAButton
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => utils.admin.documents.list.invalidate()}
          >
            Retry
          </SAButton>
        </div>
      ) : students.length === 0 ? (
        <div className="py-20 text-center">
          <FileText size={28} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {search || tab !== 'all'
              ? 'No documents match your filters.'
              : 'No documents yet. Students upload these from their dashboard.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
            <User size={14} className="text-gray-400" />
            {students.length} student record{students.length !== 1 ? 's' : ''} · {docs.length}{' '}
            document
            {docs.length !== 1 ? 's' : ''}
          </div>

          {students.map((group) => {
            const verified = group.docs.filter((d) => d.status === 'VERIFIED').length
            const pending = group.docs.filter((d) => d.status !== 'VERIFIED').length
            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]"
              >
                {/* Student header */}
                <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50/60 px-4 py-3 dark:border-white/[0.08] dark:bg-[#18181b]/80 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c41e3a] to-[#a01830] text-[13px] font-bold text-white">
                      {group.name.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </p>
                      <p className="truncate text-[12px] text-gray-500 dark:text-gray-400">
                        {group.email || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${levelColor(group.level)}`}
                    >
                      {APPLICANT_LEVEL_LABEL[group.level as 'UNDERGRADUATE' | 'POSTGRADUATE'] ??
                        group.level}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {group.docs.length} doc{group.docs.length !== 1 ? 's' : ''}
                    </span>
                    {verified > 0 && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {verified} verified
                      </span>
                    )}
                    {pending > 0 && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
                        {pending} pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="divide-y divide-gray-50 dark:divide-white/[0.06]">
                  {group.docs.map(docRow)}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
