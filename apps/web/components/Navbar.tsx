'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react'

const countries = [
  { label: 'South Korea', href: '/universities/country/south-korea', flag: 'https://flagcdn.com/w40/kr.png' },
  { label: 'Australia', href: '/universities/country/australia', flag: 'https://flagcdn.com/w40/au.png' },
] as const

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Universities', href: '/universities' },
  { label: 'Countries', href: '/universities', hasDropdown: true },
  { label: 'Courses', href: '/courses' },
  { label: 'Resources', href: '/blog' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  const authMode: 'signin' | 'signup' = pathname === '/register' ? 'signup' : 'signin'
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCountriesOpen, setIsCountriesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    setIsCountriesOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCountriesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDropdownEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsCountriesOpen(true)
  }

  const handleDropdownLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setIsCountriesOpen(false), 150)
  }

  const isCountriesActive = pathname.startsWith('/universities/country/')

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
            <div className="w-fit leading-none">
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
              if ('hasDropdown' in item && item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    ref={dropdownRef}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    className="relative"
                  >
                    <button
                      onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                      className={`relative flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                        isCountriesActive
                          ? 'text-[#C41E3A]'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`text-gray-400 transition-transform duration-200 ${isCountriesOpen ? 'rotate-180' : ''}`}
                      />
                      {isCountriesActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-[#C41E3A]/[0.06]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>

                    {/* Desktop Dropdown */}
                    <AnimatePresence>
                      {isCountriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute left-0 top-full z-[60] mt-1 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
                        >
                          <div className="p-1.5">
                            {countries.map((country) => (
                              <Link
                                key={country.href}
                                href={country.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                              >
                                <img src={country.flag} alt="" className="h-5 w-7 rounded-sm object-cover" />
                                <span>{country.label}</span>
                                <ArrowRight size={14} className="ml-auto text-gray-300 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

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

          {/* Mobile CTA + Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/register"
              className="inline-flex items-center rounded-full bg-[#C41E3A] px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_2px_8px_rgba(196,30,58,0.25)]"
            >
              Get Started
            </Link>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100/60"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileOpen((prev) => !prev)}
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
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
            className="fixed inset-x-0 top-[72px] z-50 mx-4 max-h-[80vh] overflow-y-auto rounded-2xl border border-white/50 bg-white/80 shadow-[0_16px_48px_rgba(0,0,0,0.1)] backdrop-blur-sm backdrop-saturate-[1.8] lg:hidden"
          >
            <div className="p-3">
              <div className="flex flex-col gap-0.5">
                {/* Home */}
                <Link
                  href="/"
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === '/'
                      ? 'bg-[#C41E3A]/[0.06] text-[#C41E3A]'
                      : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                  }`}
                >
                  Home
                </Link>

                {/* Universities */}
                <Link
                  href="/universities"
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === '/universities'
                      ? 'bg-[#C41E3A]/[0.06] text-[#C41E3A]'
                      : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                  }`}
                >
                  Universities
                </Link>

                {/* Countries */}
                <div className="rounded-xl bg-gray-50/50">
                  <button
                    onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      isCountriesActive
                        ? 'bg-[#C41E3A]/[0.06] text-[#C41E3A]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      Countries
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${isCountriesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isCountriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-1 pl-4">
                          {countries.map((country) => (
                            <Link
                              key={country.href}
                              href={country.href}
                              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                pathname === country.href
                                  ? 'bg-[#C41E3A]/[0.06] text-[#C41E3A]'
                                  : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                              }`}
                            >
                              <img src={country.flag} alt="" className="h-5 w-7 rounded-sm object-cover" />
                              {country.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Courses */}
                <Link
                  href="/courses"
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname.startsWith('/courses')
                      ? 'bg-[#C41E3A]/[0.06] text-[#C41E3A]'
                      : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                  }`}
                >
                  Courses
                </Link>

                {/* Resources */}
                <Link
                  href="/blog"
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname.startsWith('/blog')
                      ? 'bg-[#C41E3A]/[0.06] text-[#C41E3A]'
                      : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                  }`}
                >
                  Resources
                </Link>
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
