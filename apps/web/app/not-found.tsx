'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_234424_b1332b69-2e69-4302-8dbc-40f86846afbd.mp4'

const NAV_ITEMS = [
  { label: 'Explore', href: '/explore' },
  { label: 'Universities', href: '/universities' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function NotFound() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scaleY, setScaleY] = useState(1)
  const textRef = useRef<HTMLDivElement>(null)

  const updateScale = useCallback(() => {
    if (textRef.current) {
      const h = textRef.current.offsetHeight
      setScaleY(h > 0 ? (window.innerHeight / h) * 1.4 : 1)
    }
  }, [])

  useEffect(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [updateScale])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f7f2ec]">
      <div className="relative z-40"><Navbar /></div>

      {/* HERO */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #7A0713 0%, #5C0510 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* BG 404 text */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{
            opacity: 0.15,
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
          }}
        >
          <div
            ref={textRef}
            className="text-white font-black leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: 'clamp(200px, 48vw, 800px)', transform: `scale(1.15, ${scaleY})` }}
          >
            404
          </div>
        </div>

        {/* Video */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: 'calc(-4vh - 20px)' }}>
          <div className="w-[120vw] h-[70vh] sm:w-[60vw] sm:h-[60vh] md:w-[50vw] md:h-[65vh]">
            <video autoPlay loop muted playsInline className="w-full h-full object-contain pointer-events-none mix-blend-screen opacity-80" src={VIDEO_URL} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 mt-auto pb-12 sm:pb-16 flex flex-col items-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">
              Page Not Found
            </span>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2">Oops, this page doesn&apos;t exist</h1>
            <p className="text-white/60 text-sm sm:text-base max-w-md mb-6">The page you&apos;re looking for may have been moved, deleted, or never existed.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-white font-semibold text-sm sm:text-base hover:scale-105 hover:shadow-xl transition-all"
              style={{ background: 'linear-gradient(135deg, #C41E3A, #AD0819)', boxShadow: '0 8px 32px rgba(173, 8, 25, 0.35)' }}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Home
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />

      {/* MOBILE MENU */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <div
          className="absolute top-0 right-0 h-full w-full sm:w-[380px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ background: 'linear-gradient(135deg, #7A0713 0%, #A01830 100%)', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <span className="text-white font-bold text-lg">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-6 mt-6 space-y-3">
            {NAV_ITEMS.map((item, i) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`block px-6 py-4 text-lg font-semibold text-white rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: menuOpen ? `${150 + i * 60}ms` : '0ms' }}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 ${menuOpen ? 'opacity-100 delay-[450ms]' : 'opacity-0'}`}>
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-white font-semibold text-base hover:scale-[1.02] transition-transform" style={{ color: '#AD0819' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
