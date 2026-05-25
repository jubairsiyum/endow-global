import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          404
        </div>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-gray-400 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors mt-4"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
