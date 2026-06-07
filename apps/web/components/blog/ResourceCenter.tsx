'use client'

import { motion } from 'framer-motion'
import { Download, FileText, CheckCircle } from 'lucide-react'

const resources = [
  {
    title: 'SOP Guide',
    description: 'Complete guide to writing a compelling Statement of Purpose',
    downloads: '2.4K',
    icon: FileText,
  },
  {
    title: 'LOR Template',
    description: 'Professional Letter of Recommendation template',
    downloads: '1.8K',
    icon: FileText,
  },
  {
    title: 'CV Template',
    description: 'Academic CV template optimized for university applications',
    downloads: '3.1K',
    icon: FileText,
  },
  {
    title: 'Visa Checklist',
    description: 'Step-by-step D-10 visa application checklist',
    downloads: '4.2K',
    icon: CheckCircle,
  },
  {
    title: 'Application Checklist',
    description: 'Complete university application requirements checklist',
    downloads: '2.9K',
    icon: CheckCircle,
  },
  {
    title: 'University Comparison',
    description: 'Spreadsheet to compare universities side-by-side',
    downloads: '1.5K',
    icon: FileText,
  },
]

export function ResourceCenter() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#111827] lg:text-5xl">Resource Center</h2>
          <p className="mx-auto max-w-2xl text-xl text-[#6B7280]">
            Download premium resources to enhance your applications
          </p>
        </motion.div>

        {/* RESOURCES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group rounded-xl border border-[#E5E7EB] bg-white p-8 transition-all duration-300 hover:border-red-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#FEF2F2] transition-transform group-hover:scale-105">
                    <Icon className="h-7 w-7 text-[#C41E3A]" />
                  </div>
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <Download className="h-6 w-6 text-[#C41E3A]" />
                  </div>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-[#111827]">{resource.title}</h3>
                <p className="mb-6 text-base leading-relaxed text-[#6B7280]">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-6">
                  <span className="text-sm text-[#6B7280]">{resource.downloads} downloads</span>
                  <button className="h-10 rounded-lg bg-[#C41E3A] px-5 text-sm font-semibold text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100">
                    Download
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
