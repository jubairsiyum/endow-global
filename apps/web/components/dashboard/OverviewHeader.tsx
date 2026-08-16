'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

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
      className="relative overflow-hidden rounded-2xl border border-[#e6e1fb] bg-white shadow-sm dark:border-[#3b315d] dark:bg-[#12141c]"
    >
      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#5e25be]">
              <Sparkles size={16} aria-hidden />
              <p className="text-xs font-bold uppercase tracking-[0.14em]">Your personalised space</p>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#171a2b] dark:text-white sm:text-[28px]">
              Welcome back, {firstName} <span className="align-middle">🎉</span>
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            {intakeLabel ? (
              <>
                You&apos;re prepping for the <span className="font-semibold text-gray-900 dark:text-white">{intakeLabel}</span> intake
                {targetCountries?.length ? (
                  <>
                    {' '}
                    targeting{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {targetCountries.slice(0, 3).join(', ')}
                    </span>
                  </>
                ) : null}
                . Let&apos;s get you to campus.
              </>
            ) : (
              <>Your study-abroad journey starts here. Let&apos;s find the right next step.</>
            )}
            </p>
          </div>
          <Link
            href="/universities"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4d179e] to-[#9822c9] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(101,37,200,0.2)] transition-transform hover:-translate-y-0.5"
          >
            {matchCount > 0 ? `See ${matchCount} matches` : 'Find my matches'}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden bg-gradient-to-r from-[#ffe2ca] via-[#eadcff] to-[#d4e9ff]">
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#c9a6ff]/50 blur-xl" aria-hidden />
      </div>
    </motion.section>
  )
}
