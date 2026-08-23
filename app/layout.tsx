import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import './globals.css'
import { siteUrl } from '@/lib/utils'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Portfolio',
    template: '%s · Portfolio',
  },
  description: 'Portfolio, powered by Next.js and Sanity.',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Portfolio',
    title: 'Portfolio',
    description: 'Portfolio, powered by Next.js and Sanity.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio',
    description: 'Portfolio, powered by Next.js and Sanity.',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
