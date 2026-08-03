'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Image, File, ExternalLink, Trash2, AlertTriangle, RefreshCw } from 'lucide-react'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'

const demoResources = [
  { id: '1', name: 'university-brochure-2025.pdf', type: 'application/pdf', size: '2.4 MB', uploadedBy: 'Admin', date: '2025-07-15', url: '/docs/brochure.pdf' },
  { id: '2', name: 'seoul-campus-hero.jpg', type: 'image/jpeg', size: '1.8 MB', uploadedBy: 'Admin', date: '2025-07-14', url: '/images/campus.jpg' },
  { id: '3', name: 'admission-checklist.docx', type: 'application/msword', size: '340 KB', uploadedBy: 'Admin', date: '2025-07-12', url: '/docs/checklist.docx' },
]

const typeIcon = (mime: string) => {
  if (mime.startsWith('image')) return <Image size={16} />
  if (mime.startsWith('application/pdf')) return <FileText size={16} />
  return <File size={16} />
}

export default function AdminResourcesPage() {
  const [resources] = useState(demoResources)
  const [uploading, setUploading] = useState(false)

  const handleFakeUpload = () => {
    setUploading(true)
    setTimeout(() => setUploading(false), 1500)
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-[20px] font-bold tracking-tight"
            style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Resource Management
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#8890A8' }}>
            Upload and manage documents, images, and media files
          </p>
        </div>
        <SAButton variant="primary" size="md" onClick={handleFakeUpload} disabled={uploading}>
          <Upload size={15} />
          {uploading ? 'Uploading...' : 'Upload File'}
        </SAButton>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-xl border-2 border-dashed p-10 text-center transition-colors hover:border-[#E8A33D]/40"
        style={{ borderColor: '#262C42', background: '#161B2E' }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full mx-auto"
          style={{ background: 'rgba(232, 163, 61, 0.06)' }}
        >
          <Upload size={24} style={{ color: '#E8A33D' }} />
        </div>
        <p className="mt-4 text-[14px] font-medium" style={{ color: '#E8EAF2' }}>
          Drag & drop files here, or click to browse
        </p>
        <p className="mt-1 text-[12px]" style={{ color: '#8890A8' }}>
          Supports images (up to 4 MB), PDFs (up to 8 MB), and documents
        </p>
        <SAButton variant="secondary" size="sm" className="mt-4">
          Browse Files
        </SAButton>
      </motion.div>

      {/* File list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="overflow-hidden rounded-xl border"
        style={{ background: '#161B2E', borderColor: '#262C42' }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-3"
          style={{ borderColor: '#262C42' }}
        >
          <h2 className="text-[15px] font-semibold" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
            Uploaded Files
          </h2>
          <SABadge variant="route">{resources.length} files</SABadge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#161B2E' }}>
                {['File', 'Type', 'Size', 'Uploaded By', 'Date', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: '#8890A8', fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr]:border-t [&_tr]:border-[#262C42]/50">
              {resources.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                        style={{ background: 'rgba(136, 144, 168, 0.06)' }}
                      >
                        <span style={{ color: '#E8A33D' }}>{typeIcon(r.type)}</span>
                      </div>
                      <span className="text-[13px] font-medium truncate max-w-[240px]" style={{ color: '#E8EAF2' }}>
                        {r.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: '#8890A8' }}>
                    {r.type.split('/')[1]?.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: '#E8EAF2', fontFamily: "'JetBrains Mono', monospace" }}>
                    {r.size}
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: '#8890A8' }}>
                    {r.uploadedBy}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: '#8890A8' }}>
                    {r.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <SATooltip content="Open file">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]" style={{ color: '#4FD1A5' }}>
                          <ExternalLink size={14} />
                        </button>
                      </SATooltip>
                      <SATooltip content="Delete">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#F0625B]/10" style={{ color: '#F0625B' }}>
                          <Trash2 size={14} />
                        </button>
                      </SATooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
