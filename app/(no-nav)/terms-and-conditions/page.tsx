import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
}

export default function TermsAndConditionsPage() {
  return (
    <div className="theme-light min-h-screen bg-paper flex flex-col justify-between py-8 sm:py-12 md:py-16">
      <div className="container-page max-w-3xl flex-1 flex flex-col justify-center">
        {/* Back Button */}
        <header className="mb-8">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-[var(--on-surface-soft)] transition-colors hover:text-accent"
            >
              <ArrowLeft size={16} /> Back to main
            </Link>
          </Reveal>
        </header>

        {/* Article content */}
        <article className="prose prose-neutral max-w-none">
          <Reveal delay={0.05}>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-ink sm:text-5xl mb-2">
              Terms &amp; Conditions
            </h1>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-faint)] mb-10">
              Last Updated: August 2026
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-10">
              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  By accessing and using this portfolio website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this website.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  2. Intellectual Property
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  All content, designs, code, graphics, and text on this website are the intellectual property of Kashan Haider, unless otherwise stated or attributed to specific clients/projects. You may not reproduce, distribute, or create derivative works from this website's content without explicit, written permission.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  3. Use of the Contact Form &amp; File Uploads
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)] mb-4">
                  The contact form is provided to facilitate professional communication, freelance inquiries, and recruitment. By using the contact form, you agree:
                </p>
                <ul className="list-disc pl-5 space-y-2 font-body text-base text-[var(--on-surface-soft)] mb-4">
                  <li>Not to submit spam, unauthorized advertising, or promotional materials.</li>
                  <li>Not to upload files that contain viruses, malware, or any malicious code intended to damage or disrupt operations.</li>
                  <li>Not to submit abusive, unlawful, or discriminatory content.</li>
                </ul>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  I reserve the right to block IP addresses that abuse the contact system or violate these terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  4. No Binding Contract
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  The information provided on this website is for general informational purposes. Submitting a project inquiry or communicating via the contact form does not constitute a legally binding agreement or a commitment to provide services. Formal freelance or employment engagements will be subject to a separate, signed contract.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  5. Limitation of Liability
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  This website and its content are provided on an "as-is" basis. While I strive to keep the portfolio accurate and up-to-date, I make no warranties regarding the completeness or reliability of the information. I shall not be held liable for any direct or indirect damages arising out of your use of this website.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  6. Governing Law
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  These terms and conditions are governed by and construed in accordance with the laws of Pakistan. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the local courts.
                </p>
              </section>
            </div>
          </Reveal>
        </article>
      </div>
    </div>
  )
}
