'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { MessageSquare, Paperclip, Plus, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { cn, getInitials } from '@/lib/utils'
import { DashboardError } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, input } from '@/components/dashboard/ui'

export default function MessagesPage() {
  const { data: session } = useSession()
  const utils = trpc.useUtils()
  const { data: conversations, isLoading, isError: conversationsError, refetch: refetchConversations } = trpc.dashboard.messages.conversations.useQuery()
  const { data: counselors, isError: counselorsError } = trpc.dashboard.sessions.counselors.useQuery()
  const send = trpc.dashboard.messages.send.useMutation()
  const markRead = trpc.dashboard.messages.markRead.useMutation()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')
  const [newCounselorId, setNewCounselorId] = useState('')
  const [firstMessage, setFirstMessage] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: threadData, isError: threadError, refetch: refetchThread } = trpc.dashboard.messages.thread.useQuery(
    { conversationId: selectedId! },
    { enabled: !!selectedId }
  )

  const selectedConvo = threadData?.conversation ?? null
  const messages = threadData?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, selectedId])

  useEffect(() => {
    if (selectedId) {
      markRead.mutate(
        { conversationId: selectedId },
        { onSuccess: () => utils.dashboard.messages.conversations.invalidate() }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  async function handleSend() {
    const convo = selectedConvo
    if (!convo || !draft.trim()) return
    try {
      await send.mutateAsync({ counselorId: convo.counselorId, content: draft.trim() })
      setDraft('')
      utils.dashboard.messages.thread.invalidate()
      utils.dashboard.messages.conversations.invalidate()
    } catch (e: any) {
      toast.error(e.message || 'Failed to send')
    }
  }

  async function handleStartConversation(e: React.FormEvent) {
    e.preventDefault()
    if (!newCounselorId || !firstMessage.trim()) {
      toast.error('Pick a counselor and write a message')
      return
    }
    try {
      const res = await send.mutateAsync({ counselorId: newCounselorId, content: firstMessage.trim() })
      setFirstMessage('')
      setComposing(false)
      setSelectedId(res.conversationId)
      utils.dashboard.messages.conversations.invalidate()
    } catch (err: any) {
      toast.error(err.message || 'Failed to send')
    }
  }

  const currentUserId = session?.user?.id

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <StudentPageHeader
        eyebrow="Stay connected"
        title="Messages"
        description="Keep conversations with your counselor and university contacts in one place."
        action={
          <button onClick={() => setComposing((v) => !v)} className={btnPrimary}>
            <Plus size={15} /> New message
          </button>
        }
      />

      {composing && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleStartConversation}
          className={`${studentPanel} overflow-hidden p-5`}
        >
          <div className="space-y-3">
            <select
              value={newCounselorId}
              onChange={(e) => setNewCounselorId(e.target.value)}
              disabled={counselorsError}
              className={input}
            >
              <option value="">Select a counselor…</option>
              {(counselors ?? []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {counselorsError && <p className="text-xs text-red-600 dark:text-red-300">Counselors are temporarily unavailable. Try again shortly.</p>}
            <textarea
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              rows={2}
              placeholder="Say hi"
              className={cn(input, 'h-auto min-h-[72px] resize-none py-3')}
            />
            <button type="submit" disabled={send.isPending} className={btnPrimary}>
              Start conversation
            </button>
          </div>
        </motion.form>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${studentPanel} overflow-hidden`}>
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <div className={cn('border-gray-100 dark:border-gray-800', selectedId ? 'hidden md:block md:border-r' : '')}>
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Inbox</p>
              {(conversations ?? []).length > 0 && (
                <span className="text-xs font-semibold text-gray-400">{conversations?.length}</span>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-1 p-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800/60" />
                ))}
              </div>
            ) : conversationsError ? (
              <div className="p-4">
                <DashboardError title="Inbox unavailable" message="We could not load your conversations." onRetry={() => refetchConversations()} />
              </div>
            ) : (conversations ?? []).length === 0 ? (
              <div className="px-4 py-12 text-center">
                <MessageSquare size={28} className="mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">No conversations</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Start one with your counselor</p>
              </div>
            ) : (
              <ul>
                {(conversations ?? []).map((c: any) => {
                  const active = selectedId === c.id
                  const unread = c.unread > 0
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          'flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-[#1a1d25]/50',
                          active && 'bg-rose-50/60 dark:bg-rose-500/10'
                        )}
                      >
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-rose-700 text-xs font-bold text-white">
                          {getInitials(c.counselor?.user?.name ?? 'C')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn('truncate text-sm text-gray-900 dark:text-white', unread ? 'font-bold' : 'font-semibold')}>
                              {c.counselor?.user?.name ?? 'Counselor'}
                            </span>
                            <span className="shrink-0 text-[10px] text-gray-400">
                              {c.lastMessageAt ? formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: true }) : ''}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center justify-between gap-2">
                            <p className={cn('truncate text-xs', unread ? 'font-medium text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400')}>
                              {c.lastMessage}
                            </p>
                            {unread && (
                              <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white">
                                {c.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Thread */}
          <div className={cn('flex h-[520px] flex-col', selectedId ? '' : 'hidden md:flex')}>
            {threadError ? (
              <div className="flex flex-1 items-center p-6">
                <DashboardError title="Conversation unavailable" message="This conversation could not be loaded." onRetry={() => refetchThread()} />
              </div>
            ) : !selectedConvo ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <MessageSquare size={36} className="text-gray-300 dark:text-gray-600" />
                <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Select a conversation</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Or start a new one to reach your counselor</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                  <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600 md:hidden" aria-label="Back to inbox">
                    ←
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-rose-700 text-xs font-bold text-white">
                    {getInitials(selectedConvo.counselor?.user?.name ?? 'C')}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedConvo.counselor?.user?.name ?? 'Counselor'}
                    </p>
                    <p className="text-[11px] text-gray-400">Counselor</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <p className="pt-10 text-center text-xs text-gray-400">No messages yet — say hi</p>
                  ) : (
                    messages.map((m: any) => {
                      const isMine = currentUserId ? m.senderId === currentUserId : false
                      return (
                        <div key={m.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                          <div
                            className={cn(
                              'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                              isMine
                                ? 'rounded-br-md bg-rose-600 text-white'
                                : 'rounded-bl-md bg-gray-100 text-gray-800 dark:bg-[#1a1d25] dark:text-gray-200'
                            )}
                          >
                            {m.content}
                            <span className={cn('mt-1 block text-right text-[10px]', isMine ? 'text-white/70' : 'text-gray-400')}>
                              {m.createdAt ? formatDistanceToNow(new Date(m.createdAt), { addSuffix: true }) : ''}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="border-t border-gray-100 p-3 dark:border-gray-800">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      aria-label="Attach file"
                      onClick={() => toast.info('Attachments are coming soon')}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                    >
                      <Paperclip size={17} />
                    </button>
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message…"
                      className={input}
                    />
                    <button
                      type="submit"
                      disabled={send.isPending || !draft.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
