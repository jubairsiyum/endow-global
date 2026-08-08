'use client'

import { useSession } from '@/lib/auth-client'
import { UserRole } from '@endow/types'

import AnalyticsChart from '@/components/admin/dashboard/AnalyticsChart'
import TopCountries from '@/components/admin/dashboard/TopCountries'
import UpcomingConsultations from '@/components/admin/dashboard/UpcomingConsultations'
import { trpc } from '@/lib/trpc-client'
import { CalendarDays, Clock3, FileText, Users } from 'lucide-react'

export default function AdminPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role as UserRole

  const { data: _metrics, isLoading } = trpc.admin.dashboard.getMetrics.useQuery()
  const metrics = _metrics as any

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
          <p className="text-xs text-gray-500">Loading platform data...</p>
        </div>
      </div>
    )
  }

  const totalStudents = metrics?.students || 0
  const totalCounselors = metrics?.counselors || 0
  const totalApplications =
    metrics?.applicationsByStatus?.reduce((sum: number, curr: any) => sum + curr.count, 0) || 0

  const stats = [
    { title: 'Total Students', value: totalStudents.toString(), growth: '+12%', icon: Users, color: '#3b82f6' },
    { title: 'Applications', value: totalApplications.toString(), growth: '+8%', icon: FileText, color: '#8b5cf6' },
    { title: 'Counselors', value: totalCounselors.toString(), growth: '+5%', icon: CalendarDays, color: '#f59e0b' },
    { title: 'Active Sessions', value: (metrics?.upcomingConsultations?.length || 0).toString(), growth: '0%', icon: Clock3, color: '#10b981' },
  ]

  return (
    <div className="mx-auto max-w-[1380px] space-y-3">
      <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
            {userRole === UserRole.SUPER_ADMIN ? 'Platform Control Center' : 'Admin Dashboard'}
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>
            Overview of platform operations and activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-9">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="group relative overflow-hidden rounded-xl border p-4 transition-all hover:-translate-y-0.5" style={{ background: '#ffffff', borderColor: '#e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${item.color}10` }}>
                      <Icon size={16} style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium" style={{ color: '#6b7280' }}>{item.title}</p>
                      <h2 className="text-[20px] font-bold leading-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</h2>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-12">
            <div className="flex xl:col-span-7"><AnalyticsChart /></div>
            <div className="flex xl:col-span-5"><TopCountries /></div>
          </div>
        </div>
        <div className="space-y-3 xl:col-span-3"><UpcomingConsultations /></div>
      </div>
    </div>
  )
}
