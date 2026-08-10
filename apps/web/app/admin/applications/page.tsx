'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, RefreshCw, AlertTriangle, Eye, Mail, Phone, MapPin, GraduationCap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'

const STATUS_OPTIONS = ['DRAFT','IN_PROGRESS','SUBMITTED','UNDER_REVIEW','DOCUMENTS_REQUIRED','ACCEPTED','REJECTED','WAITLISTED','WITHDRAWN'] as const

const is = { background:'#fff', borderColor:'#e5e7eb', color:'#111827' }

export default function ApplicationsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tab, setTab] = useState<'applications'|'inquiries'>('applications')

  const utils = trpc.useUtils()
  const { data: appData, isLoading, error } = trpc.admin.applications.list.useQuery({ search: search||undefined, status: (statusFilter||undefined) as any })
  const { data: inquiries } = trpc.endow.listInquiries.useQuery()
  const appList = (appData as any)?.items ?? (Array.isArray(appData) ? appData : [])

  const updateStatusMutation = trpc.admin.applications.updateStatus.useMutation({
    onSuccess: () => { toast.success('Status updated'); utils.admin.applications.list.invalidate() },
    onError: (e:any) => toast.error(e?.message || 'Failed'),
  })

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-gray-900" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Applications</h1>
          <p className="mt-0.5 text-[13px] text-gray-500">Manage student applications & inquiries</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {[{k:'applications',l:'Course Applications',c:(appList||[]).length},{k:'inquiries',l:'Apply Now Inquiries',c:(inquiries||[]).length}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as any)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab===t.k?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>{t.l}<span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[11px] text-gray-600">{t.c}</span></button>
        ))}
      </div>

      {tab==='applications'?(
        <>
          <div className="flex items-center gap-3">
            <div className="w-[300px]"><SAInput placeholder="Search applications..." icon={<Search size={14}/>} value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-md border px-3 py-1.5 text-[13px] outline-none" style={is}>{[''].concat(STATUS_OPTIONS as any).map(s=><option key={s} value={s}>{s||'All Statuses'}</option>)}</select>
            <SAButton variant="ghost" size="sm" onClick={()=>{setSearch('');setStatusFilter('');utils.admin.applications.list.invalidate()}}><RefreshCw size={12}/>Reset</SAButton>
          </div>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="overflow-hidden rounded-xl border bg-white" style={{borderColor:'#e5e7eb'}}>
            {isLoading?<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{borderColor:'#E8A33D',borderTopColor:'transparent'}}/></div>:error?<div className="flex flex-col items-center justify-center py-20"><AlertTriangle size={28} style={{color:'#F0625B'}}/><p className="mt-3 text-sm font-medium text-red-500">Failed to load</p><SAButton variant="secondary" size="sm" className="mt-3" onClick={()=>utils.admin.applications.list.invalidate()}>Retry</SAButton></div>:(
              <div className="overflow-x-auto">
                <table className="w-full"><thead><tr className="bg-gray-50">{['Student','Course/University','Status','Counselor','Updated',''].map(h=><th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500" style={{fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
                <tbody className="[&_tr]:border-t [&_tr]:border-gray-100">
                  {(appList||[]).map((app:any)=>(
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50"><FileText size={14} className="text-purple-500"/></div><div className="min-w-0"><p className="text-[13px] font-medium text-gray-900 truncate max-w-[180px]">{app.student?.user?.name||'Unknown'}</p><p className="text-[11px] text-gray-500">{app.student?.user?.email||''}</p></div></div></td>
                      <td className="px-3 py-3"><div className="min-w-0 max-w-[200px]"><p className="text-[13px] font-medium text-gray-900 truncate">{app.course?.name||'Unknown'}</p><p className="text-[11px] text-gray-500 truncate">{app.course?.university?.name||''}</p></div></td>
                      <td className="px-3 py-3"><select value={app.status} onChange={e=>updateStatusMutation.mutate({id:app.id,status:e.target.value as any})} className="rounded-md border px-2 py-1 text-[11px] font-medium outline-none cursor-pointer" style={is}>{STATUS_OPTIONS.map(s=><option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}</select></td>
                      <td className="px-3 py-3 text-[13px] text-gray-500">{app.counselor?.user?.name||'Unassigned'}</td>
                      <td className="px-3 py-3 text-[12px] text-gray-500">{app.updatedAt?formatDistanceToNow(new Date(app.updatedAt),{addSuffix:true}):'—'}</td>
                      <td className="px-3 py-3"><button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100 text-gray-400"><Eye size={14}/></button></td>
                    </tr>
                  ))}
                  {(!appList||appList.length===0)&&<tr><td colSpan={6} className="py-20 text-center"><FileText size={28} className="mx-auto text-gray-300"/><p className="mt-2 text-sm text-gray-500">{search||statusFilter?'No matches':'No applications yet.'}</p></td></tr>}
                </tbody></table>
              </div>
            )}
          </motion.div>
        </>
      ):(
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="overflow-hidden rounded-xl border bg-white" style={{borderColor:'#e5e7eb'}}>
          {!inquiries?.length?(
            <div className="py-20 text-center"><Mail size={28} className="mx-auto text-gray-300"/><p className="mt-2 text-sm text-gray-500">No inquiries received yet.</p><p className="mt-1 text-xs text-gray-400">Apply Now form submissions will appear here.</p></div>
          ):(
            <div className="divide-y divide-gray-100">
              {(inquiries||[]).map((inq:any,i:number)=>(
                <div key={i} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{inq.givenName} {inq.surname}</span>
                        {inq.applyingTo&&<span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-600">{inq.applyingTo}</span>}
                        {inq.targetUniversity&&<span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">{inq.targetUniversity}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-500">
                        <span className="flex items-center gap-1"><Mail size={11}/>{inq.email}</span>
                        <span className="flex items-center gap-1"><Phone size={11}/>{inq.phone}</span>
                        {inq.country&&<span className="flex items-center gap-1"><MapPin size={11}/>{inq.country}</span>}
                        {inq.targetCountry&&<span className="flex items-center gap-1"><GraduationCap size={11}/>{inq.targetCountry}</span>}
                      </div>
                      {(inq.reasonToChoose||inq.englishTest!=='None')&&(
                        <div className="mt-2 flex flex-wrap gap-2">
                          {inq.englishTest&&inq.englishTest!=='None'&&<span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{inq.englishTest}{inq[inq.englishTest.toLowerCase()+'Score']?`: ${inq[inq.englishTest.toLowerCase()+'Score']}`:''}</span>}
                          {inq.reasonToChoose&&<p className="text-[11px] text-gray-400 line-clamp-2 max-w-lg">{inq.reasonToChoose}</p>}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">{new Date(inq.submittedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
