'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { FileText, Upload, Trash2, ExternalLink, ShieldCheck, ClipboardList, RefreshCw } from 'lucide-react'

import { trpc } from '@/lib/trpc-client'
import {
  DOCUMENT_REQUIREMENTS,
  requirementKey,
  APPLICANT_LEVEL_LABEL,
  type ApplicantLevel,
  type DocumentRequirement,
} from '@/lib/documents'
import { DOCUMENT_STATUS, formatBytes } from '@/lib/dashboard'
import type { DocumentStatus } from '@/lib/dashboard'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { progressTrack, progressFill, btnSecondary } from '@/components/dashboard/ui'

async function uploadFile(file: File): Promise<{ url: string; name: string; size: number }> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('scope', 'private')
  const res = await fetch('/api/upload-file', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

interface GroupedRequirement {
  category: string
  items: DocumentRequirement[]
}

function groupRequirements(level: ApplicantLevel): GroupedRequirement[] {
  const groups: GroupedRequirement[] = []
  for (const req of DOCUMENT_REQUIREMENTS[level] ?? []) {
    const group = groups.find((g) => g.category === req.category)
    if (group) group.items.push(req)
    else groups.push({ category: req.category, items: [req] })
  }
  return groups
}

export default function DocumentsPage() {
  const { data, isLoading, isError, refetch } = trpc.dashboard.documents.list.useQuery()
  const utils = trpc.useUtils()
  const addDoc = trpc.dashboard.documents.add.useMutation()
  const uploadDoc = trpc.dashboard.documents.upload.useMutation()
  const removeDoc = trpc.dashboard.documents.remove.useMutation()

  const fileInput = useRef<HTMLInputElement>(null)
  const [targetDocId, setTargetDocId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const level: ApplicantLevel = data?.level ?? 'UNDERGRADUATE'
  const items: any[] = data?.items ?? []

  const byKey = new Map<string, any>()
  for (const doc of items) byKey.set(requirementKey(doc.category, doc.label), doc)

  const required = DOCUMENT_REQUIREMENTS[level] ?? []
  const requiredKeys = new Set(required.map((r) => requirementKey(r.category, r.label)))
  const groups = groupRequirements(level)
  const extras = items.filter((d) => !requiredKeys.has(requirementKey(d.category, d.label)))

  const verifiedCount = required.filter((r) => {
    const doc = byKey.get(requirementKey(r.category, r.label))
    return doc?.status === 'VERIFIED'
  }).length
  const uploadedCount = required.filter((r) => {
    const doc = byKey.get(requirementKey(r.category, r.label))
    return doc?.status === 'VERIFIED' || doc?.status === 'UPLOADED'
  }).length
  const pct = required.length ? Math.round((verifiedCount / required.length) * 100) : 0

  const invalidate = () => {
    utils.dashboard.documents.list.invalidate()
    utils.dashboard.overview.invalidate()
  }

  async function handleFile(file: File, docId?: string) {
    setBusy(docId ?? '__new__')
    try {
      const uploaded = await uploadFile(file)
      let id = docId
      if (!id) {
        const label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        const created = await addDoc.mutateAsync({ label, category: 'OTHER' })
        id = created.id
      }
      if (!id) throw new Error('Missing document id')
      await uploadDoc.mutateAsync({
        id,
        fileUrl: uploaded.url,
        fileName: file.name,
        fileSize: file.size,
      })
      toast.success('Document uploaded — waiting for our team to review')
      invalidate()
    } catch (e: any) {
      toast.error(e.message || 'Upload failed')
    } finally {
      setBusy(null)
      setTargetDocId(null)
    }
  }

  function openPicker(docId?: string) {
    setTargetDocId(docId ?? null)
    fileInput.current?.click()
  }

  async function handleRemove(id: string) {
    try {
      await removeDoc.mutateAsync({ id })
      toast.success('Removed')
      invalidate()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  function DocRow({ doc }: { doc: any }) {
    const status = DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING
    const hasFile = Boolean(doc.fileUrl)
    const isVerified = doc.status === 'VERIFIED'

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={`${studentPanel} flex items-center gap-4 p-4 transition-shadow hover:shadow-md`}
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isVerified
              ? 'bg-green-50 dark:bg-green-500/10'
              : doc.status === 'REJECTED'
                ? 'bg-red-50 dark:bg-red-500/10'
                : 'bg-gray-50 dark:bg-[#1a1d25]'
          }`}
        >
          {isVerified ? (
            <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
          ) : (
            <FileText size={19} className="text-gray-500 dark:text-gray-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{doc.label}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
            {hasFile
              ? `${doc.fileName ?? doc.fileUrl.split('/').pop()} · ${formatBytes(doc.fileSize)}`
              : doc.status === 'REJECTED' && doc.rejectionReason
                ? doc.rejectionReason
                : 'Not uploaded yet'}
          </p>
          {doc.status === 'REJECTED' && doc.rejectionReason && (
            <p className="mt-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-300">
              {doc.rejectionReason}
            </p>
          )}
        </div>

        <StatusPill label={status.label} config={status} />

        <div className="flex shrink-0 items-center gap-2">
          {hasFile && (
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
            >
              <ExternalLink size={13} /> View
            </a>
          )}
          <button
            type="button"
            onClick={() => openPicker(doc.id)}
            disabled={busy !== null}
            title={hasFile ? 'Replace document' : 'Upload document'}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50 ${
              hasFile
                ? 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {busy === doc.id ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
            ) : (
              <Upload size={13} />
            )}
            {busy === doc.id ? 'Uploading…' : hasFile ? 'Replace' : 'Upload'}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <StudentPageHeader
        eyebrow="Application checklist"
        title="Documents"
        description="Upload the documents our team needs. Each file is reviewed and approved — or sent back with feedback if something needs a fix."
      />

      <input
        ref={fileInput}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f, targetDocId ?? undefined)
          e.target.value = ''
        }}
      />

      {isLoading ? (
        <DashboardLoading rows={3} />
      ) : isError ? (
        <DashboardError onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <ClipboardList size={34} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No checklist yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Complete your profile so we can build the exact document checklist for your programme.
          </p>
          <a href="/dashboard/settings" className={`${btnSecondary} mt-5`}>
            Complete profile
          </a>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${studentPanel} p-5`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10">
                  <ClipboardList size={18} className="text-rose-600 dark:text-rose-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {APPLICANT_LEVEL_LABEL[level]} checklist
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {verifiedCount}/{required.length} approved · {uploadedCount} uploaded
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{pct}% complete</span>
            </div>
            <div className={`${progressTrack} mt-3`}>
              <motion.div
                className={progressFill}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>

          {groups.map((group) => (
            <section key={group.category} className="space-y-3">
              <div className="flex items-center gap-2 pt-1">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                  {group.category}
                </h2>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              </div>
              <AnimatePresence initial={false}>
                {group.items.map((req) => {
                  const doc = byKey.get(requirementKey(req.category, req.label))
                  return <DocRow key={req.label} doc={doc ?? { id: `required-${req.label}`, category: req.category, label: req.label, status: 'PENDING', fileUrl: null, fileName: null, fileSize: null, rejectionReason: null }} />
                })}
              </AnimatePresence>
            </section>
          ))}

          {extras.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 pt-1">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                  Other documents
                </h2>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              </div>
              <AnimatePresence initial={false}>
                {extras.map((doc) => (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`${studentPanel} flex items-center gap-4 p-4`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-[#1a1d25]">
                      <FileText size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{doc.label}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {doc.fileName ? `${doc.fileName} · ${formatBytes(doc.fileSize)}` : 'Not uploaded yet'}
                      </p>
                    </div>
                    <StatusPill label={DOCUMENT_STATUS[doc.status as DocumentStatus]?.label ?? 'Pending'} config={DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING} />
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.id)}
                      disabled={removeDoc.isPending}
                      title="Remove"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-rose-600 disabled:opacity-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>
          )}

          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <RefreshCw size={12} /> Approved documents are confirmed by our team — rejected ones can be uploaded again.
          </p>
        </>
      )}
    </div>
  )
}