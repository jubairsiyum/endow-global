'use client'

import { MessageSquare } from 'lucide-react'

export default function CounselorMessagesPage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>Messages</h1>
      <div className="rounded-xl border bg-white py-16 text-center" style={{ borderColor: '#e5e7eb' }}>
        <MessageSquare size={28} className="mx-auto" style={{ color: '#9ca3af' }} />
        <p className="mt-3 text-[13px]" style={{ color: '#6b7280' }}>Messaging hub — conversations with your students will appear here. Integration with existing chat system coming soon.</p>
      </div>
    </div>
  )
}
