'use client'

import { motion } from 'framer-motion'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: number
  /** Optional suffix appended after the number (e.g. '%', ' days'). */
  suffix?: string
  /** Optional icon element rendered inside a brand-tinted tile. */
  icon?: React.ReactNode
  /** A "subtle" tone to use for the count color: default / success / warning / danger. */
  tone?: 'default' | 'warning' | 'danger' | 'success' | 'info'
  /** When true, the value is treated as fractional (rounded to 0 decimals). */
  isFraction?: boolean
  /** Pulse the icon tile while mounted (e.g. for unread messages). */
  pulse?: boolean
  index?: number
  /** Optional subtitle shown below the value. */
  caption?: string
}

const TONE_VALUE: Record<NonNullable<Props['tone']>, string> = {
  default: 'text-gray-900 dark:text-white',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
}

const EASE = [0.16, 1, 0.3, 1] as const

export function StatCard({
  title,
  value,
  suffix = '',
  icon,
  tone = 'default',
  isFraction = false,
  pulse = false,
  index = 0,
  caption,
}: Props) {
  const animated = useCountUp(value)
  const display = isFraction ? animated.toFixed(0) : Math.round(animated).toString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 + 0.08, ease: EASE }}
      className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-primary shadow-inner dark:from-[#3a1218] dark:to-[#2a1114]',
              pulse && 'animate-pulse'
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p
            className={cn(
              'mt-1 font-heading text-3xl font-bold leading-none tracking-tight',
              TONE_VALUE[tone]
            )}
          >
            {display}
            {suffix && (
              <span className="ml-0.5 text-base font-semibold text-gray-500 dark:text-gray-400">
                {suffix}
              </span>
            )}
          </p>
          {caption && (
            <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">{caption}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
