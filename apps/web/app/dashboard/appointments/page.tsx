'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Calendar, CalendarPlus, Clock, User, Video, X } from 'lucide-react'
import { format } from 'date-fns'

import { trpc } from '@/lib/trpc-client'
import { SESSION_STATUS } from '@/lib/dashboard'
import type { SessionStatus } from '@/lib/dashboard'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { cn } from '@/lib/utils'

export default function AppointmentsPage() {
  const utils = trpc.useUtils()
  const { data: real, isLoading, isError, refetch } = trpc.dashboard.sessions.list.useQuery()
  const { data: counselors, isError: counselorsError } = trpc.dashboard.sessions.counselors.useQuery()
  const book = trpc.dashboard.sessions.book.useMutation()
  const cancel = trpc.dashboard.sessions.cancel.useMutation()

  const [bookingOpen, setBookingOpen] = useState(false)
  const [counselorId, setCounselorId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [notes, setNotes] = useState('')

  const sessions = (real ?? []) as any[]

  const invalidate = () => utils.dashboard.sessions.list.invalidate()

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    if (!counselorId || !scheduledAt) {
      toast.error('Pick a counselor and a time')
      return
    }
    try {
      await book.mutateAsync({ counselorId, scheduledAt: new Date(scheduledAt).toISOString(), notes: notes || undefined })
      toast.success('Session booked 🎉')
      setBookingOpen(false)
      setScheduledAt('')
      setNotes('')
      invalidate()
    } catch (err: any) {
      toast.error(err.message || 'Booking failed')
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancel.mutateAsync({ id })
      toast.success('Session cancelled')
      invalidate()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            Appointments <span aria-hidden>🗓️</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Schedule 1:1 sessions with your counselor
          </p>
        </div>
        <button
          onClick={() => setBookingOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#A01830]"
        >
          <CalendarPlus size={15} /> Book session
        </button>
      </motion.div>

      <AnimatePresence>
        {bookingOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleBook}
            className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-5 shadow-premium-sm dark:border-gray-800 dark:bg-[#12141c]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-gray-900 dark:text-white">Book a session</h2>
              <button type="button" onClick={() => setBookingOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Counselor</span>
                {counselorsError && <span className="text-xs text-red-600 dark:text-red-300">Counselors are temporarily unavailable. Try again shortly.</span>}
                <select
                  value={counselorId}
                  onChange={(e) => setCounselorId(e.target.value)}
                  disabled={counselorsError}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white"
                >
                  <option value="">Select a counselor…</option>
                  {(counselors ?? []).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.rating ? `· ⭐ ${c.rating}` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Date & time</span>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="What do you want to discuss?"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white"
                />
              </label>
              <button
                type="submit"
                disabled={book.isPending}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A01830] disabled:opacity-60"
              >
                {book.isPending ? 'Booking…' : 'Confirm booking'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading ? (
        <DashboardLoading rows={3} />
      ) : isError ? (
        <DashboardError onRetry={() => refetch()} />
      ) : sessions.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-gray-200 bg-white py-14 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <Calendar size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No appointments yet</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            Book a session to plan your study abroad journey. 🌍
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const status = SESSION_STATUS[s.status as SessionStatus] ?? SESSION_STATUS.SCHEDULED
            const date = s.scheduledAt ? new Date(s.scheduledAt) : null
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-premium-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#12141c]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    {date && (
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/5">
                        <span className="font-display text-xl font-bold leading-none text-primary">{format(date, 'd')}</span>
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{format(date, 'MMM')}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {s.counselor?.user?.name ?? 'Counselor'}
                      </h3>
                      <div className="mt-1.5 space-y-1">
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} /> {date ? format(date, 'EEEE, MMM d · h:mm a') : '—'}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <User size={12} /> {s.duration ?? 60} min session
                        </p>
                        {s.meetingUrl && (
                          <p className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-300">
                            <Video size={12} /> Online meeting
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusPill label={status.label} config={status} />
                    {s.status === 'SCHEDULED' && (
                      <div className="flex items-center gap-1.5">
                        {s.meetingUrl && (
                          <a
                            href={s.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#A01830]"
                          >
                            Join
                          </a>
                        )}
                        <button
                          onClick={() => handleCancel(s.id)}
                          disabled={cancel.isPending}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:border-red-200 hover:text-red-500 dark:border-gray-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
