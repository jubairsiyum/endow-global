import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserRole } from '@endow/types'
import AdminManagementPage from './AdminManagementPage'

export default async function AdminsPage() {
 const session = await auth.api.getSession({
 headers: headers(),
 })

 if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
 redirect('/admin')
 }

 return <AdminManagementPage />
}
