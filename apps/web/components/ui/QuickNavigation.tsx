'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

export interface QuickNavigationItem {
  label: string
  href: string
}

export function QuickNavigation({ items, placeholder, className = '' }: { items: QuickNavigationItem[]; placeholder: string; className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const filteredItems = useMemo(() => {
    const value = query.trim().toLowerCase()
    return value ? items.filter((item) => item.label.toLowerCase().includes(value)) : items
  }, [items, query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-1.5" style={{ borderColor: '#e5e7eb' }}>
        <Search size={14} style={{ color: '#6b7280' }} aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#6b7280]/60"
          style={{ color: '#111827' }}
          aria-label="Quick navigation"
        />
        <kbd className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: '#f8fafc', color: '#6b7280', border: '1px solid #e5e7eb' }}>Ctrl+K</kbd>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border bg-white py-1 shadow-lg" style={{ borderColor: '#e5e7eb' }}>
          {filteredItems.length ? filteredItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block px-3 py-2 text-xs font-medium hover:bg-slate-50" style={{ color: '#111827' }}>{item.label}</Link>
          )) : <p className="px-3 py-2 text-xs" style={{ color: '#6b7280' }}>No destinations found</p>}
        </div>
      )}
    </div>
  )
}
