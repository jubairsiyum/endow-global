'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc-client'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import CourseDetailContent from '@/app/courses/[slug]/CourseDetailContent'

export default function NestedCoursePage() {
  const { course: courseSlug } = useParams<{ country: string; university: string; course: string }>()
  const { data: course, isLoading } = trpc.course.getBySlug.useQuery({ slug: courseSlug as string })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-16"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="w-full flex flex-col overflow-x-hidden">
        <section className="bg-white"><div className="max-w-7xl mx-auto px-6 pt-4 pb-6"><Navbar /></div></section>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <GraduationCap className="mx-auto h-20 w-20 text-gray-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Course Not Found</h2>
            <p className="mt-2 text-gray-500">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/courses"><Button className="mt-6" variant="outline"><ArrowLeft size={16} className="mr-2" />Browse All Courses</Button></Link>
          </div>
        </main>
      </div>
    )
  }

  return <CourseDetailContent course={course as any} />
}
