'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle, Image as ImageIcon, ArrowRight } from 'lucide-react'

function typeIcon(mime: string | null | undefined) {
  if (mime?.startsWith('image')) return ImageIcon
  if (mime?.includes('pdf')) return FileText
  return CheckCircle
}

export function ResourceCenter({ resources }: { resources: any[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } },
  }

  if (resources.length === 0) return null

  return (
    <section className="relative bg-[#FAFAFA] py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
            Resources
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            <span className="text-[#C41E3A]">Resource</span> Center
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Access exclusive templates and expert guides to elevate your university applications.
          </p>
        </motion.div>

        {/* RESOURCES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {resources.map((resource) => {
            const Icon = typeIcon(resource.mimeType)
            return (
              <motion.div
                key={resource.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-gray-200/60 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-[0_15px_40px_rgba(196,30,58,0.08)]"
              >
                <div className="absolute -left-[100%] top-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-in-out group-hover:left-[100%] group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50/80 text-gray-500 ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-[#C41E3A] group-hover:text-white group-hover:ring-[#C41E3A]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {resource.fileSize ? (
                      <div className="flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gray-500">
                        {(resource.fileSize / 1024).toFixed(0)} KB
                      </div>
                    ) : null}
                  </div>

                  <h3 className="mb-1.5 text-lg font-bold text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                    {resource.title || resource.fileName}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#6B7280] line-clamp-2">
                    {resource.description || ''}
                  </p>
                </div>

                <div className="relative z-10 mt-4 border-t border-gray-100 pt-3">
                  {(() => {
                    const safeFileUrl = resource.fileUrl?.trim().startsWith('http') || resource.fileUrl?.trim().startsWith('/') 
                      ? resource.fileUrl.trim() 
                      : '#';
                    return (
                      <a
                        href={safeFileUrl}
                        target={safeFileUrl !== '#' ? "_blank" : undefined}
                        rel="noopener noreferrer"
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#111827] transition-colors duration-300 group-hover:text-[#C41E3A]"
                  >
                    Download Now
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 transition-all duration-300 group-hover:bg-[#C41E3A]">
                      <ArrowRight className="h-4 w-4 text-[#C41E3A] transition-all duration-300 group-hover:text-white" />
                    </div>
                  </a>
                  )
                })()}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
