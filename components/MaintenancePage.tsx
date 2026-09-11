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
  socialLinks = [],
}: MaintenancePageProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-ink px-6 py-10 text-center text-paper selection:bg-accent selection:text-ink sm:py-14">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* Top spacer to balance vertical centering */}
      <div className="h-6 w-full" aria-hidden="true" />

      {/* ── Centered Main Content ──────────────────────────────────── */}
      <main className="flex w-full max-w-2xl flex-col items-center justify-center my-auto py-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          503
        </p>

        <h1 className="mt-4 text-balance font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-paper sm:text-6xl md:text-7xl">
          {title || 'Currently Under Maintenance'}
        </h1>

        <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-paper-dim sm:text-lg">
          {subtitle ||
            'I am currently making improvements to the portfolio. Please check back soon or reach out directly via email.'}
        </p>

        {expectedReturn && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 font-body text-xs text-paper-dim">
            <Clock size={14} className="text-accent shrink-0" />
            <span>
              <strong className="text-paper">Estimated return:</strong> {expectedReturn}
            </span>
          </div>
        )}

        {/* ── Action Buttons & Social Links ─────────────────────── */}
        <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-4">
          {/* Primary Action: Send an Email */}
          {email && (
            <a
              href={`mailto:${email}`}
              className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Mail size={15} />
              <span>Send an Email</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          )}

          {/* Secondary Actions: Dynamic Social Media Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.08em] text-paper-dim transition-all hover:border-accent/40 hover:bg-white/[0.08] hover:text-accent"
                >
                  <span>{s.platform}</span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-60 transition-transform duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Bottom Copyright ─────────────────────────────────────── */}
      <footer className="w-full text-center">
        <p className="font-body text-xs font-medium tracking-wide text-paper-dim/60">
          &copy; {currentYear} {name}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
