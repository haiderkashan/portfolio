'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

export default function NoNavError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[NoNavError]', error)
  }, [error])

  return (
    <div className="theme-light flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Error
      </p>
      <h1 className="mt-4 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl">
        Something went wrong
      </h1>
      <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-[var(--on-surface-soft)] sm:text-lg">
        We encountered an error loading this page. You can try again or return to the main page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-md transition-transform hover:scale-[1.03]"
        >
          <RotateCcw size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
          Try again
        </button>
        <Link
          href="/"
          className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to main
        </Link>
      </div>
    </div>
  )
}
