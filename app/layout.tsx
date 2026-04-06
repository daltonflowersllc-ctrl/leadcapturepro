import type { Metadata } from 'next'
import './globals.css'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'LeadCapture Pro | AI-Powered Missed Call Lead Capture for Contractors',
  description: 'Never lose another lead to a missed call. LeadCapture Pro uses AI to score leads, send personalized SMS, and transcribe voicemails for home service businesses.',
  keywords: 'lead capture, missed call text back, contractor software, AI lead scoring, home service business, HVAC, plumbing, roofing, landscaping',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  metadataBase: new URL('https://leadcapturepro.app'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'LeadCapture Pro | AI-Powered Missed Call Lead Capture',
    description: 'Never lose another lead to a missed call. AI-powered lead capture for home service businesses.',
    url: 'https://leadcapturepro.app',
    siteName: 'LeadCapture Pro',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadCapture Pro | AI-Powered Missed Call Lead Capture',
    description: 'Never lose another lead to a missed call. AI-powered lead capture for home service businesses.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LeadCapture Pro',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LeadCapture Pro",
    "operatingSystem": "Web, iOS, Android",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "149.00",
      "priceCurrency": "USD"
    },
    "description": "AI-powered lead capture system for home service businesses that automatically responds to missed calls and qualifies leads."
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <PWAInstallPrompt />
        <Analytics />
      </body>
    </html>
  )
}
