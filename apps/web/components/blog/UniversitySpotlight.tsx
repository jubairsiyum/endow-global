'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe, Users, BookOpen, Award, ArrowRight } from 'lucide-react'
import { ds } from '@/lib/design-system'
import { ROUTES } from '@/lib/config/routes'
import { fadeUp } from './animations'

export function UniversitySpotlight() {
  return (
    <section className={`${ds.section.base} ${ds.section.border.y} ${ds.section.bg.light} ${ds.section.padding}`}>
      <div className={ds.container.base}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className={ds.sectionHeader.wrapper}
        >
          <h2 className={`${ds.headings.section} ${ds.sectionHeader.title}`}>
            University <span className="text-[var(--brand)]">Spotlight</span>
          </h2>
          <p className={ds.sectionHeader.subtitle}>Featured University of the Week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ y: -4 }}
          className={`overflow-hidden ${ds.card.rounded} ${ds.card.base} ${ds.shadow.card} transition-shadow`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-96 overflow-hidden lg:h-full">
              <Image
                src="https://images.unsplash.com/photo-1594897369641-d7aaf6be1767?w=800&h=600&fit=crop"
                alt="Hanseo University"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[var(--text-primary)]/25" />
            </div>

            <div className={`flex flex-col justify-center ${ds.card.paddingXl} lg:p-16`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-6 inline-block">
                  <div className={ds.badge.lg}>
                    <Globe className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
                    <span className="text-sm font-semibold text-[var(--brand)]">Featured This Week</span>
                  </div>
                </div>

                <h3 className={`${ds.headings.card} mb-2 text-4xl`}>Hanseo University</h3>
                <p className={`${ds.body.lg} mb-8`}>South Korea | Seosan, Chungcheongnam-do</p>

                <div className={`mb-10 grid grid-cols-2 gap-6 ${ds.divider.border} pb-10`}>
                  <div className="flex items-start gap-4">
                    <Award className="mt-1 h-6 w-6 flex-shrink-0 text-[var(--brand)]" aria-hidden="true" />
                    <div>
                      <p className={ds.body.sm}>World Ranking</p>
                      <p className={`${ds.headings.card} text-[22px]`}>Top 2000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="mt-1 h-6 w-6 flex-shrink-0 text-[var(--brand)]" aria-hidden="true" />
                    <div>
                      <p className={ds.body.sm}>Intl Students</p>
                      <p className={`${ds.headings.card} text-[22px]`}>3000+</p>
                    </div>
                  </div>
                </div>

                <p className={`${ds.body.base} mb-8`}>
                  Hanseo University is one of South Korea's leading private universities, offering
                  excellent programs in engineering, business, humanities, and sciences. Known for
                  its strong industry partnerships and scholarship opportunities for international students.
                </p>

                <div className="mb-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={ds.accent.dot} aria-hidden="true" />
                    <p className={ds.body.primary}>Strong scholarship opportunities for international students</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={ds.accent.dot} aria-hidden="true" />
                    <p className={ds.body.primary}>Modern campus with state-of-the-art facilities</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={ds.accent.dot} aria-hidden="true" />
                    <p className={ds.body.primary}>Active exchange programs with 100+ partner universities</p>
                  </div>
                </div>

                <Link href={ROUTES.universities} aria-label="Learn more about Hanseo University" className={`group ${ds.button.primarySquare}`}>
                  Learn More{' '}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
