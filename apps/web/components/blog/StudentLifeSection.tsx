'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ds } from '@/lib/design-system'
import { staggerContainerSlow, fadeUp } from './animations'
import { studentLifeCards } from '@/lib/data/student-life'

export function StudentLifeSection() {
  return (
    <section className={`${ds.section.base} ${ds.section.bg.white} ${ds.section.padding}`}>
      <div className={ds.container.base}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className={ds.sectionHeader.wrapper}
        >
          <h2 className={`${ds.headings.section} ${ds.sectionHeader.title}`}>
            Student Life in <span className="text-[var(--brand)]">Korea</span>
          </h2>
          <p className={ds.sectionHeader.subtitle}>
            Everything you need to know about living as an international student
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className={ds.grid.cards4}
        >
          {studentLifeCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className={`${ds.card.interactive} overflow-hidden ${ds.card.rounded} ${ds.card.base} ${ds.shadow.cardHover}`}
              >
                <div className="relative h-48 overflow-hidden bg-[var(--bg-light)]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[var(--brand)] opacity-0 transition-opacity duration-300 group-hover:opacity-15" />
                </div>
                <div className={ds.card.paddingLg}>
                  <div className={`h-12 w-12 rounded-lg ${card.color} mb-4 flex items-center justify-center transition-transform group-hover:scale-105`}>
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className={`${ds.headings.card} mb-3`}>{card.title}</h3>
                  <p className={ds.body.base}>{card.description}</p>
                  <button type="button" aria-label={`Learn more about ${card.title}`} className={`${ds.button.ghost} mt-6 group-hover:translate-x-1`}>
                    Learn More <ArrowRight className="h-5 w-5" aria-hidden="true" />
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
