'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { ds } from '@/lib/design-system'
import { staggerContainer, fadeUpFast } from './animations'
import { trendingArticles, latestScholarships, latestVisaUpdates } from '@/lib/data/sidebar'

export function Sidebar() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="sticky top-32 space-y-8"
    >
      <motion.div
        variants={fadeUpFast}
        className={`${ds.card.rounded} ${ds.card.base} p-8 ${ds.shadow.smHover}`}
      >
        <div className="mb-6 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-[var(--brand)]" aria-hidden="true" />
          <h3 className={`${ds.headings.sub} ${ds.body.primary}`}>Trending Now</h3>
        </div>
        <div className="space-y-4">
          {trendingArticles.map((article) => {
            const Icon = article.icon
            return (
              <motion.div
                key={article.id}
                whileHover={{ x: 4 }}
                className="border-b border-[var(--border-default)] pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-light)]">
                    <Icon className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className={`cursor-pointer ${ds.body.sm} font-semibold ${ds.body.primary} transition-colors hover:text-[var(--brand)]`}>
                      {article.title}
                    </p>
                    <p className={`${ds.body.muted} mt-1`}>{article.views} views</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUpFast}
        className={`${ds.card.rounded} border border-[var(--border-default)] bg-[var(--bg-light)] p-8 ${ds.shadow.smHover}`}
      >
        <h3 className={`${ds.headings.cardMd} mb-6 ${ds.body.primary}`}>Latest Scholarships</h3>
        <div className="space-y-4">
          {latestScholarships.map((scholarship, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="border-b border-[var(--border-default)] pb-4 last:border-0 last:pb-0"
            >
              <p className={`${ds.body.sm} font-semibold ${ds.body.primary}`}>{scholarship.name}</p>
              <p className={`${ds.body.muted} mt-1`}>Deadline: {scholarship.deadline}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUpFast}
        className={`${ds.card.rounded} border border-[var(--border-default)] bg-[var(--brand-light)] p-8 ${ds.shadow.smHover}`}
      >
        <h3 className={`${ds.headings.cardMd} mb-6 ${ds.body.primary}`}>Visa Updates</h3>
        <div className="space-y-4">
          {latestVisaUpdates.map((update, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="border-b border-[var(--border-default)] pb-4 last:border-0 last:pb-0"
            >
              <p className={`${ds.body.sm} font-semibold ${ds.body.primary}`}>{update.title}</p>
              <p className={`${ds.body.muted} mt-1`}>{update.date}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
