'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

type UniversityLogo = {
  name: string
  logo: string
}

type DiagnosticUniversityMarqueeProps = {
  universities: readonly UniversityLogo[]
}

type DiagnosticConfig = {
  animationEnabled: boolean
  debug: boolean
  imageMode: 'next' | 'img'
  logoMode: 'all' | 'one'
  targetLogo: string
}

function getDiagnosticConfig(): DiagnosticConfig {
  if (typeof window === 'undefined') {
    return {
      animationEnabled: true,
      debug: false,
      imageMode: 'next',
      logoMode: 'all',
      targetLogo: 'Kyung Hee University',
    }
  }

  const params = new URLSearchParams(window.location.search)

  return {
    animationEnabled: params.get('marqueeAnim') !== 'off',
    debug: params.get('marqueeDebug') === '1',
    imageMode: params.get('marqueeImage') === 'img' ? 'img' : 'next',
    logoMode: params.get('marqueeLogos') === 'one' ? 'one' : 'all',
    targetLogo: params.get('marqueeLogo') || 'Kyung Hee University',
  }
}

const defaultConfig: DiagnosticConfig = {
  animationEnabled: true,
  debug: false,
  imageMode: 'next',
  logoMode: 'all',
  targetLogo: 'Kyung Hee University',
}

export function DiagnosticUniversityMarquee({ universities }: DiagnosticUniversityMarqueeProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [config, setConfig] = useState<DiagnosticConfig>(defaultConfig)

  useEffect(() => {
    setConfig(getDiagnosticConfig())
  }, [])

  const visibleUniversities = useMemo(() => {
    if (config.logoMode !== 'one') {
      return universities
    }

    const selectedUniversity = universities.find((university) =>
      university.name.toLowerCase().includes(config.targetLogo.toLowerCase())
    )

    return selectedUniversity ? [selectedUniversity] : universities.slice(0, 1)
  }, [config.logoMode, config.targetLogo, universities])

  const marqueeItems = useMemo(
    () => [...visibleUniversities, ...visibleUniversities],
    [visibleUniversities]
  )

  useEffect(() => {
    if (!config.debug || !contentRef.current) {
      return
    }

    const content = contentRef.current
    const tracks = Array.from(content.querySelectorAll<HTMLElement>('[data-marquee-half]'))
    const images = Array.from(content.querySelectorAll<HTMLImageElement>('img'))
    const start = performance.now()
    let lastFrame = start
    let rafId = 0

    const logSnapshot = (label: string) => {
      const computedStyle = window.getComputedStyle(content)

      console.table({
        label,
        nodeEnv: process.env.NODE_ENV,
        imageMode: config.imageMode,
        logoMode: config.logoMode,
        animationEnabled: config.animationEnabled,
        contentScrollWidth: content.scrollWidth,
        contentOffsetWidth: content.offsetWidth,
        firstHalfWidth: tracks[0]?.scrollWidth ?? 0,
        secondHalfWidth: tracks[1]?.scrollWidth ?? 0,
        widthMismatch: Math.abs((tracks[0]?.scrollWidth ?? 0) - (tracks[1]?.scrollWidth ?? 0)),
        animationName: computedStyle.animationName,
        animationDuration: computedStyle.animationDuration,
        transform: computedStyle.transform,
        imageCount: images.length,
      })
    }

    const logImages = () => {
      console.table(
        images.map((image, index) => ({
          index,
          alt: image.alt,
          src: image.currentSrc || image.src,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          loading: image.loading,
          decoding: image.decoding,
        }))
      )
    }

    const decodeStartedAt = performance.now()
    Promise.allSettled(images.map((image) => image.decode?.() ?? Promise.resolve()))
      .then((results) => {
        console.log('[marquee-debug] image decode settled', {
          durationMs: Math.round(performance.now() - decodeStartedAt),
          fulfilled: results.filter((result) => result.status === 'fulfilled').length,
          rejected: results.filter((result) => result.status === 'rejected').length,
        })
        logImages()
      })
      .catch((error) => {
        console.warn('[marquee-debug] image decode failed', error)
      })

    const onAnimationIteration = () => {
      console.log('[marquee-debug] animation iteration', {
        elapsedMs: Math.round(performance.now() - start),
        transform: window.getComputedStyle(content).transform,
      })
    }

    const frameLoop = (timestamp: number) => {
      const frameGap = timestamp - lastFrame

      if (frameGap > 50) {
        console.warn('[marquee-debug] long frame', {
          frameGapMs: Math.round(frameGap),
          elapsedMs: Math.round(timestamp - start),
          transform: window.getComputedStyle(content).transform,
        })
      }

      lastFrame = timestamp
      rafId = requestAnimationFrame(frameLoop)
    }

    const performanceObserver =
      'PerformanceObserver' in window
        ? new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              console.warn('[marquee-debug] long task', {
                name: entry.name,
                durationMs: Math.round(entry.duration),
                startTimeMs: Math.round(entry.startTime),
              })
            }
          })
        : null

    try {
      performanceObserver?.observe({ entryTypes: ['longtask'] })
    } catch {
      console.info('[marquee-debug] Long Task API unavailable in this browser.')
    }

    logSnapshot('mounted')
    logImages()
    content.addEventListener('animationiteration', onAnimationIteration)
    rafId = requestAnimationFrame(frameLoop)

    return () => {
      content.removeEventListener('animationiteration', onAnimationIteration)
      cancelAnimationFrame(rafId)
      performanceObserver?.disconnect()
    }
  }, [config, marqueeItems])

  const renderLogo = (university: UniversityLogo, index: number, duplicate: boolean) => {
    const isFirstUniqueLogo = !duplicate && index < visibleUniversities.length

    return (
      <div
        className="group flex cursor-pointer items-center justify-center rounded-2xl px-6 py-4 transition-all duration-300 ease-out hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
        data-logo-name={university.name}
        key={`${duplicate ? 'duplicate' : 'original'}-${university.name}-${index}`}
      >
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out group-hover:border-brand/20">
          {config.imageMode === 'img' ? (
            <img
              src={university.logo}
              alt={duplicate ? '' : university.name}
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-contain opacity-80 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
          ) : (
            <Image
              src={university.logo}
              alt={duplicate ? '' : university.name}
              width={80}
              height={80}
              priority={isFirstUniqueLogo}
              loading={isFirstUniqueLogo ? undefined : 'eager'}
              decoding="async"
              draggable={false}
              className="h-full w-full object-contain opacity-80 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden border-y border-gray-200 bg-[#F8FAFC] py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-gray-600">
          Trusted by <span className="text-gradient-brand">5000+</span> Students Across
        </p>

        <div className="marquee-container relative">
          <div
            ref={contentRef}
            className="marquee-content"
            data-animation={config.animationEnabled ? 'on' : 'off'}
            data-image-mode={config.imageMode}
            data-logo-mode={config.logoMode}
          >
            <div className="marquee-track" data-marquee-half="original">
              {marqueeItems.map((university, index) => renderLogo(university, index, false))}
            </div>
            <div className="marquee-track" data-marquee-half="duplicate">
              {marqueeItems.map((university, index) => renderLogo(university, index, true))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC] to-transparent" />
        </div>
      </div>
    </section>
  )
}
