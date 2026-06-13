import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, ArrowLeft } from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/lib/trpc'
import CourseDetailContent from './CourseDetailContent'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const context = await createTRPCContext({ headers: new Headers() })
  const caller = appRouter.createCaller(context)

  const course = await caller.course.getBySlug({ slug })

  if (!course) {
    return (
      <div className="w-full flex flex-col overflow-x-hidden">
        <section className="relative overflow-x-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="pt-4 pb-6 lg:pb-8"><Navbar /></div>
          </div>
        </section>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <GraduationCap className="mx-auto h-20 w-20 text-gray-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Course Not Found</h2>
            <p className="mt-2 text-gray-500">The course you're looking for doesn't exist or has been removed.</p>
            <Link href="/courses">
              <Button className="mt-6" variant="outline">
                <ArrowLeft size={16} className="mr-2" />
                Browse All Courses
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return <CourseDetailContent course={{ ...course, requirements: course.requirements as string[] }} />
}
