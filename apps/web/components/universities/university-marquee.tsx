'use client'

import { trpc } from '@/lib/trpc-client'
import { useEffect, useRef, useState } from 'react'

export default function UniversityMarquee() {
  const { data: universities } = trpc.university.featured.useQuery()
  const present = (universities ?? []).filter((u: any) => u.logo)

  // Duplicate the list enough times to create a seamless loop.
  const loop = Array.from({ length: 3 }).flatMap((_, t) =>
    present.map((uni: any) => ({ ...uni, _t: t }))
  )

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
          setAnimationDuration(Math.max(30, width / 60))
        }
      }
    }

    measureWidth()
    const resizeObserver = new ResizeObserver(measureWidth)
    const container = marqueeContentRef.current?.parentElement
    if (container) resizeObserver.observe(container)
    window.addEventListener('resize', measureWidth, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measureWidth)
    }
  }, [universities])

  // Hide the marquee when we don't have enough partner logos to scroll
  // (e.g. in environments where universities have no logo set yet).
  if (present.length < 3) return null

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
            <div className="marquee-track">
              {loop.map((uni) => (
                <div
                  key={`${uni._t}-${uni.id}`}
                  className="group flex cursor-pointer items-center justify-center rounded-2xl px-6 py-4 transition-all duration-300 ease-out hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out group-hover:border-brand/20">
                    <img
                      src={uni.logo}
                      alt={uni.name}
                      className="h-full w-full object-contain opacity-80 transition-opacity duration-300 ease-out group-hover:opacity-100"
                    />
                  </div>
                </div>
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
