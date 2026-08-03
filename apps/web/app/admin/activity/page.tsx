import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserRole } from '@endow/types'
import { Activity, Filter, Search } from 'lucide-react'

export default async function ActivityPage() {
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Activity size={20} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">System Activity</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monitor all platform events and changes</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-[#11131a]">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search activity logs..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#11131a] dark:text-gray-300 dark:hover:bg-[#1a1d25]">
          <Filter size={14} />
          Filter
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
        <div className="text-center">
          <Activity size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-medium text-gray-500">Activity logging will be enabled in a future update</p>
          <p className="mt-1 text-xs text-gray-400">All system events, admin actions, and user activities will appear here</p>
        </div>
      </div>
    </div>
  )
}
