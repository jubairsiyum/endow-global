'use client'

import { motion } from 'framer-motion'
import { universities } from '@/lib/universities/data'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function UniversityMarquee() {
  const marqueeContentRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState<number>(0)
  const [animationDuration, setAnimationDuration] = useState<number>(60)

  useEffect(() => {
    const measureWidth = () => {
      if (marqueeContentRef.current) {
        const firstTrack = marqueeContentRef.current.querySelector('.marquee-track')
        if (firstTrack) {
          const width = (firstTrack as HTMLElement).offsetWidth
          setTrackWidth(width)
          // Calculate animation duration: 60px per second is a smooth speed
          setAnimationDuration(Math.max(30, width / 60))
        }
      }
    }

    // Measure on mount
    measureWidth()

    // Measure on window resize
    const resizeObserver = new ResizeObserver(measureWidth)
    const container = marqueeContentRef.current?.parentElement
    if (container) {
      resizeObserver.observe(container)
    }

    // Fallback resize listener
    window.addEventListener('resize', measureWidth, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measureWidth)
    }
  }, [])

  return (
    <section className="relative overflow-hidden border-y border-gray-200 bg-[#F8FAFC] py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-gray-600">
          Trusted by <span className="text-gradient-brand">5000+</span> Students Across
        </p>

        <div className="marquee-container">
          <div
            className="marquee-content"
            ref={marqueeContentRef}
            style={
              {
                '--marquee-track-width': `${trackWidth}px`,
                '--marquee-animation-duration': `${animationDuration}s`,
              } as React.CSSProperties & {
                '--marquee-track-width': string
                '--marquee-animation-duration': string
              }
            }
          >
            {/* Track 1 - Original */}
            <div className="marquee-track">
              {universities.map((uni) => (
                <motion.div
                  key={`track1-${uni.id}`}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl px-6 py-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-brand/20 group-hover:shadow-[0_8px_24px_rgba(196,30,58,0.15)]">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                      priority={false}
                    />
                  </div>

                  <div className="hidden max-w-xs opacity-0 transition-all duration-300 ease-out group-hover:block group-hover:opacity-100">
                    <p className="text-center text-sm font-semibold text-gray-900">{uni.name}</p>
                    <p className="text-center text-xs text-gray-600">{uni.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Track 2 - Duplicate for seamless loop */}
            <div className="marquee-track">
              {universities.map((uni) => (
                <motion.div
                  key={`track2-${uni.id}`}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl px-6 py-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-brand/20 group-hover:shadow-[0_8px_24px_rgba(196,30,58,0.15)]">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                      priority={false}
                    />
                  </div>

                  <div className="hidden max-w-xs opacity-0 transition-all duration-300 ease-out group-hover:block group-hover:opacity-100">
                    <p className="text-center text-sm font-semibold text-gray-900">{uni.name}</p>
                    <p className="text-center text-xs text-gray-600">{uni.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Track 3 - Duplicate for seamless loop edge case */}
            <div className="marquee-track">
              {universities.map((uni) => (
                <motion.div
                  key={`track3-${uni.id}`}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl px-6 py-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-brand/20 group-hover:shadow-[0_8px_24px_rgba(196,30,58,0.15)]">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                      priority={false}
                    />
                  </div>

                  <div className="hidden max-w-xs opacity-0 transition-all duration-300 ease-out group-hover:block group-hover:opacity-100">
                    <p className="text-center text-sm font-semibold text-gray-900">{uni.name}</p>
                    <p className="text-center text-xs text-gray-600">{uni.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC] to-transparent" />
        </div>
      </div>
    </section>
  )
}
