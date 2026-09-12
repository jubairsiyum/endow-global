'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import { Search, Users } from 'lucide-react'
import { SAInput } from '@/components/super-admin/shared/SAInput'

function formatCountries(value: unknown): string {
  if (!value) return '—'
  if (Array.isArray(value)) return (value as string[]).slice(0, 2).join(', ') || '—'
  if (typeof value === 'string') {
    const t = value.trim()
    if (!t) return '—'
    try {
      const p = JSON.parse(t)
      if (Array.isArray(p)) return (p as string[]).slice(0, 2).join(', ') || '—'
      if (p != null) return String(p)
    } catch {
      return t
    }
  }
  return String(value)
}

export default function CounselorStudentsPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = trpc.counselor.getAssignedStudents.useQuery({ search: search || undefined, limit: 20 })

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>My Students</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>Students assigned to you — {data?.items?.length ?? 0} total</p>
        </div>
      </div>

      <div className="w-[320px]">
        <SAInput placeholder="Search by name or email…" icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
        </div>
      ) : (data?.items?.length ?? 0) === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center" style={{ borderColor: '#e5e7eb' }}>
          <Users size={28} className="mx-auto" style={{ color: '#9ca3af' }} />
          <p className="mt-3 text-[13px]" style={{ color: '#6b7280' }}>{search ? 'No students match your search' : 'No students assigned yet'}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Student', 'Email', 'Nationality', 'Target Countries', 'Progress', 'Joined'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]/50">
                {(data?.items ?? []).map((s: any) => (
                  <tr key={s.id} className="hover:bg-[#E8A33D]/[0.04]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #E8A33D, #c48b2e)', color: '#fff' }}>
                          {(s.name || 'ST').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: '#111827' }}>{s.name || 'Student'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{s.email}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{s.nationality || '—'}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{formatCountries(s.targetCountries)}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#111827' }}>{s.completionPercent ?? 0}%</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
