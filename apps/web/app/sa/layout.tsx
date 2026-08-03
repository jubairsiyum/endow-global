import { SuperAdminShell } from '@/components/super-admin/layout/SuperAdminShell'

export default function SALayout({ children }: { children: React.ReactNode }) {
  return <SuperAdminShell>{children}</SuperAdminShell>
}
