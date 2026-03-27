import type { Metadata } from 'next'
import './globals.css'
import PWAInstallPrompt from './components/PWAInstallPrompt'

export const metadata: Metadata = {
  title: 'LeadCapture Pro - Never Miss Another Lead',
  description: 'Auto-capture leads from missed calls for home service businesses',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
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
  return (
    <html lang="en">
      <body>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
