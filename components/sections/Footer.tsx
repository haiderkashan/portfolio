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
  footerImageUrl?: string
  handle: string
  name?: string
  socialLinks?: { platform: string; url: string }[]
}) {
  const currentYear = new Date().getFullYear()
  const displayName = name || 'Kashan Haider'
  const displayHandle = handle ? handle.toUpperCase() : 'KASHAN HAIDER'

  return (
    <footer id="contact" className="theme-dark bg-ink pb-8 pt-24 sm:pt-32">
      <div className="container-page">
        {/* 1. Top Section: Centered Heading & Centered CTA Button */}
        <Reveal className="flex flex-col items-center justify-center text-center">
          <h2 className="max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl">
            {headline || "Let's build something great!"}
          </h2>
          <div className="mt-8 sm:mt-10">
            <Magnetic>
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink"
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
                    className="font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent"
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
                    className="font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right-aligned Links: TERMS & CONDITIONS and PRIVACY POLICY */}
            <ul className="flex flex-wrap items-center justify-start gap-x-8 gap-y-3 sm:justify-end">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent"
                >
                  TERMS &amp; CONDITIONS
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="font-body text-sm font-medium uppercase tracking-[0.1em] text-[var(--on-surface-soft)] transition-colors hover:text-accent"
                >
                  PRIVACY POLICY
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* 3. Giant Typography (100% visible, fully centered, no overflow clipping) */}
        <div className="mt-12 sm:mt-16">
          <Link
            href="/#top"
            className="block text-center font-display text-[12vw] font-bold uppercase leading-none tracking-tight text-paper transition-colors hover:text-accent sm:text-[10vw]"
          >
            /{displayHandle}/
          </Link>
        </div>

        {/* 4. Copyright (Subtle, centered text block at absolute bottom under giant name) */}
        <p className="mt-8 text-center font-body text-[11px] font-medium tracking-wide text-[var(--on-surface-faint)]/60 sm:mt-12">
          &copy; {currentYear} {displayName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}





