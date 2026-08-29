'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Search, BookOpen, GraduationCap, DollarSign, EyeOff, Calendar, Star, FileText } from 'lucide-react'
import { toast } from 'sonner'

const LEVELS = ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'FOUNDATION']
const MODES = ['FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID']
const DURATION_UNITS = ['YEARS', 'MONTHS']

interface CourseForm {
  universityId: string; name: string; slug: string; subject: string; level: string
  duration: string; durationUnit: string; tuitionFee: string; currency: string
  language: string; description: string; isActive: boolean
  campus: string; modeOfStudy: string
  highlights: string; professionalAccreditation: string
  offerResponseTime: string; applicationFee: string; brochureUrl: string
  applicationDeadline: string; startDate: string
  hasScholarship: boolean; scholarshipDetails: string
  backlogsAccepted: boolean; gapYearsAccepted: boolean
  englishTestWaiver: boolean; expressOffer: boolean
}

const emptyForm: CourseForm = {
  universityId: '', name: '', slug: '', subject: '', level: 'POSTGRADUATE',
  duration: '', durationUnit: 'YEARS', tuitionFee: '', currency: 'USD',
  language: 'English', description: '', isActive: true,
  campus: '', modeOfStudy: 'FULL_TIME',
  highlights: '', professionalAccreditation: '',
  offerResponseTime: '', applicationFee: '', brochureUrl: '',
  applicationDeadline: '', startDate: '',
  hasScholarship: false, scholarshipDetails: '',
  backlogsAccepted: false, gapYearsAccepted: false,
  englishTestWaiver: false, expressOffer: false,
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => { const handler = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(handler) }, [value, delay])
  return debouncedValue
}

// Normalize a "list" value (array, JSON string, or plain string) into a
// newline-separated text for the textarea. Handles single- and double-encoded
// JSON strings so editing always renders one item per line.
function highlightsToText(value: unknown): string {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string').join('\n')
  if (typeof value !== 'string') return ''
  let current: unknown = value
  for (let i = 0; i < 2; i++) {
    try {
      current = JSON.parse(current as string)
    } catch {
      break
    }
    if (Array.isArray(current)) return current.filter((v) => typeof v === 'string').join('\n')
    if (typeof current !== 'string') break
  }
  return typeof current === 'string' ? current : ''
}

const is = { background: '#fff', borderColor: '#e5e7eb', color: '#111827' }

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CourseForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [reqItems, setReqItems] = useState<{ cat: string; title: string; desc: string }[]>([])
  const [levelFilter, setLevelFilter] = useState('')
  const [universityFilter, setUniversityFilter] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const utils = trpc.useUtils()
  const { data: courses, isLoading } = trpc.admin.courses.list.useQuery({ search: debouncedSearch || undefined, level: (levelFilter as any) || undefined, universityId: universityFilter || undefined })
  const { data: universities } = trpc.admin.universities.list.useQuery({})
  const { data: subjects } = trpc.admin.courses.getSubjects.useQuery()

  const createMutation = trpc.admin.courses.create.useMutation({
    onSuccess: () => { toast.success('Course created'); utils.admin.courses.list.invalidate(); setShowModal(false); setForm(emptyForm) },
    onError: (e: any) => toast.error(e?.message || 'Failed to create course'),
  })
  const updateMutation = trpc.admin.courses.update.useMutation({
    onSuccess: () => { toast.success('Course updated'); utils.admin.courses.list.invalidate(); setShowModal(false); setEditingId(null); setForm(emptyForm) },
    onError: (e: any) => toast.error(e?.message || 'Failed to update course'),
  })
  const deleteMutation = trpc.admin.courses.delete.useMutation({
    onSuccess: () => { toast.success('Course deleted'); utils.admin.courses.list.invalidate(); setDeleteConfirm(null) },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete course'),
  })

  function setF(key: string, value: any) { setForm(p => ({ ...p, [key]: value })) }
  function openCreate() { setEditingId(null); setForm(emptyForm); setReqItems([]); setShowModal(true) }
  function openEdit(c: any) {
    setEditingId(c.id)
    setForm({
      universityId: c.universityId || '', name: c.name || '', slug: c.slug || '', subject: c.subject || '',
      level: c.level || 'POSTGRADUATE', duration: c.duration?.toString() || '', durationUnit: c.durationUnit || 'YEARS',
      tuitionFee: c.tuitionFee?.toString() || '', currency: c.currency || 'USD', language: c.language || 'English',
      description: c.description || '', isActive: c.isActive ?? true,
      campus: c.campus || '', modeOfStudy: c.modeOfStudy || 'FULL_TIME',
      highlights: highlightsToText(c.highlights),
      professionalAccreditation: c.professionalAccreditation || '',
      offerResponseTime: c.offerResponseTime || '', applicationFee: c.applicationFee?.toString() || '',
      brochureUrl: c.brochureUrl || '',
      applicationDeadline: c.applicationDeadline ? new Date(c.applicationDeadline).toISOString().slice(0, 10) : '',
      startDate: c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : '',
      hasScholarship: c.hasScholarship || false, scholarshipDetails: c.scholarshipDetails || '',
      backlogsAccepted: c.backlogsAccepted || false, gapYearsAccepted: c.gapYearsAccepted || false,
      englishTestWaiver: c.englishTestWaiver || false, expressOffer: c.expressOffer || false,
    })
    setShowModal(true)
    // Parse existing requirements
    const existingReqs: any[] = Array.isArray(c.requirements) ? c.requirements : (typeof c.requirements === 'string' ? (() => { try { return JSON.parse(c.requirements) } catch { return [] } })() : [])
    setReqItems(existingReqs.map((r: any) => {
      if (typeof r === 'object' && r.title) return r
      const str = typeof r === 'string' ? r : String(r)
      const match = str.match(/^([^:]+):\s*(.+?)(?:\s*\(([^)]+)\))?$/)
      return match ? { cat: match[1].trim(), title: match[2].trim(), desc: match[3]?.trim() || '' } : { cat: 'OTHER', title: str, desc: '' }
    }))
  }

  function onSave() {
    if (!form.name.trim() || !form.slug.trim() || !form.universityId) { toast.error('Required fields missing'); return }
    const data: any = {
      ...form,
      duration: parseInt(form.duration) || 1,
      tuitionFee: parseInt(form.tuitionFee) || 0,
      applicationFee: form.applicationFee ? parseFloat(form.applicationFee) : undefined,
      highlights: form.highlights ? form.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [],
      applicationDeadline: form.applicationDeadline ? new Date(form.applicationDeadline) : undefined,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      brochureUrl: form.brochureUrl || undefined,
      offerResponseTime: form.offerResponseTime || undefined,
      professionalAccreditation: form.professionalAccreditation || undefined,
      campus: form.campus || undefined,
      modeOfStudy: form.modeOfStudy as any,
      requirements: reqItems.filter(r => r.title.trim()).map(r => `${r.cat}: ${r.title}${r.desc ? ` (${r.desc})` : ''}`),
      scholarshipDetails: form.scholarshipDetails || undefined,
    }
    if (editingId) updateMutation.mutate({ id: editingId, ...data })
    else createMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" description="Manage course catalog across partner universities." buttonText="Add Course" onButtonClick={openCreate} />
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or subject…" className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary" /></div>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none lg:w-44"><option value="">All Levels</option>{LEVELS.map(l => <option key={l} value={l}>{l.replace(/_/g, ' ')}</option>)}</select>
        <select value={universityFilter} onChange={e => setUniversityFilter(e.target.value)} className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none lg:w-48"><option value="">All Universities</option>{(universities || []).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
      </div>

      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[900px] grid-cols-7 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600"><div>Course</div><div>University</div><div>Level</div><div>Mode</div><div>Fee</div><div>Status</div><div>Actions</div></div>
          {isLoading ? (
            <div className="py-10"><div className="flex justify-center pb-4"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>{Array(5).fill(0).map((_, i) => (<div key={i} className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5"><div className="h-4 w-40 animate-pulse rounded bg-gray-200" /><div className="h-4 w-32 animate-pulse rounded bg-gray-200" /><div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" /><div className="h-4 w-20 animate-pulse rounded bg-gray-200" /><div className="h-4 w-16 animate-pulse rounded bg-gray-200" /><div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" /><div className="h-8 w-20 animate-pulse rounded bg-gray-200" /></div>))}</div>
          ) : !courses?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400"><BookOpen size={48} className="mb-3" /><p className="text-lg font-semibold text-gray-500">No courses found</p><p className="text-sm">Add your first course to get started.</p></div>
          ) : courses.map((c: any) => (
            <div key={c.id} className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.subject}{c.campus ? ` · ${c.campus}` : ''}</div>
              </div>
              <div className="text-sm text-gray-700">{c.university?.name || '—'}</div>
              <div><span className="inline-flex items-center rounded-full bg-[#C41E3A]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C41E3A]">{c.level?.replace(/_/g, ' ') || '—'}</span></div>
              <div className="text-xs text-gray-500">{c.modeOfStudy ? c.modeOfStudy.replace(/_/g, ' ') : '—'}</div>
              <div className="text-sm font-medium text-gray-900">{c.currency} {c.tuitionFee?.toLocaleString()}</div>
              <div>{c.isActive ? <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Active</span> : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"><EyeOff size={11} />Hidden</span>}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(c)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"><Pencil size={14} /></button>
                {deleteConfirm === c.id ? (<div className="flex items-center gap-1"><button onClick={() => deleteMutation.mutate({ id: c.id })} className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">Confirm</button><button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300">Cancel</button></div>) : (<button onClick={() => setDeleteConfirm(c.id)} className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"><Trash2 size={14} /></button>)}
              </div>
            </div>
          ))}
        </div>
      </AdminTable>

      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5"><h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Course' : 'Add Course'}</h2><button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"><X size={18} /></button></div>
            <div className="min-h-0 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">

              {/* Basic Info */}
              <div className="sm:col-span-2 mb-1"><h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><BookOpen size={15} className="text-[#C41E3A]" />Basic Information</h3></div>
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700">University *</label><select value={form.universityId} onChange={e => setF('universityId', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is}><option value="">Select…</option>{(universities || []).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
              {[{ l: 'Course Name *', k: 'name', onCh: (v: string) => { setF('name', v); if (!editingId) setF('slug', v.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')) } }].map(f => (
                <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><input value={(form as any)[f.k]} onChange={e => f.onCh ? f.onCh(e.target.value) : setF(f.k, e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>
              ))}
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700">URL Slug *</label><input value={form.slug} onChange={e => setF('slug', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-primary font-mono" style={is} /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label><input value={form.subject} onChange={e => setF('subject', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>
              {[{ l: 'Level', k: 'level', type: 'select', options: LEVELS.map(l => ({ v: l, label: l.replace(/_/g, ' ') })) }, { l: 'Mode of Study', k: 'modeOfStudy', type: 'select', options: MODES.map(m => ({ v: m, label: m.replace(/_/g, ' ') })) }].map(f => (
                <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><select value={(form as any)[f.k]} onChange={e => setF(f.k, e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is}>{f.options.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}</select></div>
              ))}
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700">Campus</label><input value={form.campus} onChange={e => setF('campus', e.target.value)} placeholder="e.g. Aston Birmingham Campus" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>
              <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label><textarea value={form.description} onChange={e => setF('description', e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>

              {/* Study Details */}
              <div className="sm:col-span-2 mb-1"><h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><DollarSign size={15} className="text-[#C41E3A]" />Study Details</h3></div>
              {[{ l: 'Duration', k: 'duration', t: 'number' }, { l: 'Duration Unit', k: 'durationUnit', type: 'select', options: DURATION_UNITS.map(u => ({ v: u, label: u })) }, { l: 'Tuition Fee', k: 'tuitionFee', t: 'number' }, { l: 'Currency', k: 'currency' }, { l: 'Language', k: 'language' }].map(f => (
                f.type === 'select' ? <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><select value={(form as any)[f.k]} onChange={e => setF(f.k, e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is}>{f.options.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}</select></div> : <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><input type={f.t || 'text'} value={(form as any)[f.k]} onChange={e => setF(f.k, e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>
              ))}
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700">Start Date</label><input type="date" value={form.startDate} onChange={e => setF('startDate', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700">Apply By</label><input type="date" value={form.applicationDeadline} onChange={e => setF('applicationDeadline', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>

              {/* Admission */}
              <div className="sm:col-span-2 mb-1"><h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><GraduationCap size={15} className="text-[#C41E3A]" />Admission & Offers</h3></div>
              {[{ l: 'Application Fee', k: 'applicationFee', t: 'number' }, { l: 'Offer Response Time', k: 'offerResponseTime', p: 'e.g. 2 days' }, { l: 'Professional Accreditation', k: 'professionalAccreditation', p: 'e.g. CMI Level 7' }, { l: 'Brochure URL', k: 'brochureUrl', p: 'https://…' }].map(f => (
                <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><input type={f.t || 'text'} value={(form as any)[f.k]} onChange={e => setF(f.k, e.target.value)} placeholder={f.p} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>
              ))}
              <div className="sm:col-span-2 flex flex-wrap gap-3">
                {[{ k: 'backlogsAccepted', l: 'Backlogs Accepted' }, { k: 'gapYearsAccepted', l: 'Gap Years Accepted' }, { k: 'englishTestWaiver', l: 'English Test Waiver' }, { k: 'expressOffer', l: 'Express Offer' }].map(({ k, l }) => (
                  <button type="button" key={k} onClick={() => setF(k, !(form as any)[k])} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${(form as any)[k] ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${(form as any)[k] ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {l}
                  </button>
                ))}
              </div>

              {/* Highlights */}
              <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700">Key Highlights (one per line)</label><textarea value={form.highlights} onChange={e => setF('highlights', e.target.value)} rows={4} placeholder="Recognised for quality: Triple accreditation&#10;Top 5% globally (QS World Rankings)" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} /></div>

              {/* Requirements */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><FileText size={15} className="text-[#C41E3A]" />Requirements</h3>
                  <button type="button" onClick={() => setReqItems(p => [...p, { cat: 'ACADEMIC', title: '', desc: '' }])} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"><Plus size={12} />Add Requirement</button>
                </div>
                {reqItems.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 py-4 text-center"><p className="text-xs text-gray-400">No requirements added yet. Click "Add Requirement" to start.</p></div>
                ) : (
                  <div className="space-y-2">
                    {reqItems.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select value={r.cat} onChange={e => setReqItems(p => p.map((x, j) => j === i ? { ...x, cat: e.target.value } : x))} className="w-[140px] shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-primary" style={is}>
                          {['ACADEMIC', 'ENGLISH_LANGUAGE', 'IDENTITY', 'MEDICAL', 'PROFESSIONAL', 'OTHER'].map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                        </select>
                        <input value={r.title} onChange={e => setReqItems(p => p.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} placeholder="Requirement title" className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs outline-none focus:border-primary" style={is} />
                        <input value={r.desc} onChange={e => setReqItems(p => p.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} placeholder="Min. %" className="w-[100px] shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-primary" style={is} />
                        <button type="button" onClick={() => setReqItems(p => p.filter((_, j) => j !== i))} className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => setF('isActive', !form.isActive)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${form.isActive ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <span className={`h-2 w-2 rounded-full ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />Active / Published
                </button>
                <button type="button" onClick={() => setF('hasScholarship', !form.hasScholarship)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${form.hasScholarship ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <span className={`h-2 w-2 rounded-full ${form.hasScholarship ? 'bg-amber-500' : 'bg-gray-300'}`} />Has Scholarship
                </button>
                {form.hasScholarship && <input value={form.scholarshipDetails} onChange={e => setF('scholarshipDetails', e.target.value)} placeholder="Scholarship details…" className="flex-1 min-w-[200px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary" style={is} />}
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={onSave} disabled={createMutation.isPending || updateMutation.isPending} style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}</button>
              </div>
            </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
