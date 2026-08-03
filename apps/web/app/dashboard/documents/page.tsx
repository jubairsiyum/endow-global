'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Image, File, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react'

const demoDocs = [
  { id: '1', name: 'passport-scan.pdf', type: 'pdf', size: '1.2 MB', status: 'verified', uploaded: '2025-06-10' },
  { id: '2', name: 'transcript-bachelors.pdf', type: 'pdf', size: '3.8 MB', status: 'pending', uploaded: '2025-06-12' },
  { id: '3', name: 'ielts-score-report.pdf', type: 'pdf', size: '890 KB', status: 'verified', uploaded: '2025-05-28' },
  { id: '4', name: 'recommendation-letter.pdf', type: 'pdf', size: '420 KB', status: 'required', uploaded: null },
  { id: '5', name: 'statement-of-purpose.pdf', type: 'pdf', size: '180 KB', status: 'pending', uploaded: '2025-06-15' },
]

const statusIcons: Record<string, React.ElementType> = {
  verified: CheckCircle2,
  pending: Clock,
  required: AlertCircle,
}

const statusColors: Record<string, string> = {
  verified: 'text-green-500 bg-green-50 dark:bg-green-500/10',
  pending: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
  required: 'text-red-500 bg-red-50 dark:bg-red-500/10',
}

export default function DocumentsPage() {
  const [docs] = useState(demoDocs)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload and manage your application documents</p>
        </div>
      </motion.div>

      {/* Upload area */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-[#11131a] dark:hover:border-primary/30">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 mx-auto">
          <Upload size={24} className="text-primary" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">Upload Documents</h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Drag and drop or click to browse. PDFs up to 8 MB, images up to 4 MB.</p>
        <button className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-[#A01830] transition-colors">
          Browse Files
        </button>
      </motion.div>

      {/* Document list */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Uploaded Documents</h2>
        <div className="space-y-2">
          {docs.map(doc => {
            const StatusIcon = statusIcons[doc.status]
            const statusClass = statusColors[doc.status]
            return (
              <div key={doc.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1a1d25]">
                  <FileText size={18} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.size} {doc.uploaded ? `· Uploaded ${doc.uploaded}` : '· Not uploaded'}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusClass}`}>
                  <StatusIcon size={12} />
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
