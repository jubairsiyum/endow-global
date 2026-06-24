'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 })

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPath.current) {
      NProgress.start()
      prevPath.current = pathname

      const timer = setTimeout(() => NProgress.done(), 300)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return null
}
