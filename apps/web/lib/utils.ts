import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ZodError } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === 'string')
    } catch {
      return []
    }
  }
  return []
}

const ACRONYMS = new Set(['SSC', 'HSC', 'IELTS', 'TOEFL', 'SAT', 'GRE', 'TOPIK', 'GPA', 'DOB', 'ID', 'IP', 'URL', 'USA', 'UK', 'UAE'])

function humanizeField(field: string): string {
  const spaced = field.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  return spaced
    .split(' ')
    .map((word) => {
      const upper = word.toUpperCase()
      if (ACRONYMS.has(upper)) return upper
      return upper.charAt(0) + upper.slice(1).toLowerCase()
    })
    .join(' ')
}

type ZodIssueLike = {
  code?: string
  path?: (string | number | symbol)[]
  message?: string
  expected?: unknown
  received?: unknown
  maximum?: unknown
  minimum?: unknown
  type?: unknown
  validation?: unknown
}

function zodIssueToMessage(issue: ZodIssueLike): string {
  const path = Array.isArray(issue.path) ? issue.path : []
  const field = path.length ? humanizeField(String(path[path.length - 1])) : 'input'
  const maximum = typeof issue.maximum === 'number' ? issue.maximum : undefined
  const minimum = typeof issue.minimum === 'number' ? issue.minimum : undefined
  const expected = typeof issue.expected === 'string' ? issue.expected : undefined
  const received = typeof issue.received === 'string' ? issue.received : undefined
  const type = typeof issue.type === 'string' ? issue.type : undefined
  const validation = typeof issue.validation === 'string' ? issue.validation : undefined
  const message = typeof issue.message === 'string' ? issue.message : 'Invalid input'

  switch (issue.code) {
    case 'too_big':
      if (type === 'string') return `${field} must be at most ${maximum} characters`
      if (type === 'array') return `${field} must have at most ${maximum} items`
      return `${field} is too large${maximum != null ? ` (max ${maximum})` : ''}`
    case 'too_small':
      if (type === 'string') return `${field} must be at least ${minimum} characters`
      if (type === 'array') return `${field} must have at least ${minimum} items`
      return `${field} is too small${minimum != null ? ` (min ${minimum})` : ''}`
    case 'invalid_type':
      if (received === 'undefined') return `${field} is required`
      return `${field} must be a ${expected ?? 'valid value'}`
    case 'invalid_format':
    case 'invalid_string':
      if (validation === 'email') return `${field} must be a valid email`
      return `${field} is invalid`
    case 'invalid_value':
    case 'invalid_enum_value':
      return `${field} has an invalid value`
    default:
      return `${field}: ${message}`
  }
}

export function zodErrorToMessage(error: ZodError): string {
  return (error.issues as unknown as ZodIssueLike[]).map(zodIssueToMessage).join('. ')
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (!error) return fallback
  if (typeof error === 'string') return error
  const anyError = error as {
    message?: string
    data?: { zodError?: { formErrors?: string[]; fieldErrors?: Record<string, string[] | undefined> } }
  }
  if (anyError.message) return anyError.message
  const zod = anyError.data?.zodError
  if (zod) {
    const parts: string[] = []
    for (const [field, msgs] of Object.entries(zod.fieldErrors || {})) {
      for (const msg of msgs || []) parts.push(`${humanizeField(field)}: ${msg}`)
    }
    for (const msg of zod.formErrors || []) parts.push(msg)
    if (parts.length) return parts.join('. ')
  }
  return fallback
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}
