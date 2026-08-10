import { notFound, redirect } from 'next/navigation'
import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/lib/trpc'

export const dynamic = 'force-dynamic'

export default async function CourseRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const context = await createTRPCContext({ headers: new Headers() })
  const caller = appRouter.createCaller(context)
  const course = await caller.course.getBySlug({ slug })

  if (!course) notFound()

  const uniSlug = (course as any).universitySlug || 'unknown'
  const level = ((course as any).level || 'postgraduate').toLowerCase()

  redirect(`/institutions/${uniSlug}/${level}/${slug}`)
}
