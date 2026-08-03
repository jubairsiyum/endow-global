'use client'

import { useState } from 'react'
import { BranchesTable } from '@/components/super-admin/tables/BranchesTable'
import { motion } from 'framer-motion'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { Plus } from 'lucide-react'

export default function BranchesPage() {
  const [state, setState] = useState<'data' | 'loading' | 'error' | 'empty'>('data')

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-[20px] font-bold tracking-tight"
            style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Branches
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>
            Manage all branch offices across your global network
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* State demo controls */}
          <div className="hidden items-center gap-1.5 rounded-md border px-2 py-1.5 lg:flex" style={{ borderColor: '#262C42' }}>
            <span className="text-[10px] mr-1" style={{ color: '#8890A8' }}>State:</span>
            {(['data', 'loading', 'error', 'empty'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setState(s)}
                className="rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
                style={{
                  background: state === s ? 'rgba(232, 163, 61, 0.12)' : 'transparent',
                  color: state === s ? '#E8A33D' : '#8890A8',
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <SAButton variant="primary" size="md">
            <Plus size={15} />
            Add Branch
          </SAButton>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <BranchesTable
          data={state === 'empty' ? [] : undefined}
          loading={state === 'loading'}
          error={state === 'error'}
        />
      </motion.div>
    </div>
  )
}
