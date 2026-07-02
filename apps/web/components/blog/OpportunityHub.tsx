'use client'

import { motion } from 'framer-motion'
import { ds } from '@/lib/design-system'
import { staggerContainer, fadeUp } from './animations'
import { opportunities, featuredOpportunities } from '@/lib/data/opportunities'

export function OpportunityHub() {
  return (
    <section className={`${ds.section.base} ${ds.section.bg.white} ${ds.section.padding}`}>
      <div className={ds.container.base}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className={ds.sectionHeader.wrapper}
        >
          <h2 className={`${ds.headings.section} ${ds.sectionHeader.title}`}>Opportunity <span className="text-[var(--brand)]">Hub</span></h2>
          <p className={ds.sectionHeader.subtitle}>
            Explore thousands of opportunities for your growth
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className={`mb-16 ${ds.grid.cards4}`}
        >
          {opportunities.map((opp, index) => {
            const Icon = opp.icon
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -8 }}
                className={`${ds.card.interactive} overflow-hidden ${ds.card.rounded}`}
              >
                <div className={`relative ${ds.card.rounded} ${ds.card.paddingLg} ${opp.color} h-full overflow-hidden text-white ${ds.shadow.brandLg}`}>
                  <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                  <div className="relative z-10">
                    <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-10 w-10" aria-hidden="true" />
                    </div>
                    <h3 className={`${ds.headings.card} mb-2`}>{opp.title}</h3>
                    <p className={`${ds.body.sm} mb-6 text-white/80`}>{opp.description}</p>
                    <div className="text-4xl font-bold transition-transform group-hover:translate-x-1">
                      {opp.count}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-6"
        >
          <h3 className={`${ds.headings.card} mb-8 ${ds.body.primary}`}>Latest Opportunities</h3>
          <div className={ds.grid.cols2}>
            {featuredOpportunities.map((opp, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className={`${ds.card.rounded} border border-[var(--border-default)] bg-[var(--bg-light)] ${ds.card.paddingLg} transition-all hover:border-red-200 ${ds.shadow.cardHover}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className={ds.badge.outline}>{opp.type}</span>
                  <span className={ds.body.muted}>Deadline: {opp.deadline}</span>
                </div>
                <h4 className={`${ds.headings.sm} mb-2 ${ds.body.primary}`}>{opp.title}</h4>
                <p className={ds.body.sm}>{opp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
