'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Clock, AlertCircle, ListTodo } from 'lucide-react'

import type { DocumentStatus } from '@/lib/dashboard'
import { cn } from '@/lib/utils'
import { panel } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

interface Task {
  id: string
  label: string
  hint: string
  kind: 'document' | 'deadline'
  urgent?: boolean
  href: string
}

interface Props {
  documents: any[]
  deadlines: any[]
  index?: number
}

export function TasksPanel({ documents, deadlines, index = 0 }: Props) {
  const tasks: Task[] = []

  for (const d of documents) {
    const status = d.status as DocumentStatus
    if (status === 'PENDING') {
      tasks.push({
        id: `doc-${d.id}`,
        label: `Upload ${d.label}`,
        hint: 'Waiting on you',
        kind: 'document',
        href: '/dashboard/documents',
      })
    } else if (status === 'REJECTED') {
      tasks.push({
        id: `doc-${d.id}`,
        label: `Re-upload ${d.label}`,
        hint: d.rejectionReason ?? 'Needs attention',
        kind: 'document',
        urgent: true,
        href: '/dashboard/documents',
      })
    }
  }

  for (const dl of deadlines) {
    tasks.push({
      id: dl.id,
      label: dl.label,
      hint: dl.dueIn === 0 ? 'Due today' : `Due in ${dl.dueIn} days`,
      kind: 'deadline',
      urgent: dl.dueIn <= 7,
      href: '/dashboard/application',
    })
  }

  const done = documents.filter((d) => d.status === 'VERIFIED').length
  const total = documents.length

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className={`${panel} p-5`}
    >
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            To-do list
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {total ? `${done}/${total} documents verified` : 'Documents & deadlines will show here'}
          </p>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
          <ListTodo size={16} />
        </span>
      </header>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
          <CheckCircle2 size={28} className="mx-auto text-green-400" />
          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">All caught up</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
            Nothing urgent right now.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.slice(0, 7).map((t, i) => (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
            >
              <Link
                href={t.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-sm',
                  t.urgent
                    ? 'border-rose-100 bg-rose-50/50 hover:border-rose-200 dark:border-rose-900/40 dark:bg-rose-500/5'
                    : 'border-gray-100 bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-[#1a1d25] dark:hover:border-gray-700'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    t.urgent
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
                      : t.kind === 'document'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300'
                  )}
                >
                  {t.urgent ? <AlertCircle size={16} /> : <Clock size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{t.label}</p>
                  <p className={cn('mt-0.5 truncate text-[11px]', t.urgent ? 'text-rose-600 dark:text-rose-300' : 'text-gray-500 dark:text-gray-400')}>
                    {t.hint}
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-600" />
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.section>
  )
}
