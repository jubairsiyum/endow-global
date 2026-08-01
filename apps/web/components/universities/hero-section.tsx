'use client'

import { motion, type Variants } from 'framer-motion'
import { Search, GraduationCap, Users, Globe, Award, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const popularSearches = [
  'Engineering in South Korea',
  'MBA in Australia',
  'Scholarships in Seoul',
  'IT Programs',
]

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-50/60 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(196,30,58,0.04),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex min-h-[55vh] flex-col items-center justify-center py-16 text-center sm:min-h-[60vh] sm:py-20 lg:min-h-[65vh] lg:py-24"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#C41E3A]/[0.06] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C41E3A]" />
              <span className="text-[11px] font-semibold text-[#C41E3A]">
                250+ Partner Universities
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.4rem]">
              Find Your{' '}
              <span className="text-[#C41E3A]">Perfect</span>{' '}
              University
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-gray-500">
              Explore world-class universities in South Korea and Australia.
              Get personalized recommendations based on your profile.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mt-8 w-full max-w-xl">
            <form
              action="/universities"
              method="GET"
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-colors focus-within:border-[#C41E3A] sm:px-5 sm:py-3"
            >
              <Search size={18} className="shrink-0 text-gray-400" />
              <label htmlFor="universities-hero-search" className="sr-only">Search universities, programs, or countries</label>
              <input
                id="universities-hero-search"
                name="q"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, programs, or countries..."
                className="w-full border-0 border-none bg-transparent p-0 text-sm text-gray-700 outline-none shadow-none focus:border-none focus:outline-none focus:ring-0 placeholder:text-gray-400 sm:text-[15px]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#C41E3A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A01830] sm:px-5 sm:text-sm"
              >
                Search
              </button>
            </form>
            {/* Popular searches */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-[#C41E3A]/30 hover:text-[#C41E3A]"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { icon: GraduationCap, value: '50+', label: 'Partner Unis' },
              { icon: Globe, value: '2', label: 'Destinations' },
              { icon: Award, value: '98%', label: 'Visa Success' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C41E3A]/[0.06]">
                  <stat.icon size={18} className="text-[#C41E3A]" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Trust Row */}
          <motion.div variants={itemVariants} className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">4.7</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="fill-[#C41E3A] text-[#C41E3A]" />
                ))}
              </div>
              <span className="text-gray-400">Google</span>
            </div>
            <div className="h-3.5 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Users size={13} className="text-gray-400" />
              <span>
                <span className="font-semibold text-gray-700">5,000+</span> students placed
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
