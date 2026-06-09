import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Browse thousands of academic programs from partner universities worldwide. Find your perfect course with AI-powered matching and expert counselor support.',
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
