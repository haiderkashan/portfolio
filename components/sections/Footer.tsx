import Image from 'next/image'
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
  return (
    <footer id="contact" className="theme-dark bg-ink pb-8 pt-24 sm:pt-32">
      <div className="container-page">
        <Reveal className="flex flex-col items-center justify-center gap-5 text-center sm:flex-row sm:gap-8">
          <h2 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl">
            {headline || "Let's do great things!"}
          </h2>
          {footerImageUrl && (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-36 md:h-28 md:w-40">
              <Image src={footerImageUrl} alt="" fill sizes="160px" className="object-cover" />
            </div>
          )}
          <p className="font-display text-2xl font-bold tracking-tight text-paper sm:text-4xl md:text-5xl">
            {email}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex justify-center sm:mt-12">
          <Magnetic>
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink"
            >
              {ctaLabel || 'Talk with me'}
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </Reveal>

        {socialLinks && socialLinks.length > 0 && (
          <Reveal delay={0.2} className="mt-14 border-t border-[var(--line)] pt-8 sm:mt-16">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:justify-between">
              {socialLinks.map((s) => (
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
          </Reveal>
        )}

        <div className="mt-10 overflow-hidden sm:mt-14">
          <Link
            href="/#top"
            className="block whitespace-nowrap text-center font-display text-[13vw] font-bold uppercase leading-none tracking-tight text-paper transition-colors hover:text-accent sm:text-[9vw]"
          >
            /{handle}/
          </Link>
        </div>

        <p className="mt-10 text-center font-body text-xs text-[var(--on-surface-faint)]">
          © {new Date().getFullYear()} {handle}. Built with Next.js &amp; Sanity.
        </p>
      </div>
    </footer>
  )
}
