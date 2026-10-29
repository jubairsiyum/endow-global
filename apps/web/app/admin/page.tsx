'use client'

import { ModernApplicationChart } from '@/components/admin/dashboard/ModernApplicationChart'
import { ModernPipelineFunnel } from '@/components/admin/dashboard/ModernPipelineFunnel'
import { ModernTopCountries } from '@/components/admin/dashboard/ModernTopCountries'
import { useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { UserRole } from '@endow/types'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock,
  FileText,
  GraduationCap,
  Layers,
  MessageSquare,
  Plus,
  Shield,
  Sparkles,
  TrendingUp,
  RefreshCw,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

interface SessionUser {
  role?: UserRole
}

interface ApplicationStatusCount {
  status: string
  count: number
}

interface ActivityItem {
  id?: string
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
  id?: string
  givenName?: string | null
  surname?: string | null
  targetUniversity?: string | null
  targetCountry?: string | null
  submittedAt?: string | Date | null
}

interface ConsultationItem {
  id: string
  scheduledAt: string | Date
  status?: string
  student?: {
    user?: {
      name?: string | null
    }
  }
  counselor?: {
    user?: {
      name?: string | null
    }
  }
}

interface MetricData {
  students?: number
  counselors?: number
  applicationsByStatus?: ApplicationStatusCount[]
  upcomingConsultations?: ConsultationItem[]
  recentActivity?: ActivityItem[]
  topCountries?: { country: string; count: number }[]
  applicationTrend?: {
    date: string
    day?: string
    fullDate?: string
    applications?: number
    inquiries?: number
    count: number
  }[]
  totalStudentsWithNationality?: number
}

interface PlatformStatsData {
  totalUsers?: number
  students?: number
  counselors?: number
  admins?: number
  universities?: number
  upcomingSessions?: number
}

export default function AdminPage() {
  const { data: session } = useSession()
  const sessionUser = session?.user as SessionUser | undefined
  const userRole = sessionUser?.role
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN

  const [activeTab, setActiveTab] = useState<'consultations' | 'inquiries'>('consultations')

  const utils = trpc.useUtils()

  const { data: metricsData, isLoading, isFetching } = trpc.admin.dashboard.getMetrics.useQuery(undefined, {
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
  })

  const { data: statsData } = trpc.admin.super.getPlatformStats.useQuery(undefined, {
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    enabled: isSuperAdmin,
  })

  const { data: inquiriesData, isFetching: isFetchingInquiries } = trpc.endow.listInquiries.useQuery(undefined, {
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
  })

  const handleRefresh = async () => {
    await Promise.all([
      utils.admin.dashboard.getMetrics.invalidate(),
      utils.endow.listInquiries.invalidate(),
      utils.admin.super.getPlatformStats.invalidate(),
    ])
  }

  const metrics = (metricsData as MetricData) || {}
  const stats = (statsData as PlatformStatsData) || {}
  const inquiries = (inquiriesData as InquiryItem[]) || []

  // Computed values
  const totalStudents = metrics.students || 0
  const totalCounselors = metrics.counselors || 0
  const totalAdmins = stats.admins || 0
  const totalUsers = stats.totalUsers || totalStudents + totalCounselors + (totalAdmins || 1)
  const totalUniversities = stats.universities || 0
  const totalInquiries = inquiries.length || 0

  const statusMap = useMemo(() => {
    const map: Record<string, number> = {}
    if (metrics.applicationsByStatus) {
      for (const item of metrics.applicationsByStatus) {
        map[item.status] = Number(item.count) || 0
      }
    }
    return map
  }, [metrics.applicationsByStatus])

  const totalApplications = useMemo(() => {
    return Object.values(statusMap).reduce((sum, c) => sum + c, 0)
  }, [statusMap])

  const acceptedCount = statusMap['ACCEPTED'] || 0
  const pendingDocsCount = statusMap['DOCUMENTS_REQUIRED'] || 0
  const underReviewCount = statusMap['UNDER_REVIEW'] || 0

  const recentActivity: ActivityItem[] = useMemo(() => {
    return metrics.recentActivity?.slice(0, 7) || []
  }, [metrics.recentActivity])

  const upcomingConsultations: ConsultationItem[] = useMemo(() => {
    return metrics.upcomingConsultations?.slice(0, 6) || []
  }, [metrics.upcomingConsultations])

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[65vh] flex-col items-center justify-center gap-3">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#E8A33D', borderRightColor: '#E8A33D' }}
        />
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Loading platform intelligence…
        </p>
      </div>
    )
  }

  // Primary 4 KPI highlights
  const primaryKpis = [
    {
      label: 'Total Platform Users',
      value: totalUsers,
      sub: `${totalStudents} students · ${totalCounselors} counselors · ${totalAdmins} admins`,
      icon: Users,
      color: '#C41E3A',
      trend: '+12%',
      trendLabel: 'vs last month',
      href: '/admin/students',
    },
    {
      label: 'Total Applications',
      value: totalApplications,
      sub: `${acceptedCount} accepted · ${underReviewCount + pendingDocsCount} in review`,
      icon: FileText,
      color: '#8B0E1A',
      trend: totalApplications > 0 ? '+8%' : '0%',
      trendLabel: 'active pipeline',
      href: '/admin/applications',
    },
    {
      label: 'Partner Universities',
      value: totalUniversities,
      sub: 'Institutions registered across global destinations',
      icon: Building2,
      color: '#E8A33D',
      trend: '+' + totalUniversities,
      trendLabel: 'active partners',
      href: '/admin/universities',
    },
    {
      label: 'Apply Now Leads',
      value: totalInquiries,
      sub: `${totalInquiries} high-intent student inquiries received`,
      icon: Zap,
      color: '#10B981',
      trend: totalInquiries > 0 ? 'Active' : '0',
      trendLabel: 'inbound funnel',
      href: '/admin/applications',
    },
  ]

  // Micro system specs
  const systemBadges = [
    { label: 'Platform Uptime', value: '99.98%', color: 'text-emerald-500', icon: Activity },
    { label: 'Active Sessions', value: `${upcomingConsultations.length}`, color: 'text-blue-500', icon: CalendarCheck },
    { label: 'Active Advisors', value: `${totalCounselors}`, color: 'text-amber-500', icon: UserCheck },
    { label: 'Catalog Status', value: 'Synchronized', color: 'text-purple-500', icon: BookOpen },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* ─── 1. HERO PLATFORM BANNER ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/[0.08] dark:bg-[#111319]">
        {/* Ambient subtle glow */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#C41E3A]/15 to-[#E8A33D]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg shadow-sm"
                style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #E8A33D 100%)' }}
              >
                <Shield size={14} className="text-white" />
              </div>
              <span className="rounded-full border border-[#E8A33D]/30 bg-[#E8A33D]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E8A33D]">
                {isSuperAdmin ? 'Super Admin Command Center' : 'Admin Operations'}
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Endow Global Portal</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontFamily: "'Space Grotesk',sans-serif" }}
            >
              {isSuperAdmin ? 'Platform Control Center' : 'Executive Overview'}
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Complete oversight of student applicants, admissions pipeline, partner universities, and
              operational workflows across all global branches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All Systems Operational
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching || isFetchingInquiries}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-95 disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.04]"
            >
              <RefreshCw size={13} className={isFetching || isFetchingInquiries ? 'animate-spin text-[#C41E3A]' : 'text-gray-400'} />
              <span>Refresh</span>
            </button>

            {/* Date Display */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300">
              <Clock size={13} className="text-gray-400" />
              <span>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts Bar inside Hero */}
        <div className="relative z-10 mt-6 border-t border-gray-100 pt-4 dark:border-white/[0.06]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <Sparkles size={13} className="text-[#E8A33D]" />
              <span>Quick Create Shortcuts:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/courses?action=new"
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/70 px-2.5 py-1 text-xs font-medium text-gray-700 transition-all hover:border-[#E8A33D]/50 hover:bg-amber-500/10 hover:text-amber-700 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:text-amber-400"
              >
                <Plus size={12} className="text-[#E8A33D]" />
                Course
              </Link>
              <Link
                href="/admin/universities?action=new"
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/70 px-2.5 py-1 text-xs font-medium text-gray-700 transition-all hover:border-[#E8A33D]/50 hover:bg-amber-500/10 hover:text-amber-700 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:text-amber-400"
              >
                <Plus size={12} className="text-[#E8A33D]" />
                University
              </Link>
              <Link
                href="/admin/scholarships?action=new"
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/70 px-2.5 py-1 text-xs font-medium text-gray-700 transition-all hover:border-[#E8A33D]/50 hover:bg-amber-500/10 hover:text-amber-700 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:text-amber-400"
              >
                <Plus size={12} className="text-[#E8A33D]" />
                Scholarship
              </Link>
              <Link
                href="/admin/students?action=new"
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/70 px-2.5 py-1 text-xs font-medium text-gray-700 transition-all hover:border-[#E8A33D]/50 hover:bg-amber-500/10 hover:text-amber-700 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:text-amber-400"
              >
                <Plus size={12} className="text-[#E8A33D]" />
                Student
              </Link>
              <Link
                href="/admin/notifications?action=new"
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/70 px-2.5 py-1 text-xs font-medium text-gray-700 transition-all hover:border-[#E8A33D]/50 hover:bg-amber-500/10 hover:text-amber-700 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:text-amber-400"
              >
                <Bell size={12} className="text-[#E8A33D]" />
                Broadcast Alert
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. PRIMARY EXECUTIVE KPI CARDS ─── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {primaryKpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease: EASE }}
            >
              <Link
                href={kpi.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/[0.08] dark:bg-[#18181b]"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${kpi.color}08, ${kpi.color}02)`,
                  }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105"
                    style={{ background: `${kpi.color}14` }}
                  >
                    <Icon size={20} style={{ color: kpi.color }} />
                  </div>
                  <span className="flex items-center gap-0.5 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700 transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:bg-white/[0.06] dark:text-gray-300 dark:group-hover:text-emerald-400">
                    <ArrowUpRight size={13} />
                    {kpi.trend}
                  </span>
                </div>

                <div className="relative z-10 mt-4">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {kpi.value.toLocaleString()}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                    {kpi.label}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                    {kpi.sub}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* ─── 3. ANALYTICS & PIPELINE FUNNEL GRID ─── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left: Modern Application Volume Graph (7 cols) */}
        <div className="xl:col-span-7">
          <ModernApplicationChart
            trendData={metrics.applicationTrend}
            totalApplications={totalApplications}
            totalInquiries={totalInquiries}
            onRefresh={handleRefresh}
            isRefreshing={isFetching || isFetchingInquiries}
          />
        </div>

        {/* Right: Application Pipeline & Funnel Breakdown (5 cols) */}
        <div className="xl:col-span-5">
          <ModernPipelineFunnel
            statusMap={statusMap}
            totalApplications={totalApplications}
          />
        </div>
      </div>

      {/* ─── 4. LOWER OPERATIONS & FEED GRID ─── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Target Destination Countries (4 cols) */}
        <div className="lg:col-span-4">
          <ModernTopCountries
            countries={metrics.topCountries}
            totalStudents={metrics.totalStudentsWithNationality || totalStudents}
          />
        </div>

        {/* Center: Live Applications Activity Feed (4 cols) */}
        <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b] lg:col-span-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <Activity size={15} />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                    Live Activity
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Latest student application events
                  </p>
                </div>
              </div>

              <Link
                href="/admin/activity"
                className="group flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <span>Logs</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-3 divide-y divide-gray-100 dark:divide-white/[0.06]">
              {recentActivity.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No recent activity recorded yet
                </div>
              ) : (
                recentActivity.map((app, i) => {
                  const statusColors: Record<string, { dot: string; text: string }> = {
                    ACCEPTED: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
                    REJECTED: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
                    SUBMITTED: { dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
                    UNDER_REVIEW: { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
                    DOCUMENTS_REQUIRED: { dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
                  }
                  const sc = statusColors[app.status || ''] || { dot: 'bg-gray-400', text: 'text-gray-500' }

                  return (
                    <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${sc.dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {app.student?.user?.name || 'Applicant'}{' '}
                          <span className={`font-normal text-[11px] ${sc.text}`}>
                            · {app.status?.toLowerCase().replace(/_/g, ' ')}
                          </span>
                        </p>
                        <p className="truncate text-[10px] text-gray-400 dark:text-gray-500">
                          {app.course?.university?.name || app.course?.name || 'Partner Program'}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-gray-400 font-mono">
                        {app.updatedAt
                          ? formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })
                          : ''}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <Link
            href="/admin/applications"
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-gray-50 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:bg-white/[0.08]"
          >
            <span>View All Applications</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Right: Tabbed Consultations & Student Inquiries (4 cols) */}
        <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b] lg:col-span-4">
          <div>
            {/* Header with Switcher Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 p-1 dark:bg-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setActiveTab('consultations')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    activeTab === 'consultations'
                      ? 'bg-white text-gray-900 shadow-xs dark:bg-[#18181b] dark:text-white'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Sessions ({upcomingConsultations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    activeTab === 'inquiries'
                      ? 'bg-white text-gray-900 shadow-xs dark:bg-[#18181b] dark:text-white'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Inquiries ({totalInquiries})
                </button>
              </div>

              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Schedule
              </span>
            </div>

            {/* Tab 1: Upcoming Consultations */}
            {activeTab === 'consultations' && (
              <div className="mt-3 divide-y divide-gray-100 dark:divide-white/[0.06]">
                {upcomingConsultations.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No upcoming consultations scheduled
                  </div>
                ) : (
                  upcomingConsultations.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
                          {(item.student?.user?.name || 'S')
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                            {item.student?.user?.name || 'Student'}
                          </p>
                          <p className="truncate text-[10px] text-gray-400">
                            with {item.counselor?.user?.name || 'Advisor'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block text-xs font-bold text-[#E8A33D]">
                          {item.scheduledAt
                            ? new Date(item.scheduledAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                        <span className="block text-[10px] text-gray-400">
                          {item.scheduledAt
                            ? new Date(item.scheduledAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Recent Apply Now Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="mt-3 divide-y divide-gray-100 dark:divide-white/[0.06]">
                {inquiries.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No inquiries submitted yet
                  </div>
                ) : (
                  inquiries.slice(0, 6).map((inq, i) => (
                    <div key={inq.id || i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                          {inq.givenName} {inq.surname}
                        </p>
                        <p className="truncate text-[10px] text-gray-400">
                          Target: {inq.targetCountry || inq.targetUniversity || 'General Intake'}
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] text-gray-400 font-mono">
                        {inq.submittedAt
                          ? new Date(inq.submittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href="/admin/counselors"
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-gray-50 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:bg-white/[0.08]"
          >
            <span>Manage Consultations</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
