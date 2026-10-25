'use client'

import { BarChart2, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface TrendItem {
  date: string
  count: number
}

interface Props {
  trendData?: TrendItem[]
  totalApplications?: number
}

export function ModernApplicationChart({ trendData = [], totalApplications = 0 }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prepare 7-day continuous data
  const chartData = (() => {
    if (trendData && trendData.length > 0) {
      return trendData.map((item) => {
        let label = item.date
        try {
          const d = new Date(item.date)
          if (!isNaN(d.getTime())) {
            label = d.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'numeric',
              day: 'numeric',
            })
          }
        } catch {
          // fallback to raw date
        }
        return {
          date: label,
          applications: Number(item.count) || 0,
        }
      })
    }

    // Default 7-day placeholder curve when there are no records yet
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((day) => ({
      date: day,
      applications: 0,
    }))
  })()

  const maxVal = Math.max(...chartData.map((d) => d.applications), 5)

  return (
    <div className="shadow-xs flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <BarChart2 size={15} />
            </div>
            <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Application Activity Trend
            </h2>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Real-time daily submission velocity over the past 7 days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#121214] dark:text-gray-300">
            <TrendingUp size={13} className="text-emerald-500" />
            <span>{totalApplications} Submissions</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-2 h-[220px] w-full">
        {!mounted ? (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C41E3A" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#E8A33D" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#C41E3A" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-gray-100 dark:text-white/[0.05]"
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, maxVal + 2]}
                allowDecimals={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-gray-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md dark:border-white/[0.1] dark:bg-[#18181b]/95">
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
                          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#C41E3A]" />
                          {payload[0].value}{' '}
                          {payload[0].value === 1 ? 'Application' : 'Applications'}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />

              <Area
                type="monotone"
                dataKey="applications"
                stroke="#C41E3A"
                strokeWidth={2.5}
                fill="url(#gradientApplications)"
                dot={{ r: 3.5, strokeWidth: 2, fill: '#ffffff', stroke: '#C41E3A' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: '#C41E3A', stroke: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
