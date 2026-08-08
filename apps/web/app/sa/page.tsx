'use client'

import { LiveNetworkPanel } from '@/components/super-admin/dashboard/LiveNetworkPanel'
import { KPICardRow } from '@/components/super-admin/dashboard/KPICardRow'
import { motion } from 'framer-motion'
import { trpc } from '@/lib/trpc-client'

export default function SAPage() {
  const { data: networkMap, isLoading: networkLoading } = trpc.admin.dashboard.getNetworkMap.useQuery()

  const { data: _metrics } = trpc.admin.dashboard.getMetrics.useQuery()
  const metrics = _metrics as any

  const totalBranches = networkMap?.nodes?.filter((n: any) => n.type === 'branch').length ?? 0
  const totalUniversities = networkMap?.nodes?.filter((n: any) => n.type === 'university').length ?? 0
  const totalApplications = metrics?.applicationsByStatus?.reduce((s: number, c: any) => s + c.count, 0) ?? 0

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-[20px] font-bold tracking-tight"
          style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Operations Control
        </h1>
        <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>
          Global network overview â€” branches, universities, and active routing
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <LiveNetworkPanel
          nodes={networkMap?.nodes ?? undefined}
          arcs={networkMap?.arcs ?? undefined}
          isLoading={networkLoading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <KPICardRow
          metrics={{
            totalApplications,
            totalBranches,
            totalUniversities,
            totalStudents: metrics?.students ?? 0,
            totalCounselors: metrics?.counselors ?? 0,
          }}
        />
      </motion.div>
    </div>
  )
}
