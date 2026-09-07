import Link from 'next/link'
import { ArrowUpRight, Clock, Mail } from 'lucide-react'
import type { SocialLink } from '@/sanity/lib/queries'

interface MaintenancePageProps {
  title?: string
  subtitle?: string
  expectedReturn?: string
  email?: string
  name?: string
  handle?: string
  locationTag?: string
  socialLinks?: SocialLink[]
}

export function MaintenancePage({
  title,
  subtitle,
  expectedReturn,
  email = 'you@example.com',
  name = 'Kashan Haider',
  handle = 'kashan',
  locationTag,
  socialLinks = [],
}: MaintenancePageProps) {
  const currentYear = new Date().getFullYear()
  const displayHandle = handle ? handle.toUpperCase() : 'KASHAN HAIDER'

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-ink text-paper selection:bg-accent selection:text-ink">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="container-page flex items-center justify-between border-b border-[var(--line)] py-6">
        <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-accent">
          /{displayHandle}/
        </span>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1 text-xs font-mono font-medium text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span>MAINTENANCE MODE</span>
          </div>

          {locationTag && (
            <span className="hidden font-body text-xs uppercase tracking-[0.1em] text-paper-dim sm:inline-block">
              / {locationTag}
            </span>
          )}
        </div>
      </header>

      {/* ── Main Content Area ────────────────────────────────────── */}
      <main className="container-page my-auto py-16 sm:py-24">
        <div className="max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {'// STATUS 503 · SCHEDULED UPGRADE'}
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-paper sm:text-6xl md:text-7xl">
            {title || 'Currently Under Maintenance'}
          </h1>

          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-paper-dim sm:text-lg md:text-xl">
            {subtitle ||
              'I am currently making improvements to the portfolio. Please check back soon or reach out directly via email.'}
          </p>

          {/* Expected Return Notice */}
          {expectedReturn && (
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 font-body text-sm text-paper-dim">
              <Clock size={16} className="shrink-0 text-accent" />
              <span>
                <strong className="text-paper">Estimated return:</strong> {expectedReturn}
              </span>
            </div>
          )}

          {/* CTA & Social Links */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <Mail size={16} />
                <span>Send an Email</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 font-body text-xs font-medium uppercase tracking-[0.1em] text-paper-dim transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <span>{s.platform}</span>
                    <ArrowUpRight size={13} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="container-page flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] py-6 text-xs text-paper-dim sm:flex-row">
        <p className="font-body font-medium tracking-wide">
          &copy; {currentYear} {name}. All rights reserved.
        </p>

        <Link
          href="/studio"
          className="font-mono text-paper-dim/40 transition-colors hover:text-accent"
        >
          Studio Access &rarr;
        </Link>
      </footer>
    </div>
  )
}
