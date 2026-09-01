import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserRole } from '@endow/types'
import { parsePermissionsJSON } from '@/lib/rbac'
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

   // Parse permissions JSON
   let perms = parsePermissionsJSON((dbUser as any).permissions)
    // Ensure every ADMIN has at least dashboard:view so sidebar never appears blank
    if (dbUser.role === UserRole.ADMIN && perms.length === 0) {
      perms = ['dashboard:view']
    }

   return <AdminClientLayout userRole={dbUser.role as UserRole} permissions={perms}>{children}</AdminClientLayout>
}
