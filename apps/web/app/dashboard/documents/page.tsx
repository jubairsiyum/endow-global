'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ClipboardList,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FolderUp,
  Layers,
  Loader2,
} from 'lucide-react'

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
import { progressTrack, progressFill, btnSecondary, btnPrimary, input } from '@/components/dashboard/ui'

async function uploadFile(file: File): Promise<{ url: string; name: string; size: number }> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('scope', 'private')
  const res = await fetch('/api/upload-file', { method: 'POST', body: fd })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || 'Upload failed')
  }
  return res.json()
}

interface GroupedRequirement {
  category: string
  items: DocumentRequirement[]
}

function groupRequirements(requirements: DocumentRequirement[]): GroupedRequirement[] {
  const groups: GroupedRequirement[] = []
  for (const req of requirements) {
    const group = groups.find((g) => g.category === req.category)
    if (group) group.items.push(req)
    else groups.push({ category: req.category, items: [req] })
  }
  return groups
}

interface UploadProgressItem {
  name: string
  size: number
  status: 'uploading' | 'saving' | 'done' | 'error'
  label: string
  error?: string
}

const DOCUMENT_CATEGORIES = [
  'Academic Certificates',
  'Language Proficiency',
  'Identity',
  'Financial Documents',
  'Recommendations & SOP',
  'OTHER',
]

export default function DocumentsPage() {
  const { data, isLoading, isError, refetch } = trpc.dashboard.documents.list.useQuery()
  const utils = trpc.useUtils()
  const addDoc = trpc.dashboard.documents.add.useMutation()
  const uploadDoc = trpc.dashboard.documents.upload.useMutation()
  const uploadDirect = trpc.dashboard.documents.uploadDirect.useMutation()
  const removeDoc = trpc.dashboard.documents.remove.useMutation()

  // File input refs
  const singleFileInput = useRef<HTMLInputElement>(null)
  const multiFileInput = useRef<HTMLInputElement>(null)

  const [targetDocId, setTargetDocId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Multi-upload progress state
  const [uploadQueue, setUploadQueue] = useState<UploadProgressItem[]>([])
  const [isUploadingBatch, setIsUploadingBatch] = useState(false)

  // Custom document modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [customLabel, setCustomLabel] = useState('')
  const [customCategory, setCustomCategory] = useState('Academic Certificates')
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false)

  const level: ApplicantLevel = data?.level ?? 'UNDERGRADUATE'
  const items: any[] = data?.items ?? []

  // Dynamic requirements returned by server based on what student filled
  const required: DocumentRequirement[] =
    (data as any)?.requirements ?? DOCUMENT_REQUIREMENTS[level] ?? []

  const byKey = new Map<string, any>()
  for (const doc of items) {
    byKey.set(requirementKey(doc.category, doc.label), doc)
  }

  const requiredKeys = new Set(required.map((r) => requirementKey(r.category, r.label)))
  const groups = groupRequirements(required)
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

  // Upload a single file for an individual document row
  async function handleSingleFile(file: File, docId?: string) {
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

  // Intelligent matching of a filename to an unfilled required checklist item
  function matchPendingRequirement(fileName: string, occupiedSlots: Set<string>): any | null {
    const fn = fileName.toLowerCase()

    for (const req of required) {
      const key = requirementKey(req.category, req.label)
      if (occupiedSlots.has(key)) continue

      const doc = byKey.get(key)
      if (doc?.fileUrl) continue // Already has file uploaded

      const rl = req.label.toLowerCase()

      // Match rules
      const isIelts = rl.includes('ielts') && fn.includes('ielts')
      const isToefl = rl.includes('toefl') && fn.includes('toefl')
      const isTopik = rl.includes('topik') && fn.includes('topik')
      const isSat = rl.includes('sat') && fn.includes('sat')
      const isPassport = rl.includes('passport') && fn.includes('passport')
      const isHsc =
        rl.includes('hsc') &&
        (fn.includes('hsc') || fn.includes('12th') || fn.includes('high school') || fn.includes('a-level'))
      const isSsc =
        rl.includes('ssc') &&
        (fn.includes('ssc') || fn.includes('10th') || fn.includes('secondary') || fn.includes('o-level'))
      const isBachelor =
        rl.includes('bachelor') &&
        (fn.includes('bachelor') || fn.includes('undergraduate') || fn.includes('bsc') || fn.includes('bba'))
      const isMaster =
        rl.includes('master') &&
        (fn.includes('master') || fn.includes('postgraduate') || fn.includes('msc') || fn.includes('mba'))

      if (isIelts || isToefl || isTopik || isSat || isPassport || isHsc || isSsc || isBachelor || isMaster) {
        return doc ?? { id: null, category: req.category, label: req.label }
      }
    }

    return null
  }

  // Handle uploading multiple files simultaneously (batch upload)
  async function handleMultipleFiles(files: File[]) {
    if (!files.length) return

    setIsUploadingBatch(true)
    const initialQueue: UploadProgressItem[] = files.map((f) => ({
      name: f.name,
      size: f.size,
      status: 'uploading',
      label: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    }))
    setUploadQueue(initialQueue)

    const occupiedSlots = new Set<string>()
    let successCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Update item status to uploading
      setUploadQueue((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'uploading' } : item))
      )

      try {
        const uploaded = await uploadFile(file)

        setUploadQueue((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: 'saving' } : item))
        )

        // Check if file matches an unfilled requirement
        const matched = matchPendingRequirement(file.name, occupiedSlots)

        if (matched) {
          const slotKey = requirementKey(matched.category, matched.label)
          occupiedSlots.add(slotKey)

          let docId = matched.id
          if (!docId) {
            const created = await addDoc.mutateAsync({
              label: matched.label,
              category: matched.category,
            })
            docId = created.id
          }

          await uploadDoc.mutateAsync({
            id: docId,
            fileUrl: uploaded.url,
            fileName: file.name,
            fileSize: file.size,
          })

          setUploadQueue((prev) =>
            prev.map((item, idx) =>
              idx === i
                ? { ...item, status: 'done', label: matched.label }
                : item
            )
          )
        } else {
          // Upload as an additional document under Other documents
          const label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
          await uploadDirect.mutateAsync({
            label,
            category: 'OTHER',
            fileUrl: uploaded.url,
            fileName: file.name,
            fileSize: file.size,
          })

          setUploadQueue((prev) =>
            prev.map((item, idx) => (idx === i ? { ...item, status: 'done' } : item))
          )
        }

        successCount++
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? { ...item, status: 'error', error: err?.message || 'Upload failed' }
              : item
          )
        )
      }
    }

    invalidate()
    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? '1 document uploaded successfully'
          : `${successCount} documents uploaded successfully`
      )
    }

    // Auto close batch progress after 3 seconds if all succeeded
    setTimeout(() => {
      setIsUploadingBatch(false)
      setUploadQueue([])
    }, 3200)
  }

  // Handle manual custom document submission
  async function handleCustomDocumentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customFile) {
      toast.error('Please choose a file to upload')
      return
    }
    if (!customLabel.trim()) {
      toast.error('Please enter a document title')
      return
    }

    setIsSubmittingCustom(true)
    try {
      const uploaded = await uploadFile(customFile)
      await uploadDirect.mutateAsync({
        label: customLabel.trim(),
        category: customCategory,
        fileUrl: uploaded.url,
        fileName: customFile.name,
        fileSize: customFile.size,
      })
      toast.success('Document uploaded successfully')
      invalidate()
      setShowAddModal(false)
      setCustomLabel('')
      setCustomFile(null)
    } catch (e: any) {
      toast.error(e.message || 'Failed to upload document')
    } finally {
      setIsSubmittingCustom(false)
    }
  }

  function openSinglePicker(docId?: string) {
    setTargetDocId(docId ?? null)
    singleFileInput.current?.click()
  }

  async function handleRemove(id: string) {
    try {
      await removeDoc.mutateAsync({ id })
      toast.success('Document removed')
      invalidate()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  function DocRow({ doc, requirement }: { doc: any; requirement?: DocumentRequirement }) {
    const status = DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING
    const hasFile = Boolean(doc.fileUrl)
    const isVerified = doc.status === 'VERIFIED'
    const isRejected = doc.status === 'REJECTED'

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={`${studentPanel} flex flex-col gap-3 p-4 transition-all hover:shadow-md sm:flex-row sm:items-center sm:gap-4`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isVerified
                ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                : isRejected
                  ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                  : 'bg-gray-50 text-gray-500 dark:bg-[#1a1d25] dark:text-gray-400'
            }`}
          >
            {isVerified ? (
              <ShieldCheck size={20} />
            ) : isRejected ? (
              <AlertCircle size={20} />
            ) : (
              <FileText size={19} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{doc.label}</p>
              {requirement?.required && (
                <span className="shrink-0 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  Required
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              {hasFile
                ? `${doc.fileName ?? doc.fileUrl.split('/').pop()} · ${formatBytes(doc.fileSize)}`
                : requirement?.description ?? 'Not uploaded yet'}
            </p>

            {isRejected && doc.rejectionReason && (
              <p className="mt-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-300">
                Reason: {doc.rejectionReason}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-gray-100 pt-3 sm:border-t-0 sm:pt-0 sm:justify-end">
          <StatusPill label={status.label} config={status} />

          <div className="flex items-center gap-2">
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
              onClick={() => openSinglePicker(doc.id)}
              disabled={busy !== null}
              title={hasFile ? 'Replace document' : 'Upload document'}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50 ${
                hasFile
                  ? 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {busy === doc.id ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Upload size={13} />
              )}
              {busy === doc.id ? 'Uploading…' : hasFile ? 'Replace' : 'Upload'}
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <StudentPageHeader
        eyebrow="Application checklist"
        title="Documents"
        description="Upload the documents required for your university application. Documents are reviewed and verified by our admissions team."
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => multiFileInput.current?.click()}
              className={`${btnPrimary} inline-flex items-center gap-2`}
            >
              <Upload size={15} />
              <span>Upload Documents</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className={`${btnSecondary} inline-flex items-center gap-1.5`}
            >
              <Plus size={15} />
              <span>Add Custom</span>
            </button>
          </div>
        }
      />

      {/* Hidden file inputs */}
      <input
        ref={singleFileInput}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleSingleFile(f, targetDocId ?? undefined)
          e.target.value = ''
        }}
      />

      <input
        ref={multiFileInput}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          if (files.length > 0) handleMultipleFiles(files)
          e.target.value = ''
        }}
      />

      {/* Batch Upload Progress Overlay */}
      <AnimatePresence>
        {isUploadingBatch && uploadQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${studentPanel} border-rose-200 bg-rose-50/30 p-4 dark:border-rose-900/40 dark:bg-rose-950/20`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                <FolderUp size={18} />
                <span className="text-sm font-bold">Uploading Documents ({uploadQueue.length})</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Auto-matching to requirements...
              </span>
            </div>

            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
              {uploadQueue.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center justify-between gap-3 text-xs bg-white/80 dark:bg-[#161922] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={14} className="shrink-0 text-gray-400" />
                    <span className="truncate font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-gray-400">({formatBytes(item.size)})</span>
                    {item.label && item.label !== item.name && (
                      <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                        → {item.label}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {item.status === 'uploading' && (
                      <span className="flex items-center gap-1 text-rose-600">
                        <Loader2 size={13} className="animate-spin" /> Uploading…
                      </span>
                    )}
                    {item.status === 'saving' && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Loader2 size={13} className="animate-spin" /> Saving…
                      </span>
                    )}
                    {item.status === 'done' && (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle2 size={14} /> Ready
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="flex items-center gap-1 text-red-600 font-semibold">
                        <AlertCircle size={14} /> {item.error || 'Failed'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <DashboardLoading rows={3} />
      ) : isError ? (
        <DashboardError onRetry={() => refetch()} />
      ) : items.length === 0 && required.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <ClipboardList size={34} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No checklist yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Complete your profile settings so we can build the exact required document checklist for your academic qualification and language tests.
          </p>
          <a href="/dashboard/settings?tab=study" className={`${btnSecondary} mt-5 inline-flex`}>
            Complete academic &amp; language info
          </a>
        </div>
      ) : (
        <>
          {/* Overview Progress Card */}
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
                    {APPLICANT_LEVEL_LABEL[level]} Document Checklist
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {verifiedCount}/{required.length} approved · {uploadedCount}/{required.length} uploaded
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{pct}% complete</span>
              </div>
            </div>

            <div className={`${progressTrack} mt-3`}>
              <motion.div
                className={progressFill}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>

          {/* Drag & Drop Multi-file Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const files = Array.from(e.dataTransfer.files || [])
              if (files.length > 0) handleMultipleFiles(files)
            }}
            onClick={() => multiFileInput.current?.click()}
            className={`group cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragging
                ? 'border-rose-500 bg-rose-50/50 dark:border-rose-500 dark:bg-rose-950/20'
                : 'border-gray-200 bg-white/70 hover:border-rose-300 hover:bg-rose-50/20 dark:border-gray-800 dark:bg-[#12141c] dark:hover:border-rose-800'
            }`}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-transform group-hover:scale-110 dark:bg-rose-500/10 dark:text-rose-400">
              <FolderUp size={22} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
              Upload multiple documents at once
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Drag and drop files here, or click to browse. Supports PDF, JPG, PNG, DOCX up to 10MB each.
            </p>
            <p className="mt-2 text-[11px] font-medium text-rose-600 dark:text-rose-400">
              Files matching your required certificates (IELTS, TOEFL, HSC, SSC, etc.) will be attached automatically.
            </p>
          </div>

          {/* Grouped Required Document Sections */}
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
                  return (
                    <DocRow
                      key={req.label}
                      requirement={req}
                      doc={
                        doc ?? {
                          id: `required-${req.label}`,
                          category: req.category,
                          label: req.label,
                          status: 'PENDING',
                          fileUrl: null,
                          fileName: null,
                          fileSize: null,
                          rejectionReason: null,
                        }
                      }
                    />
                  )
                })}
              </AnimatePresence>
            </section>
          ))}

          {/* Other / Additional Uploaded Documents */}
          {extras.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2 flex-1">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                    Additional Documents ({extras.length})
                  </h2>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                >
                  <Plus size={13} /> Add another
                </button>
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
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {doc.label}
                        </p>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          {doc.category || 'Other'}
                        </span>
                      </div>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {doc.fileName ? `${doc.fileName} · ${formatBytes(doc.fileSize)}` : 'Not uploaded yet'}
                      </p>
                    </div>

                    <StatusPill
                      label={DOCUMENT_STATUS[doc.status as DocumentStatus]?.label ?? 'Pending'}
                      config={DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING}
                    />

                    <div className="flex items-center gap-1.5">
                      {doc.fileUrl && (
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
                        onClick={() => handleRemove(doc.id)}
                        disabled={removeDoc.isPending}
                        title="Remove document"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-rose-600 disabled:opacity-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>
          )}

          <div className="pt-2">
            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <RefreshCw size={12} /> Requirements are automatically synced with the language tests &amp; academic qualifications in your profile.
            </p>
          </div>
        </>
      )}

      {/* Add Custom Document Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#161922] dark:border dark:border-gray-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Add Custom Document</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload any supplementary certificates or records
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCustomDocumentSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Document Title <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Recommendation Letter, Bank Solvency, CV"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    className={`${input} mt-1`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className={`${input} mt-1`}
                  >
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Document File <span className="text-rose-600">*</span>
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="file"
                      required
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) {
                          setCustomFile(f)
                          if (!customLabel) {
                            setCustomLabel(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
                          }
                        }
                      }}
                      className={`${input} text-xs file:mr-3 file:rounded-md file:border-0 file:bg-rose-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-950/60 dark:file:text-rose-300`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">PDF, JPG, PNG, DOCX up to 10MB</p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={btnSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCustom || !customFile || !customLabel.trim()}
                    className={btnPrimary}
                  >
                    {isSubmittingCustom ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Uploading…
                      </>
                    ) : (
                      <>
                        <Upload size={14} /> Upload Document
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
