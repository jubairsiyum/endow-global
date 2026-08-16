'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart, MapPin } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

interface Props {
  shortlisted: any[]
  index?: number
}

export function ShortlistedPanel({ shortlisted, index = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="rounded-2xl border border-[#e6e8ee] bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#12141c] sm:p-5"
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Shortlisted courses <span aria-hidden>💖</span>
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {shortlisted.length ? 'Saved for later — keep an eye on these' : 'Tap the heart on any course to save it here'}
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Explore <ArrowUpRight size={13} />
        </Link>
      </header>

      {shortlisted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
          <Heart size={28} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">No saved courses yet</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
            Shortlist universities you love and we’ll help you apply. 💌
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shortlisted.slice(0, 6).map((item, i) => {
            const course = item.course
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  href={`/courses/${course?.slug ?? '#'}`}
                  className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    <MapPin size={11} className="text-primary" />
                    {course?.university?.country ?? ''}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                    {course?.name ?? 'Course'}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                    {course?.university?.name ?? ''}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {course?.tuitionFee ? formatCurrency(course.tuitionFee, course.currency || 'USD') : '—'}
                    </span>
                    {course?.hasScholarship && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-500/10 dark:text-green-300">
                        Scholarship
                      </span>
                    )}
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
