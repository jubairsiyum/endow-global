'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function AuthBackground() {
  const pathname = usePathname()
  const bgImage = pathname === '/login' ? '/images/signin-bg.png' : '/images/signup-bg.png'

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={bgImage}
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
        style={{ filter: 'contrast(1.03) saturate(0.85) brightness(1.05)' }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fdf8f4]/90 via-[#faf5ef]/80 to-[#f5ebe0]/70" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(#7f1d1d 1px, transparent 1px), linear-gradient(90deg, #7f1d1d 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-[500px] w-[500px] rounded-full bg-red-200/30 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[8%] h-[450px] w-[450px] rounded-full bg-amber-200/25 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100/20 blur-[80px]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7f2ec] to-transparent" />
    </div>
  )
}
