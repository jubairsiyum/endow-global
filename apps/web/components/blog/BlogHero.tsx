'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, BookOpen, Building2, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface FeaturedArticle {
  slug: string
  title: string
  description?: string | null
  coverImage?: string | null
  author?: string | null
  category?: string | null
}

interface BlogHeroProps {
  featured: FeaturedArticle | null
}

export function BlogHero({ featured }: BlogHeroProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  const safeCoverImage =
    featured?.coverImage?.trim().startsWith('http') || featured?.coverImage?.trim().startsWith('/')
      ? featured.coverImage.trim()
      : null

  return (
    <section className="relative overflow-hidden bg-white pb-12 pt-32 lg:pb-16 lg:pt-36">
      {/* Background Glows (Matching Main Hero) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-50/60 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(196,30,58,0.04),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1380px] px-6 lg:px-10 xl:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[45%_55%] xl:gap-16"
        >
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1">
                <Zap className="h-3.5 w-3.5 text-[#C41E3A]" />
                <span className="text-xs font-semibold text-[#C41E3A]">
                  Education Knowledge Hub
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.4rem]">
                Global Education <br />
                <span className="text-[#C41E3A]">Insights &amp; Guides</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="mt-5 max-w-[520px] text-lg leading-relaxed text-gray-600">
                Study abroad guides, scholarship opportunities, visa updates, university insights,
                and real student success journeys.
              </p>
            </motion.div>

            {/* STATISTICS (Aligned with Main Hero Style) */}
            <motion.div
              variants={itemVariants}
              className="mt-8 grid max-w-[560px] grid-cols-3 gap-4"
            >
              {[
                { icon: BookOpen, value: '500+', label: 'Expert Articles' },
                { icon: Users, value: '25K+', label: 'Monthly Readers' },
                { icon: Building2, value: '20+', label: 'Partner Unis' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all hover:border-[#C41E3A]/30 hover:shadow-md"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#C41E3A]/[0.06]">
                    <stat.icon size={16} className="text-[#C41E3A]" />
                  </div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT - FEATURED ARTICLE CARD */}
          {featured && (
            <motion.div variants={itemVariants} whileHover={{ y: -6 }} className="w-full">
              <Link
                href={`/blog/${featured.slug}`}
                className="group block overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-[#C41E3A]/30 hover:shadow-[0_20px_48px_rgba(196,30,58,0.12)]"
              >
                <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-gray-50 lg:h-[280px]">
                  {safeCoverImage ? (
                    <Image
                      src={safeCoverImage}
                      alt={featured.title || 'Featured Article'}
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-gray-200">
                      {featured.title?.charAt(0)?.toUpperCase() || 'E'}
                    </div>
                  )}
                  {featured.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-md">
                      {featured.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#C41E3A]">
                    {featured.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                    {featured.description || ''}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {featured.author && <span className="font-medium">By {featured.author}</span>}
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#C41E3A] transition-transform group-hover:translate-x-1">
                      Read Article
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
