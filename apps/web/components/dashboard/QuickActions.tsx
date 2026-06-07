'use client'

import { motion } from 'framer-motion'
import { Plus, MessageCircle, Briefcase, FileText } from 'lucide-react'

import type { QuickActionItem } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface Props {
  actions: QuickActionItem[]
  index?: number
}

const EASE = [0.16, 1, 0.3, 1] as const

// Map action id -> icon component
const ICONS: Record<
  QuickActionItem['id'],
  React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
> = {
  upload: Plus,
  message: MessageCircle,
  consult: Briefcase,
  checklist: FileText,
}

export function QuickActions({ actions, index = 0 }: Props) {
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
            Quick actions
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Common shortcuts for your application.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((a, i) => {
          const Icon = ICONS[a.id] ?? FileText
          return (
            <motion.button
              key={a.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 + 0.1 + i * 0.05, ease: EASE }}
              whileHover={{ y: -2 }}
              className={cn(
                'group flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left transition-all',
                'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
                'dark:border-gray-800 dark:bg-[#222530]'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  'bg-gradient-to-br from-red-50 to-red-100 text-primary',
                  'group-hover:from-primary group-hover:to-[#C41E3A] group-hover:text-white',
                  'transition-all duration-300',
                  'dark:from-[#2a1114] dark:to-[#3a1218] dark:group-hover:from-primary dark:group-hover:to-[#C41E3A]'
                )}
              >
                <Icon size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.label}</p>
                {a.description && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500 dark:text-gray-400">
                    {a.description}
                  </p>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.section>
  )
}
