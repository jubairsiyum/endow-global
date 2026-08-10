import type { Metadata } from 'next'
import { AboutContent } from './AboutContent'

export const metadata: Metadata = {
  title: 'About Us | Endow Global Education',
  description: 'Your trusted partner for South Korean education. We specialize in guiding Bangladeshi students to pursue higher studies in South Korea\'s top universities with expert guidance and dedicated support.',
  openGraph: {
    title: 'About Endow Global Education',
    description: 'Your trusted partner for South Korean education. Expert guidance for Bangladeshi students.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutContent />
}
