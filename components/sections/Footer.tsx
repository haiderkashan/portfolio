import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Magnetic } from '@/components/ui/Magnetic'

export function Footer({
  headline,
  email,
  ctaLabel,
  handle,
  name,
  socialLinks,
}: {
  headline?: string
  email: string
  ctaLabel?: string
  handle: string
  name?: string
  socialLinks?: { platform: string; url: string }[]
}) {
  const currentYear = new Date().getFullYear()
  const displayName = name || 'Kashan Haider'
  const displayHandle = handle ? handle.toUpperCase() : 'KASHAN HAIDER'

  return (
    <footer id="contact" className="theme-dark bg-ink pb-8 pt-8 sm:pt-12">
      <div className="container-page">
        {/* 1. Top Section: Centered Heading & Centered CTA Button */}
        <Reveal className="flex flex-col items-center justify-center text-center">
          <h3 className="max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl">
            {headline || "Let's build something great!"}
          </h3>
          <div className="mt-8 sm:mt-10">
            <Magnetic>
              <a
                href={`mailto:${email}`}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                {ctaLabel || 'TALK WITH ME'}
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Magnetic>
          </div>
        </Reveal>

        {/* 2. Middle Section: Social + Email Links (Left) & Legal Placeholder Links (Right) */}
        <Reveal delay={0.15} className="mt-16 border-t border-[var(--line)] pt-8 sm:mt-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left-aligned Links: EMAIL + Social Links */}
            <ul className="flex flex-wrap items-center justify-start gap-x-8 gap-y-3">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-[44px] items-center font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent focus-visible:underline"
                  >
                    EMAIL
                  </a>
                </li>
              )}
              {socialLinks?.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent focus-visible:underline"
                  >
                    {s.platform}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Right-aligned Links: TERMS & CONDITIONS and PRIVACY POLICY */}
            <ul className="flex flex-wrap items-center justify-start gap-x-8 gap-y-3 sm:justify-end">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="inline-flex min-h-[44px] items-center font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent focus-visible:underline"
                >
                  TERMS &amp; CONDITIONS
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-flex min-h-[44px] items-center font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent focus-visible:underline"
                >
                  PRIVACY POLICY
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* 3. Giant Typography (100% visible, fully centered, constrained to viewport) */}
        <div className="mt-12 w-full max-w-full overflow-hidden sm:mt-16">
          <Link
            href="/#top"
            aria-label="Back to top of page"
            className="block w-full max-w-full truncate text-center font-display text-[8.5vw] font-bold uppercase leading-none tracking-tight text-paper transition-colors hover:text-accent sm:text-[10vw]"
          >
            /{displayHandle}/
          </Link>
        </div>

        {/* 4. Copyright (Subtle, centered text block at absolute bottom under giant name) */}
        <p className="mt-8 text-center font-body text-xs font-medium tracking-wide text-[var(--on-surface-soft)] sm:mt-12">
          &copy; {currentYear} {displayName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}





