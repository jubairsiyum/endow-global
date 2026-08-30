'use client'

import { motion } from 'framer-motion'
import { Users, FileText, Calendar, Star, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { trpc } from '@/lib/trpc-client'
import Link from 'next/link'

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div
      className="rounded-xl border p-4 transition-all hover:-translate-y-0.5 group"
      style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
    >
      {/* Accent top line */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] opacity-0 rounded-t-xl hidden group-hover:opacity-100"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}12` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span
          className="flex items-center gap-0.5 text-[11px] font-medium"
          style={{ color: '#4FD1A5', fontFamily: "'JetBrains Mono', monospace" }}
        >
          <ArrowUpRight size={11} />
          +12%
        </span>
      </div>
      <div className="mt-3">
        <h3
          className="text-[28px] font-bold leading-none tracking-tight"
          style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {value}
        </h3>
        <p className="mt-1 text-[12px] font-medium" style={{ color: '#6b7280' }}>
          {label}
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(136, 144, 168, 0.6)' }}>
          {sub}
        </p>
      </div>
    </div>
  )
}

export default function CounselorDashboard() {
  const { data: stats, isLoading } = trpc.counselor.getDashboardStats.useQuery()

  const recentStudents = stats?.recentStudents ?? []
  const upcomingSessions = stats?.upcomingSessions ?? []

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1
          className="text-[20px] font-bold tracking-tight"
          style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Counselor Dashboard
        </h1>
        <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>
          Manage your students, applications, and sessions
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="My Students"
          value={isLoading ? '—' : String(stats?.students ?? 0)}
          sub={`${stats?.recentStudents?.length ?? 0} recent · ${stats?.applications ?? 0} apps`}
          icon={Users}
          color="#E8A33D"
        />
        <StatCard
          label="Applications"
          value={isLoading ? '—' : String(stats?.applications ?? 0)}
          sub={`${stats?.applicationsByStatus?.length ?? 0} statuses`}
          icon={FileText}
          color="#a78bfa"
        />
        <StatCard
          label="Sessions"
          value={isLoading ? '—' : String(stats?.sessions ?? 0)}
          sub={`${stats?.sessionsWeek ?? 0} this week`}
          icon={Calendar}
          color="#4FD1A5"
        />
        <StatCard
          label="Rating"
          value={isLoading ? '—' : stats?.avgRating != null ? String(stats.avgRating) : '—'}
          sub="From reviews"
          icon={Star}
          color="#fbbf24"
        />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Students table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="xl:col-span-8 rounded-xl border"
          style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
        >
          <div
            className="flex items-center justify-between border-b px-5 py-3"
            style={{ borderColor: '#e5e7eb' }}
          >
            <h2 className="text-[15px] font-semibold" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
              Recent Students
            </h2>
            <Link href="/counselor/students" className="text-[11px] font-medium hover:underline" style={{ color: '#E8A33D' }}>
              View all
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <div className="py-10 text-center text-[13px]" style={{ color: '#6b7280' }}>
              No students assigned yet. New registrations will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {['Student', 'Nationality', 'Target', 'Joined'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]/50">
                  {recentStudents.map((s: any) => (
                    <tr key={s.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold"
                            style={{
                              background: 'linear-gradient(135deg, #E8A33D, #c48b2e)',
                              color: '#f8fafc',
                            }}
                          >
                            {(s.name || 'ST').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-[13px] font-medium" style={{ color: '#111827' }}>{s.name}</span>
                            <p className="text-[11px]" style={{ color: '#6b7280' }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>{s.nationality ?? '—'}</td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: '#6b7280' }}>
                        {(() => {
                          const v: any = s.targetCountries
                          const arr: string[] = Array.isArray(v) ? v : (() => { if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : p ? [String(p)] : [] } catch { return v ? [String(v)] : [] } } return [] })()
                          return arr.slice(0, 2).join(', ') || '—'
                        })()}
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>
                        {s.assignedAt ? new Date(s.assignedAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Side column */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="xl:col-span-4 space-y-4"
        >
          {/* Sessions */}
          <div
            className="rounded-xl border p-5"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <h2 className="text-[15px] font-semibold" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
              Upcoming Sessions
            </h2>
            {upcomingSessions.length === 0 ? (
              <p className="mt-3 text-[12px]" style={{ color: '#6b7280' }}>No upcoming sessions. Sessions booked by your students will appear here.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {upcomingSessions.map((session: any, i: number) => (
                  <div key={session.id ?? i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <Calendar size={14} style={{ color: '#4FD1A5' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium truncate" style={{ color: '#111827' }}>{session.studentName}</p>
                      <p className="text-[11px]" style={{ color: '#6b7280' }}>
                        {session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : '—'} · {session.duration ?? 60} min
                      </p>
                      {session.meetingUrl && (
                        <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex text-[11px] font-medium hover:underline" style={{ color: '#2563eb' }}>Join meeting</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance */}
          <div
            className="rounded-xl border p-5"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <h2 className="text-[15px] font-semibold" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
              Performance
            </h2>
            <div className="mt-3 space-y-3">
              {[
                { label: 'Response Time', value: '2.4 hrs', icon: Clock, color: '#E8A33D' },
                { label: 'Conversion Rate', value: '68%', icon: CheckCircle2, color: '#4FD1A5' },
                { label: 'Pending Reviews', value: '3 apps', icon: AlertCircle, color: '#F0625B' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} style={{ color: item.color }} />
                      <span className="text-[13px]" style={{ color: '#111827' }}>
                        {item.label}
                      </span>
                    </div>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: '#111827', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {item.value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
