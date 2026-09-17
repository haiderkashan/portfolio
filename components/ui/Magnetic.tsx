'use client'

import { useRef, type MouseEvent, type ReactNode } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'

export function Magnetic({
  children,
  strength = 0.2,
  maxOffset = 12,
  className,
}: {
  children: ReactNode
  strength?: number
  maxOffset?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 15, mass: 0.15 })
  const springY = useSpring(y, { stiffness: 180, damping: 15, mass: 0.15 })

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rawX = (e.clientX - (rect.left + rect.width / 2)) * strength
    const rawY = (e.clientY - (rect.top + rect.height / 2)) * strength

    // Clamp displacement to prevent the button from running too far away
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, rawX))
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, rawY))

    x.set(clampedX)
    y.set(clampedY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </m.div>
  )
}

