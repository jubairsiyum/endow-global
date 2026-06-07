interface Props {
  status: string
}

export default function StatusBadge({ status }: Props) {
  let colorClass = 'bg-gray-50 text-gray-600'

  const normalizedStatus = status?.toUpperCase() || ''

  switch (normalizedStatus) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'ACCEPTED':
      colorClass = 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
      break
    case 'PENDING':
    case 'UNDER_REVIEW':
      colorClass = 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
      break
    case 'PROCESSING':
    case 'SUBMITTED':
    case 'IN_PROGRESS':
      colorClass = 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
      break
    case 'DOCUMENTS_REQUIRED':
    case 'WAITLISTED':
      colorClass = 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
      break
    case 'REJECTED':
    case 'WITHDRAWN':
      colorClass = 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
      break
    default:
      colorClass = 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
