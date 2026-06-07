import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Schedule and manage meetings with your advisor."
      />
      <EmptyState
        title="Scheduling coming soon"
        description="This page is a stub. Calendar booking with timezone support will land in a follow-up."
      />
    </div>
  )
}
