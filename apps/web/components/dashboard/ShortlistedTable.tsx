'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  Heart,
  Loader2,
  MapPin,
  MoreVertical,
  Search,
  Sparkles,
  Trash2,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import { formatCurrency } from '@/lib/utils'

interface Props {
  shortlisted?: any[]
  matches?: any[]
  applications?: any[]
  counselor?: {
    id: string
    name: string
    rating?: number
  } | null
}

export function ShortlistedTable({ shortlisted = [], applications = [], counselor }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<{ id: string; top: number; right: number } | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const removeShortlist = trpc.dashboard.shortlist.remove.useMutation()

  const appliedCourseIds = new Set(
    (applications || [])
      .map((a: any) => a.courseId || a.course?.id)
      .filter(Boolean)
  )
  const appliedCourseSlugs = new Set(
    (applications || [])
      .map((a: any) => a.course?.slug || a.courseSlug)
      .filter(Boolean)
  )
  const isItemApplied = (item: any) => {
    if (item.courseId && appliedCourseIds.has(item.courseId)) return true
    if (item.slug && appliedCourseSlugs.has(item.slug)) return true
    return false
  }

  // Strictly map only courses that the student has actually saved in their database shortlist
  const rows = (shortlisted || []).map((s) => {
    const c = s.course
    return {
      id: s.id,
      courseId: s.courseId,
      name: c?.name || s.courseName || 'Degree Program',
      slug: c?.slug || s.courseSlug || '',
      subject: c?.subject || s.subject || 'General Studies',
      level: c?.level || s.level || 'POSTGRADUATE',
      universityName: c?.university?.name || s.universityName || 'Partner University',
      country: c?.university?.country || s.universityCountry || 'International',
      city: c?.university?.city || s.universityCity || '',
      tuitionFee: c?.tuitionFee,
      currency: c?.currency || 'USD',
      hasScholarship: !!c?.hasScholarship,
      advisorName: counselor?.name || 'Endow Advisory Desk',
    }
  })

  const filtered = rows.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyCourseLink = (slug: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/courses/${slug}`
      navigator.clipboard.writeText(url)
      toast.success('Course link copied to clipboard!')
    }
    setMenuAnchor(null)
  }

  const handleRemove = async (courseId: string) => {
    try {
      setRemovingId(courseId)
      await removeShortlist.mutateAsync({ courseId })
      await utils.dashboard.shortlist.list.invalidate()
      await utils.dashboard.overview.invalidate()
      toast.success('Removed from shortlist')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove from shortlist')
    } finally {
      setRemovingId(null)
      setMenuAnchor(null)
    }
  }

  const getApplyUrl = (item: {
    name?: string
    slug?: string
    universityName?: string
    country?: string
    level?: string
  }) => {
    const params = new URLSearchParams()
    if (item.name) params.set('courseName', item.name)
    if (item.slug) params.set('slug', item.slug)
    if (item.universityName && item.universityName !== 'Partner University') {
      params.set('university', item.universityName)
    }
    if (item.country && item.country !== 'International') {
      params.set('country', item.country)
    }
    if (item.level) params.set('level', item.level)
    return `/apply-now?${params.toString()}`
  }

  const activeMenuItem = menuAnchor ? rows.find((r) => r.id === menuAnchor.id) : null

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]">
      {/* Table Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Shortlisted Courses
            </h3>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {rows.length} {rows.length === 1 ? 'Program' : 'Programs'}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Programs you saved for quick tracking and application planning
          </p>
        </div>

        {rows.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortlist..."
                className="h-8.5 w-44 rounded-xl border border-slate-200/80 bg-slate-50/70 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-900 sm:w-56"
              />
            </div>

            <Link
              href="/dashboard/shortlisted"
              className="flex h-8.5 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 text-xs font-semibold text-slate-700 hover:border-rose-200 hover:bg-rose-50/40 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span>Manage</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>

      {/* Main Table / Empty State */}
      <div className="mt-4 overflow-x-auto">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 px-4 text-center dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
              <Heart size={22} />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              Your Shortlist is Empty
            </h4>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              Explore university programs below and tap the heart icon to shortlist your favourite courses.
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-rose-700"
            >
              <span>Explore Courses</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No shortlisted courses matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider dark:border-slate-800/80">
                <th className="pb-3 pl-2">Program & University</th>
                <th className="pb-3">Field & Level</th>
                <th className="pb-3">Tuition & Aid</th>
                <th className="pb-3">Advisory Desk</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Course & University */}
                  <td className="py-3.5 pl-2 max-w-[280px]">
                    <div className="font-bold text-slate-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400 transition-colors truncate">
                      <Link href={item.slug ? `/courses/${item.slug}` : '/courses'}>
                        {item.name}
                      </Link>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin size={11} className="shrink-0 text-slate-400" />
                      <span className="truncate">
                        {item.universityName} · {item.country}
                      </span>
                    </div>
                  </td>

                  {/* Subject & Degree Level */}
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.subject}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {item.level.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Tuition & Scholarship */}
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.tuitionFee != null
                        ? `${formatCurrency(item.tuitionFee, item.currency)} / yr`
                        : 'Contact for fees'}
                    </p>
                    {item.hasScholarship && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 mt-0.5">
                        <Award size={10} /> Scholarship Available
                      </span>
                    )}
                  </td>

                  {/* Advisor / Counselor from Database */}
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                        <UserCheck size={12} />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.advisorName}
                      </span>
                    </div>
                  </td>

                  {/* Functional Actions */}
                  <td className="py-3.5 pr-2 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                      {isItemApplied(item) ? (
                        <Link
                          href="/dashboard/application"
                          title="You have already applied. View application in your dashboard"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors"
                        >
                          <CheckCircle2 size={12} />
                          <span>Applied</span>
                        </Link>
                      ) : (
                        <Link
                          href={getApplyUrl(item)}
                          title="Apply to this program"
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors"
                        >
                          <Sparkles size={12} />
                          <span>Apply</span>
                        </Link>
                      )}

                      <Link
                        href={item.slug ? `/courses/${item.slug}` : '/courses'}
                        title="View Course Details"
                        className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Eye size={15} />
                      </Link>

                      {/* Direct Delete / Unlist Button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.courseId)}
                        disabled={removingId === item.courseId}
                        title="Remove from shortlist"
                        aria-label="Remove from shortlist"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors disabled:opacity-50"
                      >
                        {removingId === item.courseId ? (
                          <Loader2 size={15} className="animate-spin text-rose-600" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>

                      {/* 3-Dots Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (menuAnchor?.id === item.id) {
                            setMenuAnchor(null)
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setMenuAnchor({
                              id: item.id,
                              top: rect.bottom + 6,
                              right: Math.max(window.innerWidth - rect.right, 16),
                            })
                          }
                        }}
                        aria-label="More actions"
                        className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                      >
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Fixed Floating Dropdown (Escapes table container overflow clipping) */}
      <AnimatePresence>
        {menuAnchor && activeMenuItem && (
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setMenuAnchor(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{ top: menuAnchor.top, right: menuAnchor.right }}
              className="fixed z-50 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <Link
                href={activeMenuItem.slug ? `/courses/${activeMenuItem.slug}` : '/courses'}
                onClick={() => setMenuAnchor(null)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <ExternalLink size={13} />
                <span>View Program</span>
              </Link>

              {isItemApplied(activeMenuItem) ? (
                <Link
                  href="/dashboard/application"
                  onClick={() => setMenuAnchor(null)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-colors"
                >
                  <CheckCircle2 size={13} />
                  <span>View Application</span>
                </Link>
              ) : (
                <Link
                  href={getApplyUrl(activeMenuItem)}
                  onClick={() => setMenuAnchor(null)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Sparkles size={13} />
                  <span>Apply Now</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => copyCourseLink(activeMenuItem.slug)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <Copy size={13} />
                <span>Copy Link</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                type="button"
                onClick={() => handleRemove(activeMenuItem.courseId)}
                disabled={removingId === activeMenuItem.courseId}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
              >
                {removingId === activeMenuItem.courseId ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                <span>Remove from Shortlist</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
