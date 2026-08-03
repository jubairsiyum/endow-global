'use client'

import { motion } from 'framer-motion'
import { Users, FileText, Calendar, Star, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { SABadge } from '@/components/super-admin/shared/SABadge'

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
      style={{ background: '#161B2E', borderColor: '#262C42' }}
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
          style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {value}
        </h3>
        <p className="mt-1 text-[12px] font-medium" style={{ color: '#8890A8' }}>
          {label}
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(136, 144, 168, 0.6)' }}>
          {sub}
        </p>
      </div>
    </div>
  )
}

const recentStudents = [
  { id: '1', name: 'Aisha Rahman', country: 'Bangladesh', target: 'South Korea', app: 'SNU — Business Admin', status: 'Documents', avatar: 'AR' },
  { id: '2', name: 'Karim Hossain', country: 'Bangladesh', target: 'Australia', app: 'UNSW — Data Science', status: 'Under Review', avatar: 'KH' },
  { id: '3', name: 'Nusrat Jahan', country: 'Bangladesh', target: 'South Korea', app: 'KAIST — Engineering', status: 'Submitted', avatar: 'NJ' },
  { id: '4', name: 'Tanvir Ahmed', country: 'Bangladesh', target: 'UK', app: 'Oxford — Economics', status: 'Draft', avatar: 'TA' },
  { id: '5', name: 'Fatima Begum', country: 'Bangladesh', target: 'Malaysia', app: 'UM — Medicine', status: 'Accepted', avatar: 'FB' },
]

const upcomingSessions = [
  { name: 'Aisha Rahman', time: 'Today, 2:30 PM', type: 'Application Review' },
  { name: 'Karim Hossain', time: 'Tomorrow, 10:00 AM', type: 'University Selection' },
  { name: 'Nusrat Jahan', time: 'Thu, 3:00 PM', type: 'Document Check' },
]

export default function CounselorDashboard() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1
          className="text-[20px] font-bold tracking-tight"
          style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Counselor Dashboard
        </h1>
        <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>
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
        <StatCard label="My Students" value="24" sub="8 active · 3 new this month" icon={Users} color="#E8A33D" />
        <StatCard label="Applications" value="18" sub="5 pending · 2 accepted" icon={FileText} color="#a78bfa" />
        <StatCard label="Sessions" value="12" sub="This week · 85% attended" icon={Calendar} color="#4FD1A5" />
        <StatCard label="Rating" value="4.8" sub="From 32 reviews" icon={Star} color="#fbbf24" />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Students table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="xl:col-span-8 rounded-xl border"
          style={{ background: '#161B2E', borderColor: '#262C42' }}
        >
          <div
            className="flex items-center justify-between border-b px-5 py-3"
            style={{ borderColor: '#262C42' }}
          >
            <h2 className="text-[15px] font-semibold" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
              Recent Students
            </h2>
            <span className="text-[11px] font-medium cursor-pointer hover:underline" style={{ color: '#E8A33D' }}>
              View all
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Student', 'Country', 'Target', 'Application', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: '#8890A8', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#262C42]/50">
                {recentStudents.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #E8A33D, #c48b2e)',
                            color: '#0E1220',
                          }}
                        >
                          {s.avatar}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: '#E8EAF2' }}>
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#8890A8' }}>
                      {s.country}
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: '#8890A8' }}>
                      {s.target}
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>
                      {s.app}
                    </td>
                    <td className="px-4 py-3">
                      <SABadge
                        variant={
                          s.status === 'Accepted'
                            ? 'success'
                            : s.status === 'Under Review'
                              ? 'warning'
                              : s.status === 'Draft'
                                ? 'neutral'
                                : 'route'
                        }
                      >
                        {s.status}
                      </SABadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            style={{ background: '#161B2E', borderColor: '#262C42' }}
          >
            <h2 className="text-[15px] font-semibold" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
              Upcoming Sessions
            </h2>
            <div className="mt-3 space-y-3">
              {upcomingSessions.map((session, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(79, 209, 165, 0.08)' }}
                  >
                    <Calendar size={14} style={{ color: '#4FD1A5' }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: '#E8EAF2' }}>
                      {session.name}
                    </p>
                    <p className="text-[11px]" style={{ color: '#8890A8' }}>
                      {session.type} — {session.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div
            className="rounded-xl border p-5"
            style={{ background: '#161B2E', borderColor: '#262C42' }}
          >
            <h2 className="text-[15px] font-semibold" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
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
                      <span className="text-[13px]" style={{ color: '#E8EAF2' }}>
                        {item.label}
                      </span>
                    </div>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}
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
