'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { Search, FileText, ExternalLink, Download, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function useDebounce<T>(value: T, delay: number): T {
 const [debouncedValue, setDebouncedValue] = useState<T>(value)
 useEffect(() => { const h = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(h) }, [value, delay])
 return debouncedValue
}

const statusColors: Record<string, string> = {
 DRAFT: 'bg-gray-200 text-gray-700',
 IN_PROGRESS: 'bg-blue-50 text-blue-700',
 SUBMITTED: 'bg-purple-50 text-purple-700',
 UNDER_REVIEW: 'bg-amber-50 text-amber-700',
 DOCUMENTS_REQUIRED: 'bg-orange-50 text-orange-700',
 ACCEPTED: 'bg-green-50 text-green-700',
 REJECTED: 'bg-red-200 text-red-700',
}

export default function DocumentsPage() {
 const [search, setSearch] = useState('')
 const debouncedSearch = useDebounce(search, 400)
 const [previewUrl, setPreviewUrl] = useState<string | null>(null)

 const { data: documents, isLoading } = trpc.admin.documents.list.useQuery({
 search: debouncedSearch || undefined,
 })

 return (
 <div className="space-y-6">
 <PageHeader title="Documents" description="View and manage uploaded student documents." />

 {/* SEARCH */}
 <div className="relative">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
 <input
 type="text"
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search by student, email, or university..."
 className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary"
 />
 </div>

 {/* TABLE */}
 <AdminTable>
 <div className="overflow-x-auto">
 <div className="grid min-w-[900px] grid-cols-6 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
 <div>Student</div>
 <div>University / Course</div>
 <div>Document</div>
 <div>App Status</div>
 <div>Updated</div>
 <div>Action</div>
 </div>

 {isLoading ? (
 <div className="py-10">
 <div className="flex justify-center pb-4"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>
 {Array.from({ length: 5 }).map((_, i) => (
 <div key={i} className="grid min-w-[900px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5">
 {Array.from({ length: 6 }).map((_, j) => (
 <div key={j} className="h-4 w-24 animate-pulse rounded bg-gray-200" />
 ))}
 </div>
 ))}
 </div>
 ) : !documents?.length ? (
 <div className="flex flex-col items-center justify-center py-16 text-gray-400">
 <FileText size={48} className="mb-3" />
 <p className="text-lg font-semibold text-gray-500">No documents found</p>
 <p className="text-sm">Uploaded application documents will appear here.</p>
 </div>
 ) : (
 documents.map(doc => (
 <div key={doc.id} className="grid min-w-[900px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50">
 <div>
 <p className="font-semibold text-gray-900">{doc.studentName}</p>
 <p className="text-xs text-gray-400">{doc.studentEmail}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-700">{doc.university}</p>
 <p className="text-xs text-gray-400">{doc.course}</p>
 </div>
 <div className="flex items-center gap-1.5 text-sm text-gray-700">
 <FileText size={13} className="text-gray-400" />
 <span className="truncate max-w-[140px]">{doc.docLabel}</span>
 </div>
 <div>
 <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColors[doc.status] || 'bg-gray-200 text-gray-700'}`}>
 {doc.status.replace(/_/g, ' ')}
 </span>
 </div>
 <div className="text-xs text-gray-400">
 {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
 </div>
 <div className="flex items-center gap-2">
 <button onClick={() => setPreviewUrl(doc.docUrl)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
 <Eye size={14} />
 </button>
 <a href={doc.docUrl} target="_blank" rel="noopener" className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20">
 <ExternalLink size={14} />
 </a>
 </div>
 </div>
 ))
 )}
 </div>
 </AdminTable>

 {/* PREVIEW MODAL */}
 {previewUrl && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 " onClick={() => setPreviewUrl(null)}>
 <div className="max-h-[85vh] max-w-3xl overflow-auto rounded-3xl bg-white p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
 {previewUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) ? (
 <img src={previewUrl} alt="Document preview" className="max-h-[80vh] rounded-2xl object-contain" />
 ) : (
 <iframe src={previewUrl} className="h-[80vh] w-[700px] rounded-2xl" title="Document preview" />
 )}
 <div className="mt-3 flex justify-between px-2 pb-2">
 <a href={previewUrl} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
 <Download size={14} /> Open in new tab
 </a>
 <button onClick={() => setPreviewUrl(null)} className="rounded-xl px-3 py-1 text-sm text-gray-500 hover:bg-gray-200">Close</button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
