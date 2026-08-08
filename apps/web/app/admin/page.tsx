'use client'

import { CalendarDays, Clock3, FileText, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import AnalyticsChart from '@/components/admin/dashboard/AnalyticsChart'
import TopCountries from '@/components/admin/dashboard/TopCountries'
import UpcomingConsultations from '@/components/admin/dashboard/UpcomingConsultations'
import SuperAdminDashboard from '@/components/admin/dashboard/SuperAdminDashboard'
import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { UserRole } from '@endow/types'

export default function AdminPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role as UserRole
  const { data: _metrics, isLoading } = trpc.admin.dashboard.getMetrics.useQuery()
  const metrics = _metrics as any

  if (userRole === UserRole.SUPER_ADMIN) {
    return <SuperAdminDashboard />
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }}
          />
          <p className="text-[12px]" style={{ color: '#6b7280' }}>Loading dashboard...</p>
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
  const pendingDocs = pipelineStatusMap['DOCUMENTS_REQUIRED'] || 0

  const stats = [
    {
      title: 'Total Students',
      value: metrics?.students?.toString() || '0',
      growth: '+0%',
      icon: Users,
    },
    {
      title: 'Applications',
      value: totalApplications.toString(),
      growth: '+0%',
      icon: FileText,
    },
    {
      title: 'Pending Docs',
      value: pendingDocs.toString(),
      growth: '+0%',
      icon: Clock3,
    },
    {
      title: 'Counselors',
      value: metrics?.counselors?.toString() || '0',
      growth: '+0%',
      icon: CalendarDays,
    },
  ]

  const activities =
    metrics?.recentActivity?.map((app: any) => ({
      title: `Application ${app.status.toLowerCase().replace('_', ' ')}: ${app.student?.user?.name}`,
      time: formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true }),
    })) || []

  return (
    <div className="mx-auto max-w-[1380px] space-y-3">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
        <div>
          <h1
            className="text-[20px] font-bold tracking-tight"
            style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Admin Dashboard
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>
            Overview of platform operations and activity
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        {/* Left */}
        <div className="space-y-3 xl:col-span-9">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item: any) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-xl border p-4 transition-all hover:-translate-y-0.5"
                  style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: 'rgba(234, 179, 8, 0.1)' }}
                    >
                      <Icon size={16} style={{ color: '#E8A33D' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium" style={{ color: '#6b7280' }}>
                        {item.title}
                      </p>
                      <h2
                        className="text-[20px] font-bold leading-tight"
                        style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {item.value}
                      </h2>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-12">
            <div className="flex xl:col-span-7">
              <AnalyticsChart />
            </div>
            <div className="flex xl:col-span-5">
              <TopCountries />
            </div>
          </div>

          {/* Pipeline */}
          <div
            className="rounded-xl border p-4"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <h2
              className="text-[15px] font-semibold"
              style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Application Pipeline
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-5">
              {[
                {
                  label: 'New Lead',
                  value: (pipelineStatusMap['DRAFT'] || 0) + (pipelineStatusMap['IN_PROGRESS'] || 0),
                  bg: 'rgba(234, 179, 8, 0.08)',
                  text: '#E8A33D',
                },
                {
                  label: 'Submitted',
                  value: pipelineStatusMap['SUBMITTED'] || 0,
                  bg: 'rgba(96, 165, 250, 0.06)',
                  text: '#60a5fa',
                },
                {
                  label: 'Under Review',
                  value: pipelineStatusMap['UNDER_REVIEW'] || 0,
                  bg: 'rgba(250, 204, 21, 0.06)',
                  text: '#facc15',
                },
                {
                  label: 'Docs Required',
                  value: pipelineStatusMap['DOCUMENTS_REQUIRED'] || 0,
                  bg: 'rgba(167, 139, 250, 0.06)',
                  text: '#a78bfa',
                },
                {
                  label: 'Completed',
                  value: pipelineStatusMap['ACCEPTED'] || 0,
                  bg: 'rgba(79, 209, 165, 0.06)',
                  text: '#4FD1A5',
                },
              ].map((stage) => (
                <div
                  key={stage.label}
                  className="rounded-lg px-3 py-2.5"
                  style={{ background: stage.bg }}
                >
                  <p className="text-[11px] font-medium" style={{ color: stage.text }}>
                    {stage.label}
                  </p>
                  <h3
                    className="mt-1 text-[18px] font-bold"
                    style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {stage.value}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-3 xl:col-span-3">
          <UpcomingConsultations />

          <div
            className="rounded-xl border p-4"
            style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <h2
              className="text-[13px] font-semibold"
              style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Recent Applications
            </h2>

            <div className="mt-3 space-y-3">
              {activities.length === 0 && (
                <p className="text-[12px]" style={{ color: '#6b7280' }}>No recent activity</p>
              )}
              {activities.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: '#E8A33D' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium" style={{ color: '#111827' }}>
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px]" style={{ color: '#6b7280' }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
