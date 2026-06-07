'use client'

import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  'All Articles',
  'Scholarships',
  'Visa Guide',
  'Study Abroad',
  'University News',
  'Student Life',
  'Career',
  'Success Stories',
  'Resources',
  'Company Updates',
]

type SearchFilterSectionProps = {
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export function SearchFilterSection({
  activeCategory,
  setActiveCategory,
}: SearchFilterSectionProps) {
  return (
    <section className="relative border-y border-[#E5E7EB] bg-[#F8FAFC] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CATEGORY PILLS */}
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
                  ? 'bg-[#C41E3A] text-white shadow-[0_10px_30px_rgba(196,30,58,0.18)]'
                  : 'border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#C41E3A]'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
