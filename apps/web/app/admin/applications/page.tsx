'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, RefreshCw, AlertTriangle, Eye, Pencil } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'

const STATUS_OPTIONS = ['DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'WITHDRAWN'] as const

const STATUS_VARIANT: Record<string, 'route' | 'success' | 'alert' | 'neutral' | 'warning'> = {
 ACCEPTED: 'success', SUBMITTED: 'route', UNDER_REVIEW: 'warning',
 DOCUMENTS_REQUIRED: 'alert', DRAFT: 'neutral', IN_PROGRESS: 'route',
 REJECTED: 'alert', WAITLISTED: 'warning', WITHDRAWN: 'neutral',
}

export default function SAApplicationsPage() {
 const [search, setSearch] = useState('')
 const [statusFilter, setStatusFilter] = useState('')

 const utils = trpc.useUtils()
 const { data: appData, isLoading, error } = trpc.admin.applications.list.useQuery({ search: search || undefined, status: (statusFilter || undefined) as any })
 const appList = (appData as any)?.items ?? (Array.isArray(appData) ? appData : [])

 const updateStatusMutation = trpc.admin.applications.updateStatus.useMutation({
 onSuccess: () => { toast.success('Status updated'); utils.admin.applications.list.invalidate() },
 onError: (e: any) => toast.error(e?.message || 'Failed to update status'),
 })

 function handleStatusChange(appId: string, newStatus: string) {
 updateStatusMutation.mutate({ id: appId, status: newStatus as any })
 }

 return (
 <div className="mx-auto max-w-[1440px] space-y-4">
 <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
 <div>
 <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily:"'Space Grotesk', sans-serif" }}>Applications</h1>
 <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>Track and manage student applications across all universities</p>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="flex items-center gap-3">
 <div className="w-[300px]"><SAInput placeholder="Search applications..." icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#111827' }}>
 <option value="">All Statuses</option>
 {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
 </select>
 <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter(''); utils.admin.applications.list.invalidate() }}><RefreshCw size={12} /> Reset</SAButton>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="overflow-hidden rounded-xl border" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
 {isLoading ? (
 <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
 ) : error ? (
 <div className="flex flex-col items-center justify-center py-20 px-4"><AlertTriangle size={28} style={{ color: '#F0625B' }} /><p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load applications</p><SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.applications.list.invalidate()}>Retry</SAButton></div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead><tr style={{ background: '#ffffff' }}>{['Student', 'Course / University', 'Status', 'Counselor', 'Updated', 'Actions'].map((h) => <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280', fontFamily:"'JetBrains Mono', monospace" }}>{h}</th>)}</tr></thead>
 <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]">
 {(appList ?? []).map((app: any) => (
 <tr key={app.id} className="transition-colors hover:bg-gray-50">
 <td className="px-3 py-3">
 <div className="flex items-center gap-2.5">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ background: 'rgba(167,139,250,0.08)' }}>
 <FileText size={14} style={{ color: '#a78bfa' }} />
 </div>
 <div className="min-w-0">
 <span className="text-[13px] font-medium block truncate max-w-[180px]" style={{ color: '#111827' }}>{app.student?.user?.name || 'Unknown'}</span>
 <span className="text-[11px]" style={{ color: '#6b7280' }}>{app.student?.user?.email || ''}</span>
 </div>
 </div>
 </td>
 <td className="px-3 py-3">
 <div className="min-w-0 max-w-[200px]">
 <span className="text-[13px] font-medium block truncate" style={{ color: '#111827' }}>{app.course?.name || 'Unknown Course'}</span>
 <span className="text-[11px] block truncate" style={{ color: '#6b7280' }}>{app.course?.university?.name || ''}</span>
 </div>
 </td>
 <td className="px-3 py-3">
 <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)}
 className="rounded-md border px-2 py-1 text-[11px] font-medium outline-none cursor-pointer"
 style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#111827' }}>
 {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
 </select>
 </td>
 <td className="px-3 py-3 text-[13px]" style={{ color: '#6b7280' }}>{app.counselor?.user?.name || 'Unassigned'}</td>
 <td className="px-3 py-3 text-[12px]" style={{ color: '#6b7280' }}>{app.updatedAt ? formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true }) : '—'}</td>
 <td className="px-3 py-3">
 <SATooltip content="View Details">
 <button className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-gray-100" style={{ color: '#6b7280' }}><Eye size={14} /></button>
 </SATooltip>
 </td>
 </tr>
 ))}
 {(!appList || appList.length === 0) && (<tr><td colSpan={6} className="py-20 text-center"><FileText size={28} style={{ color: '#6b7280', margin: '0 auto 8px' }} /><p className="text-[13px]" style={{ color: '#6b7280' }}>{search || statusFilter ? 'No applications match your filters' : 'No applications yet.'}</p></td></tr>)}
 </tbody>
 </table>
 </div>
 )}
 </motion.div>
 </div>
 )
}
