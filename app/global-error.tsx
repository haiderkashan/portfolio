'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f2] px-6 text-center text-[#0a0a08]">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[#f4cf00]">
          Something went wrong
        </p>
        <h1 className="mt-4 text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          System Error
        </h1>
        <p className="mt-5 max-w-md font-body text-base leading-relaxed text-[#0a0a08]/70 sm:text-lg">
          An unexpected error occurred while loading the application.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-full bg-[#f4cf00] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#0a0a08] shadow-md transition-transform hover:scale-[1.03]"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
