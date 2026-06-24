'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPath = useRef(pathname)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pathname !== prevPath.current) {
      setLoading(true)
      prevPath.current = pathname

      const timer = setTimeout(() => setLoading(false), 400)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
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
