'use client'

import { Toaster } from 'sonner'

/**
 * Thin client-only wrapper around sonner's Toaster.
 * sonner v2 ships with 'use client' internally, so importing it directly
 * into a Server Component (layout.tsx) returns an empty object {} during SSR.
 * Wrapping it here ensures the import only runs in the browser bundle.
 */
export default function ToasterProvider() {
  return <Toaster position="top-right" richColors closeButton />
}
