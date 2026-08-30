'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

interface Props {
  name: string
  intakeLabel?: string
  targetCountries?: string[]
  matchCount?: number
}

export function OverviewHeader({
  name,
  intakeLabel,
  targetCountries,
  matchCount = 0,
}: Props) {
  const firstName = name?.split(' ')[0] || 'there'

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#12141c]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-rose-100/60 blur-3xl dark:bg-rose-500/10"
      />
      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-300">
              <Sparkles size={16} aria-hidden />
              <p className="text-xs font-bold uppercase tracking-[0.14em]">Your personalised space</p>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[28px]">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              {intakeLabel ? (
                <>
                  You&apos;re prepping for the <span className="font-semibold text-gray-900 dark:text-white">{intakeLabel}</span> intake
                  {(() => {
                    const arr: string[] = Array.isArray(targetCountries)
                      ? targetCountries
                      : (() => {
                          if (typeof targetCountries === 'string') {
                            try {
                              const p = JSON.parse(targetCountries as unknown as string)
                              if (Array.isArray(p)) return p as string[]
                              return (targetCountries as unknown as string) ? [String(targetCountries)] : []
                            } catch {
                              return (targetCountries as unknown as string) ? [String(targetCountries)] : []
                            }
                          }
                          return []
                        })()
                    return arr.length ? (
                      <>
                        {' '}
                        targeting{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {arr.slice(0, 3).join(', ')}
                        </span>
                      </>
                    ) : null
                  })()}
                  . Let&apos;s get you to campus.
                </>
              ) : (
                <>Your study-abroad journey starts here. Let&apos;s find the right next step.</>
              )}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2.5 lg:items-end">
            <Link
              href={matchCount > 0 ? '/universities' : '/dashboard/settings?tab=study'}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              {matchCount > 0 ? `See ${matchCount} matches` : 'Set study preferences'}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dashboard/settings?tab=study"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200"
            >
              <SlidersHorizontal size={14} />
              Study preferences
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
