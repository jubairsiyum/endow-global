'use client'

import { useState } from 'react'
import { motion, useReducedMotion, PanInfo } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Star, ArrowRight, Users, GraduationCap, Globe } from 'lucide-react'

const students = [
  { src: '/student-1.jpg', alt: 'Student studying abroad' },
  { src: '/student-2.jpg', alt: 'International student' },
  { src: '/student-3.jpg', alt: 'University student' },
  { src: '/student-4.jpg', alt: 'Graduate student' },
  { src: '/student-5.jpg', alt: 'Exchange student' },
]

const COUNT = students.length

const slotX = [-128, -64, 0, 64, 128]
const slotRotate = [-3, -1, 0, 1, 3]
const slotY = [12, 4, 0, 4, 12]

function getSlot(i: number, activeIndex: number) {
  const raw = ((i - activeIndex) % COUNT + COUNT) % COUNT
  return raw > 2 ? raw - COUNT : raw
}

export default function PremiumHero() {
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(2)
  const [isDragging, setIsDragging] = useState(false)

  function handleDragEnd(_: unknown, info: PanInfo) {
    setIsDragging(false)
    if (Math.abs(info.offset.x) < 40) return
    setActiveIndex((p) => (info.offset.x > 0 ? (p - 1 + COUNT) % COUNT : (p + 1) % COUNT))
  }

  return (
    <section id="hero-section" className="relative overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="flex min-h-[70vh] flex-col justify-center py-20 lg:hidden">
          <div className="relative z-10">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#C41E3A]/[0.06] px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#C41E3A]" />
              <span className="text-[11px] font-semibold text-[#C41E3A]">Trusted by 5,000+ students</span>
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[2rem] font-extrabold leading-[1.1] tracking-tight text-gray-900"
            >
              Study Abroad With{' '}
              <span className="text-[#C41E3A]">Endow Guidance</span>
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500"
            >
              Expert guidance from university selection to visa approval for
              South Korea and Australia.
            </motion.p>

            {/* Trust row */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 flex items-center gap-4"
            >
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">4.7</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-gray-400">Google</span>
              </div>
              <div className="h-3 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Users size={13} className="text-gray-400" />
                <span><span className="font-semibold text-gray-700">5,000+</span> students</span>
              </div>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <div className="relative rounded-full p-[1.5px] bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
                <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                  <Search size={18} className="shrink-0 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, universities..."
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                  <Link
                    href="/universities"
                    className="shrink-0 rounded-full bg-[#C41E3A] px-4 py-1.5 text-[12px] font-semibold text-white"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 grid grid-cols-3 gap-3"
            >
              {[
                { icon: GraduationCap, label: 'Partner Unis', value: '250+' },
                { icon: Globe, label: 'Countries', value: '10+' },
                { icon: Users, label: 'Placed', value: '5,000+' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-center">
                  <stat.icon size={16} className="mx-auto mb-1 text-[#C41E3A]" />
                  <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                  <div className="text-[10px] text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C41E3A] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(196,30,58,0.3)] transition-all hover:bg-[#A01830]"
              >
                Start Your Journey
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden min-h-[85vh] items-center py-28 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left — Content */}
          <div className="relative z-10 max-w-xl">
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.4rem]"
            >
              Study Abroad With{' '}
              <span className="text-[#C41E3A]">Endow Guidance</span>
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-5 max-w-md text-lg leading-relaxed text-gray-500"
            >
              Personalized counseling for students pursuing higher education
              in South Korea and Australia — from university selection to
              visa approval.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-8"
            >
              <div className="relative rounded-full p-[1.5px] bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                  <Search size={20} className="shrink-0 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for courses, universities..."
                    className="w-full bg-transparent text-[15px] text-gray-700 outline-none placeholder:text-gray-400"
                  />
                  <Link
                    href="/universities"
                    className="shrink-0 rounded-full bg-[#C41E3A] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#A01830]"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Trust */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-6 flex items-center gap-2 text-sm text-gray-500"
            >
              <span className="font-semibold text-gray-700">Rated 4.7</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-400">on Google</span>
            </motion.div>
          </div>

          {/* Right — Overlapping student cards */}
          <div
            className={`relative hidden h-[480px] lg:block ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {students.map((s, i) => {
              const slot = getSlot(i, activeIndex)
              const isCenter = slot === 0
              const slotIdx = slot + 2

              return (
                <motion.div
                  key={i}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
                  animate={{
                    opacity: 1,
                    x: slotX[slotIdx],
                    rotate: slotRotate[slotIdx],
                    y: slotY[slotIdx],
                    scale: isCenter ? 1 : 0.96,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  className="absolute top-0"
                  style={{
                    left: 'calc(50%)',
                    transform: 'translateX(-50%)',
                    zIndex: isCenter ? 10 : 5 - Math.abs(slot),
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.03] ${
                      isCenter
                        ? 'h-[360px] w-[220px]'
                        : 'h-[320px] w-[190px]'
                    }`}
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 1024px) 0px 220px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
