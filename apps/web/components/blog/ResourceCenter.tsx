'use client'

import { motion } from 'framer-motion'
import { Download, ArrowRight } from 'lucide-react'
import { ds } from '@/lib/design-system'
import { staggerContainer, springUp } from './animations'
import { resources } from '@/lib/data/resources'

export function ResourceCenter() {
  return (
    <section className={`${ds.section.base} ${ds.section.bg.lighter} ${ds.section.paddingCompact}`}>
      <div className={ds.container.base}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className={ds.sectionHeader.wrapperTight}
        >
          <h2 className={`${ds.headings.section} mb-3 ${ds.sectionHeader.title}`}>
            <span className="text-[var(--brand)]">Resource</span> Center
          </h2>
          <p className={`${ds.container.prose} ${ds.body.lg}`}>
            Access exclusive templates and expert guides to elevate your university applications.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
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
                variants={springUp}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative flex flex-col justify-between overflow-hidden ${ds.card.roundedLg} border border-gray-200/60 bg-white p-5 ${ds.shadow.sm} transition-shadow duration-300 ${ds.shadow.brandHover}`}
              >
                <div className="absolute -left-[100%] top-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-in-out group-hover:left-[100%] group-hover:opacity-100" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50/80 text-gray-500 ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-[var(--brand)] group-hover:text-white group-hover:ring-[var(--brand)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className={ds.badge.downloadBadge}>
                      <Download className="h-3 w-3" aria-hidden="true" />
                      {resource.downloads}
                    </div>
                  </div>
                  <h3 className={`${ds.headings.cardMd} mb-1.5 transition-colors group-hover:text-[var(--brand)]`}>
                    {resource.title}
                  </h3>
                  <p className={`${ds.body.sm} line-clamp-2`}>
                    {resource.description}
                  </p>
                </div>
                <div className={`relative z-10 mt-4 ${ds.divider.border} pt-3`}>
                  <button type="button" aria-label={`Download ${resource.title}`} className={`flex w-full items-center justify-between ${ds.body.sm} font-semibold ${ds.body.primary} transition-colors duration-300 group-hover:text-[var(--brand)]`}>
                    Download Now
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 transition-all duration-300 group-hover:bg-[var(--brand)]">
                      <ArrowRight className="h-4 w-4 text-[var(--brand)] transition-all duration-300 group-hover:text-white" aria-hidden="true" />
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
