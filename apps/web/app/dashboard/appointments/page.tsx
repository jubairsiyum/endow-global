'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Video, MapPin, User } from 'lucide-react'
import { format } from 'date-fns'

const demoSessions = [
  { id: '1', type: 'Application Review', with: 'Dr. Rahman', date: new Date(2025, 6, 18, 14, 30), mode: 'Online', status: 'confirmed', meetingUrl: 'https://meet.endow.global/abc123' },
  { id: '2', type: 'University Selection', with: 'Sarah Kim', date: new Date(2025, 6, 20, 10, 0), mode: 'Online', status: 'confirmed', meetingUrl: 'https://meet.endow.global/def456' },
  { id: '3', type: 'Document Check', with: 'Dr. Rahman', date: new Date(2025, 6, 25, 15, 0), mode: 'In-Person', status: 'pending', meetingUrl: null },
]

export default function AppointmentsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Schedule and manage counseling sessions</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#A01830] transition-colors">
          Book Session
        </button>
      </motion.div>

      {/* Upcoming */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Upcoming Sessions</h2>
        <div className="space-y-3">
          {demoSessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-[#11131a]">
              <Calendar size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No Appointments</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Book a session with a counselor to discuss your study options.</p>
            </div>
          ) : (
            demoSessions.map(session => (
              <div key={session.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#11131a]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-primary/5">
                      <span className="text-lg font-bold text-primary" style={{ lineHeight: 1 }}>
                        {format(session.date, 'd')}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500">{format(session.date, 'MMM')}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{session.type}</h3>
                      <div className="mt-1.5 space-y-1">
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <User size={12} /> {session.with}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} /> {format(session.date, 'EEEE, MMM d · h:mm a')}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          {session.mode === 'Online' ? <Video size={12} /> : <MapPin size={12} />}
                          {session.mode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      session.status === 'confirmed'
                        ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}>
                      {session.status}
                    </span>
                    {session.meetingUrl && (
                      <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-[#A01830] transition-colors">
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
