'use client'

import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Search, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface NotificationItem {
  id: string
  title: string
  body: string
  createdAt: string | Date
  user?: {
    name?: string | null
  } | null
}

export default function NotificationsPage() {
  const [search, setSearch] = useState('')
  const [showSend, setShowSend] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sendForm, setSendForm] = useState({ title: '', body: '', userId: '' })

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()
  const { data: notificationsData, isLoading } = trpc.admin.notifications.list.useQuery({
    search: search || undefined,
  })

  const sendMutation = trpc.admin.notifications.sendSystem.useMutation({
    onSuccess: () => {
      utils.admin.notifications.list.invalidate()
      setShowSend(false)
      setSendForm({ title: '', body: '', userId: '' })
    },
  })

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    sendMutation.mutate({
      title: sendForm.title,
      body: sendForm.body,
      userId: sendForm.userId || undefined,
    })
  }

  const notifications: NotificationItem[] = (notificationsData as NotificationItem[]) || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Track system notifications and send alerts."
        buttonText="Send Notification"
        onButtonClick={() => setShowSend(true)}
      />

      {/* SEARCH */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notifications..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder:text-gray-500"
        />
      </div>

      {/* NOTIFICATIONS LIST */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white py-16 text-gray-400 dark:border-white/[0.08] dark:bg-[#18181b]">
          <Bell size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No notifications</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Send your first system notification.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-white/[0.08] dark:bg-[#18181b]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#c41e3a]" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{n.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{n.body}</p>
                    {n.user && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        {n.user.name ? `Sent to: ${n.user.name}` : 'Broadcast'}
                      </p>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {n.createdAt
                    ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                    : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEND MODAL */}
      {showSend &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Send Notification
                </h2>
                <button
                  onClick={() => setShowSend(false)}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <Send size={18} />
                </button>
              </div>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title *
                  </label>
                  <input
                    required
                    value={sendForm.title}
                    onChange={(e) => setSendForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <textarea
                    required
                    value={sendForm.body}
                    onChange={(e) => setSendForm((p) => ({ ...p, body: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    User ID (leave empty to broadcast)
                  </label>
                  <input
                    value={sendForm.userId}
                    onChange={(e) => setSendForm((p) => ({ ...p, userId: e.target.value }))}
                    placeholder="Leave empty for all users"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSend(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendMutation.isPending}
                    style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
