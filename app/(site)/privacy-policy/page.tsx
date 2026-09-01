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
  const title = 'Privacy Policy'
  const description = 'Privacy Policy and data protection details.'
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
      canonical: '/privacy-policy',
    },
    openGraph: {
      title: `${title} · ${settings?.name || 'Portfolio'}`,
      description,
      type: 'website',
      url: `${siteUrl}/privacy-policy`,
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

export default async function PrivacyPolicyPage() {
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
            Privacy Policy
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
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">1</span> Introduction
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                Welcome to the portfolio website of {authorName}. I respect your privacy and am committed to protecting your personal data. This Privacy Policy explains how I collect, use, and safeguard your information when you visit my website and use my contact form.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">2</span> Information I Collect
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)] mb-4">
                When you reach out via the Contact Form, I may collect the following personal information:
              </p>
              <ul className="list-disc pl-5 space-y-3 font-body text-base text-[var(--on-surface-soft)]">
                <li>
                  <strong className="text-ink font-semibold">Identity Data:</strong> Your full name and company/organization name (optional).
                </li>
                <li>
                  <strong className="text-ink font-semibold">Contact Data:</strong> Your email address and phone number (optional).
                </li>
                <li>
                  <strong className="text-ink font-semibold">Communication Data:</strong> The topic of your inquiry, your message, and any files or documents you choose to attach.
                </li>
                <li>
                  <strong className="text-ink font-semibold">Technical Data:</strong> For security and spam prevention (rate limiting), I temporarily process your IP address when you submit a request.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">3</span> How I Use Your Information
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)] mb-4">
                The information collected is strictly used for professional purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 font-body text-base text-[var(--on-surface-soft)]">
                <li>To respond to your inquiries, project proposals, or recruitment messages.</li>
                <li>To evaluate any documents or briefs you upload regarding potential collaborations.</li>
                <li>To maintain security, prevent spam, and protect the website against bot-driven abuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">4</span> Data Storage and Security
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                Your data is processed securely. Form submissions are stored securely in a managed database (Sanity CMS) and transmitted via encrypted email routing to my personal inbox. I implement strict technical measures (such as server-side validation and in-memory rate limiting) to prevent unauthorized access or data breaches.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">5</span> Third-Party Services
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                I do not sell, trade, or rent your personal information to others. However, to operate this website, I utilize trusted third-party infrastructure providers (such as Vercel for hosting and Sanity for database management). These providers are bound by strict data processing agreements and only handle your data to the extent necessary to keep the website functional.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">6</span> Your Rights
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                You have the right to request access to the personal data I hold about you, or to request that I delete your information from my database. To exercise these rights, please contact me directly via the contact page.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">7</span> Data Retention
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                I retain personal information and uploaded files only for as long as reasonably necessary to fulfill the purposes outlined in this policy—typically no longer than 12 months for general inquiries—unless an ongoing professional or contractual relationship is established, or as required by law.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">8</span> Cookies &amp; Analytics
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                This website may utilize essential cookies and basic, anonymized edge analytics (provided by hosting infrastructure like Vercel) strictly to monitor site performance, security, and uptime. I do not use intrusive third-party marketing or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="flex items-center font-display text-base font-bold uppercase tracking-wider text-ink mb-3 sm:text-lg">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink mr-2.5 shrink-0">9</span> Cross-Border Data Transfer
              </h2>
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                Because this website utilizes global cloud infrastructure (such as Vercel and Sanity), data submitted through the contact form may be transferred to, and processed on, servers located outside of your home jurisdiction, including in the United States and European Union. By submitting your information, you consent to this transfer.
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
