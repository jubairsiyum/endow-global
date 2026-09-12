'use client'

import { trpc } from '@/lib/trpc-client'
import { FileText } from 'lucide-react'
import { SABadge } from '@/components/super-admin/shared/SABadge'

export default function CounselorApplicationsPage() {
  const { data, isLoading } = trpc.counselor.getApplications.useQuery({ limit: 50 })

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>Applications</h1>
      <p className="text-[13px]" style={{ color: '#6b7280' }}>Applications from your assigned students</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
      ) : (data?.items?.length ?? 0) === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center" style={{ borderColor: '#e5e7eb' }}>
          <FileText size={28} className="mx-auto" style={{ color: '#9ca3af' }} />
          <p className="mt-3 text-[13px]" style={{ color: '#6b7280' }}>No applications yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
          <table className="w-full">
            <thead>
              <tr>
                {['Student', 'Course', 'University', 'Status', 'Updated'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]/50">
              {(data?.items ?? []).map((a: any) => (
                <tr key={a.id} className="hover:bg-[#E8A33D]/[0.04]">
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#111827' }}>{a.studentName || '—'}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{a.courseName || '—'}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{a.universityName || '—'}</td>
                  <td className="px-4 py-3"><SABadge variant="route">{a.status}</SABadge></td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
