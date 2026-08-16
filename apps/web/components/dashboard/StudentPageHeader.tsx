'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  eyebrow?: string
  title: string
  description: string
  action?: React.ReactNode
}

export function StudentPageHeader({ eyebrow = 'Student portal', title, description, action }: Props) {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end dark:border-gray-800">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-600">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}

export function StudentActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 transition-colors hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:text-rose-300">
      {children}
      <ArrowUpRight size={15} aria-hidden />
    </Link>
  )
}

export const studentPanel = 'rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#12141c]'
