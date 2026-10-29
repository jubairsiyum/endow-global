'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  FileEdit,
  FileText,
  FileUp,
  Globe,
  ShieldCheck,
  Zap,
} from 'lucide-react'

interface TodoItem {
  id: string
  iconType: 'certificate' | 'passport' | 'sop' | 'language' | 'file'
  title: string
  subtitle: string
  dueLabel: string
  priorityLabel: string
  priorityColor: string
  completed: boolean
  href: string
}

interface Props {
  documents?: any[]
  docProgress?: {
    total: number
    uploaded: number
    verified: number
    inReview: number
    pending: number
    percent: number
  }
}

function resolveIconType(title: string, category?: string): TodoItem['iconType'] {
  const t = (title + ' ' + (category || '')).toLowerCase()
  if (
    t.includes('transcript') ||
    t.includes('certificate') ||
    t.includes('degree') ||
    t.includes('diploma') ||
    t.includes('academic') ||
    t.includes('bachelor') ||
    t.includes('hsc') ||
    t.includes('ssc')
  ) {
    return 'certificate'
  }
  if (
    t.includes('passport') ||
    t.includes('identity') ||
    t.includes('nid') ||
    t.includes('visa') ||
    t.includes('national')
  ) {
    return 'passport'
  }
  if (
    t.includes('ielts') ||
    t.includes('toefl') ||
    t.includes('topik') ||
    t.includes('language') ||
    t.includes('duolingo') ||
    t.includes('english')
  ) {
    return 'language'
  }
  if (
    t.includes('purpose') ||
    t.includes('sop') ||
    t.includes('essay') ||
    t.includes('letter') ||
    t.includes('recommendation')
  ) {
    return 'sop'
  }
  return 'file'
}

function TaskIcon({ type }: { type: TodoItem['iconType'] }) {
  switch (type) {
    case 'certificate':
      return <Award size={18} className="text-amber-600 dark:text-amber-400" />
    case 'passport':
      return <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
    case 'language':
      return <Globe size={18} className="text-emerald-600 dark:text-emerald-400" />
    case 'sop':
      return <FileEdit size={18} className="text-purple-600 dark:text-purple-400" />
    case 'file':
    default:
      return <FileUp size={18} className="text-rose-600 dark:text-rose-400" />
  }
}

export function DashboardTodoList({ documents = [], docProgress }: Props) {
  const totalDocs = docProgress?.total ?? documents.length
  const uploadedDocs =
    docProgress?.uploaded ??
    documents.filter((d: any) => d.status === 'UPLOADED' || d.status === 'VERIFIED').length
  const verifiedDocs =
    docProgress?.verified ?? documents.filter((d: any) => d.status === 'VERIFIED').length
  const inReviewDocs =
    docProgress?.inReview ?? documents.filter((d: any) => d.status === 'UPLOADED').length
  const pendingDocs =
    docProgress?.pending ??
    documents.filter(
      (d: any) => d.status === 'PENDING' || d.status === 'REJECTED' || !d.fileUrl
    ).length
  const docPercent =
    docProgress?.percent ??
    (totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0)

  // Build real tasks strictly from documents pending upload/revision
  const pendingItems: TodoItem[] = []

  for (const doc of documents) {
    if (doc.status === 'PENDING' || !doc.fileUrl) {
      const iconType = resolveIconType(doc.label, doc.category)
      pendingItems.push({
        id: `doc-${doc.id || doc.label}`,
        iconType,
        title: `Upload ${doc.label}`,
        subtitle: `${doc.category || 'Required'} verification document`,
        dueLabel: 'Pending Upload',
        priorityLabel: 'Action Required',
        priorityColor: 'text-rose-600 dark:text-rose-400',
        completed: false,
        href: '/dashboard/documents',
      })
    } else if (doc.status === 'REJECTED') {
      pendingItems.push({
        id: `doc-${doc.id || doc.label}`,
        iconType: 'file',
        title: `Re-upload ${doc.label}`,
        subtitle: doc.rejectionReason || 'Document needs revision',
        dueLabel: 'Action Required',
        priorityLabel: 'Urgent Fix',
        priorityColor: 'text-red-600 dark:text-red-400',
        completed: false,
        href: '/dashboard/documents',
      })
    }
  }

  const [items, setItems] = useState<TodoItem[]>(pendingItems)

  const toggleTask = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const activePendingCount = items.filter((i) => !i.completed).length

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            Document Checklist To-Do
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            Pending document submissions for your admission file
          </p>
        </div>
        <Link
          href="/dashboard/documents"
          title="View all pending documents"
          className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          {activePendingCount} Pending
        </Link>
      </div>

      {/* Document Verification & Upload Progress Bar */}
      {totalDocs > 0 && (
        <div className="my-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Document Completion
            </span>
            <span className="font-extrabold text-rose-600 dark:text-rose-400">
              {uploadedDocs} of {totalDocs} Files ({docPercent}%)
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${docPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-rose-600 dark:bg-rose-500"
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {verifiedDocs} Verified
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {inReviewDocs} In Review
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              {pendingDocs} Remaining
            </span>
          </div>
        </div>
      )}

      {/* List Items strictly showing pending documents */}
      <div className="my-2 space-y-2.5 flex-1 flex flex-col justify-center">
        {items.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50/30 py-8 px-3 text-center dark:border-emerald-900/40 dark:bg-emerald-950/10">
            <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
            <p className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              All Required Documents Submitted!
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              You are all caught up! Your admission documents are being evaluated by our team.
            </p>
          </div>
        ) : (
          items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 transition-all hover:border-slate-200 hover:bg-slate-50 hover:shadow-xs dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
            >
              <Link
                href={item.href}
                className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-800">
                  <TaskIcon type={item.iconType} />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs font-bold transition-colors ${
                      item.completed
                        ? 'text-slate-400 line-through dark:text-slate-500'
                        : 'text-slate-800 group-hover:text-rose-600 dark:text-slate-100 dark:group-hover:text-rose-400'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {item.dueLabel}
                  </p>
                  <p
                    className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${item.priorityColor}`}
                  >
                    <Zap size={10} className="fill-current" />
                    {item.priorityLabel}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleTask(item.id, e)}
                  aria-label="Toggle task completion"
                  className={`flex h-6 w-6 sm:h-5 sm:w-5 items-center justify-center rounded-md border transition-all ${
                    item.completed
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800'
                  }`}
                >
                  {item.completed && <Check size={12} strokeWidth={3} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer quick link */}
      <div className="border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
        <Link
          href="/dashboard/documents"
          className="flex items-center justify-between gap-2 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          <span className="truncate">Upload &amp; manage all admission documents</span>
          <ChevronRight size={13} className="shrink-0" />
        </Link>
      </div>
    </div>
  )
}
