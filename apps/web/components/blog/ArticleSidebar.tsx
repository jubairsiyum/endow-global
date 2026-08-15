'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { FormEvent } from 'react'
import { ArrowRight, BookOpen, Check, Link2, Share2, Sparkles } from 'lucide-react'

const SIDEBAR_CARD = 'rounded-xl border border-slate-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]'

export function StudyWorkCTA({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        'rounded-xl border border-slate-100 bg-gradient-to-r from-[#EEF2FF] via-[#F4E8FF] to-[#FFE4F0]',
        'p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] sm:p-6',
        compact ? '' : 'sm:flex sm:items-center sm:justify-between sm:gap-8',
      ].join(' ')}
    >
      <div>
        <h3 className="text-base font-bold text-slate-950">Study and Work Abroad</h3>
        <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-[#C41E3A]">
          Apply now for top countries with work options and upcoming intake deadlines approaching!
        </p>
      </div>

      <Link
        href="/contact"
        className={[
          'inline-flex items-center justify-center rounded-full bg-[#C41E3A] text-sm font-bold text-white',
          'shadow-[0_2px_12px_rgba(196,30,58,0.3)] transition hover:bg-[#A01830]',
          compact ? 'mt-5 w-full px-6 py-2.5' : 'mt-5 w-full px-6 py-2.5 sm:mt-0 sm:w-auto sm:min-w-[160px]',
        ].join(' ')}
      >
        Get started
      </Link>
    </div>
  )
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractHeadings(html: string) {
  const headings: { id: string; text: string; level: 'h2' | 'h3' }[] = []
  const regex = /<(h2|h3)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi
  const counts = new Map<string, number>()
  let match: RegExpExecArray | null
  while ((match = regex.exec(html)) !== null) {
    const level = match[1].toLowerCase() as 'h2' | 'h3'
    const text = match[2]
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) continue
    const base = slugify(text) || `section-${headings.length + 1}`
    const count = counts.get(base) ?? 0
    counts.set(base, count + 1)
    headings.push({ id: count === 0 ? base : `${base}-${count + 1}`, text, level })
  }
  return headings
}

function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => extractHeadings(content), [content])
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    if (headings.length === 0) return
    const els = Array.from(document.querySelectorAll('.article-html h2, .article-html h3'))
    els.forEach((el, i) => {
      if (headings[i]) el.setAttribute('id', headings[i].id)
    })

    const offset = 120

    const computeActive = () => {
      let current: string | null = headings[0]?.id ?? null
      for (const el of els) {
        if (el.getBoundingClientRect().top <= offset) current = el.id
      }
      return current
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setActiveId(computeActive())
        ticking = false
      })
    }

    const initialRaf = requestAnimationFrame(() => setActiveId(computeActive()))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(initialRaf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [headings])

  if (headings.length === 0) return null

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActiveId(id)
    const lenis = window.__lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(el, { offset: -96 })
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className={`${SIDEBAR_CARD} p-5`}>
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-[#C41E3A]" />
        <h3 className="text-sm font-bold text-slate-950">On this page</h3>
      </div>

      <nav className="mt-3 space-y-0.5">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <button
              key={heading.id}
              onClick={() => scrollTo(heading.id)}
              className={`relative w-full rounded-md py-1.5 text-left text-[13px] leading-5 transition-colors ${
                heading.level === 'h3' ? 'pl-5' : 'pl-3'
              } ${
                isActive
                  ? 'bg-[#FEF2F4] font-semibold text-[#C41E3A]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#C41E3A]" />
              )}
              <span className="line-clamp-2">{heading.text}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

const SOCIAL_ICONS = {
  facebook: {
    viewBox: '0 0 320 512',
    path: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z',
  },
  x: {
    viewBox: '0 0 512 512',
    path: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z',
  },
  linkedin: {
    viewBox: '0 0 448 512',
    path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z',
  },
  whatsapp: {
    viewBox: '0 0 448 512',
    path: 'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z',
  },
} as const

function ShareWidget({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const networks = [
    {
      label: 'Facebook',
      buildUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-[#1877F2]',
      icon: SOCIAL_ICONS.facebook,
    },
    {
      label: 'X',
      buildUrl: (url: string) =>
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-black',
      icon: SOCIAL_ICONS.x,
    },
    {
      label: 'LinkedIn',
      buildUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-[#0A66C2]',
      icon: SOCIAL_ICONS.linkedin,
    },
    {
      label: 'WhatsApp',
      buildUrl: (url: string) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      color: 'hover:bg-[#25D366]',
      icon: SOCIAL_ICONS.whatsapp,
    },
  ]

  const share = (buildUrl: (url: string) => string) => {
    window.open(buildUrl(window.location.href), '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`${SIDEBAR_CARD} p-5`}>
      <div className="flex items-center gap-2">
        <Share2 className="h-4 w-4 text-[#C41E3A]" />
        <h3 className="text-sm font-bold text-slate-950">Share this guide</h3>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {networks.map((network) => (
          <button
            key={network.label}
            onClick={() => share(network.buildUrl)}
            aria-label={`Share on ${network.label}`}
            className={`flex h-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:text-white ${network.color}`}
          >
            <svg className="h-4 w-4" viewBox={network.icon.viewBox} fill="currentColor">
              <path d={network.icon.path} />
            </svg>
          </button>
        ))}

        <button
          onClick={copyLink}
          aria-label="Copy link"
          className={`flex h-10 items-center justify-center rounded-lg transition-colors ${
            copied
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 3000)
  }

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#C41E3A] to-[#7A0713] p-5 text-white shadow-[0_8px_24px_rgba(196,30,58,0.28)]">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-white/90" />
        <h3 className="text-sm font-bold text-white">Free study-abroad tips</h3>
      </div>

      <p className="mt-2 text-[13px] leading-5 text-white/85">
        Scholarship deadlines and visa updates, straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-lg bg-white px-3 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/60"
        />
        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-[13px] font-bold text-[#C41E3A] transition-colors hover:bg-[#FEF2F4]"
        >
          {subscribed ? 'Subscribed' : 'Subscribe'}
          {!subscribed && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}

export function ArticleSidebar({ content, title }: { content: string; title: string }) {
  return (
    <div className="space-y-5">
      <TableOfContents content={content} />
      <NewsletterWidget />
      <StudyWorkCTA compact />
      <ShareWidget title={title} />
    </div>
  )
}
