'use client'

import { m, type Variants } from 'motion/react'
import type { ElementType, ReactNode } from 'react'

export const EASE_SWIFT = [0.16, 1, 0.3, 1] as const

// Stable references (created once, at module scope) for every tag these
// components are actually used with — looking one up during render just
// reads this map, it never constructs a new component.
const MOTION_TAGS = {
  div: m.div,
  span: m.span,
  p: m.p,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  a: m.a,
  li: m.li,
  ul: m.ul,
} as const

/** Fades + slides a single element up as it enters the viewport or on mount. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  amount = 'some',
  margin = '100px',
  as = 'div',
  animateOnMount = false,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
  amount?: number | 'some' | 'all'
  margin?: string
  as?: ElementType
  animateOnMount?: boolean
}) {
  const Component =
    (typeof as === 'string' && MOTION_TAGS[as as keyof typeof MOTION_TAGS]) || m.div

  const animationProps = animateOnMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once, amount, margin } }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      {...animationProps}
      transition={{ duration: 0.85, delay, ease: EASE_SWIFT }}
    >
      {children}
    </Component>
  )
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_SWIFT } },
}

/** Container that reveals its StaggerItem children one after another. */
export function Stagger({
  children,
  className,
  amount = 'some',
  margin = '100px',
  once = true,
  animateOnMount = false,
}: {
  children: ReactNode
  className?: string
  amount?: number | 'some' | 'all'
  margin?: string
  once?: boolean
  animateOnMount?: boolean
}) {
  const animationProps = animateOnMount
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once, amount, margin } }

  return (
    <m.div
      className={className}
      initial="hidden"
      {...animationProps}
      variants={staggerContainer}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  const Component =
    (typeof as === 'string' && MOTION_TAGS[as as keyof typeof MOTION_TAGS]) || m.div
  return (
    <Component className={className} variants={staggerItem}>
      {children}
    </Component>
  )
}
