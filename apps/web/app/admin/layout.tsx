import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserRole } from '@endow/types'
import { AdminClientLayout } from '@/components/admin/layout/AdminClientLayout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  if (!session?.user) {
    redirect('/login')
  }

  const dbUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, session.user.id),
  })

  if (!dbUser || (dbUser.role !== UserRole.ADMIN && dbUser.role !== UserRole.SUPER_ADMIN)) {
    redirect('/login/admin?error=unauthorized')
  }

  return <AdminClientLayout userRole={dbUser.role as UserRole}>{children}</AdminClientLayout>
}
