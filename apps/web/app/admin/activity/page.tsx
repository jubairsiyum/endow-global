'use client'

import { motion } from 'framer-motion'
import { Activity, AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '@/lib/trpc-client'
import { SAButton } from '@/components/super-admin/shared/SAButton'

export default function SAActivityPage() {
  const activity = trpc.admin.activity.list.useQuery({ limit: 100 })
  const utils = trpc.useUtils()

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>Activity Log</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>Audited administrator actions and sign-ins</p>
        </div>
        <SAButton variant="ghost" size="sm" onClick={() => utils.admin.activity.list.invalidate()}><RefreshCw size={12} /> Refresh</SAButton>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="overflow-hidden rounded-xl border" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {activity.isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
        ) : activity.error ? (
          <div className="flex flex-col items-center justify-center px-4 py-20"><AlertTriangle size={28} style={{ color: '#F0625B' }} /><p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load activity</p><SAButton variant="secondary" size="sm" className="mt-3" onClick={() => activity.refetch()}>Retry</SAButton></div>
        ) : !activity.data?.length ? (
          <div className="flex flex-col items-center justify-center py-20"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100"><Activity size={24} className="text-gray-400" /></div><p className="mt-3 text-sm font-medium" style={{ color: '#6b7280' }}>No audited activity yet</p><p className="mt-1 text-xs" style={{ color: '#9ca3af' }}>Administrator sign-ins and changes will appear here.</p></div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#e5e7eb' }}>
            {activity.data.map((entry, index) => (
              <div key={`${entry.timestamp}-${index}`} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50"><Activity size={14} style={{ color: '#E8A33D' }} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium" style={{ color: '#111827' }}>{entry.action.replace(/[._]/g, ' ')}</p>
                  <p className="mt-1 text-[11px]" style={{ color: '#6b7280' }}>{entry.actor.email} · {entry.actor.role}{entry.target ? ` · ${entry.target.type} ${entry.target.id}` : ''}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[11px]" style={{ color: '#9ca3af' }}><Clock size={11} />{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
