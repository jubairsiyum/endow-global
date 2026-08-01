'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { trpc } from '@/lib/trpc-client'

export default function AnalyticsChart() {
  const { data: metrics } = trpc.admin.dashboard.getMetrics.useQuery()

  const trend = (metrics?.applicationTrend || []).map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    applications: Number(item.count),
  }))

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            Application Overview
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Last 7 days application trend
          </p>
        </div>
      </div>

      <div className="mt-3 h-[190px]">
        {trend.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No application data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#AD0819" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#AD0819" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '18px',
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#E11D2E"
                strokeWidth={2}
                fill="url(#colorApplications)"
                dot={{ r: 3, strokeWidth: 1.5, fill: '#fff', stroke: '#E11D2E' }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
