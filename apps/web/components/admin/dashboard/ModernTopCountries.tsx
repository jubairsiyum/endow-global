'use client'

import { Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CountryItem {
  country?: string
  name?: string
  count?: number | string
}

interface Props {
  countries?: CountryItem[]
  totalStudents?: number
}

const PALETTE = ['#C41E3A', '#E8A33D', '#3B82F6', '#10B981', '#8B5CF6']

export function ModernTopCountries({ countries = [], totalStudents = 0 }: Props) {
  const normalized = countries.slice(0, 5).map((c, i) => {
    const name = c.country || c.name || 'International'
    const count = Number(c.count) || 0
    const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
    return {
      name,
      count,
      pct,
      color: PALETTE[i % PALETTE.length],
    }
  })

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Globe size={15} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Target Destinations
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Student study preferences
            </p>
          </div>
        </div>

        <Link
          href="/admin/countries"
          className="group flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <span>All Countries</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Country List */}
      <div className="my-2 space-y-3">
        {normalized.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
            <Globe size={24} className="opacity-40" />
            <p className="mt-2 text-xs">No destination preference data yet</p>
          </div>
        ) : (
          normalized.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.count}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">({item.pct}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(item.pct, 6)}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Pill */}
      <div className="mt-2 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-white/[0.03] dark:text-gray-400">
        <span>Total Profiled Students</span>
        <span className="font-bold text-gray-900 dark:text-white">
          {totalStudents.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

