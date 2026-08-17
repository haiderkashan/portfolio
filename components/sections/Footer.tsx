import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Magnetic } from '@/components/ui/Magnetic'

export function Footer({
  headline,
  email,
  ctaLabel,
  footerImageUrl,
  handle,
  socialLinks,
}: {
  headline?: string
  email: string
  ctaLabel?: string
  footerImageUrl?: string
  handle: string
  socialLinks?: { platform: string; url: string }[]
}) {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contact" className="theme-dark relative overflow-hidden bg-ink pb-0 pt-24 sm:pt-32">
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

        {/* 2. Middle Section: Social + Email Links Bar (Left) & Copyright (Right) */}
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

            {/* 3. Copyright Text: Aligned to the right, sitting directly above giant typography */}
            <p className="font-body text-xs text-[var(--on-surface-faint)] sm:text-right">
              &copy; {currentYear} {handle}. All rights reserved.
            </p>
          </div>
        </Reveal>

        {/* 4. Bottom Section: Giant Typography with Clipped/Half Effect */}
        <div className="mt-8 overflow-hidden pt-4 sm:mt-12">
          <Link
            href="/#top"
            className="block translate-y-1/3 whitespace-nowrap text-center font-display text-[15vw] font-bold uppercase leading-none tracking-tight text-paper transition-colors hover:text-accent sm:text-[13vw]"
          >
            /{handle}/
          </Link>
        </div>
      </div>
    </footer>
  )
}





