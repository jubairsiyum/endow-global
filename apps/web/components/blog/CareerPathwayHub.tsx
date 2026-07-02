'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ds } from '@/lib/design-system'
import { ROUTES } from '@/lib/config/routes'
import { pathways } from '@/lib/data/career-pathways'

function MilestoneCard({ pathway, index }: { pathway: typeof pathways[0]; index: number }) {
  const Icon = pathway.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center"
    >
      <div className={`h-10 w-10 rounded-full bg-white ${ds.shadow.icon} flex items-center justify-center mb-4`}>
        <Icon className="h-5 w-5 text-[var(--brand)]" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className={ds.divider.connector} aria-hidden="true" />
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`${ds.card.interactive} w-full max-w-[240px]`}
      >
        <div className={`h-[320px] rounded-[24px] bg-white border border-[var(--border-warm)] ${ds.shadow.card} ${ds.shadow.brandHover} ${ds.card.padding} transition-shadow duration-300 overflow-hidden flex flex-col`}>
          <div className={ds.badge.stepBadge}>
            <span className="text-[11px] font-bold tracking-[0.12em] text-[var(--brand)]">
              {pathway.step}
            </span>
          </div>
          <h3 className={`${ds.headings.card} mb-2 text-[20px] leading-tight tracking-tight ${ds.body.primaryDark}`}>
            {pathway.title}
          </h3>
          <div className={`${ds.accent.bar} mb-3`} aria-hidden="true" />
          <p className={`${ds.body.sm} mb-3 leading-6 text-[var(--text-slate)]`}>
            {pathway.description}
          </p>
          <div className="space-y-2 mt-auto">
            {pathway.details.map((detail, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`${ds.accent.dotSm} flex-shrink-0`} aria-hidden="true" />
                <span className={`${ds.body.sm} text-[var(--text-slate-dark)]`}>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function CareerPathwayHub() {
  return (
    <section className={`${ds.section.base} ${ds.section.border.y} ${ds.section.bg.redTint}`}>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <img
          src="/images/career-pathway-bg.png"
          className="w-full h-full object-contain opacity-30"
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className={`relative z-10 ${ds.container.base} pt-12 pb-16`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={ds.sectionHeader.wrapperTight}
        >
          <h2 className={`${ds.headings.section} ${ds.sectionHeader.titleDark}`}>
            Career <span className="text-[var(--brand)]">Pathway</span> Hub
          </h2>
          <p className={`mt-4 ${ds.body.lg} text-[var(--text-slate)]`}>
            From student to career professional in four strategic steps
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center max-w-6xl mx-auto">
          {pathways.map((pathway, index) => (
            <MilestoneCard key={index} pathway={pathway} index={index} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href={ROUTES.courses} aria-label="View career resources and courses" className={`group ${ds.button.primarySquare}`}>
            View Career Resources
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
