'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Send } from 'lucide-react'

const demoMessages = [
  { id: '1', from: 'Dr. Rahman', role: 'Counselor', message: 'Hello! I have reviewed your application. There are a few documents we need to discuss.', time: '10:30 AM', unread: true },
  { id: '2', from: 'Sarah Kim', role: 'Admissions - SNU', message: 'Your application has been received. Please complete the supplemental form by next week.', time: 'Yesterday', unread: false },
  { id: '3', from: 'Support Team', role: 'Endow Global', message: 'Welcome to Endow Global! Here are some tips to get started with your study abroad journey.', time: 'Jun 1', unread: false },
]

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Communicate with counselors and university representatives</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#11131a]">

        {/* Search + Compose */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <input type="text" placeholder="Search messages..."
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white" />
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#A01830] transition-colors">
            <Send size={14} /> New Message
          </button>
        </div>

        {demoMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No Messages</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Messages from counselors and universities will appear here.</p>
          </div>
        ) : (
          <div>
            {demoMessages.map(msg => (
              <div key={msg.id}
                className="flex items-start gap-4 border-b border-gray-50 px-5 py-4 transition-colors hover:bg-gray-50/50 cursor-pointer last:border-0 dark:border-gray-800 dark:hover:bg-[#1a1d25]/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{msg.from[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.from}</span>
                      <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-[#1a1d25] dark:text-gray-400">
                        {msg.role}
                      </span>
                      {msg.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{msg.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-gray-600 dark:text-gray-400">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
