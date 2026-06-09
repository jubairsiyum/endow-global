'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Globe,
  Award,
  BookOpen,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc-client'
import { formatCurrency, formatDate } from '@/lib/utils'

const levelLabels: Record<string, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
  PHD: 'PhD',
  DIPLOMA: 'Diploma',
  CERTIFICATE: 'Certificate',
  FOUNDATION: 'Foundation',
}

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: course, isLoading, error } = trpc.course.getBySlug.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="w-full flex flex-col overflow-x-hidden">
        <section className="relative overflow-x-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="pt-4 pb-6 lg:pb-8"><Navbar /></div>
          </div>
        </section>
        <main className="flex-grow py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 rounded bg-gray-200" />
              <div className="h-12 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-40 rounded-lg bg-gray-100" />
                  <div className="h-32 rounded-lg bg-gray-100" />
                </div>
                <div className="h-64 rounded-lg bg-gray-100" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !course) {
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

  const requirements: string[] = Array.isArray(course.requirements) ? course.requirements : []

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <section className="relative overflow-x-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="pt-4 pb-6 lg:pb-8">
            <Navbar />
          </div>

          <div className="py-10 lg:py-16">
            {/* Breadcrumb */}
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#C41E3A] transition-colors"
            >
              <ArrowLeft size={16} />
              All Courses
            </Link>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#C41E3A]">
                    {levelLabels[course.level] ?? course.level}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {course.subject}
                  </span>
                  {course.hasScholarship && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      <Award size={12} />
                      Scholarship Available
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  {course.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {course.universityName && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={16} className="text-[#C41E3A]" />
                      {course.universityName}
                    </span>
                  )}
                  {course.universityCountry && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-400" />
                      {course.universityCity}, {course.universityCountry}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Globe size={16} className="text-gray-400" />
                    {course.language}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
                  <Clock size={18} className="mx-auto text-[#C41E3A]" />
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {course.duration} {course.durationUnit?.toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
                  <DollarSign size={18} className="mx-auto text-[#C41E3A]" />
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {formatCurrency(course.tuitionFee, course.currency)}
                  </p>
                  <p className="text-xs text-gray-500">Per Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow">
        {/* Content */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Description */}
                <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <BookOpen size={20} className="text-[#C41E3A]" />
                    About This Course
                  </h2>
                  <div className="mt-4 prose prose-gray max-w-none text-sm leading-7 text-gray-600">
                    <p>{course.description}</p>
                  </div>
                </div>

                {/* Requirements */}
                {requirements.length > 0 && (
                  <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                      <CheckCircle2 size={20} className="text-[#C41E3A]" />
                      Entry Requirements
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scholarship Details */}
                {course.hasScholarship && course.scholarshipDetails && (
                  <div className="rounded-lg border border-green-100 bg-green-50/50 p-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Award size={20} className="text-green-600" />
                      Scholarship Information
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-gray-600">
                      {course.scholarshipDetails}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Apply Card */}
                <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <h3 className="text-lg font-bold text-gray-900">Apply Now</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Start your application to {course.universityName}
                  </p>
                  <Button className="mt-4 w-full" size="lg">
                    Start Application
                  </Button>
                  <Button variant="outline" className="mt-2 w-full">
                    Shortlist Course
                  </Button>
                </div>

                {/* Key Details */}
                <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <h3 className="text-lg font-bold text-gray-900">Key Details</h3>
                  <dl className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-500">Duration</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {course.duration} {course.durationUnit?.toLowerCase()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-500">Tuition Fee</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(course.tuitionFee, course.currency)}/yr
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-500">Language</dt>
                      <dd className="text-sm font-medium text-gray-900">{course.language}</dd>
                    </div>
                    {course.applicationDeadline && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-500">Deadline</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatDate(course.applicationDeadline)}
                        </dd>
                      </div>
                    )}
                    {course.startDate && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-500">Start Date</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatDate(course.startDate)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* University Card */}
                {course.universityName && (
                  <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <h3 className="text-lg font-bold text-gray-900">University</h3>
                    <div className="mt-4 flex items-center gap-3">
                      {course.universityLogo && (
                        <img
                          src={course.universityLogo}
                          alt={course.universityName}
                          className="h-12 w-12 rounded-lg object-contain"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{course.universityName}</p>
                        <p className="text-sm text-gray-500">
                          {course.universityCity}, {course.universityCountry}
                        </p>
                      </div>
                    </div>
                    {course.universityRanking && (
                      <p className="mt-3 text-sm text-gray-600">
                        Ranked #{course.universityRanking} globally
                      </p>
                    )}
                    {course.universityWebsite && (
                      <a
                        href={course.universityWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#C41E3A] hover:underline"
                      >
                        Visit Website
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
