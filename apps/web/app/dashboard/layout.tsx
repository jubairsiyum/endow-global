import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserRole } from '@endow/types'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

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

  return <DashboardShell>{children}</DashboardShell>
}
