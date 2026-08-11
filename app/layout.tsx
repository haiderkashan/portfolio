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
  description: 'Portfolio, powered by Sanity.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
