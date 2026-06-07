import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Upload and track the files required for your application."
      />
      <EmptyState
        title="Document library coming soon"
        description="This page is a stub. A full drag-and-drop uploader with versioning is in the next iteration."
      />
    </div>
  )
}
