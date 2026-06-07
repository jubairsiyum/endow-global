'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

type AuthMode = 'signin' | 'signup'

interface AuthContextType {
  mode: AuthMode
  setMode: (mode: AuthMode) => void
  toggleMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function modeFromPath(pathname: string | null): AuthMode {
  if (!pathname) return 'signin'
  if (pathname.startsWith('/register')) return 'signup'
  return 'signin'
}

export function AuthProvider({
  children,
  initialMode = 'signin',
}: {
  children: React.ReactNode
  initialMode?: AuthMode
}) {
  const [mode, setModeState] = useState<AuthMode>(initialMode)
  const pathname = usePathname()

  // Keep state in sync if the URL changes externally (e.g. browser back/forward)
  // without remounting the route segment.
  React.useEffect(() => {
    if (!pathname) return
    const fromPath = modeFromPath(pathname)
    setModeState((prev) => (prev === fromPath ? prev : fromPath))
  }, [pathname])

  const handleSetMode = useCallback((newMode: AuthMode) => {
    setModeState((prev) => (prev === newMode ? prev : newMode))
    if (typeof window === 'undefined') return
    // Use history.replaceState so the URL updates without a Next.js
    // route segment refetch, which is what was killing the animation.
    const newPath = newMode === 'signin' ? '/login' : '/register'
    if (window.location.pathname !== newPath) {
      window.history.replaceState(window.history.state, '', newPath)
    }
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'signin' ? 'signup' : 'signin'
      if (typeof window !== 'undefined') {
        const newPath = next === 'signin' ? '/login' : '/register'
        if (window.location.pathname !== newPath) {
          window.history.replaceState(window.history.state, '', newPath)
        }
      }
      return next
    })
  }, [])

  // Allow external components (e.g. the global Navbar) to request an
  // in-page mode change without performing a route navigation. The Navbar
  // can fire a `endow:set-auth-mode` window event with `detail: "signin" | "signup"`.
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (event: Event) => {
      const custom = event as CustomEvent<AuthMode>
      const next = custom.detail
      if (next === 'signin' || next === 'signup') {
        handleSetMode(next)
      }
    }
    window.addEventListener('endow:set-auth-mode', handler as EventListener)
    return () => window.removeEventListener('endow:set-auth-mode', handler as EventListener)
  }, [handleSetMode])

  return (
    <AuthContext.Provider value={{ mode, setMode: handleSetMode, toggleMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthMode() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthMode must be used within AuthProvider')
  }
  return context
}
