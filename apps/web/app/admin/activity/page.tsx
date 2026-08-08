'use client'

import { motion } from 'framer-motion'
import { Activity, Clock, FileText, RefreshCw, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'

const STATUS_COLORS: Record<string, string> = {
 ACCEPTED: '#4FD1A5', REJECTED: '#F0625B', SUBMITTED: '#4a90d9',
 UNDER_REVIEW: '#E8A33D', DOCUMENTS_REQUIRED: '#a78bfa',
 DRAFT: '#6b7280', IN_PROGRESS: '#E8A33D', WAITLISTED: '#E8A33D', WITHDRAWN: '#6b7280',
}

export default function SAActivityPage() {
 const { data: _metrics, isLoading, error } = trpc.admin.dashboard.getMetrics.useQuery()
 const metrics = _metrics as any
 const utils = trpc.useUtils()

 const activities = metrics?.recentActivity?.map((app: any) => ({
 id: app.id,
 student: app.student?.user?.name || 'Unknown Student',
 course: app.course?.name || 'Unknown Course',
 university: app.course?.university?.name || '',
 status: app.status,
 time: formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true }),
 date: new Date(app.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
 })) || []

 return (
 <div className="mx-auto max-w-[1440px] space-y-4">
 <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
 <div>
 <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily:"'Space Grotesk', sans-serif" }}>Activity Log</h1>
 <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>Recent platform activity and application updates</p>
 </div>
 <SAButton variant="ghost" size="sm" onClick={() => utils.admin.dashboard.getMetrics.invalidate()}><RefreshCw size={12} /> Refresh</SAButton>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="overflow-hidden rounded-xl border" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
 {isLoading ? (
 <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
 ) : error ? (
 <div className="flex flex-col items-center justify-center py-20 px-4"><AlertTriangle size={28} style={{ color: '#F0625B' }} /><p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load activity</p><SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.dashboard.getMetrics.invalidate()}>Retry</SAButton></div>
 ) : activities.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20">
 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100"><Activity size={24} className="text-gray-400" /></div>
 <p className="mt-3 text-sm font-medium" style={{ color: '#6b7280' }}>No recent activity</p>
 <p className="mt-1 text-xs" style={{ color: '#9ca3af' }}>Platform activity will appear here as students submit applications.</p>
 </div>
 ) : (
 <div className="divide-y" style={{ borderColor: '#e5e7eb' }}>
 {activities.map((item: any, i: number) => {
 const color = STATUS_COLORS[item.status] || '#6b7280'
 return (
 <div key={i} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50">
 <div className="mt-1 shrink-0">
 <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${color}15` }}>
 <FileText size={14} style={{ color }} />
 </div>
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-[13px] font-medium" style={{ color: '#111827' }}>{item.student}</span>
 <span className="text-[11px]" style={{ color: '#6b7280' }}>applied to</span>
 <span className="text-[13px] font-medium" style={{ color: '#111827' }}>{item.course}</span>
 {item.university && <span className="text-[11px]" style={{ color: '#6b7280' }}>at {item.university}</span>}
 </div>
 <div className="mt-1 flex items-center gap-3">
 <SABadge variant="route" dot>{item.status?.replace(/_/g, ' ') || 'Unknown'}</SABadge>
 <span className="text-[11px] flex items-center gap-1" style={{ color: '#9ca3af' }}><Clock size={11} />{item.date}</span>
 <span className="text-[11px]" style={{ color: '#9ca3af' }}>{item.time}</span>
 </div>
 </div>
 </div>
 )
 })}
 </div>
 )}
 </motion.div>
 </div>
 )
}
