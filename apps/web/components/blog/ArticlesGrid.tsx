'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, User, Calendar } from 'lucide-react'

const categoryColors: Record<string, string> = {
  Scholarships: 'bg-[#FEF2F2] text-[#C41E3A]',
  'Visa Guide': 'bg-[#F8FAFC] text-[#111827]',
  'Study Abroad': 'bg-[#FEF2F2] text-[#C41E3A]',
  'University News': 'bg-[#F8FAFC] text-[#111827]',
  'Student Life': 'bg-[#FEF2F2] text-[#C41E3A]',
  'Success Stories': 'bg-[#F8FAFC] text-[#111827]',
  Career: 'bg-[#FEF2F2] text-[#C41E3A]',
  Resources: 'bg-[#FEF2F2] text-[#C41E3A]',
  'Company Updates': 'bg-[#F8FAFC] text-[#111827]',
}

function readTime(content: string | null | undefined): string {
  const words = (content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

type ArticlesGridProps = {
  articles: any[]
}

export function ArticlesGrid({ articles }: ArticlesGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5E7EB] py-20 text-center text-gray-400">
        No articles published yet.
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-8"
    >
      {articles.map((article) => (
        <motion.article
          key={article.id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-3">
            {/* IMAGE */}
            <div className="relative h-64 overflow-hidden bg-[#F8FAFC] md:col-span-1 md:h-full">
              {(() => {
                const safeCoverImage = article.coverImage?.trim().startsWith('http') || article.coverImage?.trim().startsWith('/') 
                  ? article.coverImage.trim() 
                  : null;
                  
                return safeCoverImage ? (
                  <Image
                    src={safeCoverImage}
                    alt={article.title || 'Article'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-200">
                    {article.title?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                )
              })()}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-between p-8 md:col-span-2">
              <div>
                {article.category && (
                  <div className="mb-4">
                    <span className={`inline-flex h-10 items-center rounded-full border border-[#E5E7EB] px-4 text-sm font-semibold ${categoryColors[article.category] ?? 'bg-[#F8FAFC] text-[#111827]'}`}>
                      {article.category}
                    </span>
                  </div>
                )}

                <h3 className="mb-3 line-clamp-2 text-2xl font-bold text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                  {article.title}
                </h3>

                <p className="line-clamp-3 text-base leading-relaxed text-[#6B7280]">
                  {article.description || ''}
                </p>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#E5E7EB] pt-6 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#6B7280]">
                  {article.author && (
                    <div className="flex items-center gap-2"><User className="h-4 w-4" />{article.author}</div>
                  )}
                  {article.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {readTime(article.content)}
                  </div>
                </div>

                <Link href={`/blog/${article.slug}`} className="flex items-center gap-2 text-base font-semibold text-[#C41E3A] transition-all group-hover:gap-3">
                  Read More <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
