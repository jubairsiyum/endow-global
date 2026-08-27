'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, differenceInCalendarDays, differenceInHours } from 'date-fns'
import { AlertTriangle, CalendarClock, CheckCircle2, Clock, Landmark, FileText, GraduationCap, Plane, BookOpen } from 'lucide-react'

import { trpc } from '@/lib/trpc-client'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { cn } from '@/lib/utils'

type DeadlineCategory = 'APPLICATION' | 'DOCUMENT' | 'VISA' | 'SCHOLARSHIP' | 'EXAM' | 'OTHER'

interface DeadlineItem {
  id: string
  title: string
  description?: string | null
  category: DeadlineCategory
  dueAt: string
  relatedUniversity?: string | null
  relatedCourse?: string | null
  remindDaysBefore?: number
}

const CATEGORY_META: Record<DeadlineCategory, { label: string; icon: typeof BookOpen; classes: string }> = {
  APPLICATION: { label: 'Application', icon: FileText, classes: 'text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10' },
  DOCUMENT: { label: 'Document', icon: FileText, classes: 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10' },
  VISA: { label: 'Visa', icon: Plane, classes: 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10' },
  SCHOLARSHIP: { label: 'Scholarship', icon: GraduationCap, classes: 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10' },
  EXAM: { label: 'Exam', icon: BookOpen, classes: 'text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10' },
  OTHER: { label: 'Other', icon: Landmark, classes: 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800' },
}

const CATEGORY_FILTERS: { value: DeadlineCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'APPLICATION', label: 'Application' },
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'VISA', label: 'Visa' },
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'EXAM', label: 'Exam' },
  { value: 'OTHER', label: 'Other' },
]

function dueMeta(dueAt: string) {
  const due = new Date(dueAt)
  const now = new Date()
  const diffDays = differenceInCalendarDays(due, now)
  const diffHours = differenceInHours(due, now)

  if (diffDays < 0) return { label: 'Passed', tone: 'muted', day: 'gray', urgency: 3 }
  if (diffDays === 0) return { label: diffHours < 1 ? 'Due now' : `Due in ${diffHours}h`, tone: 'error', day: 'rose', urgency: 0 }
  if (diffDays === 1) return { label: 'Due tomorrow', tone: 'error', day: 'rose', urgency: 0 }
  if (diffDays <= 3) return { label: `Due in ${diffDays} days`, tone: 'warning', day: 'amber', urgency: 1 }
  if (diffDays <= 14) return { label: `Due in ${diffDays} days`, tone: 'info', day: 'blue', urgency: 2 }
  return { label: `Due in ${diffDays} days`, tone: 'neut', day: 'gray', urgency: 3 }
}

const toneClasses: Record<string, string> = {
  error: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
  info: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
  neut: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  muted: 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500',
}

export default function DeadlinesPage() {
  const { data, isLoading, isError, refetch } = trpc.dashboard.deadlines.list.useQuery()
  const [category, setCategory] = useState<DeadlineCategory | 'ALL'>('ALL')

  const all = (data ?? []) as DeadlineItem[]

  const filtered = useMemo(() => all.filter((d) => category === 'ALL' || d.category === category), [all, category])

  const now = Date.now()
  const upcoming = useMemo(() => filtered.filter((d) => new Date(d.dueAt).getTime() >= now), [filtered, now])
  const passed = useMemo(() => filtered.filter((d) => new Date(d.dueAt).getTime() < now), [filtered, now])

  const dueSoonCount = upcoming.filter((d) => differenceInCalendarDays(new Date(d.dueAt), new Date()) <= 7).length

  const renderCard = (d: DeadlineItem) => {
    const meta = CATEGORY_META[d.category] ?? CATEGORY_META.OTHER
    const Icon = meta.icon
    const due = dueMeta(d.dueAt)
    const dueDate = new Date(d.dueAt)
    const passedItem = dueDate.getTime() < now

    return (
      <motion.div
        key={d.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(studentPanel, 'p-5 transition-shadow hover:shadow-md', passedItem && 'opacity-70')}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', meta.classes)}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{d.title}</h3>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', meta.classes)}>{meta.label}</span>
              </div>
              {d.relatedUniversity && <p className="mt-1 truncate text-xs font-medium text-gray-500 dark:text-gray-400">{d.relatedUniversity}{d.relatedCourse ? ` · ${d.relatedCourse}` : ''}</p>}
              {d.description && <p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-600 dark:text-gray-300">{d.description}</p>}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold', toneClasses[due.tone])}>
              {passedItem ? 'Passed' : due.label}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{format(dueDate, 'EEE, MMM d · h:mm a')}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <StudentPageHeader
        eyebrow="Stay on track"
        title="Deadlines"
        description="Application, document, scholarship and exam deadlines so you never miss a step."
      />

      {/* Summary strip */}
      {isError ? null : isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(studentPanel, 'flex items-center gap-3 p-4')}>
              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-12 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-28 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className={cn(studentPanel, 'flex items-center gap-3 p-4')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"><CalendarClock size={18} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcoming.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming deadlines</p>
            </div>
          </div>
          <div className={cn(studentPanel, 'flex items-center gap-3 p-4')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"><AlertTriangle size={18} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dueSoonCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Due within a week</p>
            </div>
          </div>
          <div className={cn(studentPanel, 'flex items-center gap-3 p-4')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><CheckCircle2 size={18} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{passed.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Past deadlines</p>
            </div>
          </div>
        </div>
      )}

      {/* Category filters */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Deadline categories">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={category === f.value}
            onClick={() => setCategory(f.value)}
            className={cn(
              'whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600',
              category === f.value
                ? 'border-rose-600 bg-rose-600 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-300'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <DashboardLoading rows={3} />
      ) : isError ? (
        <DashboardError title="Deadlines unavailable" message="We could not load your deadlines." onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center dark:border-gray-700 dark:bg-[#12141c]">
          <CalendarClock size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No deadlines here</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            {category !== 'ALL' ? 'No deadlines in this category right now.' : 'Your counselor will post important deadlines here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Upcoming</h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">{upcoming.length}</span>
              </div>
              <div className="space-y-3">{upcoming.map(renderCard)}</div>
            </section>
          )}

          {passed.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Past</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">{passed.length}</span>
              </div>
              <div className="space-y-3">{passed.map(renderCard)}</div>
            </section>
          )}
        </div>
      )}

      <AnimatePresence>
        {!isLoading && !isError && filtered.length > 0 && upcoming.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Clock size={13} /> You're all caught up — nothing due soon.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
