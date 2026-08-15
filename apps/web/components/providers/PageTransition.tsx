'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // On route change, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}
