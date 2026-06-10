import Link from 'next/link'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CourseNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <GraduationCap className="h-20 w-20 text-gray-300" />
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Course Not Found</h2>
      <p className="mt-2 text-center text-gray-500">
        The course you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/courses" className="mt-6">
        <Button variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          Browse All Courses
        </Button>
      </Link>
    </div>
  )
}
