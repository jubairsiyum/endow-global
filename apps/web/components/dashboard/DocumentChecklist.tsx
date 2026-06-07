'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Check, Clock, Upload } from 'lucide-react'
import { useState } from 'react'

import type { DocumentStatus, MockDocument } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface Props {
  documents: MockDocument[]
  index?: number
}

const EASE = [0.16, 1, 0.3, 1] as const

function StatusIcon({ status }: { status: DocumentStatus }) {
  if (status === 'uploaded') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300">
        <Check size={14} strokeWidth={3} />
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
        <AlertCircle size={14} strokeWidth={2.5} />
      </span>
    )
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
      <Clock size={14} strokeWidth={2.5} />
    </span>
  )
}

const LABEL_FOR: Record<DocumentStatus, string> = {
  uploaded: 'Uploaded',
  pending: 'Pending',
  rejected: 'Rejected',
}

const LABEL_TONE: Record<DocumentStatus, string> = {
  uploaded: 'text-green-700 dark:text-green-300',
  pending: 'text-amber-700 dark:text-amber-300',
  rejected: 'text-red-700 dark:text-red-300',
}

export function DocumentChecklist({ documents, index = 0 }: Props) {
  const [filter, setFilter] = useState<'all' | DocumentStatus>('all')
  const visible = filter === 'all' ? documents : documents.filter((d) => d.status === filter)

  const counts = {
    uploaded: documents.filter((d) => d.status === 'uploaded').length,
    pending: documents.filter((d) => d.status === 'pending').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="flex flex-col rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]"
    >
      <header className="flex items-center justify-between gap-2 border-b border-gray-100 p-5 dark:border-gray-800">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Document checklist
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {counts.uploaded}/{documents.length} uploaded
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-0.5 text-[10px] font-semibold dark:border-gray-700 dark:bg-[#222530]">
          {(['all', 'uploaded', 'pending', 'rejected'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-2.5 py-1 capitalize transition-colors',
                filter === f
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-[#1a1d25] dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <ul className="max-h-[420px] divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
        <AnimatePresence initial={false}>
          {visible.map((doc) => (
            <motion.li
              key={doc.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/60 dark:hover:bg-[#222530]"
            >
              <StatusIcon status={doc.status} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {doc.label}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  {doc.rejectionReason ? (
                    <span className="text-red-600 dark:text-red-300">{doc.rejectionReason}</span>
                  ) : doc.updatedAt ? (
                    <>Updated {doc.updatedAt}</>
                  ) : (
                    <>Not uploaded yet</>
                  )}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 text-[10px] font-bold uppercase tracking-[0.12em]',
                  LABEL_TONE[doc.status]
                )}
              >
                {LABEL_FOR[doc.status]}
              </span>
              {doc.status !== 'uploaded' && (
                <button
                  type="button"
                  className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-[#222530]"
                  aria-label={`Upload ${doc.label}`}
                >
                  <Upload size={14} />
                </button>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Nothing here for this filter.
          </li>
        )}
      </ul>
    </motion.section>
  )
}
