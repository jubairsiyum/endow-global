'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

import type { MockDeadline } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface Props {
  deadlines: MockDeadline[]
  index?: number
}

const EASE = [0.16, 1, 0.3, 1] as const

function urgencyTone(days: number) {
  if (days <= 7) return 'danger'
  if (days <= 14) return 'warning'
  return 'info'
}

const TONE_STYLES = {
  danger: {
    badge: 'bg-red-50 text-primary dark:bg-[#2a1114] dark:text-red-300',
    bar: 'bg-gradient-to-r from-[#C41E3A] to-[#ff4d6d]',
    chip: 'bg-primary text-white',
    ring: 'ring-1 ring-red-200/70 dark:ring-[#3a1218]',
  },
  warning: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    bar: 'bg-gradient-to-r from-amber-400 to-amber-300',
    chip: 'bg-amber-500 text-white',
    ring: 'ring-1 ring-amber-200/70 dark:ring-amber-700/40',
  },
  info: {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    bar: 'bg-gradient-to-r from-blue-500 to-blue-300',
    chip: 'bg-blue-500 text-white',
    ring: 'ring-1 ring-blue-200/70 dark:ring-blue-700/40',
  },
} as const

export function UpcomingDeadlines({ deadlines, index = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25] sm:p-6"
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Upcoming deadlines
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Items within 7 days are flagged urgent.
          </p>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-primary dark:bg-[#2a1114]">
          <Calendar size={16} />
        </span>
      </header>

      <ul className="space-y-2.5">
        {deadlines.map((d, i) => {
          const tone = urgencyTone(d.dueIn)
          const t = TONE_STYLES[tone]
          return (
            <motion.li
              key={d.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 + 0.1 + i * 0.05, ease: EASE }}
              className={cn(
                'group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#222530]',
                tone === 'danger' && t.ring,
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                  t.chip,
                )}
                aria-hidden
              >
                {d.dueIn}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {d.label}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <Clock size={10} aria-hidden />
                  {d.dueIn === 0
                    ? 'Due today'
                    : d.dueIn === 1
                      ? 'Due tomorrow'
                      : `Due in ${d.dueIn} days`}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]',
                  t.badge,
                )}
              >
                {tone === 'danger' ? 'Urgent' : tone === 'warning' ? 'Soon' : 'Upcoming'}
              </span>
            </motion.li>
          )
        })}
      </ul>
    </motion.section>
  )
}
