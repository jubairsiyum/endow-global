'use client'

import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { useState } from 'react'

interface ConversationItem {
  id: string
  studentName?: string | null
  studentEmail?: string | null
  lastMessage?: string | null
  lastMessageAt?: string | Date | null
}

interface MessageItem {
  id: string
  senderRole?: string | null
  content?: string | null
  createdAt?: string | Date | null
}

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data: conversationsData, isLoading } = trpc.admin.messages.list.useQuery({ limit: 50 })
  const { data: messagesData } = trpc.admin.messages.getMessages.useQuery(
    { conversationId: selectedId! },
    { enabled: !!selectedId }
  )

  const conversations: ConversationItem[] = (conversationsData as ConversationItem[]) || []
  const messages: MessageItem[] = (messagesData as MessageItem[]) || []

  const selectedConvo = conversations.find((c) => c.id === selectedId)

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Manage student-counselor communications." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* CONVERSATION LIST */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.08]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Conversations</h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2"
                  style={{ borderColor: '#c41e3a', borderTopColor: 'transparent' }}
                />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <MessageSquare size={36} className="mb-2" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                      selectedId === c.id ? 'bg-[#c41e3a]/10 dark:bg-[#c41e3a]/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #c41e3a, #a01830)' }}
                      >
                        {c.studentName?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {c.studentName || 'Unknown'}
                        </p>
                        <p className="truncate text-xs text-gray-400">{c.studentEmail || ''}</p>
                        {c.lastMessage && (
                          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                            {c.lastMessage}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] text-gray-400">
                        {c.lastMessageAt
                          ? formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: true })
                          : ''}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MESSAGE DETAIL */}
        <div className="lg:col-span-2">
          <div className="flex h-[70vh] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            {!selectedConvo ? (
              <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
                <MessageSquare size={48} className="mb-3" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Select a conversation
                </p>
                <p className="text-sm">Click on a conversation to view messages</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/[0.08]">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300 lg:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #c41e3a, #a01830)' }}
                  >
                    {selectedConvo.studentName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedConvo.studentName || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400">{selectedConvo.studentEmail}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {messages.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-400">
                      No messages in this conversation.
                    </p>
                  ) : (
                    <div className="flex flex-col-reverse gap-4 p-6">
                      {[...messages].reverse().map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderRole === 'STUDENT' ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                              msg.senderRole === 'STUDENT'
                                ? 'bg-gray-100 dark:bg-gray-800'
                                : 'bg-[#c41e3a]/10 dark:bg-[#c41e3a]/20'
                            }`}
                          >
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              {msg.content}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-400">
                              {msg.createdAt
                                ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })
                                : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
