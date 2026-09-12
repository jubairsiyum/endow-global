'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { AlertTriangle, Calendar, CalendarPlus, Clock, StickyNote, User, Video, X } from 'lucide-react'
import { format } from 'date-fns'

import { trpc } from '@/lib/trpc-client'
import { SESSION_STATUS } from '@/lib/dashboard'
import type { SessionStatus } from '@/lib/dashboard'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, btnSecondary, input } from '@/components/dashboard/ui'
import { cn } from '@/lib/utils'

const STATUS_CANCELLED = 'CANCELLED'
const STATUS_SCHEDULED = 'SCHEDULED'

function toDateInputValue(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export default function AppointmentsPage() {
  const utils = trpc.useUtils()
  const { data: real, isLoading, isError, refetch } = trpc.dashboard.sessions.list.useQuery()
  const { data: counselors, isError: counselorsError, refetch: refetchCounselors } = trpc.dashboard.sessions.counselors.useQuery()
  const { data: assignedCounselor, isLoading: assignedLoading } = trpc.dashboard.sessions.assigned.useQuery()
  const book = trpc.dashboard.sessions.book.useMutation()
  const reschedule = trpc.dashboard.sessions.reschedule.useMutation()
  const cancel = trpc.dashboard.sessions.cancel.useMutation()

  const [bookingOpen, setBookingOpen] = useState(false)
  const [counselorId, setCounselorId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [notes, setNotes] = useState('')

  const [cancelTarget, setCancelTarget] = useState<any>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<any>(null)
  const [rescheduleAt, setRescheduleAt] = useState('')

  const sessions = (real ?? []) as any[]

  const invalidate = () => {
    utils.dashboard.sessions.list.invalidate()
    utils.dashboard.sessions.counselors.invalidate()
    utils.dashboard.sessions.assigned.invalidate()
  }

  // Keep counselorId in sync with assigned counselor
  const effectiveCounselorId = assignedCounselor?.id ?? counselorId
  const hasAssignedCounselor = !!assignedCounselor?.id

  // Preselect the assigned counselor the first time the booking form opens.
  function openBooking() {
    setBookingOpen((open) => {
      const next = !open
      if (next && assignedCounselor?.id) {
        setCounselorId(assignedCounselor.id)
      }
      return next
    })
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    const bookingCounselorId = assignedCounselor?.id ?? counselorId
    if (!hasAssignedCounselor) {
      toast.error('No counselor assigned to you yet. Please contact support.')
      return
    }
    if (!bookingCounselorId) {
      toast.error('No counselor assigned')
      return
    }
    if (!scheduledAt) {
      toast.error('Pick a date and time')
      return
    }
    const when = new Date(scheduledAt)
    if (Number.isNaN(when.getTime())) {
      toast.error('Invalid date and time')
      return
    }
    if (when.getTime() <= Date.now()) {
      toast.error('Please choose a time in the future')
      return
    }
    try {
      await book.mutateAsync({ counselorId: bookingCounselorId, scheduledAt: when.toISOString(), notes: notes || undefined })
      toast.success('Session booked')
      setBookingOpen(false)
      setScheduledAt('')
      setNotes('')
      invalidate()
    } catch (err: any) {
      toast.error(err.message || 'Booking failed')
    }
  }

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault()
    const target = rescheduleTarget
    if (!target) return
    if (!rescheduleAt) {
      toast.error('Pick a new date and time')
      return
    }
    const when = new Date(rescheduleAt)
    if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
      toast.error('Please choose a valid time in the future')
      return
    }
    try {
      await reschedule.mutateAsync({ id: target.id, scheduledAt: when.toISOString() })
      toast.success('Session rescheduled')
      setRescheduleTarget(null)
      setRescheduleAt('')
      invalidate()
    } catch (err: any) {
      toast.error(err.message || 'Reschedule failed')
    }
  }

  async function confirmCancel() {
    const target = cancelTarget
    if (!target) return
    try {
      await cancel.mutateAsync({ id: target.id })
      toast.success('Session cancelled')
      setCancelTarget(null)
      invalidate()
    } catch (err: any) {
      toast.error(err.message || 'Could not cancel session')
    }
  }

  const upcoming = useMemo(() => sessions.filter((s) => s.status === STATUS_SCHEDULED), [sessions])
  const past = useMemo(
    () => sessions.filter((s) => s.status !== STATUS_SCHEDULED),
    [sessions]
  )

  const minDateTime = useMemo(() => {
    const d = new Date(Date.now() + 30 * 60 * 1000)
    d.setMinutes(d.getMinutes() - d.getMinutes() % 5)
    return toDateInputValue(d)
  }, [])

  const renderSession = (s: any) => {
    const status = SESSION_STATUS[s.status as SessionStatus] ?? SESSION_STATUS.SCHEDULED
    const date = s.scheduledAt ? new Date(s.scheduledAt) : null
    const cancelled = s.status === STATUS_CANCELLED
    const passed = date ? date.getTime() <= Date.now() : false
    return (
      <motion.div
        key={s.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(studentPanel, 'p-5 transition-shadow hover:shadow-md', cancelled && 'opacity-70')}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-4">
            {date && (
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10">
                <span className="font-display text-xl font-bold leading-none text-rose-600 dark:text-rose-300">{format(date, 'd')}</span>
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{format(date, 'MMM')}</span>
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white">{s.counselor?.user?.name ?? 'Counselor'}</h3>
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
                {s.notes && (
                  <p className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <StickyNote size={12} className="mt-0.5 shrink-0" /> <span className="line-clamp-2">{s.notes}</span>
                  </p>
                )}
                {s.counselor?.rating != null && (
                  <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-300">
                    {s.counselor.rating} ★ rating
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusPill label={status.label} config={status} />
            {s.status === STATUS_SCHEDULED && (
              <div className="flex items-center gap-1.5">
                {s.meetingUrl && !passed && (
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
                  type="button"
                  onClick={() => { const d = date ? new Date(date) : new Date(); setRescheduleTarget(s); setRescheduleAt(toDateInputValue(d)) }}
                  disabled={reschedule.isPending}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-rose-300 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setCancelTarget(s)}
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
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <StudentPageHeader
        eyebrow="Your support team"
        title="Appointments"
        description="Book time with a counselor to make your next application step easier."
        action={
          <button onClick={openBooking} className={btnPrimary}>
            <CalendarPlus size={15} /> Book session
          </button>
        }
      />

      {/* Booking form */}
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
                {assignedLoading ? (
                  <span className="text-xs text-gray-400">Loading your counselor…</span>
                ) : hasAssignedCounselor ? (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                      {(assignedCounselor.name || 'C')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{assignedCounselor.name}</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">Your assigned counselor · only this counselor can be booked</p>
                    </div>
                    {assignedCounselor.rating != null && (
                      <span className="ml-auto text-xs font-semibold text-amber-600">{assignedCounselor.rating} ★</span>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                    No counselor is assigned to you yet. Please contact support — you will be able to book once a counselor is assigned.
                  </div>
                )}
                {/* Fallback for error state when assigned counselor fetch fails but counselors list exists */}
                {!hasAssignedCounselor && counselorsError && (
                  <button type="button" onClick={() => refetchCounselors()} className="text-left text-xs text-red-600 underline dark:text-red-300">
                    Counselors are temporarily unavailable. Try again.
                  </button>
                )}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Date &amp; time</span>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  min={minDateTime}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className={input}
                />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  Sessions must be booked at least 30 minutes in advance.
                </span>
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
              <button type="submit" disabled={book.isPending || !hasAssignedCounselor} className={cn(btnPrimary, 'w-full')}>
                {book.isPending ? 'Booking…' : hasAssignedCounselor ? 'Confirm booking' : 'No counselor assigned'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reschedule form */}
      <AnimatePresence>
        {rescheduleTarget && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleReschedule}
            className={`${studentPanel} overflow-hidden p-5`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Reschedule session with {rescheduleTarget.counselor?.user?.name ?? 'counselor'}
              </h2>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                aria-label="Close reschedule form"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">New date &amp; time</span>
                <input
                  type="datetime-local"
                  value={rescheduleAt}
                  min={minDateTime}
                  onChange={(e) => setRescheduleAt(e.target.value)}
                  className={input}
                />
              </label>
              <div className="flex items-center gap-2">
                <button type="submit" disabled={reschedule.isPending} className={cn(btnPrimary, 'flex-1')}>
                  {reschedule.isPending ? 'Updating…' : 'Confirm reschedule'}
                </button>
                <button type="button" onClick={() => setRescheduleTarget(null)} className={cn(btnSecondary, 'flex-1')}>
                  Keep current time
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {cancelTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setCancelTarget(null)} aria-hidden />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${studentPanel} relative w-full max-w-md p-6`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-dialog-title"
            >
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                <AlertTriangle size={22} />
              </div>
              <h3 id="cancel-dialog-title" className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                Cancel this session?
              </h3>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                This will cancel your appointment with {cancelTarget.counselor?.user?.name ?? 'your counselor'}. This action cannot be undone.
              </p>
              <div className="mt-6 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setCancelTarget(null)} className={cn(btnSecondary, 'flex-1')}>
                  Keep session
                </button>
                <button type="button" onClick={confirmCancel} disabled={cancel.isPending} className={cn('flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50')}>
                  {cancel.isPending ? 'Cancelling…' : 'Yes, cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
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
        <div className="space-y-8">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Upcoming</h2>
              {upcoming.length > 0 && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">{upcoming.length}</span>}
            </div>
            {upcoming.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
                No upcoming sessions.
              </div>
            ) : (
              <div className="space-y-3">{upcoming.map(renderSession)}</div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Past</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">{past.length}</span>
              </div>
              <div className="space-y-3">{past.map(renderSession)}</div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
