import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserRole } from '@endow/types'
import { AdminClientLayout } from '@/components/admin/layout/AdminClientLayout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  return <AdminClientLayout>{children}</AdminClientLayout>
}
