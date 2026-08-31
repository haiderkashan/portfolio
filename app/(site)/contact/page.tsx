import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { BackButton } from '@/components/ui/BackButton'
import { ContactForm } from '@/components/ContactForm'
import { JsonLd } from '@/components/JsonLd'
import { siteUrl } from '@/lib/utils'
import { urlForImage } from '@/sanity/lib/image'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
  const title = 'Contact'
  const description = settings?.contactSeoDescription || settings?.seoDescription || 'Get in touch for project collaborations, freelance inquiries, or recruitment.'
  const fallbackOgUrl = `${siteUrl}/og-fallback.png`
  const ogImageUrl = urlForImage(settings?.ogImage)?.width(1200).height(630).url() || fallbackOgUrl
  const twitterHandle = settings?.twitterHandle
    ? (settings.twitterHandle.startsWith('@') ? settings.twitterHandle : `@${settings.twitterHandle}`)
    : settings?.handle
      ? `@${settings.handle.replace(/^@/, '')}`
      : undefined

  return {
    title,
    description,
    alternates: {
      canonical: '/contact',
    },
    openGraph: {
      title: `${title} · ${settings?.name || 'Portfolio'}`,
      description,
      type: 'website',
      url: `${siteUrl}/contact`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${settings?.name || 'Portfolio'}`,
      description,
      images: [ogImageUrl],
      creator: twitterHandle,
      site: twitterHandle,
    },
  }
}

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
  const email = settings?.email || 'you@example.com'
  const resumeUrl = settings?.resume?.asset?.url
  const description = settings?.contactSeoDescription || settings?.seoDescription || 'Get in touch for project collaborations, freelance inquiries, or recruitment.'

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contact',
            item: `${siteUrl}/contact`,
          },
        ],
      },
      {
        '@type': 'ContactPage',
        '@id': `${siteUrl}/contact#webpage`,
        url: `${siteUrl}/contact`,
        name: `Contact · ${settings?.name || 'Portfolio'}`,
        description,
        mainEntity: {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: settings?.name || 'Portfolio',
          email,
          url: `${siteUrl}/`,
          ...(settings?.role ? { jobTitle: settings.role } : {}),
        },
      },
    ],
  }

  return (
    <div className="theme-light min-h-screen bg-paper flex flex-col pt-24 sm:pt-28 pb-8">
      <JsonLd data={contactJsonLd} />

      {/* Main Content Grid */}
      <div className="container-page flex-1 grid gap-8 py-4 md:grid-cols-12 md:items-start md:gap-12 lg:gap-16">
        {/* Left Column: Heading & Contact Info */}
        <div className="md:col-span-5 flex flex-col justify-start">
          {/* Decoupled Back Button Navigation inside left flow */}
          <div className="mb-6 md:mb-8">
            <Reveal>
              <BackButton fallbackHref="/" label="Back to main" />
            </Reveal>
          </div>

          <SplitHeading
            text="Let's talk"
            as="h1"
            className="font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
          />
          <Reveal delay={0.15} className="mt-4 max-w-md">
            <p className="font-body text-base sm:text-lg leading-relaxed text-[var(--on-surface-soft)]">
              Have a project in mind, a question, or an opportunity? Fill out the form or reach out directly at{' '}
              <a
                href={`mailto:${email}`}
                className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:bg-accent/40"
              >
                {email}
              </a>
              .
            </p>
          </Reveal>

          {resumeUrl && (
            <Reveal delay={0.25} className="mt-6">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] transition-all hover:bg-accent hover:border-accent hover:text-ink focus-visible:bg-accent focus-visible:text-ink"
              >
                <FileText size={14} /> View resume
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Reveal>
          )}
        </div>

        {/* Right Column: Form Container */}
        <div className="md:col-span-7 pt-2">
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
