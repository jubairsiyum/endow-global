'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import { MessageSquare, X, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data: conversations, isLoading } = trpc.admin.messages.list.useQuery({ limit: 50 })
  const { data: messages } = trpc.admin.messages.getMessages.useQuery(
    { conversationId: selectedId! },
    { enabled: !!selectedId }
  )

  const selectedConvo = conversations?.find(c => c.id === selectedId)

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Manage student-counselor communications." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* CONVERSATION LIST */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Conversations</h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            ) : !conversations?.length ? (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <MessageSquare size={36} className="mb-2" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {conversations.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-[#11131a] ${selectedId === c.id ? 'bg-red-50/50 dark:bg-[#2a1114]' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {c.studentName?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {c.studentName || 'Unknown'}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {c.studentEmail || ''}
                          </p>
                          {c.lastMessage && (
                            <p className="mt-0.5 truncate text-xs text-gray-500">{c.lastMessage}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-[10px] text-gray-400">
                          {c.lastMessageAt ? formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: true }) : ''}
                        </span>
                      </div>
                    </button>
                  ))
                }
              </div>
            )}
          </div>
        </div>

        {/* MESSAGE DETAIL */}
        <div className="lg:col-span-2">
          <div className="flex h-[70vh] flex-col rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            {!selectedConvo ? (
              <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
                <MessageSquare size={48} className="mb-3" />
                <p className="text-lg font-semibold text-gray-500">Select a conversation</p>
                <p className="text-sm">Click on a conversation to view messages</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                  <button onClick={() => setSelectedId(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden dark:hover:bg-[#222530]">
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {selectedConvo.studentName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedConvo.studentName || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{selectedConvo.studentEmail}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {!messages?.length ? (
                    <p className="py-8 text-center text-sm text-gray-400">No messages in this conversation.</p>
                  ) : (
                    <div className="space-y-3">
                      {[...messages].reverse().map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderRole === 'STUDENT' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.senderRole === 'STUDENT' ? 'bg-gray-100 dark:bg-[#222530]' : 'bg-primary/10 dark:bg-[#2a1114]'}`}>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{msg.content}</p>
                            <p className="mt-1 text-[10px] text-gray-400">
                              {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }) : ''}
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
