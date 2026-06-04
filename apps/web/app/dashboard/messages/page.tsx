import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Conversations with your assigned advisor."
      />
      <EmptyState
        title="Inbox coming soon"
        description="This page is a stub. Threaded messaging and file attachments will land in a follow-up."
      />
    </div>
  )
}
