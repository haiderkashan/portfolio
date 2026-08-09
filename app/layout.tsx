import type { Metadata } from 'next'
import './globals.css'
import { siteUrl } from '@/lib/utils'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Portfolio',
    template: '%s · Portfolio',
  },
  description: 'Portfolio, powered by Sanity.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
