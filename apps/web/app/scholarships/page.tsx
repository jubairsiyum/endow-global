import type { Metadata } from 'next'
import ScholarshipsContent from './ScholarshipsContent'

export const metadata: Metadata = {
  title: 'Scholarships | Endow Global Education',
  description: 'Explore exclusive scholarship opportunities from partner universities. Find full, partial, and tuition coverage options.',
}

export default function ScholarshipsPage() {
  return <ScholarshipsContent />
}
