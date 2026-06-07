'use client'

import { CalendarDays, Clock3, FileText, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import AnalyticsChart from '@/components/admin/dashboard/AnalyticsChart'
import TopCountries from '@/components/admin/dashboard/TopCountries'
import UpcomingConsultations from '@/components/admin/dashboard/UpcomingConsultations'
import { trpc } from '@/lib/trpc-client'

export default function AdminPage() {
  const { data: metrics, isLoading } = trpc.admin.dashboard.getMetrics.useQuery()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  // Calculate some derived stats
  const pipelineStatusMap =
    metrics?.applicationsByStatus?.reduce(
      (acc, curr) => {
        acc[curr.status] = curr.count
        return acc
      },
      {} as Record<string, number>
    ) || {}

  const totalApplications =
    metrics?.applicationsByStatus?.reduce((sum, curr) => sum + curr.count, 0) || 0
  const pendingDocs = pipelineStatusMap['DOCUMENTS_REQUIRED'] || 0

  const stats = [
    {
      title: 'Total Students',
      value: metrics?.students?.toString() || '0',
      growth: '+0%', // Hardcoded for now
      icon: Users,
    },
    {
      title: 'Applications',
      value: totalApplications.toString(),
      growth: '+0%', // Hardcoded for now
      icon: FileText,
    },
    {
      title: 'Pending Docs',
      value: pendingDocs.toString(),
      growth: '+0%', // Hardcoded for now
      icon: Clock3,
    },
    {
      title: 'Counselors',
      value: metrics?.counselors?.toString() || '0',
      growth: '+0%', // Hardcoded for now
      icon: CalendarDays,
    },
  ]

  const activities =
    metrics?.recentActivity?.map((app) => ({
      title: `Application ${app.status.toLowerCase().replace('_', ' ')}: ${app.student?.user?.name}`,
      time: formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true }),
    })) || []

  return (
    <div className="mx-auto max-w-[1380px] space-y-3">
      {/* HERO */}
      <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back, Super Admin! 👋
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Here's what's happening with your applications today.
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        {/* LEFT CONTENT */}
        <div className="space-y-3 xl:col-span-9">
          {/* STATS */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-50 to-red-100 text-primary shadow-inner dark:bg-[#2a1114]">
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {item.title}
                      </p>

                      <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                        {item.value}
                      </h2>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 items-stretch gap-2 xl:grid-cols-12">
            {/* CHART */}
            <div className="flex xl:col-span-7">
              <AnalyticsChart />
            </div>

            {/* COUNTRIES */}
            <div className="flex xl:col-span-5">
              <TopCountries />
            </div>
          </div>

          {/* PIPELINE */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Application Pipeline
            </h2>

            <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-5">
              <div className="rounded-lg bg-red-50 px-3 py-2.5 dark:bg-[#2a1114]">
                <p className="text-xs font-medium text-red-600">New Lead</p>

                <h3 className="mt-1 text-lg font-bold text-red-700 dark:text-red-400">
                  {(pipelineStatusMap['DRAFT'] || 0) + (pipelineStatusMap['IN_PROGRESS'] || 0)}
                </h3>
              </div>

              <div className="rounded-lg bg-blue-50 px-3 py-2.5 dark:bg-[#111b2a]">
                <p className="text-xs font-medium text-blue-600">Submitted</p>

                <h3 className="mt-1 text-lg font-bold text-blue-700 dark:text-blue-400">
                  {pipelineStatusMap['SUBMITTED'] || 0}
                </h3>
              </div>

              <div className="rounded-lg bg-yellow-50 px-3 py-2.5 dark:bg-[#2a2311]">
                <p className="text-xs font-medium text-yellow-600">Under Review</p>

                <h3 className="mt-1 text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  {pipelineStatusMap['UNDER_REVIEW'] || 0}
                </h3>
              </div>

              <div className="rounded-lg bg-purple-50 px-3 py-2.5 dark:bg-[#21112a]">
                <p className="text-xs font-medium text-purple-600">Docs Required</p>

                <h3 className="mt-1 text-lg font-bold text-purple-700 dark:text-purple-400">
                  {pipelineStatusMap['DOCUMENTS_REQUIRED'] || 0}
                </h3>
              </div>

              <div className="rounded-lg bg-green-50 px-3 py-2.5 dark:bg-[#112a1a]">
                <p className="text-xs font-medium text-green-600">Completed</p>

                <h3 className="mt-1 text-lg font-bold text-green-700 dark:text-green-400">
                  {pipelineStatusMap['ACCEPTED'] || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-3 xl:col-span-3">
          <UpcomingConsultations />

          {/* ACTIVITIES */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h2>
            </div>

            <div className="mt-3 space-y-2">
              {activities.length === 0 && (
                <p className="text-xs text-gray-500">No recent activity</p>
              )}
              {activities.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
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
