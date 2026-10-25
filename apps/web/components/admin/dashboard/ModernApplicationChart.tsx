'use client'

import {
  Activity,
  BarChart2,
  Calendar,
  CheckCircle2,
  Flame,
  LineChart as LineChartIcon,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface TrendItem {
  date: string
  day?: string
  fullDate?: string
  applications?: number
  inquiries?: number
  count: number
}

interface Props {
  trendData?: TrendItem[]
  totalApplications?: number
  totalInquiries?: number
  onRefresh?: () => void
  isRefreshing?: boolean
}

type MetricFilter = 'all' | 'inquiries' | 'applications'
type ChartType = 'bar' | 'area'

export function ModernApplicationChart({
  trendData = [],
  totalApplications = 0,
  totalInquiries = 0,
  onRefresh,
  isRefreshing = false,
}: Props) {
  const [mounted, setMounted] = useState(false)
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [metricFilter, setMetricFilter] = useState<MetricFilter>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Today in UTC YYYY-MM-DD
  const todayKey = useMemo(() => {
    const now = new Date()
    const yyyy = now.getUTCFullYear()
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(now.getUTCDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  // Process data for chart & cards
  const chartData = useMemo(() => {
    if (!trendData || trendData.length === 0) {
      // Fallback 7 days
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      return days.map((day) => ({
        date: day,
        day,
        fullDate: day,
        applications: 0,
        inquiries: 0,
        total: 0,
        displayVal: 0,
        isToday: false,
      }))
    }

    return trendData.map((item) => {
      const isToday = item.date === todayKey
      const appVal = Number(item.applications) || 0
      const inqVal = Number(item.inquiries) || 0
      const totalVal = Number(item.count) || appVal + inqVal

      let displayVal = totalVal
      if (metricFilter === 'inquiries') displayVal = inqVal
      if (metricFilter === 'applications') displayVal = appVal

      return {
        date: item.date,
        day: item.day || item.date,
        fullDate: item.fullDate || item.date,
        applications: appVal,
        inquiries: inqVal,
        total: totalVal,
        displayVal,
        isToday,
      }
    })
  }, [trendData, metricFilter, todayKey])

  // Summary analytics
  const { weekTotal, todayCount, peakDay } = useMemo(() => {
    let weekTotal = 0
    let todayCount = 0
    let peakDay = { day: 'None', val: 0, fullDate: '' }

    for (const d of chartData) {
      weekTotal += d.displayVal
      if (d.isToday) {
        todayCount = d.displayVal
      }
      if (d.displayVal > peakDay.val) {
        peakDay = { day: d.day, val: d.displayVal, fullDate: d.fullDate }
      }
    }

    return { weekTotal, todayCount, peakDay }
  }, [chartData])

  const maxVal = Math.max(...chartData.map((d) => d.displayVal), 4)

  // Combined totals for filter buttons
  const sumInquiries = useMemo(
    () => trendData.reduce((acc, curr) => acc + (Number(curr.inquiries) || 0), 0),
    [trendData]
  )
  const sumApplications = useMemo(
    () => trendData.reduce((acc, curr) => acc + (Number(curr.applications) || 0), 0),
    [trendData]
  )
  const sumTotal = sumInquiries + sumApplications

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b]">
      {/* ─── Header & Controls ─── */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                <BarChart2 size={15} />
              </div>
              <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                Application Activity Trend
              </h2>
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  title="Refresh live activity metrics"
                  className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
                >
                  <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Daily submission velocity over the past 7 days across admissions & inquiries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Bar vs Area */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50/80 p-0.5 dark:border-white/[0.08] dark:bg-[#121214]">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
                  chartType === 'bar'
                    ? 'bg-white text-gray-900 shadow-xs dark:bg-[#27272a] dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <BarChart2 size={13} />
                <span>Bar</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
                  chartType === 'area'
                    ? 'bg-white text-gray-900 shadow-xs dark:bg-[#27272a] dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <LineChartIcon size={13} />
                <span>Trend</span>
              </button>
            </div>

            {/* Total 7-day Badge */}
            <div className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1 text-xs font-semibold text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-400">
              <TrendingUp size={13} />
              <span>{weekTotal} This Week</span>
            </div>
          </div>
        </div>

        {/* ─── Metric Filter Pills ─── */}
        <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3 pt-1 dark:border-white/[0.06]">
          <span className="text-[11px] font-medium text-gray-400 mr-1">Filter:</span>
          <button
            type="button"
            onClick={() => setMetricFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              metricFilter === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.1]'
            }`}
          >
            All Submissions ({sumTotal})
          </button>
          <button
            type="button"
            onClick={() => setMetricFilter('inquiries')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              metricFilter === 'inquiries'
                ? 'bg-[#E8A33D] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.1]'
            }`}
          >
            Apply Now ({sumInquiries})
          </button>
          <button
            type="button"
            onClick={() => setMetricFilter('applications')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              metricFilter === 'applications'
                ? 'bg-[#C41E3A] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.1]'
            }`}
          >
            Course Apps ({sumApplications})
          </button>
        </div>
      </div>

      {/* ─── Chart Canvas ─── */}
      <div className="mt-3 h-[210px] w-full">
        {!mounted ? (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={chartData}
                margin={{ top: 22, right: 12, left: -22, bottom: 4 }}
                barCategoryGap="22%"
              >
                <defs>
                  {/* Active Bar Gradient (Endow Crimson) */}
                  <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C41E3A" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#8B0E1A" stopOpacity={0.8} />
                  </linearGradient>

                  {/* Inquiry Bar Gradient (Gold / Amber) */}
                  <linearGradient id="barGradientInquiry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.85} />
                  </linearGradient>

                  {/* Empty Day Gradient */}
                  <linearGradient id="barGradientZero" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e5e7eb" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#f3f4f6" stopOpacity={0.4} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-white/[0.05]"
                />

                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={({ x, y, payload }) => {
                    const item = chartData[payload.index]
                    const isToday = item?.isToday
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={12}
                          textAnchor="middle"
                          fill={isToday ? '#C41E3A' : '#9ca3af'}
                          fontSize={11}
                          fontWeight={isToday ? 700 : 500}
                        >
                          {payload.value}
                        </text>
                        {isToday && (
                          <circle cx={0} cy={22} r={2.5} fill="#C41E3A" />
                        )}
                      </g>
                    )
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, maxVal + 1]}
                  allowDecimals={false}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(196, 30, 58, 0.04)', radius: 8 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="min-w-[190px] rounded-xl border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-white/[0.1] dark:bg-[#18181b]/95">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                              {data.day}, {data.fullDate}
                            </span>
                            {data.isToday && (
                              <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                TODAY
                              </span>
                            )}
                          </div>

                          <div className="mt-2.5 space-y-1.5 border-t border-gray-100 pt-2 text-xs dark:border-white/[0.06]">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <span className="inline-block h-2 w-2 rounded-full bg-[#C41E3A]" />
                                Total Submissions
                              </span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {data.total}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                              <span>📝 Apply Now Inquiries</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {data.inquiries}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                              <span>🎓 Course Applications</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {data.applications}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />

                <Bar
                  dataKey="displayVal"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                  animationDuration={600}
                >
                  <LabelList
                    dataKey="displayVal"
                    position="top"
                    formatter={(val: any) => (Number(val) > 0 ? String(val) : '')}
                    style={{ fill: '#C41E3A', fontSize: 11, fontWeight: 700 }}
                  />
                  {chartData.map((entry, index) => {
                    const hasData = entry.displayVal > 0
                    let fill = 'url(#barGradientActive)'
                    if (!hasData) fill = 'url(#barGradientZero)'
                    else if (metricFilter === 'inquiries') fill = 'url(#barGradientInquiry)'
                    return <Cell key={`cell-${index}`} fill={fill} />
                  })}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 16, right: 12, left: -20, bottom: 4 }}
              >
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
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, maxVal + 1]}
                  allowDecimals={false}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-xl border border-gray-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md dark:border-white/[0.1] dark:bg-[#18181b]/95">
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                            {label}, {data.fullDate} {data.isToday ? '(Today)' : ''}
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
                            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#C41E3A]" />
                            {payload[0].value}{' '}
                            {payload[0].value === 1 ? 'Submission' : 'Submissions'}
                          </p>
                          <p className="mt-1 text-[10px] text-gray-400">
                            {data.inquiries} inquiries · {data.applications} course apps
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="displayVal"
                  stroke="#C41E3A"
                  strokeWidth={2.5}
                  fill="url(#gradientApplications)"
                  dot={{ r: 3.5, strokeWidth: 2, fill: '#ffffff', stroke: '#C41E3A' }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: '#C41E3A', stroke: '#ffffff' }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* ─── Bottom Metrics Mini Strip ─── */}
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 p-2 dark:bg-white/[0.03]">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 size={13} />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">Today</span>
            <span className="truncate text-xs font-bold text-gray-900 dark:text-white">
              {todayCount} {todayCount === 1 ? 'submission' : 'submissions'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 p-2 dark:bg-white/[0.03]">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Flame size={13} />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">Peak Day</span>
            <span className="truncate text-xs font-bold text-gray-900 dark:text-white">
              {peakDay.val > 0 ? `${peakDay.day} (${peakDay.val})` : '0'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 p-2 dark:bg-white/[0.03]">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
            <Activity size={13} />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">Velocity</span>
            <span className="truncate text-xs font-bold text-gray-900 dark:text-white">
              {(weekTotal / 7).toFixed(1)} / day
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
