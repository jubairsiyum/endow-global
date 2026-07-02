'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, User, Calendar } from 'lucide-react'
import { ds } from '@/lib/design-system'
import { staggerContainer, fadeUpFast } from './animations'
import { articles, categoryColors } from '@/lib/data/articles'

type ArticlesGridProps = {
  category: string
}

export function ArticlesGrid({ category }: ArticlesGridProps) {
  const filteredArticles =
    category === 'All Articles'
      ? articles
      : articles.filter((article) => article.category === category)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="grid grid-cols-1 gap-8"
    >
      {filteredArticles.map((article) => (
        <motion.article
          key={article.id}
          variants={fadeUpFast}
          whileHover={{ y: -4 }}
          className={`${ds.card.interactive} overflow-hidden ${ds.card.rounded} ${ds.card.base} hover:${ds.shadow.cardHover}`}
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-3">
            <div className="relative h-64 overflow-hidden bg-[var(--bg-light)] md:col-span-1 md:h-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-between p-8 md:col-span-2">
              <div>
                <div className="mb-4">
                  <span className={`${ds.badge.lg} text-sm font-semibold ${categoryColors[article.category]}`}>
                    {article.category}
                  </span>
                </div>
                <h3 className={`${ds.headings.card} mb-3 line-clamp-2 transition-colors group-hover:text-[var(--brand)]`}>
                  {article.title}
                </h3>
                <p className={`line-clamp-3 ${ds.body.base}`}>
                  {article.description}
                </p>
              </div>
              <div className={`mt-6 flex flex-col justify-between gap-4 ${ds.divider.border} pt-6 sm:flex-row sm:items-center`}>
                <div className={`flex flex-wrap items-center gap-6 ${ds.body.sm}`}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {article.readTime}
                  </div>
                </div>
                <button type="button" aria-label={`Read more about ${article.title}`} className={ds.button.ghostLg}>
                  Read More <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
