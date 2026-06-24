'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className={`flex w-full max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5 sm:py-3 ${
            isScrolled
              ? 'bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm backdrop-saturate-[1.8] ring-1 ring-black/[0.04]'
              : 'bg-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-sm backdrop-saturate-[1.5] ring-1 ring-white/40'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Endow Global Education home">
            <Image
              src="/logo/endoedu.svg"
              alt="Endow Global Education"
              width={36}
              height={36}
              className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
              priority
            />
            <div className="hidden w-fit leading-none sm:block">
              <span className="block text-[13px] font-bold tracking-tight text-gray-900">
                Endow Global
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
                Education
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#C41E3A]'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {(item.label === 'Countries' || item.label === 'Courses') && (
                    <ChevronDown size={12} className="text-gray-400" />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#C41E3A]/[0.06]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              prefetch={false}
              onClick={handleAuthClick('signin')}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              prefetch={false}
              onClick={handleAuthClick('signup')}
              className="group inline-flex items-center gap-1.5 rounded-full bg-[#C41E3A] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_2px_12px_rgba(196,30,58,0.3)] transition-all hover:bg-[#A01830] hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)] hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100/60 lg:hidden"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.header>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 top-[72px] z-50 mx-4 overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-[0_16px_48px_rgba(0,0,0,0.1)] backdrop-blur-sm backdrop-saturate-[1.8] lg:hidden"
          >
            <div className="p-3">
              <div className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#C41E3A]/[0.06] text-[#C41E3A]'
                          : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="mt-2 flex flex-col gap-2 border-t border-gray-100/80 pt-3">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-xl border border-gray-200/80 bg-white/60 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-full bg-[#C41E3A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(196,30,58,0.25)]"
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
