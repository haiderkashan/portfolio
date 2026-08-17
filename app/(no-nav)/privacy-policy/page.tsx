import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-faint)] mb-10">
              Last Updated: August 2026
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-10">
              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  1. Introduction
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  Welcome to the portfolio website of Kashan Haider. I respect your privacy and am committed to protecting your personal data. This Privacy Policy explains how I collect, use, and safeguard your information when you visit my website and use my contact form.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  2. Information I Collect
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)] mb-4">
                  When you reach out via the Contact Form, I may collect the following personal information:
                </p>
                <ul className="list-disc pl-5 space-y-2 font-body text-base text-[var(--on-surface-soft)]">
                  <li>
                    <strong className="text-ink">Identity Data:</strong> Your full name and company/organization name (optional).
                  </li>
                  <li>
                    <strong className="text-ink">Contact Data:</strong> Your email address and phone number (optional).
                  </li>
                  <li>
                    <strong className="text-ink">Communication Data:</strong> The topic of your inquiry, your message, and any files or documents you choose to attach.
                  </li>
                  <li>
                    <strong className="text-ink">Technical Data:</strong> For security and spam prevention (rate limiting), I temporarily process your IP address when you submit a request.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  3. How I Use Your Information
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
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  4. Data Storage and Security
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  Your data is processed securely. Form submissions are stored securely in a managed database (Sanity CMS) and transmitted via encrypted email routing to my personal inbox. I implement strict technical measures (such as server-side validation and in-memory rate limiting) to prevent unauthorized access or data breaches.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  5. Third-Party Services
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  I do not sell, trade, or rent your personal information to others. However, to operate this website, I utilize trusted third-party infrastructure providers (such as Vercel for hosting and Sanity for database management). These providers are bound by strict data processing agreements and only handle your data to the extent necessary to keep the website functional.
                </p>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-ink mb-3">
                  6. Your Rights
                </h2>
                <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)]">
                  You have the right to request access to the personal data I hold about you, or to request that I delete your information from my database. To exercise these rights, please contact me directly via the contact page.
                </p>
              </section>
            </div>
          </Reveal>
        </article>
      </div>
    </div>
  )
}
