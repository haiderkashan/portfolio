import type { Metadata } from 'next'
import { Download } from 'lucide-react'
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
    <div className="theme-light min-h-screen bg-paper pb-28 pt-32 sm:pb-36 sm:pt-40">
      <div className="container-page grid gap-16 md:grid-cols-2 md:gap-12">
        <div>
          <SplitHeading
            text="Let's talk"
            as="h1"
            className="font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl"
          />
          <Reveal delay={0.15} className="mt-6 max-w-sm">
            <p className="font-body text-lg leading-relaxed text-[var(--on-surface-soft)]">
              Have a project in mind or just want to say hi? Fill out the form, or email me
              directly at{' '}
              <a href={`mailto:${email}`} className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-2">
                {email}
              </a>
              .
            </p>
          </Reveal>

          {resumeUrl && (
            <Reveal delay={0.25} className="mt-8">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:border-accent hover:text-accent"
              >
                <Download size={15} /> Download resume
              </a>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  )
}
