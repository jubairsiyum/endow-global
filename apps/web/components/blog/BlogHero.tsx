'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { ds } from '@/lib/design-system'
import { staggerContainer, fadeUp } from './animations'

export function BlogHero() {
  return (
    <section className={`${ds.section.base} overflow-hidden bg-gradient-to-b from-[var(--bg-lighter)] via-[var(--bg-light)] to-white pb-10 pt-32 lg:pb-14 lg:pt-36`}>
      <div className="pointer-events-none absolute right-0 top-0 -mr-48 -mt-48 h-[420px] w-[420px] rounded-full bg-[var(--brand-light)] opacity-40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[420px] w-[420px] rounded-full bg-[var(--bg-light)] opacity-60 blur-3xl" aria-hidden="true" />
      <div className="bg-[var(--brand)]/4 absolute left-1/2 top-32 h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-[120px]" aria-hidden="true" />
      <div className={`${ds.container.wide} relative z-10`}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[42%_58%] xl:gap-16"
        >
          <div>
            <motion.div variants={fadeUp} className="mb-4">
              <div className="inline-block">
                <div className={`${ds.badge.sm} text-xs font-semibold tracking-wide text-[var(--brand)]`}>
                  <Zap className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
                  Education Knowledge Hub
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className={`${ds.headings.hero} mb-4 max-w-[700px]`}
            >
              <div className={`${ds.accent.strip} mb-4`} aria-hidden="true" />
              <div className={ds.body.primary}>
                Global Education
              </div>
              <div className="bg-gradient-to-r from-[var(--brand)] to-[var(--accent-red-gradient)] bg-clip-text text-transparent">
                Insights &amp; Guides
              </div>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className={`${ds.body.base} mb-7 max-w-[520px]`}
            >
              Study abroad guides, scholarship opportunities, visa updates, university insights, and
              real student success journeys.
            </motion.p>

            <motion.div variants={fadeUp} className={ds.grid.stats3}>
              <div className={`min-h-[95px] ${ds.card.rounded} border border-[var(--border-light)] bg-white p-4 ${ds.shadow.stat} ${ds.shadow.statHover}`}>
                <div className={`${ds.accent.line} mb-3`} aria-hidden="true" />
                <p className={`text-xl font-bold ${ds.body.primary}`}>500+</p>
                <p className={`${ds.body.muted} mt-1.5 uppercase tracking-wider`}>Expert Articles</p>
              </div>
              <div className={`min-h-[95px] ${ds.card.rounded} border border-[var(--border-light)] bg-white p-4 ${ds.shadow.stat} ${ds.shadow.statHover}`}>
                <div className={`${ds.accent.line} mb-3`} aria-hidden="true" />
                <p className={`text-xl font-bold ${ds.body.primary}`}>25K+</p>
                <p className={`${ds.body.muted} mt-1.5 uppercase tracking-wider`}>Monthly Readers</p>
              </div>
              <div className={`min-h-[95px] ${ds.card.rounded} border border-[var(--border-light)] bg-white p-4 ${ds.shadow.stat} ${ds.shadow.statHover}`}>
                <div className={`${ds.accent.line} mb-3`} aria-hidden="true" />
                <p className={`text-xl font-bold ${ds.body.primary}`}>20+</p>
                <p className={`${ds.body.muted} mt-1.5 uppercase tracking-wider`}>Partner Universities</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className="relative ml-auto w-full"
          >
            <div className={`group overflow-hidden ${ds.card.roundedXl} border border-[var(--border-light)] bg-white ${ds.shadow.hero} transition-all duration-500 ${ds.shadow.heroHover}`}>
              <div className="relative h-[220px] w-full overflow-hidden bg-[var(--bg-light)] lg:h-[300px]">
                <Image
                  src="/blog/gks-scholarship-guide.jpg"
                  alt="Complete GKS Scholarship Guide 2024"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4">
                <h3 className={`${ds.headings.card} mb-2.5 line-clamp-2 text-[20px] leading-snug`}>
                  From Dream University to Acceptance Letter
                </h3>
                <p className={`${ds.body.sm} mb-3 line-clamp-2`}>
                 Discover proven strategies, scholarship opportunities, and application insights that help students achieve international education success.
                </p>
                <div className={`flex items-center justify-between ${ds.divider.border} pt-4 text-xs ${ds.body.muted}`}>
                  <div className="flex items-center gap-3">
                    <span>By Endow Team</span>
                    <span>•</span>
                    <span>3 min read</span>
                  </div>
                </div>
                <div className="mt-3">
                  <button type="button" aria-label="Read article: From Dream University to Acceptance Letter" className={`${ds.button.primary} h-11 rounded-full px-4`}>
                    Read Article
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
