'use client'

import { motion, type Variants } from 'motion/react'
import type { ElementType, ReactNode } from 'react'

export const EASE_SWIFT = [0.16, 1, 0.3, 1] as const

// Stable references (created once, at module scope) for every tag these
// components are actually used with — looking one up during render just
// reads this map, it never constructs a new component.
const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  a: motion.a,
  li: motion.li,
  ul: motion.ul,
} as const

/** Fades + slides a single element up as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  amount = 0.3,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
  amount?: number
  as?: ElementType
}) {
  const Component =
    (typeof as === 'string' && MOTION_TAGS[as as keyof typeof MOTION_TAGS]) || motion.div
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
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
  amount = 0.2,
  once = true,
}: {
  children: ReactNode
  className?: string
  amount?: number
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
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
    (typeof as === 'string' && MOTION_TAGS[as as keyof typeof MOTION_TAGS]) || motion.div
  return (
    <Component className={className} variants={staggerItem}>
      {children}
    </Component>
  )
}
