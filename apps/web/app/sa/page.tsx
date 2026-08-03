'use client'

import { LiveNetworkPanel } from '@/components/super-admin/dashboard/LiveNetworkPanel'
import { KPICardRow } from '@/components/super-admin/dashboard/KPICardRow'
import { motion } from 'framer-motion'

export default function SAPage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-[20px] font-bold tracking-tight"
          style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Operations Control
        </h1>
        <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>
          Global network overview — branches, universities, and active routing
        </p>
      </motion.div>

      {/* Hero: Live Network Panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <LiveNetworkPanel />
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <KPICardRow />
      </motion.div>
    </div>
  )
}
