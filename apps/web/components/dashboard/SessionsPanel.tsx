'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Clock, Video } from 'lucide-react'
import { format } from 'date-fns'

const EASE = [0.16, 1, 0.3, 1] as const

interface Props {
  sessions: any[]
  index?: number
}

export function SessionsPanel({ sessions, index = 0 }: Props) {
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
            Upcoming sessions <span aria-hidden>🗓️</span>
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {sessions.length ? '1:1 time with your counselor' : 'Book time with a counselor'}
          </p>
        </div>
        <Link
          href="/dashboard/appointments"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Manage <ArrowUpRight size={13} />
        </Link>
      </header>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
          <CalendarDays size={28} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">No sessions booked</p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
            Grab a slot with your counselor to plan your applications. 🎯
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sessions.slice(0, 3).map((s, i) => {
            const date = s.scheduledAt ? new Date(s.scheduledAt) : null
            return (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]">
                  {date && (
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/5">
                      <span className="font-display text-lg font-bold leading-none text-primary">{format(date, 'd')}</span>
                      <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{format(date, 'MMM')}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {s.counselor?.user?.name ?? 'Counselor'}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                      {date ? (
                        <>
                          <Clock size={11} /> {format(date, 'EEE, MMM d · h:mm a')}
                        </>
                      ) : null}
                      {s.meetingUrl && (
                        <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-300">
                          <Video size={11} /> Online
                        </span>
                      )}
                    </p>
                  </div>
                  {s.meetingUrl ? (
                    <a
                      href={s.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#A01830]"
                    >
                      Join
                    </a>
                  ) : null}
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}
    </motion.section>
  )
}
