'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { toast } from 'sonner'
import {
  Plus, Pencil, Trash2, X, Search, BookOpen, FileText, Upload, EyeOff,
  ExternalLink, Loader2, Globe, Tag,
} from 'lucide-react'

interface ResourceForm {
  type: 'BLOG' | 'FILE'
  title: string
  slug: string
  description: string
  content: string
  coverImage: string
  category: string
  tags: string
  author: string
  fileUrl: string
  fileName: string
  mimeType: string
  fileSize: string
  isPublished: boolean
  metaTitle: string
  metaDescription: string
  keywords: string
  canonicalUrl: string
  ogImageUrl: string
  noIndex: boolean
}

const emptyForm: ResourceForm = {
  type: 'BLOG',
  title: '', slug: '', description: '', content: '', coverImage: '',
  category: '', tags: '', author: '', fileUrl: '', fileName: '', mimeType: '', fileSize: '',
  isPublished: true, metaTitle: '', metaDescription: '', keywords: '', canonicalUrl: '', ogImageUrl: '',
  noIndex: false,
}

function splitComma(s: string): string[] {
  return s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []
}

function toCommaList(value: unknown): string {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string').join(', ')
  if (typeof value === 'string') {
    const s = value.trim()
    if (!s) return ''
    try {
      const p = JSON.parse(s)
      if (Array.isArray(p)) return p.filter((v) => typeof v === 'string').join(', ')
      if (typeof p === 'string') return p
    } catch {
      return value
    }
  }
  return ''
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

const is = { background: '#fff', borderColor: '#e5e7eb', color: '#111827' }

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BLOG' | 'FILE'>('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ResourceForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const utils = trpc.useUtils()
  const { data: resources, isLoading } = trpc.resource.admin.list.useQuery({
    search: search || undefined,
    type: typeFilter === 'ALL' ? undefined : typeFilter,
  })

  const createMutation = trpc.resource.admin.create.useMutation({
    onSuccess: () => { toast.success('Resource created'); utils.resource.admin.list.invalidate(); closeModal() },
    onError: (e: any) => toast.error(e?.message || 'Failed to create resource'),
  })
  const updateMutation = trpc.resource.admin.update.useMutation({
    onSuccess: () => { toast.success('Resource updated'); utils.resource.admin.list.invalidate(); closeModal() },
    onError: (e: any) => toast.error(e?.message || 'Failed to update resource'),
  })
  const deleteMutation = trpc.resource.admin.delete.useMutation({
    onSuccess: () => { toast.success('Resource deleted'); utils.resource.admin.list.invalidate(); setDeleteConfirm(null) },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete resource'),
  })

  function setF(key: string, value: any) { setForm((p) => ({ ...p, [key]: value })) }

  function closeModal() { setShowModal(false); setEditingId(null); setForm(emptyForm) }

  function openCreate() { setEditingId(null); setForm(emptyForm); setShowModal(true) }

  function openEdit(r: any) {
    setEditingId(r.id)
    setForm({
      type: r.type || 'BLOG',
      title: r.title || '',
      slug: r.slug || '',
      description: r.description || '',
      content: r.content || '',
      coverImage: r.coverImage || '',
      category: r.category || '',
      tags: toCommaList(r.tags),
      author: r.author || '',
      fileUrl: r.fileUrl || '',
      fileName: r.fileName || '',
      mimeType: r.mimeType || '',
      fileSize: r.fileSize?.toString() || '',
      isPublished: r.isPublished ?? true,
      metaTitle: r.metaTitle || '',
      metaDescription: r.metaDescription || '',
      keywords: toCommaList(r.keywords),
      canonicalUrl: r.canonicalUrl || '',
      ogImageUrl: r.ogImageUrl || '',
      noIndex: r.noIndex ?? false,
    })
    setShowModal(true)
  }

  function onTitleChange(v: string) {
    setF('title', v)
    if (!editingId) setF('slug', slugify(v))
  }

  async function uploadFile(file: File, target: 'cover' | 'file') {
    if (target === 'cover') setUploadingCover(true)
    else setUploadingFile(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-file', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok || !json.url) throw new Error(json.error || 'Upload failed')
      if (target === 'cover') {
        setF('coverImage', json.url)
        if (!form.ogImageUrl) setF('ogImageUrl', json.url)
      } else {
        setF('fileUrl', json.url)
        setF('fileName', json.name || file.name)
        setF('mimeType', json.type || file.type || '')
        setF('fileSize', String(json.size ?? file.size ?? ''))
        if (!form.title) setF('title', file.name)
      }
      toast.success('File uploaded')
    } catch (e: any) {
      toast.error(e.message || 'Upload failed')
    } finally {
      if (target === 'cover') setUploadingCover(false)
      else setUploadingFile(false)
    }
  }

  function onSave() {
    if (!form.title.trim() || !form.slug.trim()) { toast.error('Title and slug are required'); return }
    if (form.type === 'FILE' && !form.fileUrl.trim()) { toast.error('Please upload or provide a file URL'); return }

    const payload: any = {
      type: form.type,
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      content: form.content || null,
      coverImage: form.coverImage || null,
      category: form.category || null,
      tags: splitComma(form.tags),
      author: form.author || null,
      fileUrl: form.fileUrl || null,
      fileName: form.fileName || null,
      mimeType: form.mimeType || null,
      fileSize: form.fileSize ? parseInt(form.fileSize, 10) || null : null,
      isPublished: form.isPublished,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      keywords: splitComma(form.keywords),
      canonicalUrl: form.canonicalUrl || null,
      ogImageUrl: form.ogImageUrl || null,
      noIndex: form.noIndex,
    }

    if (editingId) updateMutation.mutate({ id: editingId, ...payload })
    else createMutation.mutate(payload)
  }

  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700'
  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resource Management"
        description="Manage blogs and downloadable files with SEO metadata."
        buttonText="Add Resource"
        onButtonClick={openCreate}
      />

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or file name…"
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none lg:w-44">
          <option value="ALL">All Types</option>
          <option value="BLOG">Blogs</option>
          <option value="FILE">Files</option>
        </select>
      </div>

      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-6 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
            <div>Resource</div>
            <div>Type</div>
            <div>Category</div>
            <div>Status</div>
            <div>Updated</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="py-10">
              <div className="flex justify-center pb-4"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : !resources?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No resources found</p>
              <p className="text-sm">Add your first blog post or file to get started.</p>
            </div>
          ) : (
            (resources as any[]).map((r) => (
              <div key={r.id} className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${r.type === 'BLOG' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {r.type === 'BLOG' ? <BookOpen size={16} /> : <FileText size={16} />}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-gray-900">{r.title}</div>
                    <div className="truncate text-xs text-gray-400">/{r.slug}</div>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.type === 'BLOG' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                    {r.type === 'BLOG' ? 'Blog' : 'File'}
                  </span>
                </div>
                <div className="truncate text-sm text-gray-600">{r.category || '—'}</div>
                <div className="flex items-center gap-1.5">
                  {r.isPublished ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Published</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"><EyeOff size={11} />Draft</span>
                  )}
                  {r.noIndex && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700" title="No-index (hidden from search engines)">noindex</span>}
                </div>
                <div className="text-xs text-gray-400">
                  {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(r)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"><Pencil size={14} /></button>
                  {r.fileUrl && <a href={r.fileUrl} target="_blank" rel="noopener" className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"><ExternalLink size={14} /></a>}
                  {deleteConfirm === r.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => deleteMutation.mutate({ id: r.id })} className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(r.id)} className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"><Trash2 size={14} /></button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </AdminTable>

      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Resource' : 'Add Resource'}</h2>
              <button onClick={closeModal} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
              {/* Type */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Type</label>
                <div className="flex gap-2">
                  {(['BLOG', 'FILE'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setF('type', t)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${form.type === t ? 'border-[#C41E3A] bg-[#C41E3A]/5 text-[#C41E3A]' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                    >
                      {t === 'BLOG' ? <BookOpen size={15} /> : <FileText size={15} />}
                      {t === 'BLOG' ? 'Blog Post' : 'File / Document'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Title *</label>
                <input value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="e.g. Complete Guide to Studying in South Korea" className={inputCls} style={is} />
              </div>
              <div>
                <label className={labelCls}>URL Slug *</label>
                <input value={form.slug} onChange={(e) => setF('slug', slugify(e.target.value))} placeholder="auto-generated" className={`${inputCls} font-mono`} style={is} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <input value={form.category} onChange={(e) => setF('category', e.target.value)} placeholder="e.g. Study Abroad" className={inputCls} style={is} />
              </div>
              <div>
                <label className={labelCls}>Author</label>
                <input value={form.author} onChange={(e) => setF('author', e.target.value)} placeholder="e.g. Endow Team" className={inputCls} style={is} />
              </div>
              <div>
                <label className={labelCls}>Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setF('tags', e.target.value)} placeholder="korea, scholarship, guide" className={inputCls} style={is} />
              </div>

              {/* Blog fields */}
              {form.type === 'BLOG' && (
                <>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Description / Excerpt</label>
                    <textarea value={form.description} onChange={(e) => setF('description', e.target.value)} rows={2} placeholder="Short summary shown in listings and search results." className={inputCls} style={is} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Content (HTML supported)</label>
                    <textarea value={form.content} onChange={(e) => setF('content', e.target.value)} rows={8} placeholder="<h2>Heading</h2><p>Body text…</p>" className={`${inputCls} font-mono text-xs`} style={is} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Cover Image</label>
                    <div className="flex items-center gap-2">
                      <input value={form.coverImage} onChange={(e) => setF('coverImage', e.target.value)} placeholder="https://… or upload" className={inputCls} style={is} />
                      <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        {uploadingCover ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Upload
                      </button>
                      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'cover'); e.target.value = '' }} />
                    </div>
                    {form.coverImage && <img src={form.coverImage} alt="cover preview" className="mt-2 h-32 w-56 rounded-lg border border-gray-200 object-cover" />}
                  </div>
                </>
              )}

              {/* File fields */}
              {form.type === 'FILE' && (
                <>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>File *</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingFile} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        {uploadingFile ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} {uploadingFile ? 'Uploading…' : 'Choose file'}
                      </button>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'file'); e.target.value = '' }} />
                      {form.fileName && <span className="truncate text-sm text-gray-600">{form.fileName} {form.fileSize ? `(${(Number(form.fileSize) / 1024).toFixed(1)} KB)` : ''}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>File URL (or paste directly)</label>
                    <input value={form.fileUrl} onChange={(e) => setF('fileUrl', e.target.value)} placeholder="/uploads/… or https://…" className={inputCls} style={is} />
                  </div>
                  <div>
                    <label className={labelCls}>File Name</label>
                    <input value={form.fileName} onChange={(e) => setF('fileName', e.target.value)} className={inputCls} style={is} />
                  </div>
                  <div>
                    <label className={labelCls}>MIME Type</label>
                    <input value={form.mimeType} onChange={(e) => setF('mimeType', e.target.value)} placeholder="application/pdf" className={inputCls} style={is} />
                  </div>
                </>
              )}

              {/* Publishing */}
              <div className="sm:col-span-2 flex items-center gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setF('isPublished', !form.isPublished)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${form.isPublished ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                  <span className={`h-2 w-2 rounded-full ${form.isPublished ? 'bg-green-500' : 'bg-gray-300'}`} />
                  {form.isPublished ? 'Published' : 'Draft'}
                </button>
              </div>

              {/* SEO */}
              <div className="sm:col-span-2 mb-1 flex items-center gap-2">
                <Globe size={15} className="text-[#C41E3A]" />
                <h3 className="text-sm font-semibold text-gray-900">SEO Options</h3>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Meta Title</label>
                <input value={form.metaTitle} onChange={(e) => setF('metaTitle', e.target.value)} placeholder="Overrides the page title (defaults to resource title)." className={inputCls} style={is} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Meta Description</label>
                <textarea value={form.metaDescription} onChange={(e) => setF('metaDescription', e.target.value)} rows={2} placeholder="For search engine snippet (defaults to description)." className={inputCls} style={is} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Keywords (comma-separated)</label>
                <input value={form.keywords} onChange={(e) => setF('keywords', e.target.value)} placeholder="korea, study abroad, scholarship" className={inputCls} style={is} />
              </div>
              <div>
                <label className={labelCls}>Canonical URL</label>
                <input value={form.canonicalUrl} onChange={(e) => setF('canonicalUrl', e.target.value)} placeholder="https://…" className={inputCls} style={is} />
              </div>
              <div>
                <label className={labelCls}>OG Image URL</label>
                <input value={form.ogImageUrl} onChange={(e) => setF('ogImageUrl', e.target.value)} placeholder="https://… (social share image)" className={inputCls} style={is} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <button type="button" onClick={() => setF('noIndex', !form.noIndex)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${form.noIndex ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                  <Tag size={14} /> No-index (hide from search engines)
                </button>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={onSave} disabled={createMutation.isPending || updateMutation.isPending} style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 hover:shadow-lg disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving…' : editingId ? 'Update Resource' : 'Create Resource'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
