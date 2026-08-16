'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { FileText, Plus, Trash2, Upload } from 'lucide-react'

import { trpc } from '@/lib/trpc-client'
import { DOCUMENT_STATUS, formatBytes } from '@/lib/dashboard'
import type { DocumentStatus } from '@/lib/dashboard'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'

async function uploadFile(file: File): Promise<{ url: string; name: string; size: number }> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload-file', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export default function DocumentsPage() {
  const { data, isLoading, isError, refetch } = trpc.dashboard.documents.list.useQuery()
  const documents = data ?? []
  const utils = trpc.useUtils()
  const addDoc = trpc.dashboard.documents.add.useMutation()
  const uploadDoc = trpc.dashboard.documents.upload.useMutation()
  const removeDoc = trpc.dashboard.documents.remove.useMutation()

  const fileInput = useRef<HTMLInputElement>(null)
  const [targetDocId, setTargetDocId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')
  const [filter, setFilter] = useState<'all' | 'attention' | 'verified'>('all')

  const invalidate = () => utils.dashboard.documents.list.invalidate()

  const verified = documents.filter((d) => d.status === 'VERIFIED').length
  const pct = documents.length ? Math.round((verified / documents.length) * 100) : 0
  const visibleDocuments = documents.filter((document) => filter === 'all' ? true : filter === 'verified' ? document.status === 'VERIFIED' : ['PENDING', 'REJECTED'].includes(document.status))

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
      toast.success('Document uploaded 🎉')
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

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const label = newLabel.trim()
    if (!label) return
    try {
      await addDoc.mutateAsync({ label, category: 'OTHER' })
      toast.success('Requirement added')
      setNewLabel('')
      invalidate()
    } catch (e: any) {
      toast.error(e.message)
    }
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

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <StudentPageHeader eyebrow="Application checklist" title="Documents" description="Keep your application moving by uploading clear, current documents." />

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

      {/* Progress summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${studentPanel} p-5`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {verified}/{documents.length} verified
          </p>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{pct}% complete</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#C41E3A] to-[#ff4d6d]"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>

      {/* Upload area */}
      <motion.button
        type="button"
        onClick={() => openPicker()}
        disabled={busy !== null}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center transition-colors hover:border-rose-400 hover:bg-rose-50/30 dark:border-gray-700 dark:bg-[#12141c] dark:hover:bg-rose-950/10 disabled:opacity-60"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 transition-transform group-hover:scale-110">
          <Upload size={24} className="text-primary" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
          {busy === '__new__' ? 'Uploading…' : 'Drop it like it’s hot'}
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Click to browse — PDFs up to 8 MB, images up to 4 MB
        </p>
      </motion.button>

      <div className={`${studentPanel} flex gap-1 overflow-x-auto p-1.5`} role="tablist" aria-label="Document filters">
        {([['all', 'All'], ['attention', 'Needs attention'], ['verified', 'Verified']] as const).map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 ${filter === value ? 'bg-rose-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Add requirement */}
      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add a requirement (e.g. Reference letter #2)"
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary dark:border-gray-700 dark:bg-[#12141c] dark:text-white"
        />
        <button
          type="submit"
          disabled={addDoc.isPending || !newLabel.trim()}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A01830] disabled:opacity-50"
        >
          <Plus size={15} /> Add
        </button>
      </form>

      {/* Document list */}
      <div className="space-y-2">
        {isLoading ? (
          <DashboardLoading rows={3} />
        ) : isError ? (
          <DashboardError onRetry={() => refetch()} />
        ) : documents.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-200 bg-white py-14 text-center dark:border-gray-700 dark:bg-[#12141c]">
            <FileText size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No documents yet</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              Upload your first document to kick things off. 📄
            </p>
          </div>
        ) : visibleDocuments.length === 0 ? (
          <div className={`${studentPanel} py-12 text-center`}><FileText size={30} className="mx-auto text-gray-300 dark:text-gray-600" /><p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">No documents in this view</p><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try another filter to see your checklist.</p></div>
        ) : (
          <AnimatePresence initial={false}>
            {visibleDocuments.map((doc) => {
              const status = DOCUMENT_STATUS[doc.status as DocumentStatus] ?? DOCUMENT_STATUS.PENDING
              const pending = doc.status === 'PENDING' || doc.status === 'REJECTED'
              return (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`${studentPanel} flex items-center gap-4 p-4 transition-all hover:shadow-sm`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1a1d25]">
                    <FileText size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{doc.label}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {doc.fileName
                        ? `${doc.fileName} · ${formatBytes(doc.fileSize)}`
                        : doc.status === 'REJECTED' && doc.rejectionReason
                          ? doc.rejectionReason
                          : 'Not uploaded yet'}
                    </p>
                  </div>
                  <StatusPill label={status.label} config={status} />
                  <div className="flex shrink-0 items-center gap-1.5">
                    {pending && (
                      <button
                        type="button"
                        onClick={() => openPicker(doc.id)}
                        disabled={busy !== null}
                        title="Upload"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 disabled:opacity-50"
                      >
                        {busy === doc.id ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Upload size={14} />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.id)}
                      disabled={removeDoc.isPending}
                      title="Remove"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
