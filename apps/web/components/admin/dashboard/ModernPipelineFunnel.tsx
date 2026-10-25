'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react'
import Link from 'next/link'

interface Props {
  statusMap: Record<string, number>
  totalApplications: number
}

const STAGES = [
  {
    key: 'SUBMITTED',
    label: 'Submitted',
    color: '#3b82f6',
    bg: 'bg-blue-500',
    barColor: 'from-blue-500 to-blue-600',
  },
  {
    key: 'UNDER_REVIEW',
    label: 'Under Review',
    color: '#f59e0b',
    bg: 'bg-amber-500',
    barColor: 'from-amber-500 to-amber-600',
  },
  {
    key: 'DOCUMENTS_REQUIRED',
    label: 'Docs Pending',
    color: '#8b5cf6',
    bg: 'bg-purple-500',
    barColor: 'from-purple-500 to-purple-600',
  },
  {
    key: 'ACCEPTED',
    label: 'Accepted',
    color: '#10b981',
    bg: 'bg-emerald-500',
    barColor: 'from-emerald-500 to-emerald-600',
  },
  {
    key: 'REJECTED',
    label: 'Rejected',
    color: '#ef4444',
    bg: 'bg-red-500',
    barColor: 'from-red-500 to-red-600',
  },
]

export function ModernPipelineFunnel({ statusMap, totalApplications }: Props) {
  const acceptedCount = statusMap['ACCEPTED'] || 0
  const acceptanceRate =
    totalApplications > 0 ? Math.round((acceptedCount / totalApplications) * 100) : 0

  return (
    <div className="shadow-xs flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Layers size={15} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Application Funnel
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Pipeline distribution & review stages
            </p>
          </div>
        </div>

        <Link
          href="/admin/applications"
          className="group flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <span>All Apps</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Funnel Progress List */}
      <div className="my-2 space-y-3">
        {STAGES.map((stage) => {
          const count = statusMap[stage.key] || 0
          const pct = totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0

          return (
            <div key={stage.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                  <span className={`h-2 w-2 rounded-full ${stage.bg}`} />
                  <span>{stage.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">{count}</span>
                  <span className="text-[10px] text-gray-400">({pct}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${stage.barColor}`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Summary Pill */}
      <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={14} />
          <span>Acceptance Rate</span>
        </div>
        <span className="font-bold text-emerald-700 dark:text-emerald-400">{acceptanceRate}%</span>
      </div>
    </div>
  )
}
