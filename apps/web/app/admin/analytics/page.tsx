import PageHeader from '@/components/ui/PageHeader'

import { Users, Globe, FileCheck, TrendingUp } from 'lucide-react'

const analytics = [
  {
    title: 'Total Visitors',
    value: '24,589',
    growth: '+18%',
    icon: Globe,
  },
  {
    title: 'Applications',
    value: '3,268',
    growth: '+12%',
    icon: FileCheck,
  },
  {
    title: 'Students',
    value: '1,842',
    growth: '+9%',
    icon: Users,
  },
  {
    title: 'Conversion Rate',
    value: '64%',
    growth: '+6%',
    icon: TrendingUp,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track system growth and platform insights." />

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {analytics.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary dark:bg-[#2a1114]">
                  <Icon size={20} />
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 dark:bg-green-500/10">
                  {item.growth}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>

                <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </h2>
              </div>
            </div>
          )
        })}
      </div>

      {/* CHART PLACEHOLDER */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Growth Analytics
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monthly platform performance overview
            </p>
          </div>

          <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#920715]">
            Export
          </button>
        </div>

        <div className="mt-10 flex h-[400px] items-center justify-center rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-400 dark:text-gray-500">Analytics Chart Coming Soon</p>
        </div>
      </div>
    </div>
  )
}
