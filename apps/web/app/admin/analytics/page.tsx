'use client'

import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { format, formatDistanceToNow } from 'date-fns'
import { Briefcase, Calendar, FileCheck, LucideIcon, TrendingUp, Users } from 'lucide-react'

interface ApplicationStatusMetric {
  count?: number
}

interface ApplicationTrendMetric {
  date: string | Date
  count: number
}

interface CountryMetric {
  country: string
  count: number
}

interface ActivityItem {
  id: string
  status?: string | null
  updatedAt?: string | Date | null
  student?: {
    user?: {
      name?: string | null
    } | null
  } | null
  course?: {
    name?: string | null
  } | null
}

interface MetricsData {
  students?: number
  counselors?: number
  applicationsByStatus?: ApplicationStatusMetric[]
  applicationTrend?: ApplicationTrendMetric[]
  topCountries?: CountryMetric[]
  recentActivity?: ActivityItem[]
}

interface CardItem {
  title: string
  value: number
  icon: LucideIcon
  color: string
}

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = trpc.admin.dashboard.getMetrics.useQuery()
  const metrics = (data as MetricsData) || {}

  const totalApplications = (metrics.applicationsByStatus || []).reduce(
    (sum, a) => sum + (a.count || 0),
    0
  )
  const thisWeekApplications = (metrics.applicationTrend || []).reduce(
    (sum, a) => sum + (a.count || 0),
    0
  )

  const cards: CardItem[] = [
    {
      title: 'Total Students',
      value: metrics.students ?? 0,
      icon: Users,
      color: 'bg-red-500/10 text-[#c41e3a]',
    },
    {
      title: 'Total Counselors',
      value: metrics.counselors ?? 0,
      icon: Briefcase,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Applications',
      value: totalApplications,
      icon: FileCheck,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Applications This Week',
      value: thisWeekApplications,
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
  ]

  const maxCountry = Math.max(1, ...(metrics.topCountries || []).map((c) => c.count))

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track system growth and platform insights." />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: '#c41e3a', borderTopColor: 'transparent' }}
          />
        </div>
      ) : isError ? (
        <div className="flex justify-center py-16">
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
          >
            Failed to load analytics — retry
          </button>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b]"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                    <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                      {Number(item.value).toLocaleString()}
                    </h2>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* TOP COUNTRIES */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Nationalities
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Students by nationality
              </p>
              <div className="mt-6 space-y-4">
                {(metrics.topCountries || []).length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">No nationality data yet</p>
                ) : (
                  (metrics.topCountries || []).map((c) => (
                    <div key={c.country}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {c.country}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">{c.count}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-[#c41e3a]"
                          style={{ width: `${(c.count / maxCountry) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* APPLICATION TREND */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Application Trend
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Applications created in the last 7 days
              </p>
              <div className="mt-6">
                {(metrics.applicationTrend || []).length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">
                    No applications this week yet
                  </p>
                ) : (
                  <div className="flex h-48 items-end gap-2">
                    {(metrics.applicationTrend || []).map((a) => {
                      const trendList = metrics.applicationTrend || []
                      const max = Math.max(1, ...trendList.map((x) => x.count))
                      return (
                        <div
                          key={String(a.date)}
                          className="flex flex-1 flex-col items-center gap-1.5"
                        >
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                            {a.count}
                          </span>
                          <div
                            className="w-full rounded-t-lg bg-[#c41e3a]"
                            style={{ height: `${(a.count / max) * 100}%` }}
                          />
                          <span className="text-[10px] text-gray-400">
                            {format(new Date(a.date), 'MMM d')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Latest application updates
            </p>
            <div className="mt-6 divide-y divide-gray-100 dark:divide-white/[0.06]">
              {(metrics.recentActivity || []).length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No recent activity</p>
              ) : (
                (metrics.recentActivity || []).map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                        {a.student?.user?.name?.charAt(0) || 'S'}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                          {a.student?.user?.name || 'Student'}
                          <span className="text-gray-400"> → </span>
                          {a.course?.name || 'Application'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {a.updatedAt
                            ? formatDistanceToNow(new Date(a.updatedAt), { addSuffix: true })
                            : ''}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {a.status || '—'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Calendar size={13} /> Live platform data
          </div>
        </>
      )}
    </div>
  )
}
