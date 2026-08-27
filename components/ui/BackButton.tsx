'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export function BackButton({
  fallbackHref = '/',
  label = 'Back to main',
  className = 'inline-flex min-h-[44px] items-center gap-1.5 font-body text-sm font-medium text-[var(--on-surface-soft)] transition-colors hover:text-ink focus-visible:underline',
  children,
}: {
  fallbackHref?: string
  label?: string
  className?: string
  children?: ReactNode
}) {
  const router = useRouter()

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    if (
      typeof window !== 'undefined' &&
      window.history.length > 1 &&
      document.referrer &&
      document.referrer.includes(window.location.host)
    ) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <a href={fallbackHref} onClick={handleClick} className={className}>
      {children || (
        <>
          <ArrowLeft size={16} /> {label}
        </>
      )}
    </a>
  )
}
