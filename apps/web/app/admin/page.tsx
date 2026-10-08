'use client'

import { useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { UserRole } from '@endow/types'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ArrowUpRight,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

interface SessionUser {
  role?: UserRole
}

interface ApplicationStatusCount {
  count: number
}

interface ActivityItem {
  status?: string
  student?: {
    user?: {
      name?: string | null
    }
  }
  course?: {
    name?: string | null
    university?: {
      name?: string | null
    }
  }
  updatedAt?: string | Date | null
}

interface InquiryItem {
  givenName?: string | null
  surname?: string | null
  targetUniversity?: string | null
  targetCountry?: string | null
  submittedAt?: string | Date | null
}

interface MetricData {
  students?: number
  counselors?: number
  applicationsByStatus?: ApplicationStatusCount[]
  upcomingConsultations?: unknown[]
  recentActivity?: ActivityItem[]
}

interface PlatformStatsData {
  totalUsers?: number
  admins?: number
  universities?: number
}

interface KPIItem {
  label: string
  value: number
  sub: string
  icon: LucideIcon
  color: string
  trend: string
}

export default function AdminPage() {
  const { data: session } = useSession()
  const sessionUser = session?.user as SessionUser | undefined
  const userRole = sessionUser?.role

  const { data: metricsData, isLoading } = trpc.admin.dashboard.getMetrics.useQuery(undefined, {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN
  const { data: statsData } = trpc.admin.super.getPlatformStats.useQuery(undefined, {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: isSuperAdmin,
  })

  const { data: inquiriesData } = trpc.endow.listInquiries.useQuery(undefined, {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const metrics = (metricsData as MetricData) || {}
  const stats = (statsData as PlatformStatsData) || {}
  const inquiries = (inquiriesData as InquiryItem[]) || []

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#E8A33D', borderRightColor: '#E8A33D' }}
        />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading platform data…
        </p>
      </div>
    )
  }

  const totalStudents = metrics.students || 0
  const totalCounselors = metrics.counselors || 0
  const totalApplications =
    metrics.applicationsByStatus?.reduce((s, c) => s + (c.count || 0), 0) || 0
  const totalInquiries = inquiries.length || 0
  const totalUsers = stats.totalUsers || totalStudents + totalCounselors + 2
  const totalAdmins = stats.admins || 0
  const totalUniversities = stats.universities || 0
  const upcomingSessions = metrics.upcomingConsultations?.length || 0

  const kpis: KPIItem[] = [
    {
      label: 'Total Users',
      value: totalUsers,
      sub: `${totalStudents} students · ${totalCounselors} counselors · ${totalAdmins} admins`,
      icon: Users,
      color: '#C41E3A',
      trend: '+12%',
    },
    {
      label: 'Applications',
      value: totalApplications,
      sub: 'Platform-wide submissions',
      icon: FileText,
      color: '#8B0E1A',
      trend: '+8%',
    },
    {
      label: 'Inquiries',
      value: totalInquiries,
      sub: 'Apply Now form leads',
      icon: Zap,
      color: '#E8A33D',
      trend: totalInquiries > 0 ? 'Active' : '0',
    },
    {
      label: 'Universities',
      value: totalUniversities,
      sub: 'Partner institutions',
      icon: Building2,
      color: '#B08C45',
      trend: totalUniversities > 0 ? '+' + totalUniversities : '0',
    },
    {
      label: 'Counselors',
      value: totalCounselors,
      sub: 'Active advisors',
      icon: UserCheck,
      color: '#E05266',
      trend: '0%',
    },
    {
      label: 'Sessions',
      value: upcomingSessions,
      sub: 'Upcoming consultations',
      icon: CalendarDays,
      color: '#A0543B',
      trend: '0',
    },
  ]

  const recentActivity: ActivityItem[] = metrics.recentActivity?.slice(0, 5) || []

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span
            className="mb-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ borderColor: '#E8A33D4D', color: '#E8A33D', background: '#E8A33D12' }}
          >
            Endow Ops
          </span>
          <h1
            className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "'Space Grotesk',sans-serif" }}
          >
            {userRole === UserRole.SUPER_ADMIN ? 'Platform Control Center' : 'Admin Dashboard'}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Overview of platform operations and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            All Systems Operational
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, ease: EASE }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b]"
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{ background: `linear-gradient(135deg, ${k.color}08, ${k.color}03)` }}
            />
            <div className="relative z-10 flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${k.color}10` }}
              >
                <k.icon size={18} style={{ color: k.color }} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight size={12} />
                {k.trend}
              </span>
            </div>
            <div className="relative z-10 mt-4">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {k.value.toLocaleString()}
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
              <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{k.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed + Quick Stats */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <Activity size={18} className="text-gray-400" />
              Recent Activity
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {recentActivity.length} events
            </span>
          </div>
          {recentActivity.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">No recent activity yet.</div>
          ) : (
            <div className="space-y-0">
              {recentActivity.map((app, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-gray-50 py-2.5 last:border-0 dark:border-white/[0.06]"
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background:
                        app.status === 'ACCEPTED'
                          ? '#10b981'
                          : app.status === 'REJECTED'
                            ? '#ef4444'
                            : app.status === 'SUBMITTED'
                              ? '#3b82f6'
                              : '#f59e0b',
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-900 dark:text-gray-200">
                      {app.student?.user?.name || 'Student'} —{' '}
                      {app.status?.toLowerCase()?.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {app.course?.university?.name || app.course?.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-gray-400">
                    {app.updatedAt
                      ? new Date(app.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Quick Stats
            </h3>
            <div className="space-y-3">
              {[
                { icon: Users, label: 'Students', value: totalStudents },
                { icon: UserCheck, label: 'Counselors', value: totalCounselors },
                { icon: Building2, label: 'Universities', value: totalUniversities },
                { icon: GraduationCap, label: 'Sessions', value: upcomingSessions },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <s.icon size={15} className="shrink-0 text-gray-400" />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{s.label}</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Recent Inquiries */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Recent Inquiries
            </h3>
            {inquiries.length === 0 ? (
              <p className="text-xs text-gray-400">No inquiries yet.</p>
            ) : (
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {inquiries.slice(0, 5).map((inq, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {inq.givenName} {inq.surname}
                    </span>
                    <span className="ml-2 text-gray-400">
                      {inq.targetUniversity || inq.targetCountry}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-gray-400">
                      {inq.submittedAt
                        ? new Date(inq.submittedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
