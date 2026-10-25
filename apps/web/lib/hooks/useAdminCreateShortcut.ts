'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Hook to automatically trigger creation modal/drawer when:
 * 1. The page mounts with `?action=new` or `?action=[targetKey]`
 * 2. An `admin:create-shortcut` custom event is dispatched for this targetKey
 */
export function useAdminCreateShortcut(targetKey: string, onOpen: () => void) {
  const pathname = usePathname()
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen

  // Handle URL query parameters on mount or navigation
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkUrl = () => {
      try {
        const url = new URL(window.location.href)
        const action = url.searchParams.get('action')
        const target = url.searchParams.get('target')

        if (action === 'new' || action === targetKey || target === targetKey) {
          onOpenRef.current?.()

          // Clean URL without triggering page reload or router churn
          url.searchParams.delete('action')
          url.searchParams.delete('target')
          const cleanSearch = url.searchParams.toString()
          const cleanUrl = url.pathname + (cleanSearch ? `?${cleanSearch}` : '')
          window.history.replaceState(null, '', cleanUrl)
        }
      } catch {
        // Ignore URL parsing errors
      }
    }

    // Run check immediately on mount or route transition
    checkUrl()

    window.addEventListener('popstate', checkUrl)
    return () => window.removeEventListener('popstate', checkUrl)
  }, [targetKey, pathname])

  // Handle same-page event dispatch
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ target: string }>
      if (!customEvent.detail || customEvent.detail.target === targetKey) {
        onOpenRef.current?.()
      }
    }

    window.addEventListener('admin:create-shortcut', handleEvent)
    return () => {
      window.removeEventListener('admin:create-shortcut', handleEvent)
    }
  }, [targetKey])
}
