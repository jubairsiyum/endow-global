'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Clock,
  Sparkles,
  UserCheck,
  Video,
} from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  sessions?: any[]
  counselor?: {
    id: string
    name: string
    rating?: number
  } | null
}

export function UpcomingSessionsCard({ sessions = [], counselor }: Props) {
  const primarySession = sessions[0]
  const secondarySessions = sessions.slice(1, 3)

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
            <CalendarDays size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Upcoming Sessions
              </h3>
              {sessions.length > 0 && (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {sessions.length} {sessions.length === 1 ? 'Booking' : 'Bookings'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              1-on-1 strategy & admissions consultations
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/appointments"
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          <span>Manage</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Main Content Area: Aligned to start (top) to balance row height gracefully */}
      <div className="my-3 flex flex-1 flex-col justify-start space-y-3">
        {primarySession ? (
          <>
            {/* Primary / Next Confirmed Session */}
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3.5 transition-all dark:border-rose-950/60 dark:bg-rose-950/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-rose-200/80 bg-white shadow-xs dark:border-rose-900/60 dark:bg-slate-900">
                    <span className="text-base font-extrabold leading-none text-rose-700 dark:text-rose-300">
                      {format(new Date(primarySession.scheduledAt), 'd')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600/80 dark:text-rose-400">
                      {format(new Date(primarySession.scheduledAt), 'MMM')}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Next Up
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {format(new Date(primarySession.scheduledAt), 'h:mm a')} · {primarySession.duration ?? 45} mins
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">
                      {primarySession.counselor?.user?.name ?? counselor?.name ?? 'Assigned Counselor'}
                    </p>

                    <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Video size={11} className="text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>1-on-1 Video Consultation</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {primarySession.meetingUrl ? (
                    <a
                      href={primarySession.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-rose-700"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <Link
                      href="/dashboard/appointments"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Details
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* If multiple sessions are scheduled, show the next ones */}
            {secondarySessions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Later Sessions
                </p>
                {secondarySessions.map((s: any) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition-all dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white text-[10px] font-bold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <span>{format(new Date(s.scheduledAt), 'd MMM')}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                          {s.counselor?.user?.name ?? counselor?.name ?? 'Counselor Session'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {format(new Date(s.scheduledAt), 'h:mm a')} · {s.duration ?? 45} mins
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/appointments"
                      className="shrink-0 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* If only 1 session is scheduled, fill the row height gracefully with Counselor Guidance & Follow-up Booking */
              <div className="flex flex-1 flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/30">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <UserCheck size={14} className="text-rose-600 dark:text-rose-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Admissions Guidance
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      ★ 4.9 Rated
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                    Have questions about course deadlines, university interviews, or visa files?
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    You can book follow-up consultations anytime as your application progresses.
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200/70 pt-2.5 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Next slots available
                  </span>
                  <Link
                    href="/dashboard/appointments"
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    <span>Book Follow-up</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State: High-impact consultation invitation filling the height */
          <div className="flex flex-1 flex-col justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-900/20">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Speak With an Admissions Counselor
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Get 1-on-1 strategy for course admission, scholarships, and visa files.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Program eligibility &amp; scholarship matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Document review &amp; university application assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Embassy visa interview preparation</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Free 30-min consultation
              </span>
              <Link
                href="/dashboard/appointments"
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-rose-700"
              >
                <span>Book Counselor</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-1 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
        <Link
          href="/dashboard/appointments"
          className="flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          <span>View all upcoming bookings &amp; calendar</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
