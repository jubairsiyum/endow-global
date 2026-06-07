'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

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
    maxWidth: 1140,
    minHeight: 80,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 18,
    y: 0,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderColor: 'rgba(255, 255, 255, 0)',
    boxShadow: '0 0 0 rgba(0,0,0,0)',
    backdropFilter: 'blur(0px)'
  },
  scrolled: {
    maxWidth: 980,
    minHeight: 80,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 12,
    y: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: 'rgba(229, 231, 235, 0.86)',
    boxShadow: '0 16px 42px rgba(15,23,42,0.12)',
    backdropFilter: 'blur(22px)'
  }
}

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  const authMode: 'signin' | 'signup' = pathname === '/register' ? 'signup' : 'signin'
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isHero = !isScrolled
  const textPrimary = 'text-gray-900'
  const textMuted = 'text-gray-700'
  const textHover = 'hover:text-gray-900'
  const navRailBg = isHero ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.65)'
  const pillActiveBg = 'bg-[#C41E3A]'
  const pillActiveShadow = 'shadow-[0_10px_30px_rgba(196,30,58,0.25)]'

  const navMotion = isHero ? containerVariants.hero : containerVariants.scrolled

  // When already on an auth route, the Navbar's Sign In / Sign Up buttons
  // must toggle the form in-page (via the AuthContext) rather than performing
  // a Next.js route navigation, which would remount the page and kill the
  // smooth form-switch animation.
  const handleAuthClick = useCallback(
    (mode: 'signin' | 'signup') =>
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isAuthRoute && authMode !== mode) {
          e.preventDefault()
          window.dispatchEvent(
            new CustomEvent('endow:set-auth-mode', { detail: mode })
          )
        }
      },
    [isAuthRoute, authMode]
  )

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
        className={[
          `relative ${isHero ? 'flex w-full' : 'inline-flex'} items-center ${isHero ? 'justify-between gap-5 md:gap-8' : 'gap-6'} border ${isScrolled ? 'rounded-[10px]' : ''}`
        ].join(' ')}
      >
        <Link
          href="/"
          className={`flex h-14 shrink-0 items-center rounded-full pr-2 text-sm font-semibold transition sm:h-16 md:pr-4 ${textPrimary}`}
        >
          {/* Wide logo mark */}
          <span className="relative flex h-10 w-[168px] min-w-[168px] shrink-0 items-center overflow-hidden sm:h-12 sm:w-[202px] sm:min-w-[202px] md:h-[52px] md:w-[220px] md:min-w-[220px]">
            <Image
              src="/logo/endoedu.png"
              alt="Endow Global Education"
              fill
              priority
              sizes="(max-width: 640px) 168px, (max-width: 768px) 202px, 220px"
              className="object-cover object-center"
            />
          </span>

          {/* <span className="hidden whitespace-nowrap text-base font-semibold tracking-tight sm:inline">
            Endow Global
          </span> */}
        </Link>

        <motion.div
          className={`relative hidden items-center md:flex ${isHero ? 'rounded-full gap-1.5 p-1' : 'gap-1 p-0'}`}
          animate={{ backgroundColor: isHero ? navRailBg : 'transparent' }}
          transition={transition}
        >
          <div className={`flex items-center ${isHero ? 'gap-1' : 'gap-0.5'}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative rounded-full text-sm font-medium transition ${
                    isActive ? 'text-white' : textMuted
                  } ${isActive ? '' : textHover} ${
                    isHero ? 'px-3.5 py-1.5' : 'px-3 py-1.5'
                  }`}
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
        </motion.div>

        <div className={`hidden items-center ${isHero ? 'gap-2' : 'gap-2'} md:flex`}>
          <motion.div
            layout
            initial={{ opacity: 1 }}
            animate={isHero ? { opacity: 1, x: 0 } : { opacity: 0, x: -10, pointerEvents: 'none' }}
            transition={transition}
            className={isHero ? '' : 'hidden'}
          >
            <Link
              href="/login"
              prefetch={false}
              onClick={handleAuthClick('signin')}
              className={`inline-flex items-center justify-center rounded-full text-sm font-semibold transition ${textPrimary} ${textHover} ${
                isHero ? 'px-4 py-1.5' : 'px-4 py-1.5'
              }`}
            >
              Sign In
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/register"
              prefetch={false}
              onClick={handleAuthClick('signup')}
              className={`inline-flex items-center justify-center group rounded-full transition ${
                isScrolled
                  ? 'gap-2 px-5 py-2.5 font-semibold tracking-tight text-white bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_10px_24px_rgba(196,30,58,0.20)] hover:shadow-red-200 hover:-translate-y-0.5 transition-all duration-300'
                  : `text-sm font-semibold text-white bg-[#C41E3A] shadow-[0_14px_32px_rgba(196,30,58,0.35)] ${
                      isHero ? 'px-4 py-1.5' : 'px-4 py-1.5'
                    }`
              }`}
            >
              {isScrolled ? (
                <>
                  <span>Get Started</span>
                  <motion.div
                    animate={{
                      x: [0, 1.5, 0],
                      opacity: [0.95, 1, 0.95]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="group/arrow relative inline-flex items-center justify-center"
                  >
                    <ArrowRight
                      strokeWidth={1.5}
                      className="h-5 w-5 text-white transition-all duration-300 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-[1px]"
                    />
                  </motion.div>
                </>
              ) : (
                'Sign Up'
              )}
            </Link>
          </motion.div>
        </div>

        <button
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition md:hidden ${textPrimary}`}
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 8 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute top-14 w-full max-w-[980px] px-4 sm:px-6 md:hidden"
          >
            <motion.div
              animate={{
                backgroundColor: isHero ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.30)',
                borderColor: isHero ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.30)',
                boxShadow: isHero
                  ? '0 24px 60px rgba(0,0,0,0.08)'
                  : '0 24px 60px rgba(0,0,0,0.12)',
                backdropFilter: isHero ? 'blur(10px)' : 'blur(22px)'
              }}
              transition={transition}
              className="rounded-3xl border p-4 backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'rounded-2xl px-4 py-3 text-sm font-medium transition',
                        isActive
                          ? isHero
                            ? 'bg-white/20 text-gray-900 shadow-[0_12px_30px_rgba(15,23,42,0.12)]'
                            : 'bg-[#C41E3A] text-white shadow-[0_12px_30px_rgba(196,30,58,0.25)]'
                          : isHero
                            ? 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                            : 'text-gray-700 hover:bg-neutral-100 hover:text-gray-900'
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  prefetch={false}
                  onClick={handleAuthClick('signin')}
                  className="flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  prefetch={false}
                  onClick={handleAuthClick('signup')}
                  className="flex items-center justify-center rounded-full bg-[#C41E3A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(196,30,58,0.35)]"
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
