'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, RefreshCw, AlertTriangle, Eye, Mail, Phone, MapPin, GraduationCap, Download, FileSpreadsheet, FileCode2, ChevronDown, Filter, X, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import StatusBadge from '@/components/ui/StatusBadge'

const STATUS_OPTIONS = ['DRAFT','IN_PROGRESS','SUBMITTED','UNDER_REVIEW','DOCUMENTS_REQUIRED','ACCEPTED','REJECTED','WAITLISTED','WITHDRAWN'] as const
const LEVELS = ['Undergraduate','Masters','Doctorate','EAP','KLP']
const TESTS = ['None','IELTS','TOEFL','SAT','TOPIK']
const SOURCES = ['Social Sites','Website','Family, Friends & Relatives']
const is = { background:'#fff', borderColor:'#e5e7eb', color:'#111827' }
const selCls = "rounded-md border px-3 py-1.5 text-[13px] outline-none bg-white"

function csvEscape(v:any):string { if(v===null||v===undefined)return''; const s=String(v).replace(/"/g,'""'); return /[,"\n\r]/.test(s)?`"${s}"`:s }
function downloadBlob(c:string,f:string,m:string){ const b=new Blob(['\uFEFF'+c],{type:m}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=f; a.click(); URL.revokeObjectURL(u) }
function fmtDate(d:any){ if(!d)return''; return new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) }

export default function ApplicationsPage() {
  const [search,setSearch]=useState('');const [statusFilter,setStatusFilter]=useState('')
  const [tab,setTab]=useState<'applications'|'inquiries'>('applications')
  const [exportOpen,setExportOpen]=useState(false)
  const [showFilters,setShowFilters]=useState(false)

  // Course app filters
  const [uniFilter,setUniFilter]=useState('')
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')

  // Inquiry filters
  const [inqCountry,setInqCountry]=useState('')
  const [inqUni,setInqUni]=useState('')
  const [inqLevel,setInqLevel]=useState('')
  const [inqTest,setInqTest]=useState('')
  const [inqSource,setInqSource]=useState('')
  const [inqDateFrom,setInqDateFrom]=useState('')
  const [inqDateTo,setInqDateTo]=useState('')

  const utils=trpc.useUtils()
  const {data:appData,isLoading,error}=trpc.admin.applications.list.useQuery({search:search||undefined,status:(statusFilter||undefined)as any})
  const {data:inquiries}=trpc.endow.listInquiries.useQuery()
  const {data:unis}=trpc.admin.universities.list.useQuery({})
  const appList=(appData as any)?.items??(Array.isArray(appData)?appData:[])

  // Filter course applications
  const filteredApps=appList.filter((a:any)=>{
    if(uniFilter&&a.course?.university?.id!==uniFilter)return false
    if(dateFrom&&new Date(a.updatedAt)<new Date(dateFrom))return false
    if(dateTo&&new Date(a.updatedAt)>new Date(dateTo+'T23:59:59'))return false
    return true
  })

  // Filter inquiries
  const filteredInquiries=(inquiries||[]).filter((i:any)=>{
    if(inqCountry&&i.targetCountry!==inqCountry)return false
    if(inqUni&&i.targetUniversity!==inqUni)return false
    if(inqLevel&&i.applyingTo!==inqLevel)return false
    if(inqTest&&i.englishTest!==inqTest)return false
    if(inqSource&&i.heardFrom!==inqSource)return false
    if(inqDateFrom&&new Date(i.submittedAt)<new Date(inqDateFrom))return false
    if(inqDateTo&&new Date(i.submittedAt)>new Date(inqDateTo+'T23:59:59'))return false
    return true
  })

  const uniOpts=unis||[]
  const activeFilters=tab==='applications'
    ?[uniFilter,dateFrom,dateTo].filter(Boolean).length
    :[inqCountry,inqUni,inqLevel,inqTest,inqSource,inqDateFrom,inqDateTo].filter(Boolean).length

  const doExport=useCallback((format:'csv'|'json')=>{
    const ts=new Date().toISOString().slice(0,10)
    if(tab==='applications'){
      const rows=filteredApps
      if(format==='json'){downloadBlob(JSON.stringify(rows,null,2),`course-apps-${ts}.json`,'application/json');toast.success('Exported JSON');return}
      const csv=[['Student Name','Student Email','Course','University','Status','Counselor','Updated'].join(',')]
      for(const a of rows)csv.push([a.student?.user?.name||'',a.student?.user?.email||'',a.course?.name||'',a.course?.university?.name||'',a.status||'',a.counselor?.user?.name||'Unassigned',fmtDate(a.updatedAt)].map(csvEscape).join(','))
      downloadBlob(csv.join('\n'),`course-apps-${ts}.csv`,'text/csv')
    }else{
      const rows=filteredInquiries
      if(format==='json'){downloadBlob(JSON.stringify(rows,null,2),`inquiries-${ts}.json`,'application/json');toast.success('Exported JSON');return}
      const csv=[['Name','Email','Phone','Country','Target Country','Target University','Degree','English Test','Source','Submitted'].join(',')]
      for(const i of rows)csv.push([`${i.givenName} ${i.surname}`,i.email,i.phone,i.country,i.targetCountry,i.targetUniversity,i.applyingTo,i.englishTest,i.heardFrom,fmtDate(i.submittedAt)].map(csvEscape).join(','))
      downloadBlob(csv.join('\n'),`inquiries-${ts}.csv`,'text/csv')
    }
    toast.success(`Exported ${format.toUpperCase()}`)
    setExportOpen(false)
  },[tab,filteredApps,filteredInquiries])

  function resetFilters(){
    setUniFilter('');setDateFrom('');setDateTo('')
    setInqCountry('');setInqUni('');setInqLevel('');setInqTest('');setInqSource('');setInqDateFrom('');setInqDateTo('')
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-gray-900" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Applications</h1>
          <p className="mt-0.5 text-[13px] text-gray-500">Manage student applications & inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <SAButton variant="ghost" size="sm" onClick={()=>{setShowFilters(!showFilters);if(showFilters)resetFilters()}} className="relative">
            <Filter size={14}/>Filters {activeFilters>0&&<span className="ml-1 rounded-full bg-red-500 px-1.5 py-px text-[9px] font-bold text-white">{activeFilters}</span>}
          </SAButton>
          <div className="relative">
            <SAButton variant="secondary" size="sm" onClick={()=>setExportOpen(!exportOpen)}><Download size={14}/>Export<ChevronDown size={12}/></SAButton>
            {exportOpen&&(
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-xl z-30">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{tab==='applications'?'Course Apps':'Inquiries'}</div>
                <button onClick={()=>doExport('csv')} className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"><FileSpreadsheet size={14} className="text-green-600"/>Export CSV</button>
                <button onClick={()=>doExport('json')} className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"><FileCode2 size={14} className="text-blue-600"/>Export JSON</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {[{k:'applications',l:'Course Applications',c:appList.length},{k:'inquiries',l:'Apply Now Inquiries',c:(inquiries||[]).length}].map(t=>(
          <button key={t.k} onClick={()=>{setTab(t.k as any);setShowFilters(false)}} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab===t.k?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>{t.l}<span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[11px] text-gray-600">{t.c}</span></button>
        ))}
      </div>

      {/* Filter bar */}
      {showFilters&&(
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by</span>
            <button onClick={resetFilters} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600"><X size={12}/>Clear all</button>
          </div>
          {tab==='applications'?(
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">University</span><select value={uniFilter} onChange={e=>setUniFilter(e.target.value)} className={selCls} style={is}><option value="">All Universities</option>{uniOpts.map((u:any)=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">Updated From</span><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className={selCls} style={is}/></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">Updated To</span><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className={selCls} style={is}/></div>
              <span className="text-[11px] text-gray-400 ml-2">{filteredApps.length} of {appList.length} results</span>
            </div>
          ):(
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">Country</span><select value={inqCountry} onChange={e=>setInqCountry(e.target.value)} className={selCls} style={is}><option value="">All</option>{Array.from(new Set((inquiries||[]).map((i:any)=>i.country).filter(Boolean))).map(c=><option key={c as string} value={c as string}>{c as string}</option>)}</select></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">Target Country</span><select value={inqCountry} onChange={e=>setInqCountry(e.target.value)} className={selCls} style={is}><option value="">All</option>{Array.from(new Set((inquiries||[]).map((i:any)=>i.targetCountry).filter(Boolean))).map(c=><option key={c as string} value={c as string}>{c as string}</option>)}</select></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">University</span><select value={inqUni} onChange={e=>setInqUni(e.target.value)} className={selCls} style={is}><option value="">All</option>{Array.from(new Set((inquiries||[]).map((i:any)=>i.targetUniversity).filter(Boolean))).map(u=><option key={u as string} value={u as string}>{u as string}</option>)}</select></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">Degree</span><select value={inqLevel} onChange={e=>setInqLevel(e.target.value)} className={selCls} style={is}><option value="">All</option>{LEVELS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">English Test</span><select value={inqTest} onChange={e=>setInqTest(e.target.value)} className={selCls} style={is}><option value="">All</option>{TESTS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">Source</span><select value={inqSource} onChange={e=>setInqSource(e.target.value)} className={selCls} style={is}><option value="">All</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">From</span><input type="date" value={inqDateFrom} onChange={e=>setInqDateFrom(e.target.value)} className={selCls} style={is}/></div>
              <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-400">To</span><input type="date" value={inqDateTo} onChange={e=>setInqDateTo(e.target.value)} className={selCls} style={is}/></div>
              <span className="text-[11px] text-gray-400 ml-2">{filteredInquiries.length} of {(inquiries||[]).length} results</span>
            </div>
          )}
        </motion.div>
      )}

      {tab==='applications'?(
        <>
          <div className="flex items-center gap-3">
            <div className="w-[300px]"><SAInput placeholder="Search by student/course..." icon={<Search size={14}/>} value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className={selCls} style={is}>{[''].concat(STATUS_OPTIONS as any).map(s=><option key={s} value={s}>{s||'All Statuses'}</option>)}</select>
            <SAButton variant="ghost" size="sm" onClick={()=>{setSearch('');setStatusFilter('');resetFilters();utils.admin.applications.list.invalidate()}}><RefreshCw size={12}/>Reset</SAButton>
          </div>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="overflow-hidden rounded-xl border bg-white" style={{borderColor:'#e5e7eb'}}>
            {isLoading?<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{borderColor:'#E8A33D',borderTopColor:'transparent'}}/></div>:error?<div className="flex flex-col items-center justify-center py-20"><AlertTriangle size={28} style={{color:'#F0625B'}}/><p className="mt-3 text-sm font-medium text-red-500">Failed to load</p><SAButton variant="secondary" size="sm" className="mt-3" onClick={()=>utils.admin.applications.list.invalidate()}>Retry</SAButton></div>:(
              <div className="overflow-x-auto">
                <table className="w-full"><thead><tr className="bg-gray-50">{['Student','Course/University','Status','Counselor','Updated',''].map(h=><th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500" style={{fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
                <tbody className="[&_tr]:border-t [&_tr]:border-gray-100">
                  {filteredApps.map((app:any)=>(
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50"><FileText size={14} className="text-purple-500"/></div><div className="min-w-0"><p className="text-[13px] font-medium text-gray-900 truncate max-w-[180px]">{app.student?.user?.name||'Unknown'}</p><p className="text-[11px] text-gray-500">{app.student?.user?.email||''}</p></div></div></td>
                      <td className="px-3 py-3"><div className="min-w-0 max-w-[200px]"><p className="text-[13px] font-medium text-gray-900 truncate">{app.course?.name||'Unknown'}</p><p className="text-[11px] text-gray-500 truncate">{app.course?.university?.name||''}</p></div></td>
                      <td className="px-3 py-3"><StatusBadge status={app.status} /></td>
                      <td className="px-3 py-3 text-[13px] text-gray-500">{app.counselor?.user?.name||'Unassigned'}</td>
                      <td className="px-3 py-3 text-[12px] text-gray-500">{app.updatedAt?formatDistanceToNow(new Date(app.updatedAt),{addSuffix:true}):'—'}</td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          aria-label={`View application from ${app.student?.user?.name||'student'}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Eye size={14}/>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length===0&&<tr><td colSpan={6} className="py-20 text-center"><FileText size={28} className="mx-auto text-gray-300"/><p className="mt-2 text-sm text-gray-500">{appList.length===0?(search||statusFilter?'No matches':'No applications yet.'):'No results match your filters.'}</p></td></tr>}
                </tbody></table>
              </div>
            )}
          </motion.div>
        </>
      ):(
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="overflow-hidden rounded-xl border bg-white" style={{borderColor:'#e5e7eb'}}>
          {filteredInquiries.length===0?(
            <div className="py-20 text-center"><Mail size={28} className="mx-auto text-gray-300"/><p className="mt-2 text-sm text-gray-500">{!inquiries?.length?'No inquiries received yet.':'No results match your filters.'}</p><p className="mt-1 text-xs text-gray-400">Apply Now form submissions will appear here.</p></div>
          ):(
            <div className="divide-y divide-gray-100">
              {filteredInquiries.map((inq:any,i:number)=>(
                <div key={i} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1"><span className="text-sm font-semibold text-gray-900">{inq.givenName} {inq.surname}</span>{inq.applyingTo&&<span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-600">{inq.applyingTo}</span>}{inq.targetUniversity&&<span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">{inq.targetUniversity}</span>}</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-500"><span className="flex items-center gap-1"><Mail size={11}/>{inq.email}</span><span className="flex items-center gap-1"><Phone size={11}/>{inq.phone}</span>{inq.country&&<span className="flex items-center gap-1"><MapPin size={11}/>{inq.country}</span>}{inq.targetCountry&&<span className="flex items-center gap-1"><GraduationCap size={11}/>{inq.targetCountry}</span>}</div>
                      <div className="mt-2 flex flex-wrap gap-2">{inq.englishTest&&inq.englishTest!=='None'&&<span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{inq.englishTest}{inq[inq.englishTest.toLowerCase()+'Score']?`: ${inq[inq.englishTest.toLowerCase()+'Score']}`:''}</span>}{inq.reasonToChoose&&<p className="text-[11px] text-gray-400 line-clamp-2 max-w-lg">{inq.reasonToChoose}</p>}</div>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">{fmtDate(inq.submittedAt)}</span>
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
