'use client'

import { ReactLenis } from 'lenis/react'
import { type ReactNode, useEffect, useState } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Enable smooth scrolling only on desktop devices (width >= 768px and fine pointer)
    // Completely bypasses Lenis smooth scroll on mobile/tablet screens < 768px
    if (
      window.matchMedia('(pointer: fine)').matches &&
      window.matchMedia('(min-width: 768px)').matches
    ) {
      setEnabled(true)
    }
  }, [])

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
