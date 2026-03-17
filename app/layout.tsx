import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadCapture Pro - Never Miss Another Lead',
  description: 'Auto-capture leads from missed calls for home service businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
