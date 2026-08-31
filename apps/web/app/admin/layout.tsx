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

   // Parse permissions JSON (stored as json, stringified json, or null)
   let perms: string[] = []
   const raw: any = (dbUser as any).permissions
   if (Array.isArray(raw)) perms = raw
   else if (typeof raw === 'string' && raw.trim().length > 0) {
     try {
       const parsed = JSON.parse(raw)
       if (Array.isArray(parsed)) perms = parsed
       else if (typeof parsed === 'string' && parsed.length > 0) perms = [parsed]
     } catch {
       // Fallback: treat raw as comma-separated or single value
       if (raw.trim().startsWith('[')) perms = []
       else perms = []
     }
   } else if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
     // Drizzle may return JSON object already parsed
     const maybe = (raw as any).value ?? raw
     if (Array.isArray(maybe)) perms = maybe
   }
   // Normalize: ensure string array, filter empties
   perms = (perms || []).map((p) => String(p).trim()).filter(Boolean)

  return <AdminClientLayout userRole={dbUser.role as UserRole} permissions={perms}>{children}</AdminClientLayout>
}
