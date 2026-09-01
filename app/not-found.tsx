import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="theme-light flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-[var(--on-surface-soft)] sm:text-lg">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink"
      >
        Back home
        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  )
}
