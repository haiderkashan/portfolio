'use client'

import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export function Marquee({
  items,
  className,
  duration = 26,
  separator = '•',
}: {
  items: string[]
  className?: string
  duration?: number
  separator?: string
}) {
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const content = items.join(`  ${separator}  `) + `  ${separator}  `

  if (prefersReducedMotion) {
    return (
      <div
        role="region"
        aria-label="Scrolling highlights"
        className={cn('relative overflow-x-auto no-scrollbar select-none', className)}
      >
        <div className="flex w-max" style={{ animation: 'none', transform: 'none' }}>
          <span className="whitespace-nowrap pr-6">{content}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-label="Scrolling highlights (tap to pause)"
      onClick={() => setIsPaused((p) => !p)}
      className={cn(
        'pause-on-hover relative cursor-pointer overflow-hidden select-none',
        className
      )}
    >
      <div
        className="animate-marquee flex w-max will-change-transform"
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: isPaused ? 'paused' : undefined,
        }}
      >
        <span className="whitespace-nowrap pr-6">{content}</span>
        <span className="whitespace-nowrap pr-6" aria-hidden="true">
          {content}
        </span>
      </div>
    </div>
  )
}
