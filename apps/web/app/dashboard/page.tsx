'use client'

import { motion } from 'framer-motion'
import {
  CalendarClock,
  FileCheck2,
  GraduationCap,
  MessageSquare,
} from 'lucide-react'

import {
  mockDeadlines,
  mockDocuments,
  mockQuickActions,
  mockStudent,
  mockTimeline,
} from '@/lib/mockData'
import { ApplicationTimeline } from '@/components/dashboard/ApplicationTimeline'
import { DocumentChecklist } from '@/components/dashboard/DocumentChecklist'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { StatCard } from '@/components/dashboard/StatCard'
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines'
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner'

const EASE = [0.16, 1, 0.3, 1] as const

// One-shot pulse: only on initial mount, no polling.
function useOneShotPulse(): boolean {
  return true
}

export default function DashboardPage() {
  useOneShotPulse()

  const uploaded = mockDocuments.filter((d) => d.status === 'uploaded').length
  const total = mockDocuments.length
  const percent = Math.round((uploaded / total) * 100)
  const nextDeadline = mockDeadlines[0]?.dueIn ?? 0
  const messagesUnread = mockStudent.unreadMessages
  const status = mockStudent.applicationStatus

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.05 },
        },
      }}
      className="space-y-6"
    >
      {/* 0 — Welcome banner */}
      <WelcomeBanner
        name={mockStudent.name}
        status={status}
        progress={percent}
        program={mockStudent.program}
        university={mockStudent.university}
        visaType={mockStudent.visaType}
        index={0}
      />

      {/* 1 — Stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Documents uploaded"
          value={uploaded}
          suffix={` / ${total}`}
          icon={<FileCheck2 size={18} aria-hidden />}
          tone="success"
          caption={`${percent}% complete`}
          index={1}
        />
        <StatCard
          title="Application progress"
          value={percent}
          suffix="%"
          icon={<GraduationCap size={18} aria-hidden />}
          tone="default"
          caption={status}
          index={2}
        />
        <StatCard
          title="Days until next deadline"
          value={nextDeadline}
          suffix=" days"
          icon={<CalendarClock size={18} aria-hidden />}
          tone={nextDeadline <= 7 ? 'danger' : nextDeadline <= 14 ? 'warning' : 'info'}
          caption={mockDeadlines[0]?.label ?? '—'}
          index={3}
        />
        <StatCard
          title="Unread messages"
          value={messagesUnread}
          icon={<MessageSquare size={18} aria-hidden />}
          tone={messagesUnread > 0 ? 'danger' : 'default'}
          caption="Replies usually within 24h"
          pulse={messagesUnread > 0}
          index={4}
        />
      </section>

      {/* 2 — Two-column content */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <ApplicationTimeline steps={mockTimeline} index={5} />
          <UpcomingDeadlines deadlines={mockDeadlines} index={6} />
        </div>
        <div className="space-y-6 lg:col-span-3">
          <QuickActions actions={mockQuickActions} index={7} />
          <DocumentChecklist documents={mockDocuments} index={8} />
        </div>
      </section>

      {/* footer breathing room */}
      <div className="h-2" aria-hidden />
    </motion.div>
  )
}
