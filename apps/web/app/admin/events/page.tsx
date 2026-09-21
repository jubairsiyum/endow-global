'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import {
  Plus, Pencil, Trash2, X, Search, CalendarDays, MapPin,
  Globe, Star, Eye, EyeOff, Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from '@/lib/auth-client'
import { hasPermission, parsePermissionsJSON } from '@/lib/rbac'
import { UserRole } from '@endow/types'

const CATEGORIES = ['WEBINAR', 'WORKSHOP', 'FAIR', 'SEMINAR', 'DEADLINE', 'OTHER'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_COLORS: Record<Category, string> = {
  WEBINAR: '#3b82f6',
  WORKSHOP: '#8b5cf6',
  FAIR: '#10b981',
  SEMINAR: '#f59e0b',
  DEADLINE: '#ef4444',
  OTHER: '#6b7280',
}

interface EventForm {
  title: string; slug: string; excerpt: string; content: string
  coverImage: string; category: Category
  eventDate: string; eventEndDate: string
  location: string; registrationUrl: string
  tags: string; author: string
  isFeatured: boolean; isPublished: boolean
  metaTitle: string; metaDescription: string; ogImageUrl: string
}

const emptyForm: EventForm = {
  title: '', slug: '', excerpt: '', content: '',
  coverImage: '', category: 'OTHER',
  eventDate: '', eventEndDate: '',
  location: '', registrationUrl: '',
  tags: '', author: '',
  isFeatured: false, isPublished: false,
  metaTitle: '', metaDescription: '', ogImageUrl: '',
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

function formatDate(d: unknown): string {
  if (!d) return '—'
  try {
    return new Date(d as string).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return '—' }
}

const is = { background: '#fff', borderColor: '#e5e7eb', color: '#111827' }

export default function EventsPage() {
  const { data: session } = useSession()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EventForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const utils = trpc.useUtils()
  const role = (session?.user as any)?.role as UserRole | undefined
  const permissions = parsePermissionsJSON((session?.user as any)?.permissions)
  const canManage = role === UserRole.SUPER_ADMIN || hasPermission(permissions, 'events:manage', role)

  const { data: events, isLoading } = trpc.admin.events.list.useQuery({
    search: debouncedSearch || undefined,
    category: (categoryFilter as any) || undefined,
  })

  const createMutation = trpc.admin.events.create.useMutation({
    onSuccess: () => {
      toast.success('Event created')
      utils.admin.events.list.invalidate()
      setShowModal(false); setForm(emptyForm)
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create event'),
  })
  const updateMutation = trpc.admin.events.update.useMutation({
    onSuccess: () => {
      toast.success('Event updated')
      utils.admin.events.list.invalidate()
      setShowModal(false); setEditingId(null); setForm(emptyForm)
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update event'),
  })
  const deleteMutation = trpc.admin.events.delete.useMutation({
    onSuccess: () => {
      toast.success('Event deleted')
      utils.admin.events.list.invalidate()
      setDeleteConfirm(null)
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete event'),
  })

  function setF(key: string, value: any) { setForm(p => ({ ...p, [key]: value })) }

  function openCreate() {
    setEditingId(null); setForm(emptyForm); setSeoOpen(false); setShowModal(true)
  }

  function openEdit(ev: any) {
    setEditingId(ev.id)
    setForm({
      title: ev.title || '',
      slug: ev.slug || '',
      excerpt: ev.excerpt || '',
      content: ev.content || '',
      coverImage: ev.coverImage || '',
      category: ev.category || 'OTHER',
      eventDate: ev.eventDate ? new Date(ev.eventDate).toISOString().slice(0, 10) : '',
      eventEndDate: ev.eventEndDate ? new Date(ev.eventEndDate).toISOString().slice(0, 10) : '',
      location: ev.location || '',
      registrationUrl: ev.registrationUrl || '',
      tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : '',
      author: ev.author || '',
      isFeatured: ev.isFeatured || false,
      isPublished: ev.isPublished || false,
      metaTitle: ev.metaTitle || '',
      metaDescription: ev.metaDescription || '',
      ogImageUrl: ev.ogImageUrl || '',
    })
    setSeoOpen(false)
    setShowModal(true)
  }

  function onSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Title and slug are required')
      return
    }
    const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    const data: any = {
      ...form,
      tags,
      eventDate: form.eventDate ? new Date(form.eventDate) : null,
      eventEndDate: form.eventEndDate ? new Date(form.eventEndDate) : null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      coverImage: form.coverImage || null,
      location: form.location || null,
      registrationUrl: form.registrationUrl || null,
      author: form.author || null,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      ogImageUrl: form.ogImageUrl || null,
    }
    if (editingId) updateMutation.mutate({ id: editingId, ...data })
    else createMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage featured events shown on the homepage and public events page."
        buttonText={canManage ? 'Add Event' : undefined}
        onButtonClick={canManage ? openCreate : undefined}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events…"
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none lg:w-44"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[900px] grid-cols-7 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
            <div>Title</div>
            <div>Category</div>
            <div>Event Date</div>
            <div>Location</div>
            <div>Featured</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="py-10">
              <div className="flex justify-center pb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : !events?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <CalendarDays size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No events found</p>
              <p className="text-sm">Create your first event to get started.</p>
            </div>
          ) : events.map((ev: any) => (
            <div key={ev.id} className="grid min-w-[900px] grid-cols-7 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50">
              <div>
                <div className="font-semibold text-gray-900 line-clamp-1">{ev.title}</div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">/{ev.slug}</div>
              </div>
              <div>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    background: `${CATEGORY_COLORS[ev.category as Category] || '#6b7280'}15`,
                    color: CATEGORY_COLORS[ev.category as Category] || '#6b7280',
                    border: `1px solid ${CATEGORY_COLORS[ev.category as Category] || '#6b7280'}30`,
                  }}
                >
                  {ev.category?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-sm text-gray-700">{formatDate(ev.eventDate)}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {ev.location ? (
                  <>
                    {ev.location.toLowerCase().includes('online')
                      ? <Globe size={11} className="shrink-0" />
                      : <MapPin size={11} className="shrink-0" />}
                    <span className="truncate">{ev.location}</span>
                  </>
                ) : '—'}
              </div>
              <div>
                {ev.isFeatured
                  ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"><Star size={10} />Featured</span>
                  : <span className="text-xs text-gray-400">—</span>}
              </div>
              <div>
                {ev.isPublished
                  ? <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"><Eye size={11} />Published</span>
                  : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"><EyeOff size={11} />Draft</span>}
              </div>
              {canManage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(ev)}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === ev.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMutation.mutate({ id: ev.id })}
                        className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(ev.id)}
                      className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </AdminTable>

      {/* Create/Edit Modal */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Event' : 'Add Event'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="min-h-0 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">

                {/* Basic Info */}
                <div className="sm:col-span-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarDays size={15} className="text-[#C41E3A]" />Event Details
                  </h3>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => {
                      setF('title', e.target.value)
                      if (!editingId) {
                        setF('slug', e.target.value.toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-')
                          .replace(/^-|-$/g, ''))
                      }
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">URL Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setF('slug', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-mono outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setF('category', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Author / Posted By</label>
                  <input
                    value={form.author}
                    onChange={e => setF('author', e.target.value)}
                    placeholder="e.g. Endow Global Team"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Start Date</label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={e => setF('eventDate', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Event End Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Event End Date</label>
                  <input
                    type="date"
                    value={form.eventEndDate}
                    onChange={e => setF('eventEndDate', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Location</label>
                  <input
                    value={form.location}
                    onChange={e => setF('location', e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh or Online"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Registration URL */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Registration URL</label>
                  <input
                    value={form.registrationUrl}
                    onChange={e => setF('registrationUrl', e.target.value)}
                    placeholder="https://…"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Cover Image */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Cover Image URL</label>
                  <input
                    value={form.coverImage}
                    onChange={e => setF('coverImage', e.target.value)}
                    placeholder="/uploads/event-cover.jpg or https://…"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Excerpt */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Excerpt / Short Summary</label>
                  <textarea
                    value={form.excerpt}
                    onChange={e => setF('excerpt', e.target.value)}
                    rows={2}
                    placeholder="A brief description shown on cards and listings…"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Content */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Content</label>
                  <textarea
                    value={form.content}
                    onChange={e => setF('content', e.target.value)}
                    rows={6}
                    placeholder="Full event description, agenda, requirements…"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Tag size={13} />Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
                  </label>
                  <input
                    value={form.tags}
                    onChange={e => setF('tags', e.target.value)}
                    placeholder="e.g. Korea, scholarship, webinar"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    style={is}
                  />
                </div>

                {/* SEO (collapsible) */}
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setSeoOpen(o => !o)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span>SEO Settings (optional)</span>
                    <span className="text-xs text-gray-400">{seoOpen ? '▲' : '▼'}</span>
                  </button>
                  {seoOpen && (
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Title</label>
                        <input value={form.metaTitle} onChange={e => setF('metaTitle', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">OG Image URL</label>
                        <input value={form.ogImageUrl} onChange={e => setF('ogImageUrl', e.target.value)} placeholder="https://…" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
                        <textarea value={form.metaDescription} onChange={e => setF('metaDescription', e.target.value)} rows={2} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" style={is} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setF('isPublished', !form.isPublished)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${form.isPublished ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${form.isPublished ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setF('isFeatured', !form.isFeatured)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${form.isFeatured ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${form.isFeatured ? 'bg-amber-500' : 'bg-gray-300'}`} />
                    Featured on Homepage
                  </button>
                </div>

                {/* Footer buttons */}
                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingId ? 'Update Event' : 'Create Event'}
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
