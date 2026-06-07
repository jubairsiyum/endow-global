'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 to-black text-white">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold">Application Error</h1>
            <p className="max-w-md text-gray-400">
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => reset()}
              className="inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
