import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { BackButton } from '@/components/ui/BackButton'
import { siteUrl } from '@/lib/utils'

import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
  const title = 'Terms & Conditions'
  const description = 'Terms and Conditions for website usage and intellectual property.'
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
      canonical: '/terms-and-conditions',
    },
    openGraph: {
      title: `${title} · ${settings?.name || 'Portfolio'}`,
      description,
      type: 'website',
      url: `${siteUrl}/terms-and-conditions`,
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

export default async function TermsAndConditionsPage() {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
  const authorName = settings?.name || 'Kashan Haider'
  const currentYear = new Date().getFullYear()

  return (
    <div className="theme-light min-h-screen bg-paper pb-20 pt-24 sm:pb-28 sm:pt-28">
      <div className="container-page max-w-2xl">
        {/* Back Button */}
        <header className="mb-10">
          <Reveal animateOnMount>
            <BackButton fallbackHref="/" label="Back to main" />
          </Reveal>
        </header>

        {/* Title */}
        <Reveal delay={0.05} animateOnMount>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-ink sm:text-5xl mb-3">
            Terms &amp; Conditions
          </h1>
          <div className="h-[3px] w-16 bg-accent mb-6" />
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-faint)]/80 mb-12">
            Last Updated: August 2026
          </p>
        </Reveal>

        {/* Content sections */}
        <Reveal delay={0.1} animateOnMount>
          <div className="space-y-12">
            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">1</span> Acceptance of Terms
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                By accessing and using this portfolio website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">2</span> Intellectual Property
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                All content, designs, code, graphics, and text on this website are the intellectual property of {authorName}, unless otherwise stated or attributed to specific clients/projects. You may not reproduce, distribute, or create derivative works from this website's content without explicit, written permission.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">3</span> Use of the Contact Form &amp; File Uploads
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)] mb-4">
                The contact form is provided to facilitate professional communication, freelance inquiries, and recruitment. By using the contact form, you agree:
              </p>
              <ul className="list-disc pl-5 space-y-3 font-body text-base text-[var(--on-surface-soft)] mb-4">
                <li>Not to submit spam, unauthorized advertising, or promotional materials.</li>
                <li>Not to upload files that contain viruses, malware, or any malicious code intended to damage or disrupt operations.</li>
                <li>Not to submit abusive, unlawful, or discriminatory content.</li>
              </ul>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                I reserve the right to block IP addresses that abuse the contact system or violate these terms.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">4</span> No Binding Contract
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                The information provided on this website is for general informational purposes. Submitting a project inquiry or communicating via the contact form does not constitute a legally binding agreement or a commitment to provide services. Formal freelance or employment engagements will be subject to a separate, signed contract.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">5</span> Limitation of Liability
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                This website and its content are provided on an "as-is" basis. While I strive to keep the portfolio accurate and up-to-date, I make no warranties regarding the completeness or reliability of the information. I shall not be held liable for any direct or indirect damages arising out of your use of this website.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">6</span> Governing Law
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                These terms and conditions are governed by and construed in accordance with the laws of Pakistan. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the local courts.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">7</span> Third-Party IP &amp; Demonstrative Work
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                The portfolio projects displayed on this website may include corporate logos, trademarks, open-source components, or references to third-party intellectual property. These are displayed strictly for educational, demonstrative, and portfolio purposes to accurately represent my professional and academic experience. All third-party trademarks and copyrights remain the exclusive property of their respective owners.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">8</span> External Links Disclaimer
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                This website contains links to external platforms (such as GitHub, LinkedIn, and X). I am not responsible for the content, privacy practices, or security of these third-party websites. Accessing external links is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">9</span> Modifications to Terms
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                I reserve the right to update, modify, or replace these Terms &amp; Conditions and the Privacy Policy at any time without prior notice. Continued use of the website following any changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>
        </Reveal>

        {/* Footer copyright */}
        <footer className="mt-20 border-t border-[var(--line)]/50 pt-8 text-center text-xs text-[var(--on-surface-faint)]/60">
          &copy; {currentYear} {authorName}. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
