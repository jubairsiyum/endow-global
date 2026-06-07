import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Profile, notifications, and security preferences."
      />
      <EmptyState
        title="Settings coming soon"
        description="This page is a stub. Profile, notification, and security controls will land in a follow-up."
      />
    </div>
  )
}
