'use client'

import { motion } from 'framer-motion'
import { Download, FileText, CheckCircle } from 'lucide-react'

const resources = [
  {
    title: 'SOP Guide',
    description: 'Complete guide to writing a compelling Statement of Purpose',
    downloads: '2.4K',
    icon: FileText
  },
  {
    title: 'LOR Template',
    description: 'Professional Letter of Recommendation template',
    downloads: '1.8K',
    icon: FileText
  },
  {
    title: 'CV Template',
    description: 'Academic CV template optimized for university applications',
    downloads: '3.1K',
    icon: FileText
  },
  {
    title: 'Visa Checklist',
    description: 'Step-by-step D-10 visa application checklist',
    downloads: '4.2K',
    icon: CheckCircle
  },
  {
    title: 'Application Checklist',
    description: 'Complete university application requirements checklist',
    downloads: '2.9K',
    icon: CheckCircle
  },
  {
    title: 'University Comparison',
    description: 'Spreadsheet to compare universities side-by-side',
    downloads: '1.5K',
    icon: FileText
  }
]

export function ResourceCenter() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <section className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#111827] mb-4">Resource Center</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">Download premium resources to enhance your applications</p>
        </motion.div>

        {/* RESOURCES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group rounded-xl bg-white border border-[#E5E7EB] hover:border-red-200 p-8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-lg bg-[#FEF2F2] border border-[#E5E7EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7 text-[#C41E3A]" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-6 h-6 text-[#C41E3A]" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#111827] mb-3">{resource.title}</h3>
                <p className="text-[#6B7280] mb-6 text-base leading-relaxed">{resource.description}</p>

                <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
                  <span className="text-sm text-[#6B7280]">{resource.downloads} downloads</span>
                  <button className="h-10 px-5 rounded-lg bg-[#C41E3A] text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
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
