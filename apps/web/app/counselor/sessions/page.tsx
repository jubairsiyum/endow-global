'use client'

import { trpc } from '@/lib/trpc-client'
import { Calendar, Video, Clock } from 'lucide-react'

export default function CounselorSessionsPage() {
  const { data: sessions, isLoading } = trpc.counselor.getSessions.useQuery({ limit: 50 })

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>Sessions</h1>
      <p className="text-[13px]" style={{ color: '#6b7280' }}>Upcoming and past sessions with your students</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
      ) : (sessions?.length ?? 0) === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center" style={{ borderColor: '#e5e7eb' }}>
          <Calendar size={28} className="mx-auto" style={{ color: '#9ca3af' }} />
          <p className="mt-3 text-[13px]" style={{ color: '#6b7280' }}>No sessions yet. Students will book via their dashboard.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(sessions ?? []).map((s: any) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border bg-white p-4" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <Clock size={16} style={{ color: '#4FD1A5' }} />
                </div>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: '#111827' }}>{s.studentName || 'Student'} · {s.studentEmail || ''}</p>
                  <p className="text-[12px]" style={{ color: '#6b7280' }}>{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : '—'} · {s.duration} min · {s.status}</p>
                  {s.notes && <p className="text-[11px]" style={{ color: '#6b7280' }}>{s.notes}</p>}
                </div>
              </div>
              {s.meetingUrl && s.status === 'SCHEDULED' && (
                <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8A33D] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#c48b2e]">
                  <Video size={13} /> Join
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
