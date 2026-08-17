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
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, input } from '@/components/dashboard/ui'
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
      toast.success('Session booked')
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
    <div className="mx-auto max-w-[1000px] space-y-6">
      <StudentPageHeader
        eyebrow="Your support team"
        title="Appointments"
        description="Book time with a counselor to make your next application step easier."
        action={
          <button onClick={() => setBookingOpen((v) => !v)} className={btnPrimary}>
            <CalendarPlus size={15} /> Book session
          </button>
        }
      />

      <AnimatePresence>
        {bookingOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleBook}
            className={`${studentPanel} overflow-hidden p-5`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Book a session</h2>
              <button
                type="button"
                onClick={() => setBookingOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                aria-label="Close booking form"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Counselor</span>
                {counselorsError && <span className="text-xs text-red-600 dark:text-red-300">Counselors are temporarily unavailable. Try again shortly.</span>}
                <select value={counselorId} onChange={(e) => setCounselorId(e.target.value)} disabled={counselorsError} className={input}>
                  <option value="">Select a counselor…</option>
                  {(counselors ?? []).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.rating ? `· ${c.rating} ★` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Date &amp; time</span>
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className={input} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="What do you want to discuss?"
                  className={cn(input, 'h-auto min-h-[64px] resize-none py-3')}
                />
              </label>
              <button type="submit" disabled={book.isPending} className={cn(btnPrimary, 'w-full')}>
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
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <Calendar size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No appointments yet</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            Book a session to plan your study abroad journey.
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
                className={`${studentPanel} p-5 transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    {date && (
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10">
                        <span className="font-display text-xl font-bold leading-none text-rose-600 dark:text-rose-300">{format(date, 'd')}</span>
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
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                          >
                            Join
                          </a>
                        )}
                        <button
                          onClick={() => handleCancel(s.id)}
                          disabled={cancel.isPending}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:border-red-200 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-50 dark:border-gray-700"
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
