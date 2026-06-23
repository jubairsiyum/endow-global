'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Universities', href: '/universities' },
  { label: 'Countries', href: '/universities' },
  { label: 'Courses', href: '/courses' },
  { label: 'Resources', href: '/blog' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  const authMode: 'signin' | 'signup' = pathname === '/register' ? 'signup' : 'signin'
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleAuthClick = useCallback(
    (mode: 'signin' | 'signup') => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isAuthRoute && authMode !== mode) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('endow:set-auth-mode', { detail: mode }))
      }
    },
    [isAuthRoute, authMode]
  )

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-gray-100 bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl'
            : 'bg-white'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Endow Global Education home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C41E3A]">
              <span className="text-sm font-bold leading-none text-white">E</span>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-gray-900">
              Endow<span className="text-[#C41E3A]">Global</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#C41E3A]'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {(item.label === 'Countries' || item.label === 'Courses') && (
                    <ChevronDown size={13} className="text-gray-400" />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-1 -bottom-[1px] h-0.5 rounded-full bg-[#C41E3A]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              prefetch={false}
              onClick={handleAuthClick('signin')}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              prefetch={false}
              onClick={handleAuthClick('signup')}
              className="group inline-flex items-center gap-1.5 rounded-full bg-[#C41E3A] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(196,30,58,0.25)] transition-all hover:bg-[#A01830] hover:shadow-[0_4px_16px_rgba(196,30,58,0.3)] hover:-translate-y-px"
            >
              Get Started
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 top-16 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto max-w-7xl px-5 py-4">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#C41E3A]/5 text-[#C41E3A]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-full bg-[#C41E3A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(196,30,58,0.25)]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
