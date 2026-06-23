'use client'

import { motion } from 'framer-motion'
import { Download, FileText, CheckCircle, ArrowRight } from 'lucide-react'

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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
  }

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
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            <span className="text-[#C41E3A]">Resource</span> Center
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#6B7280]">
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
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                
                className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-gray-200/60 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-[0_15px_40px_rgba(196,30,58,0.08)]"
              >
                <div className="absolute -left-[100%] top-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-in-out group-hover:left-[100%] group-hover:opacity-100" />

                <div className="relative z-10">
                  
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50/80 text-gray-500 ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-[#C41E3A] group-hover:text-white group-hover:ring-[#C41E3A]">
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gray-500 transition-colors group-hover:border-red-100 group-hover:bg-red-50 group-hover:text-[#C41E3A]">
                      <Download className="h-3 w-3" />
                      {resource.downloads}
                    </div>
                  </div>

                  <h3 className="mb-1.5 text-lg font-bold text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                    {resource.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#6B7280] line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                
                <div className="relative z-10 mt-4 border-t border-gray-100 pt-3">
                  <button className="flex w-full items-center justify-between text-sm font-semibold text-[#111827] transition-colors duration-300 group-hover:text-[#C41E3A]">
                    Download Now
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 transition-all duration-300 group-hover:bg-[#C41E3A]">
                      <ArrowRight className="h-4 w-4 text-[#C41E3A] transition-all duration-300 group-hover:text-white" />
                    </div>
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