'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Pencil, Trash2, X, Users, Star } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/super-admin/shared/ImageUploader'

function safeArray(val: any): string[] {
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : [] } catch { return [] }
  }
  return []
}

export default function CounselorsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', bio: '', expertiseSubjects: '', expertiseCountries: '', languages: 'English', sessionRate: '0', calUsername: '', isAvailable: true, image: '' })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const utils = trpc.useUtils()
  const { data: counselors, isLoading } = trpc.admin.counselors.list.useQuery()

  const createMutation = trpc.admin.counselors.create.useMutation({
    onSuccess: () => { toast.success('Counselor created'); utils.admin.counselors.list.invalidate(); closeModal() },
    onError: (e: any) => toast.error(e?.message || 'Failed to create counselor'),
  })
  const updateMutation = trpc.admin.counselors.update.useMutation({
    onSuccess: () => { toast.success('Counselor updated'); utils.admin.counselors.list.invalidate(); closeModal() },
    onError: (e: any) => toast.error(e?.message || 'Failed to update counselor'),
  })
  const deleteMutation = trpc.admin.counselors.delete.useMutation({
    onSuccess: () => { toast.success('Counselor deleted'); utils.admin.counselors.list.invalidate(); setDeleteConfirm(null) },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete counselor'),
  })

  function closeModal() { setShowModal(false); setEditingId(null); setForm({ name: '', email: '', bio: '', expertiseSubjects: '', expertiseCountries: '', languages: 'English', sessionRate: '0', calUsername: '', isAvailable: true, image: '' }) }
  function openCreate() { setEditingId(null); setShowModal(true) }
  function openEdit(c: any) {
    setEditingId(c.id)
    setForm({ name: c.name || '', email: c.email || '', bio: c.counselorProfile?.bio || '', expertiseSubjects: safeArray(c.counselorProfile?.expertiseSubjects).join(', '), expertiseCountries: safeArray(c.counselorProfile?.expertiseCountries).join(', '), languages: safeArray(c.counselorProfile?.languages).join(', ') || 'English', sessionRate: c.counselorProfile?.sessionRate?.toString() || '0', calUsername: c.counselorProfile?.calUsername || '', isAvailable: c.counselorProfile?.isAvailable ?? true, image: c.image || '' })
    setShowModal(true)
  }

  function buildData() {
    return {
      name: form.name, email: form.email, bio: form.bio || undefined,
      expertiseSubjects: form.expertiseSubjects.split(',').map(s => s.trim()).filter(Boolean),
      expertiseCountries: form.expertiseCountries.split(',').map(s => s.trim()).filter(Boolean),
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      sessionRate: Number(form.sessionRate) || 0, calUsername: form.calUsername || undefined,
      isAvailable: form.isAvailable,
    }
  }

  function onSave() {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email are required'); return }
    const data = buildData()
    if (editingId) { updateMutation.mutate({ id: editingId, ...data, image: form.image || undefined }) }
    else { createMutation.mutate({ ...data, image: form.image || undefined }) }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Counselors" description="Manage counselor accounts and profiles." buttonText="Add Counselor" onButtonClick={openCreate} />

      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-6 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600"><div>Counselor</div><div>Expertise</div><div>Languages</div><div>Rating</div><div>Status</div><div>Actions</div></div>
          {isLoading ? (
            <div className="py-10"><div className="flex justify-center pb-4"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5"><div className="h-4 w-32 animate-pulse rounded bg-gray-200" /><div className="h-4 w-24 animate-pulse rounded bg-gray-200" /><div className="h-4 w-16 animate-pulse rounded bg-gray-200" /><div className="h-4 w-12 animate-pulse rounded bg-gray-200" /><div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" /><div className="h-8 w-20 animate-pulse rounded bg-gray-200" /></div>))}</div>
          ) : (counselors || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400"><Users size={48} className="mb-3" /><p className="text-lg font-semibold text-gray-500">No counselors found</p><p className="text-sm">Add your first counselor to get started.</p></div>
          ) : (counselors || []).map((c: any) => (
            <div key={c.id} className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 hover:bg-gray-50">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #4ade80, #2dd4bf)' }}>{c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} /> : <span className="text-sm font-bold text-white">{c.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}</span>}</div><div><div className="font-semibold text-gray-900">{c.name}</div><div className="text-xs text-gray-400">{c.email}</div></div></div>
              <div className="flex flex-wrap gap-1">{safeArray(c.counselorProfile?.expertiseSubjects).slice(0, 2).map((s, i) => <span key={i} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{s}</span>)}{safeArray(c.counselorProfile?.expertiseSubjects).length === 0 && <span className="text-xs text-gray-400">—</span>}</div>
              <div className="text-sm text-gray-600">{safeArray(c.counselorProfile?.languages).join(', ') || '—'}</div>
              <div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-sm font-medium text-gray-700">{c.counselorProfile?.rating?.toFixed(1) || '—'}</span></div>
              <div>{c.counselorProfile?.isAvailable !== false ? <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Available</span> : <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">Unavailable</span>}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(c)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"><Pencil size={14} /></button>
                {deleteConfirm === c.id ? (<div className="flex items-center gap-1"><button onClick={() => deleteMutation.mutate({ id: c.id })} className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">Confirm</button><button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300">Cancel</button></div>) : (<button onClick={() => setDeleteConfirm(c.id)} className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"><Trash2 size={14} /></button>)}
              </div>
            </div>
          ))}
        </div>
      </AdminTable>

      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5"><h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Counselor' : 'Add Counselor'}</h2><button onClick={closeModal} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"><X size={18} /></button></div>
            <div className="min-h-0 overflow-y-auto px-6 py-6">
              <ImageUploader value={form.image} onChange={(v) => setForm(p => ({ ...p, image: v }))} label="Profile Image" previewHeight={120} />
              <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
                {[{ l: 'Full Name *', k: 'name', t: 'text' }, { l: 'Email *', k: 'email', t: 'email' }].map(f => (
                  <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><input type={f.t} value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" /></div>
                ))}
                <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700">Bio</label><textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" /></div>
                {[{ l: 'Expertise Subjects (comma)', k: 'expertiseSubjects', p: 'e.g. MBA, Engineering' }, { l: 'Expertise Countries (comma)', k: 'expertiseCountries', p: 'e.g. USA, UK' }].map(f => (
                  <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><input value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.p} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" /></div>
                ))}
                {[{ l: 'Languages (comma)', k: 'languages', p: 'English, Bengali' }, { l: 'Session Rate ($)', k: 'sessionRate', t: 'number', m: 0 }, { l: 'Cal.com Username', k: 'calUsername' }].map(f => (
                  <div key={f.k}><label className="mb-1.5 block text-sm font-medium text-gray-700">{f.l}</label><input type={f.t || 'text'} min={f.m} value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.p} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" /></div>
                ))}
                <div className="sm:col-span-2 flex items-center gap-2"><input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 accent-primary" /><span className="text-sm font-medium text-gray-700">Available for consultations</span></div>
                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="button" onClick={onSave} disabled={createMutation.isPending || updateMutation.isPending} style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Counselor' : 'Create Counselor'}
                  </button>
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
