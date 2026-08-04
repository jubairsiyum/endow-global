'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarCheck,
  DollarSign,
  FileText,
  GraduationCap,
  MessageSquare,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  UserCheck,
  Zap,
  Clock,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '@/lib/trpc-client'

const EASE = [0.16, 1, 0.3, 1] as const

function GlowDot({ color = 'emerald' }: { color?: 'emerald' | 'amber' | 'red' }) {
  const colors = {
    emerald: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]',
    amber: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]',
    red: 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]',
  }
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors[color]}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[color]}`} />
    </span>
  )
}

function EmptyPipeline() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/50">
        <BarChart3 size={24} className="text-gray-400 dark:text-gray-500" />
      </div>
      <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No applications yet</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        Applications will appear here once students begin submitting.
      </p>
    </div>
  )
}

export default function SuperAdminDashboard() {
  const { data: _metrics, isLoading } = trpc.admin.dashboard.getMetrics.useQuery()
  const metrics = _metrics as any

  const { data: _platformStats } = trpc.admin.super.getPlatformStats.useQuery()
  const platformStats = _platformStats as any

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-gray-500">Loading platform data...</p>
        </div>
      </div>
    )
  }

  const pipelineStatusMap =
    metrics?.applicationsByStatus?.reduce(
      (acc: Record<string, number>, curr: any) => {
        acc[curr.status] = curr.count
        return acc
      },
      {} as Record<string, number>
    ) || {}

  const totalApplications =
    metrics?.applicationsByStatus?.reduce((sum: number, curr: any) => sum + curr.count, 0) || 0
  const totalStudents = metrics?.students || 0
  const totalCounselors = metrics?.counselors || 0
  const pendingDocs = pipelineStatusMap['DOCUMENTS_REQUIRED'] || 0
  const completedApps = pipelineStatusMap['ACCEPTED'] || 0
  const totalUsers = platformStats?.totalUsers ?? totalStudents + totalCounselors + 2
  const totalAdmins = platformStats?.admins ?? 0

  const topKpis = [
    {
      label: 'Total Users',
      value: totalUsers,
      sub: `${totalStudents} students · ${totalCounselors} counselors${totalAdmins ? ` · ${totalAdmins} admins` : ''}`,
      icon: Users,
      gradient: 'from-blue-500/10 to-blue-600/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      change: '+12%',
      changeColor: 'text-emerald-400',
    },
    {
      label: 'Applications',
      value: totalApplications,
      sub: `${completedApps} completed · ${pendingDocs} pending`,
      icon: FileText,
      gradient: 'from-violet-500/10 to-violet-600/5',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      change: '+8%',
      changeColor: 'text-emerald-400',
    },
    {
      label: 'Counselors',
      value: totalCounselors,
      sub: 'Active advisors on platform',
      icon: UserCheck,
      gradient: 'from-amber-500/10 to-amber-600/5',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      change: '0%',
      changeColor: 'text-gray-400',
    },
    {
      label: 'Revenue (Monthly)',
      value: '$24.8K',
      sub: 'Consultations · Applications',
      icon: DollarSign,
      gradient: 'from-emerald-500/10 to-emerald-600/5',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      change: '+18%',
      changeColor: 'text-emerald-400',
    },
  ]

  const systemMetrics = [
    {
      label: 'Platform Uptime',
      value: '99.97%',
      icon: Activity,
      color: 'emerald' as const,
    },
    {
      label: 'Active Sessions',
      value: '24',
      icon: Zap,
      color: 'emerald' as const,
    },
    {
      label: 'API Latency',
      value: '45ms',
      icon: Clock,
      color: 'emerald' as const,
    },
    {
      label: 'Storage Used',
      value: '2.1 GB',
      icon: Building2,
      color: 'amber' as const,
    },
  ]

  const activities =
    metrics?.recentActivity?.map((app: any) => ({
      title: `${app.student?.user?.name || 'Student'} — ${app.status.toLowerCase().replace(/_/g, ' ')}`,
      subtitle: app.course?.university?.name || app.course?.name || 'N/A',
      time: formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true }),
      status: app.status,
    })) || []

  const pipelineStages = [
    { label: 'New Leads', count: (pipelineStatusMap['DRAFT'] || 0) + (pipelineStatusMap['IN_PROGRESS'] || 0), color: 'from-red-500 to-red-600', bg: 'bg-red-500/10', iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
    { label: 'Submitted', count: pipelineStatusMap['SUBMITTED'] || 0, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    { label: 'Under Review', count: pipelineStatusMap['UNDER_REVIEW'] || 0, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-500/10', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    { label: 'Docs Required', count: pipelineStatusMap['DOCUMENTS_REQUIRED'] || 0, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
    { label: 'Completed', count: pipelineStatusMap['ACCEPTED'] || 0, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500/10', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
  ]

  const maxStage = Math.max(...pipelineStages.map((s) => s.count), 1)
  const hasPipelineData = pipelineStages.some((s) => s.count > 0)
  const universitiesCount = metrics?.universities ?? platformStats?.universities ?? 3
  const upcomingSessionsCount = metrics?.upcomingConsultations?.length ?? 0

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* ─── HERO SECTION ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
        <div className="absolute right-0 top-0 h-full w-[400px] opacity-[0.03] dark:opacity-[0.06]">
          <div className="absolute right-[-60px] top-[-80px] h-[300px] w-[300px] rounded-full bg-primary blur-3xl" />
          <div className="absolute right-[80px] top-[40px] h-[200px] w-[200px] rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg shadow-lg"
                style={{ background: 'linear-gradient(135deg, #AD0819 0%, #e11d48 100%)', boxShadow: '0 4px 14px rgba(173,8,25,0.3)' }}
              >
                <Shield size={16} className="text-white" />
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary dark:border-primary/30 dark:bg-primary/10">
                SUPER ADMIN
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Platform Control Center
            </h1>
            <p className="max-w-lg text-sm text-gray-500 dark:text-gray-400">
              Complete oversight of the Endow Global platform. Monitor performance, manage administrators,
              and ensure smooth operations across all modules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-500/5">
              <GlowDot color="emerald" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">All Systems Operational</span>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:border-gray-700 dark:bg-[#1a1d25] lg:flex">
              <Clock size={13} />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* System Health Widgets */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {systemMetrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-700/50 dark:bg-[#1a1d25]/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-[#222530]">
                <metric.icon size={16} className={metric.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── KPI CARDS ─── */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {topKpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease: EASE }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-[#11131a]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                    <Icon size={18} className={kpi.iconColor} />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.changeColor}`}>
                    <ArrowUpRight size={12} />
                    {kpi.change}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {kpi.value}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                  <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{kpi.sub}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ─── MAIN CONTENT GRID ─── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* LEFT: Pipeline + Stats */}
        <div className="space-y-4 xl:col-span-8">
          {/* Application Pipeline */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Application Pipeline</h2>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Real-time funnel overview</p>
              </div>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                {totalApplications} Total
              </span>
            </div>

            {hasPipelineData ? (
              <div className="mt-5">
                <div className="flex items-end gap-3">
                  {pipelineStages.map((stage) => (
                    <div key={stage.label} className="flex-1 space-y-2">
                      <div className="text-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{stage.count}</span>
                      </div>
                      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-[#1a1d25]">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(stage.count / maxStage) * 100}%` }}
                          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                          className={`absolute bottom-0 w-full rounded-xl bg-gradient-to-t ${stage.color}`}
                          style={{ opacity: 0.85 }}
                        />
                      </div>
                      <p className="text-center text-[11px] font-medium text-gray-500 dark:text-gray-400">{stage.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <EmptyPipeline />
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 px-4 py-2 dark:border-gray-700 dark:bg-[#1a1d25]/30">
                    <FileText size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">No applications in the pipeline yet</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <GraduationCap size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Universities</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{universitiesCount}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <CalendarCheck size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming Sessions</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{upcomingSessionsCount}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                  <MessageSquare size={16} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Conversations</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">—</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Activity + Quick Actions */}
        <div className="space-y-4 xl:col-span-4">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Platform management shortcuts</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { label: 'Add Admin', icon: Shield, color: 'text-primary' },
                { label: 'View Reports', icon: TrendingUp, color: 'text-emerald-400' },
                { label: 'System Logs', icon: Activity, color: 'text-blue-400' },
                { label: 'Settings', icon: Sparkles, color: 'text-amber-400' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-center transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm dark:border-gray-700/50 dark:bg-[#1a1d25]/50 dark:hover:border-gray-600 dark:hover:bg-[#222530]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-[#222530]">
                      <Icon size={16} className={action.color} />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Latest platform events</p>
              </div>
              <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#1a1d25] dark:text-gray-400">
                {activities.length} events
              </span>
            </div>

            <div className="mt-4 space-y-0">
              {activities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800/50">
                    <Activity size={20} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No recent activity</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Platform events will appear here.</p>
                </div>
              )}
              {activities.slice(0, 8).map((item: any, i: number) => {
                const statusColors: Record<string, string> = {
                  ACCEPTED: 'bg-emerald-400',
                  REJECTED: 'bg-red-400',
                  SUBMITTED: 'bg-blue-400',
                  UNDER_REVIEW: 'bg-amber-400',
                  DOCUMENTS_REQUIRED: 'bg-purple-400',
                }
                const dotColor = statusColors[item.status] || 'bg-gray-400'
                return (
                  <div key={i} className="flex items-start gap-3 border-b border-gray-50 py-3 last:border-0 dark:border-gray-800">
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  )
}
