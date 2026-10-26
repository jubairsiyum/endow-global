'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarClock, Clock, ExternalLink, Sparkles } from 'lucide-react'
import { format } from 'date-fns'

interface DeadlineItem {
  id: string
  label: string
  dueDate?: Date | string
  dueIn: number
  slug?: string
}

interface Props {
  deadlines?: DeadlineItem[]
}

const DEFAULT_INTAKES: DeadlineItem[] = [
  {
    id: 'default-spring',
    label: 'Spring 2025 Regular Intake — South Korea Universities',
    dueDate: '2025-01-15',
    dueIn: 45,
    slug: 'spring-intake-korea',
  },
  {
    id: 'default-fall',
    label: 'Fall 2025 Early Admissions — Global Partner Programs',
    dueDate: '2025-04-30',
    dueIn: 120,
    slug: 'fall-intake-global',
  },
]

export function UpcomingIntakesCard({ deadlines = [] }: Props) {
  const displayItems = deadlines.length > 0 ? deadlines : DEFAULT_INTAKES

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-rose-50 text-rose-700 dark:border-slate-700 dark:bg-rose-950/40 dark:text-rose-300">
            <CalendarClock size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming Intakes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              University admission deadlines & intake dates
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          {displayItems.length} Open
        </span>
      </div>

      {/* Intake Items List */}
      <div className="my-3 space-y-2.5 flex-1 flex flex-col justify-center">
        {displayItems.slice(0, 3).map((item) => {
          const isUrgent = item.dueIn != null && item.dueIn <= 14
          const dateObj = item.dueDate ? new Date(item.dueDate) : null
          const isValidDate = dateObj && !isNaN(dateObj.getTime())

          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Date Capsule */}
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white border border-slate-200/80 text-rose-700 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-300 shadow-xs">
                  <span className="text-xs font-black leading-none">
                    {isValidDate ? format(dateObj, 'd') : '2025'}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase mt-0.5">
                    {isValidDate ? format(dateObj, 'MMM') : 'Intake'}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                    {item.label}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {isValidDate ? format(dateObj, 'MMM d, yyyy') : 'Admission Open'}
                    </span>
                    <span>·</span>
                    <span
                      className={`font-semibold ${
                        isUrgent
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.dueIn === 0
                        ? 'Deadline Today'
                        : item.dueIn > 0
                          ? `${item.dueIn} days left`
                          : 'Intake Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={item.slug ? `/apply-now?slug=${encodeURIComponent(item.slug)}` : '/courses'}
                className="shrink-0 ml-2 inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors"
              >
                <Sparkles size={11} />
                <span>Apply</span>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Footer link */}
      <div className="border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
        <Link
          href="/courses"
          className="flex items-center justify-between text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          <span>Explore all university intake schedules & requirements</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
