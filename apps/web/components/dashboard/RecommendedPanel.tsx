'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

interface Props {
  matches: any[]
  index?: number
}

export function RecommendedPanel({ matches, index = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-[#e6e8ee] bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#12141c] sm:p-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/10 to-transparent blur-2xl"
      />
      <header className="relative z-10 mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Recommended for you <span aria-hidden>✨</span>
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            AI-matched to your profile &amp; budget
          </p>
        </div>
        <Link
          href="/universities"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Discover <ArrowUpRight size={13} />
        </Link>
      </header>

      {matches.length === 0 ? (
        <div className="relative z-10 rounded-2xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
          <Sparkles size={28} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">No matches yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
            Complete your profile and we’ll find your perfect-fit courses. 🤖
          </p>
        </div>
      ) : (
        <div className="relative z-10 flex gap-3 overflow-x-auto pb-2">
          {matches.map((m, i) => {
            const course = m.course
            const score = Math.round(m.score ?? 0)
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
                className="min-w-[240px] max-w-[240px]"
              >
                <Link
                  href={`/courses/${course?.slug ?? '#'}`}
                  className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {score}% match
                    </span>
                    <Sparkles size={14} className="text-violet-400" aria-hidden />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300">
                    {course?.name ?? 'Course'}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                    {course?.university?.name ?? ''}
                  </p>
                  <div className="mt-auto pt-3">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {course?.tuitionFee ? formatCurrency(course.tuitionFee, course.currency || 'USD') : '—'}
                    </span>
                    {m.matchReasons?.length ? (
                      <p className="mt-1.5 line-clamp-1 text-[11px] text-gray-500 dark:text-gray-400">
                        {m.matchReasons[0]}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.section>
  )
}
