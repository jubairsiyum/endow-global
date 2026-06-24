import type { Metadata, Viewport } from 'next'

import { TRPCReactProvider } from '@/lib/trpc-client'

import { Toaster } from 'sonner'

import ThemeProvider from '@/components/providers/ThemeProvider'
import SmoothScroll from '@/components/providers/SmoothScroll'
import ClickSpark from '@/components/effects/ClickSpark'
import RouteProgress from '@/components/effects/RouteProgress'

import './globals.css'

const appUrlRaw = process.env.NEXT_PUBLIC_APP_URL
const appUrl = (() => {
  if (!appUrlRaw) return new URL('http://localhost:3000')
  try {
    return new URL(appUrlRaw)
  } catch {
    return new URL('http://localhost:3000')
  }
})()

export const metadata: Metadata = {
  metadataBase: appUrl,

  title: {
    default: 'Endow Global Education',
    template: '%s | Endow Global Education',
  },

  description:
    'Your trusted partner for international education. Find the perfect university, get AI-powered course matching, and expert counselor support.',

  keywords: [
    'study abroad',
    'university application',
    'education counseling',
    'scholarship',
    'international students',
    'UK universities',
    'Australia universities',
  ],

  authors: [
    {
      name: 'Endow Global Education',
    },
  ],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Endow Global Education',

    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@endowglobal',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#AD0819',
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body bg-[#f6f7fb] text-gray-900 antialiased transition-colors duration-300 dark:bg-[#09090b] dark:text-white">
        <ClickSpark />
        <RouteProgress />

        <ThemeProvider>
          <SmoothScroll>
            <TRPCReactProvider>
              {children}

              <Toaster position="top-right" richColors closeButton />
            </TRPCReactProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
