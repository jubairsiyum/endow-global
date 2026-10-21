'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ArrowRight, BookOpen, Building2, ChevronLeft, ChevronRight, Sparkles, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export interface FeaturedArticle {
  slug: string
  title: string
  description?: string | null
  coverImage?: string | null
  author?: string | null
  category?: string | null
  publishedAt?: string | null
  createdAt?: string | null
}

interface BlogHeroProps {
  featured?: FeaturedArticle | null
  featuredPosts?: FeaturedArticle[] | null
}

export function BlogHero({ featured, featuredPosts }: BlogHeroProps) {
  // Normalize items
  const items: FeaturedArticle[] =
    featuredPosts && featuredPosts.length > 0
      ? featuredPosts
      : featured
      ? [featured]
      : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  // Auto-play slide timer
  useEffect(() => {
    if (items.length <= 1 || isHovered) return

    const timer = setInterval(() => {
      setDirection('next')
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5500)

    return () => clearInterval(timer)
  }, [items.length, isHovered])

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('prev')
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('next')
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const currentItem = items[currentIndex] || null

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
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

  const slideVariants: any = {
    enter: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
    exit: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' },
    }),
  }

  const safeCoverImage =
    currentItem?.coverImage?.trim().startsWith('http') || currentItem?.coverImage?.trim().startsWith('/')
      ? currentItem.coverImage.trim()
      : null

  return (
    <section className="relative overflow-hidden bg-white pb-12 pt-32 lg:pb-16 lg:pt-36">
      {/* Background Glows */}
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

            {/* STATISTICS */}
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

          {/* RIGHT - FEATURED ARTICLES SLIDER */}
          {currentItem && (
            <motion.div
              variants={itemVariants}
              className="relative w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* SLIDE CARD */}
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-[#C41E3A]/30 hover:shadow-[0_20px_48px_rgba(196,30,58,0.12)]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentItem.slug}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <Link href={`/blog/${currentItem.slug}`} className="group block">
                      {/* IMAGE AREA */}
                      <div className="relative h-[230px] w-full overflow-hidden rounded-2xl bg-gray-50 lg:h-[285px]">
                        {safeCoverImage ? (
                          <Image
                            src={safeCoverImage}
                            alt={currentItem.title || 'Featured Article'}
                            fill
                            priority
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-gray-200">
                            {currentItem.title?.charAt(0)?.toUpperCase() || 'E'}
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                        {/* Category & Badge */}
                        <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
                          {currentItem.category && (
                            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur-md">
                              {currentItem.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1 rounded-full bg-[#C41E3A] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </span>
                        </div>

                        {/* Slide Counter on Image */}
                        {items.length > 1 && (
                          <span className="absolute right-3.5 top-3.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                            {currentIndex + 1} / {items.length}
                          </span>
                        )}
                      </div>

                      {/* ARTICLE DETAILS */}
                      <div className="p-5">
                        <h3 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#C41E3A] sm:text-2xl">
                          {currentItem.title}
                        </h3>

                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                          {currentItem.description || ''}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            {currentItem.author && (
                              <span className="font-medium text-gray-700">By {currentItem.author}</span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-[#C41E3A] transition-transform group-hover:translate-x-1">
                            Read Article
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* CONTROLS (Only if multiple featured items) */}
                {items.length > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
                    {/* Dots */}
                    <div className="flex items-center gap-1.5">
                      {items.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Go to slide ${idx + 1}`}
                          onClick={(e) => {
                            e.preventDefault()
                            setDirection(idx > currentIndex ? 'next' : 'prev')
                            setCurrentIndex(idx)
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'w-6 bg-[#C41E3A]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Prev / Next Arrows */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous featured story"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#C41E3A] hover:bg-[#C41E3A] hover:text-white"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next featured story"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#C41E3A] hover:bg-[#C41E3A] hover:text-white"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
