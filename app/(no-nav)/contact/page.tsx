import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
}

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
  const email = settings?.email || 'you@example.com'
  const resumeUrl = settings?.resume?.asset?.url

  return (
    <div className="theme-light min-h-screen bg-paper flex flex-col justify-between">
      {/* Top Header Bar / Back Navigation */}
      <header className="container-page pt-6 sm:pt-8 pb-3 shrink-0">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-[var(--on-surface-soft)] transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} /> Back to main
          </Link>
        </Reveal>
      </header>

      {/* Main Content Grid */}
      <div className="container-page flex-1 grid gap-8 py-6 md:grid-cols-12 md:items-center md:gap-12">
        {/* Left Column: Heading & Contact Info */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <SplitHeading
            text="Let's talk"
            as="h1"
            className="font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
          />
          <Reveal delay={0.15} className="mt-5 max-w-md">
            <p className="font-body text-base sm:text-lg leading-relaxed text-[var(--on-surface-soft)]">
              Have a project in mind, a question, or an opportunity? Fill out the form or reach out directly at{' '}
              <a
                href={`mailto:${email}`}
                className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-accent"
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:border-accent hover:text-accent"
              >
                <Download size={14} /> Download resume
              </a>
            </Reveal>
          )}
        </div>

        {/* Right Column: Form Container */}
        <div className="md:col-span-7 py-1">
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>

      {/* Desktop subtle footer note */}
      <footer className="container-page py-4 shrink-0 flex items-center justify-between text-xs text-[var(--on-surface-faint)] border-t border-[var(--line)]/50">
        <span>Available for full-time & freelance roles</span>
        <span>Replies typically within 24 hours</span>
      </footer>
    </div>
  )
}
