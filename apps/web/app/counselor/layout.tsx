import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { UserRole } from '@endow/types'
import { CounselorShell } from '@/components/counselor/layout/Shell'

export default async function CounselorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  if (!session) {
    redirect('/login')
  }

  if (
    session.user.role !== UserRole.COUNSELOR &&
    session.user.role !== UserRole.ADMIN &&
    session.user.role !== UserRole.SUPER_ADMIN
  ) {
    redirect('/dashboard')
  }

  return <CounselorShell>{children}</CounselorShell>
}
