'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Sparkles } from 'lucide-react'

import type { ApplicationStatus } from '@/lib/mockData'
import { StatusBadge } from './StatusBadge'

interface Props {
  name: string
  status: ApplicationStatus
  progress: number
  program: string
  university: string
  visaType: string
  index?: number
}

const EASE = [0.16, 1, 0.3, 1] as const

export function WelcomeBanner({
  name,
  status,
  progress,
  program,
  university,
  visaType,
  index = 0,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25] sm:p-7"
    >
      {/* Subtle red wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          background:
            'radial-gradient(ellipse 600px 220px at top right, #C41E3A 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT — greeting */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary dark:border-[#3a1218] dark:bg-[#2a1114]">
            <Sparkles size={13} aria-hidden />
            Student portal
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Welcome back, <span className="text-primary">{name.split(' ')[0]}</span>.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            You&apos;re applying to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{program}</span> at{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{university}</span> for
            the {visaType}. Here&apos;s the latest on your application.
          </p>
        </div>

        {/* RIGHT — status + progress */}
        <div className="flex w-full flex-col gap-3 lg:max-w-sm lg:items-end">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Status
            </span>
            <StatusBadge status={status} />
          </div>
          <div className="w-full rounded-2xl border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-700 dark:bg-[#222530]">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-200">
                <GraduationCap size={13} className="text-primary" aria-hidden />
                Application progress
              </span>
              <span className="font-bold text-gray-900 dark:text-white">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-[#0b0f19]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: EASE, delay: index * 0.08 + 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-[#C41E3A] via-[#dc143c] to-[#ff4d6d]"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
