import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-gray-900 to-black px-4 text-white">
      <div className="max-w-md space-y-4 text-center">
        <div className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-6xl font-bold text-transparent">
          404
        </div>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-sm text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
