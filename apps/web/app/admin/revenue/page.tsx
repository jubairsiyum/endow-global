import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserRole } from '@endow/types'
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default async function RevenuePage() {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
    redirect('/admin')
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <DollarSign size={20} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track platform revenue from consultations and applications</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { label: 'Total Revenue', value: '$24,800', change: '+18%', up: true, color: 'emerald' },
          { label: 'This Month', value: '$4,200', change: '+12%', up: true, color: 'blue' },
          { label: 'Pending Payouts', value: '$1,850', change: '-3%', up: false, color: 'amber' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11131a]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}
              >
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
        <div className="text-center">
          <TrendingUp size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-medium text-gray-500">Detailed revenue analytics coming soon</p>
          <p className="mt-1 text-xs text-gray-400">Transaction history, breakdowns, and export features will be available here</p>
        </div>
      </div>
    </div>
  )
}
