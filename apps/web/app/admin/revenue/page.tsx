'use client'

import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { format } from 'date-fns'
import { ArrowRight, Calendar, DollarSign, Landmark, TrendingUp } from 'lucide-react'

interface TransactionItem {
  id: string
  studentName?: string | null
  counselorName?: string | null
  createdAt?: string | Date | null
  status?: string | null
  amountPaid?: number | string | null
}

interface RevenueOverviewData {
  totalRevenue?: number
  thisMonthRevenue?: number
  paidSessions?: number
  thisMonthSessions?: number
  recentTransactions?: TransactionItem[]
}

export default function RevenuePage() {
  const { data, isLoading, isError, refetch } = trpc.admin.revenue.getOverview.useQuery()
  const revenue = (data as RevenueOverviewData) || {}

  const stats = [
    { label: 'Total Revenue', value: revenue.totalRevenue ?? 0, color: 'emerald' },
    { label: 'This Month', value: revenue.thisMonthRevenue ?? 0, color: 'blue' },
    { label: 'Paid Sessions', value: revenue.paidSessions ?? 0, color: 'amber' },
  ]

  const palette: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40',
    blue: 'text-blue-500 bg-blue-500/10 dark:bg-blue-950/40',
    amber: 'text-amber-500 bg-amber-500/10 dark:bg-amber-950/40',
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHeader
        title="Revenue"
        description="Track platform revenue from paid consultations and applications."
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: '#c41e3a', borderTopColor: 'transparent' }}
          />
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/70 p-10 text-center dark:border-red-900/40 dark:bg-red-950/30">
          <p className="text-gray-600 dark:text-gray-300">Failed to load revenue data.</p>
          <button
            onClick={() => refetch()}
            style={{ background: '#c41e3a' }}
            className="mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${palette[stat.color]}`}
                  >
                    <DollarSign size={18} />
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                  ${Number(stat.value).toLocaleString()}
                </h2>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/40">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Transactions
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Paid sessions ({revenue.thisMonthSessions ?? 0} this month)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              {(revenue.recentTransactions || []).length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Landmark size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">No paid transactions yet</p>
                </div>
              ) : (
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-white/[0.06]">
                      <th className="pb-3 pr-4 font-medium">Student</th>
                      <th className="pb-3 pr-4 font-medium">Counselor</th>
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.06]">
                    {(revenue.recentTransactions || []).map((t) => (
                      <tr key={t.id}>
                        <td className="py-3.5 pr-4 font-medium text-gray-800 dark:text-gray-200">
                          {t.studentName || 'Unknown'}
                        </td>
                        <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-400">
                          {t.counselorName || 'Unassigned'}
                        </td>
                        <td className="py-3.5 pr-4 text-gray-500 dark:text-gray-400">
                          {t.createdAt
                            ? format(new Date(t.createdAt), 'MMM d, yyyy · h:mm a')
                            : '—'}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {t.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-bold text-gray-900 dark:text-white">
                          ${Number(t.amountPaid || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Calendar size={13} /> Revenue is aggregated from paid sessions <ArrowRight size={12} />
          </div>
        </>
      )}
    </div>
  )
}
