'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

import type { TimelineStep } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface Props {
  steps: TimelineStep[]
  index?: number
}

const EASE = [0.16, 1, 0.3, 1] as const

export function ApplicationTimeline({ steps, index = 0 }: Props) {
  const activeIndex = steps[0]?.currentIndex ?? 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25] sm:p-6"
    >
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Application timeline
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Your application progress, step by step.
          </p>
        </div>
        <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary dark:bg-[#2a1114]">
          Step {activeIndex + 1} of {steps.length}
        </span>
      </header>

      <ol className="relative space-y-2 pl-1">
        {/* connecting line */}
        <span
          aria-hidden
          className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-gray-200 dark:bg-gray-700"
        />
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ transformOrigin: 'top' }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.2, ease: EASE }}
          className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-[#C41E3A] via-[#dc143c] to-gray-200 dark:to-gray-700"
        />

        {steps.map((step, i) => {
          const isComplete = i < activeIndex
          const isActive = i === activeIndex
          return (
            <li
              key={step.id}
              className="relative flex items-start gap-4 rounded-2xl px-2 py-2.5 transition-colors hover:bg-gray-50/70 dark:hover:bg-[#222530]"
            >
              <span
                className={cn(
                  'relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all',
                  isComplete &&
                    'border-primary bg-primary text-white shadow-[0_0_0_4px_rgba(196,30,58,0.12)]',
                  isActive && 'border-primary bg-white text-primary dark:bg-[#1a1d25]',
                  !isComplete &&
                    !isActive &&
                    'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-[#1a1d25]'
                )}
              >
                {isComplete ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex items-center justify-center"
                  >
                    <Check size={15} strokeWidth={3} />
                  </motion.span>
                ) : isActive ? (
                  <motion.span
                    animate={{ scale: [1, 1.18, 1] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    }}
                    className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_6px_rgba(196,30,58,0.18)]"
                  />
                ) : (
                  i + 1
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isActive || isComplete
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
              {isComplete && (
                <span className="hidden rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-300 sm:inline-flex">
                  Done
                </span>
              )}
              {isActive && (
                <span className="hidden rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-primary dark:bg-[#2a1114] sm:inline-flex">
                  In progress
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </motion.section>
  )
}
