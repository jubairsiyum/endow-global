interface Props {
  status: string
}

export default function StatusBadge({ status }: Props) {
  let colorClass = 'bg-gray-100 text-gray-700'

  const normalizedStatus = status?.toUpperCase() || ''

  switch (normalizedStatus) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'ACCEPTED':
      colorClass = 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
      break
    case 'PENDING':
    case 'UNDER_REVIEW':
      colorClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
      break
    case 'PROCESSING':
    case 'SUBMITTED':
    case 'IN_PROGRESS':
      colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
      break
    case 'DOCUMENTS_REQUIRED':
    case 'WAITLISTED':
      colorClass = 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
      break
    case 'REJECTED':
    case 'WITHDRAWN':
      colorClass = 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
      break
    default:
      colorClass = 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
