'use client'

import { trpc } from '@/lib/trpc-client'
import { format } from 'date-fns'

export default function UpcomingConsultations() {
  const { data: metrics } = trpc.admin.dashboard.getMetrics.useQuery()

  const consultations = (metrics?.upcomingConsultations || []).map((session: any) => ({
    id: session.id,
    name: session.student?.user?.name || 'Unknown Student',
    initials: (session.student?.user?.name || '??').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
    counselor: session.counselor?.user?.name || 'Unassigned',
    time: format(new Date(session.scheduledAt), 'h:mm a'),
    date: format(new Date(session.scheduledAt), 'MMM d'),
  }))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white">
          Upcoming Consultations
        </h2>
        <a href="/admin/students" className="text-xs font-medium text-primary">View All</a>
      </div>

      <div className="mt-2.5 space-y-2">
        {consultations.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">No upcoming consultations</p>
        ) : (
          consultations.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-xs font-bold text-primary dark:bg-[#2a1114]">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="truncate text-[9px] text-gray-500 dark:text-gray-400">
                    With {item.counselor}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold text-primary">{item.time}</p>
                <p className="text-[9px] text-gray-400">{item.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
