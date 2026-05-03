import type { Metadata, Viewport } from 'next'
import { Quicksand } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { TRPCReactProvider } from '@/lib/trpc-client'
import { Toaster } from 'sonner'
import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: { default: 'Endow Global Education', template: '%s | Endow Global Education' },
  description: 'Your trusted partner for international education. Find the perfect university, get AI-powered course matching, and expert counselor support.',
  keywords: ['study abroad', 'university application', 'education counseling', 'scholarship', 'international students', 'UK universities', 'Australia universities'],
  authors: [{ name: 'Endow Global Education' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Endow Global Education',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', site: '@endowglobal' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#C41E3A',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="font-body antialiased">
        <SessionProvider>
          <TRPCReactProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
