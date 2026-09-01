import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import './globals.css'
import { siteUrl } from '@/lib/utils'

import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
  const name = settings?.name || 'Portfolio'
  const title = settings?.siteTitle || (settings?.name ? `${settings.name} — ${settings.role || 'Portfolio'}` : 'Portfolio')
  const description = settings?.seoDescription || settings?.bio || 'Full-Stack Software Engineer & Technical Architect specializing in high-performance web applications, distributed systems, and modern UI engineering.'
  const fallbackOgUrl = `${siteUrl}/og-fallback.png`
  const ogImageUrl = urlForImage(settings?.ogImage)?.width(1200).height(630).url() || fallbackOgUrl
  const ogImageAlt = settings?.ogImage?.alt || title
  const twitterHandle = settings?.twitterHandle
    ? (settings.twitterHandle.startsWith('@') ? settings.twitterHandle : `@${settings.twitterHandle}`)
    : settings?.handle
      ? `@${settings.handle.replace(/^@/, '')}`
      : undefined

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s · ${name}`,
    },
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: name,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: twitterHandle,
      site: twitterHandle,
    },
  }
}

import { LazyMotion, domAnimation } from 'motion/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body>
        <LazyMotion features={domAnimation}>
          {children}
        </LazyMotion>
      </body>
    </html>
  )
}
