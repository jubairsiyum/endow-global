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
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-3xl font-bold">Universities Page Error</h2>
        <p className="text-gray-400 text-sm">
          {error.message || 'Something went wrong loading the universities page.'}
        </p>
        <div className="space-y-2 text-xs text-gray-500 max-h-32 overflow-auto bg-gray-800/50 rounded p-2">
          <p>{error.digest && `Error ID: ${error.digest}`}</p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-block rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white hover:bg-red-700 transition-colors mt-4"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
