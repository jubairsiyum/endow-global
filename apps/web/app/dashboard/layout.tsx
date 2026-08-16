import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserRole } from '@endow/types'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { Footer } from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  if (!session) {
    redirect('/login')
  }

  const role = session.user.role as UserRole

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    redirect('/admin')
  }

  if (role === UserRole.COUNSELOR) {
    redirect('/counselor')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7fb] text-gray-900 transition-colors duration-300 dark:bg-[#0b0f19] dark:text-white">
      <DashboardShell>{children}</DashboardShell>
      <Footer />
    </div>
  )
}
