import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";

import { TRPCReactProvider } from "@/lib/trpc-client";

import { Toaster } from "sonner";

import ThemeProvider from "@/components/providers/ThemeProvider";
import ClickSpark from "@/components/effects/ClickSpark";

import "@fontsource/inter";

import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const appUrlRaw = process.env.NEXT_PUBLIC_APP_URL;
const appUrl = (() => {
  if (!appUrlRaw) return new URL("http://localhost:3000");
  try {
    return new URL(appUrlRaw);
  } catch {
    return new URL("http://localhost:3000");
  }
})();

export const metadata: Metadata = {
  metadataBase: appUrl,

  title: {
    default: "Endow Global Education",
    template: "%s | Endow Global Education",
  },

  description:
    "Endow Global Education helps Bangladeshi students pursue higher education in South Korea with expert guidance, transparent support, and a guided path forward.",

  keywords: [
    "study abroad",
    "university application",
    "education counseling",
    "scholarship",
    "international students",
    "South Korea universities",
    "Bangladeshi students in Korea",
    "study in Korea",
  ],

  authors: [
    {
      name: "Endow Global Education",
    },
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Endow Global Education",

    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@endowglobal",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#AD0819",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={quicksand.variable}
    >
      <body className="font-body bg-[#f6f7fb] text-gray-900 antialiased transition-colors duration-300 dark:bg-[#ffffff] dark:text-white">
        <ClickSpark />
        
        <ThemeProvider>
          
            <TRPCReactProvider>
              {children}

              <Toaster
                position="top-right"
                richColors
                closeButton
              />
            </TRPCReactProvider>

        </ThemeProvider>

      </body>
    </html>
  );
}
