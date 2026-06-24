'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function RouteProgress() {
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const [loading, setLoading] = useState(false)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopLoading = useCallback(() => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    setFading(true)
    fadeTimerRef.current = setTimeout(() => {
      setLoading(false)
      setFading(false)
    }, 200)
  }, [])

  // Detect link clicks immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Skip external, anchors, mailto, tel, new tab, modifier keys
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (target.target === '_blank') return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      // Skip if already on this path
      if (href === pathname) return

      // Show spinner immediately
      setLoading(true)
      setFading(false)

      // Safety timeout
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => stopLoading(), 3000)
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [pathname, stopLoading])

  // Stop loading once pathname changes
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      timerRef.current = setTimeout(() => stopLoading(), 300)
    }
  }, [pathname, stopLoading])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  if (!loading) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-200 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinning logo */}
        <div className="relative h-20 w-20 animate-spin">
          <Image
            src="/logo/endoedu.svg"
            alt="Loading"
            fill
            className="object-contain"
            priority
          />
        </div>
        {/* Pulsing dots */}
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C41E3A] animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-[#C41E3A] animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-[#C41E3A] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
