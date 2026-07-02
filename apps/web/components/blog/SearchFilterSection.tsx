'use client'

import { motion } from 'framer-motion'
import { ds } from '@/lib/design-system'
import { categories } from '@/lib/data/categories'

type SearchFilterSectionProps = {
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export function SearchFilterSection({
  activeCategory,
  setActiveCategory,
}: SearchFilterSectionProps) {
  return (
    <section className={`${ds.section.base} ${ds.section.border.y} ${ds.section.bg.light} py-20 lg:py-24`}>
      <div className={ds.container.base}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`h-11 rounded-full px-5 text-base font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[var(--brand)] text-white shadow-[0_10px_30px_rgba(196,30,58,0.18)]'
                  : 'border border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:border-[var(--brand)]'
              }`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
