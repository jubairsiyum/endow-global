'use client'

import { useEffect } from 'react'

export default function UniversitiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Universities page error:', error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-gray-900 to-black px-4 text-white">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-3xl font-bold">Universities Page Error</h2>
        <p className="text-sm text-gray-400">
          {error.message || 'Something went wrong loading the universities page.'}
        </p>
        <div className="max-h-32 space-y-2 overflow-auto rounded bg-gray-800/50 p-2 text-xs text-gray-500">
          <p>{error.digest && `Error ID: ${error.digest}`}</p>
        </div>
        <button
          onClick={() => reset()}
          className="mt-4 inline-block rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
