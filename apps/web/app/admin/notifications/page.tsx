'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import { Bell, Send, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsPage() {
  const [search, setSearch] = useState('')
  const [showSend, setShowSend] = useState(false)
  const [sendForm, setSendForm] = useState({ title: '', body: '', userId: '' })

  const utils = trpc.useUtils()
  const { data: notifications, isLoading } = trpc.admin.notifications.list.useQuery({
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
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notifications..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white"
        />
      </div>

      {/* NOTIFICATIONS LIST */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : !notifications?.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white py-16 text-gray-400 dark:border-gray-800 dark:bg-[#1a1d25]">
          <Bell size={48} className="mb-3" />
          <p className="text-lg font-semibold text-gray-500">No notifications</p>
          <p className="text-sm">Send your first system notification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n: any) => (
            <div
              key={n.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" />
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
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEND MODAL */}
      {showSend && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-12 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#1a1d25]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Notification</h2>
              <button onClick={() => setShowSend(false)} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#222530]">
                <Send size={18} />
              </button>
            </div>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                <input required value={sendForm.title} onChange={e => setSendForm(p => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
                <textarea required value={sendForm.body} onChange={e => setSendForm(p => ({ ...p, body: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">User ID (leave empty to broadcast)</label>
                <input value={sendForm.userId} onChange={e => setSendForm(p => ({ ...p, userId: e.target.value }))} placeholder="Leave empty for all users" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowSend(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-[#222530]">Cancel</button>
                <button type="submit" disabled={sendMutation.isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#920715] disabled:opacity-50">
                  {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
