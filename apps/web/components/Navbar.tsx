'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Universities', href: '/universities' },
  { label: 'Courses', href: '/courses' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' }
] as const

const transition = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 28,
  mass: 0.5
}

const containerVariants = {
  hero: {
    maxWidth: '100%',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 9999,
    y: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(12px)'
  },
  scrolled: {
    maxWidth: 900,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 9999,
    y: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.20)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
    backdropFilter: 'blur(16px)'
  }
}

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isHero = isHome && !isScrolled
  const textPrimary = 'text-gray-900'
  const textMuted = 'text-gray-700'
  const textHover = 'hover:text-gray-900'
  const pillActiveBg = 'bg-gradient-to-r from-[#C41E3A] to-[#E63D55]'
  const pillActiveShadow = 'shadow-[0_12px_32px_rgba(196,30,58,0.28)]'

  const navMotion = isHero ? containerVariants.hero : containerVariants.scrolled

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <div className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4 sm:px-6">
      <motion.nav
        aria-label="Primary"
        initial={false}
        layout
        animate={navMotion}
        transition={transition}
        className={`relative flex w-full items-center gap-1 border rounded-full md:inline-flex md:w-auto`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`flex flex-shrink-0 items-center gap-2 rounded-full text-sm font-semibold transition ${textPrimary} ${
            isHero ? 'px-3 py-2' : 'px-3 py-2'
          }`}
        >
          <span className="inline-flex h-8 items-center sm:h-9">
            <img
              src="/logo/endoedu.png"
              alt="Endow Global Education"
              className="h-full w-auto object-contain"
            />
          </span>
        </Link>

        {/* Navigation Links - Desktop Only */}
        <div className={`hidden items-center gap-0.5 md:flex`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative rounded-full text-sm font-medium transition ${
                  isActive ? 'text-white' : textMuted
                } ${isActive ? '' : textHover} px-4 py-2`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="navbar-pill"
                    className={`absolute inset-0 rounded-full ${pillActiveBg} ${pillActiveShadow}`}
                    transition={transition}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Auth Links - Desktop Only */}
        <div className={`hidden items-center gap-2 md:flex`}>
          <motion.div
            layout
            initial={{ opacity: 1 }}
            animate={isHero ? { opacity: 1, x: 0 } : { opacity: 0, x: -10, pointerEvents: 'none' }}
            transition={transition}
            className={isHero ? '' : 'hidden'}
          >
            <Link
              href="/sign-in"
              className={`inline-flex items-center justify-center rounded-full text-sm font-semibold transition ${textPrimary} ${textHover} px-4 py-2`}
            >
              Sign In
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/sign-up"
              className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#C41E3A] to-[#E63D55] text-sm font-semibold text-white shadow-[0_12px_32px_rgba(196,30,58,0.28)] transition px-5 py-2`}
            >
              Sign Up
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`relative ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition md:hidden ${textPrimary}`}
          aria-label="Toggle menu"
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          <motion.span
            animate={isMobileOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: -3 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute h-[2px] w-5 rounded-full bg-current"
          />
          <motion.span
            animate={isMobileOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 3 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute h-[2px] w-5 rounded-full bg-current"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 12 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-16 w-full max-w-sm px-4 sm:px-6 md:hidden"
          >
            <motion.div
              animate={{
                backgroundColor: isHero ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.18)',
                borderColor: 'rgba(255, 255, 255, 0.20)',
                boxShadow: isHero
                  ? '0 10px 40px rgba(0,0,0,0.12)'
                  : '0 10px 40px rgba(0,0,0,0.18)',
                backdropFilter: 'blur(16px)'
              }}
              transition={transition}
              className="rounded-2xl border p-4"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'relative rounded-full px-4 py-3 text-sm font-medium transition',
                        isActive
                          ? `${pillActiveBg} text-white ${pillActiveShadow}`
                          : `${textMuted} ${textHover}`
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  className={`flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold transition ${textPrimary} ${textHover}`}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={`flex items-center justify-center rounded-full bg-gradient-to-r from-[#C41E3A] to-[#E63D55] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(196,30,58,0.28)] transition`}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
