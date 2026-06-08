'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, GraduationCap, Sparkles } from 'lucide-react'
import { useState } from 'react'
import AIMatcher from './ai-matcher'

export default function HeroSection() {
  const [showMatcher, setShowMatcher] = useState(false)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-32 h-[450px] w-[450px] rounded-full bg-red-50 blur-[120px]" />

        <div className="absolute right-0 top-20 h-[350px] w-[350px] rounded-full bg-rose-50 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid min-h-[calc(100vh-90px)] items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[520px]"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#C41E3A]" />

                <span className="text-sm font-semibold text-[#C41E3A]">
                  AI-Powered University Matching
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              variants={itemVariants}
              className="mt-8"
            >
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 lg:text-6xl">
                Find Your Ideal

                <span className="block text-[#C41E3A]">
                  Study Destination
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-7 text-slate-600">
                Personalized university recommendations
                based on your academic profile, budget,
                and career aspirations.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4"
            >
              <button
                onClick={() => setShowMatcher(true)}
                className="group inline-flex h-14 items-center gap-2 rounded-xl bg-[#C41E3A] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(196,30,58,0.18)] transition-all duration-300 hover:-translate-y-1"
              >
                <GraduationCap className="h-4 w-4" />

                Start Assessment

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="inline-flex h-14 items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-slate-900">
                Browse Universities

                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex gap-10"
            >
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  250+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Universities
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">
                  45
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Countries
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">
                  98%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Visa Success
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-red-100/40 to-transparent blur-3xl" />

            <div
              className="
                relative
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-6
                shadow-[0_25px_80px_rgba(15,23,42,0.08)]
              "
            >
              <AIMatcher
                onClose={() => setShowMatcher(false)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}