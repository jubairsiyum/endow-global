import { Metadata } from 'next'
import CampaignFormClient from '@/components/campaign/CampaignFormClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Campaign Registration | Endow Global Education',
  description:
    'Fill out our 1-minute quick inquiry form to receive scholarship options and personalized admission counseling for top global universities.',
  openGraph: {
    title: 'Fast Track Lead Registration • Endow Global Education',
    description: '1-minute fast track form for international study & scholarship opportunities.',
  },
}

export default function CampaignPage() {
  return <CampaignFormClient />
}

