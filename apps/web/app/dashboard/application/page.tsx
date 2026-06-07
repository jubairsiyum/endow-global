import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default function MyApplicationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My application"
        description="Manage your visa application in one place."
      />
      <EmptyState
        title="Detailed view coming soon"
        description="This page is a stub. Detailed application fields and editing will land in a follow-up."
      />
    </div>
  )
}
