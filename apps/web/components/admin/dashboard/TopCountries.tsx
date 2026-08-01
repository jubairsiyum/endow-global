'use client'

import { trpc } from '@/lib/trpc-client'

const COLORS = ['#ef4444', '#8b5cf6', '#22c55e', '#eab308', '#d1d5db']

export default function TopCountries() {
  const { data: metrics } = trpc.admin.dashboard.getMetrics.useQuery()

  const totalStudents = metrics?.totalStudentsWithNationality || 0
  const countries = (metrics?.topCountries || []).map((item: any, i: number) => ({
    name: item.country || 'Unknown',
    count: Number(item.count),
    value: totalStudents > 0 ? `${Math.round((Number(item.count) / totalStudents) * 100)}%` : '0%',
    color: COLORS[i % COLORS.length],
  }))

  // Calculate SVG circle segments
  const circumference = 2 * Math.PI * 72 // radius 72
  const total = countries.reduce((sum, c) => sum + c.count, 0) || 1
  let cumulativePercent = 0

  const segments = countries.map((c) => {
    const percent = c.count / total
    const dashArray = `${percent * circumference} ${circumference}`
    const dashOffset = -cumulativePercent * circumference
    cumulativePercent += percent
    return { ...c, dashArray, dashOffset }
  })

  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            Top Countries
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Student application distribution
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-start gap-2 pt-2">
        {/* DONUT */}
        <div className="relative flex shrink-0 items-center justify-center">
          {totalStudents > 0 ? (
            <svg width="190" height="190" viewBox="0 0 210 210" className="-rotate-90">
              <circle cx="105" cy="105" r="58" fill="none" stroke="#f3f4f6" strokeWidth="14" />
              {segments.map((seg, i) => (
                <circle
                  key={i}
                  cx="105"
                  cy="105"
                  r="72"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
          ) : (
            <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full bg-gray-50 dark:bg-[#222530]">
              <span className="text-xs text-gray-400">No data</span>
            </div>
          )}

          <div className="absolute flex flex-col items-center">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {totalStudents.toLocaleString()}
            </h3>
            <p className="mt-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
              Students
            </p>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex-1 space-y-2">
          {countries.length === 0 && (
            <p className="text-xs text-gray-400">No country data yet</p>
          )}
          {countries.map((country) => (
            <div key={country.name} className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: country.color }}
                />
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {country.name}
                </span>
              </div>
              <span className="ml-1 shrink-0 text-[11px] font-semibold text-gray-900 dark:text-white">
                {country.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
