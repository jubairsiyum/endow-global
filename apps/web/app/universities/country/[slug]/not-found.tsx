import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <div className="text-center">
        <Globe className="mx-auto h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Country not found</h2>
        <p className="mt-2 text-sm text-gray-500">
          The country you&apos;re looking for doesn&apos;t exist or isn&apos;t available yet.
        </p>
        <Link
          href="/universities"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#A01830]"
        >
          <ArrowLeft size={16} />
          Browse All Universities
        </Link>
      </div>
    </div>
  )
}
