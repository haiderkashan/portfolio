'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="theme-light flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Something went wrong
      </p>
      <h1 className="mt-4 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl">
        That didn&rsquo;t load right
      </h1>
      <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-[var(--on-surface-soft)] sm:text-lg">
        An unexpected error occurred. Try again, or head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink"
        >
          <RotateCcw size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
          Try again
        </button>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:border-accent hover:text-accent"
        >
          Back home
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </div>
  )
}
