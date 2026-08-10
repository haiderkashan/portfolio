'use client'

import { motion } from 'motion/react'
import type { ElementType } from 'react'
import { EASE_SWIFT } from './Reveal'

export function SplitHeading({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  as = 'h2',
  once = true,
  variant = 'slide',
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  as?: ElementType
  once?: boolean
  /**
   * 'slide' - words rise up from behind a mask (used across most sections).
   * 'fade'  - words materialize from a faint ghost tone into full solid
   *           color, tuned for dark text on a light section.
   */
  variant?: 'slide' | 'fade'
}) {
  const Tag = as
  const words = text.split(' ')

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.flatMap((word, i) => {
          const wordNode =
            variant === 'fade' ? (
              <motion.span
                key={`w-${i}`}
                className={`inline-block ${wordClassName ?? ''}`}
                initial={{ opacity: 0, color: 'rgba(10,10,8,0.2)' }}
                whileInView={{ opacity: 1, color: 'rgba(10,10,8,1)' }}
                viewport={{ once, amount: 0.6 }}
                transition={{
                  duration: 0.7,
                  delay: delay + i * stagger,
                  ease: 'easeOut',
                }}
              >
                {word}
              </motion.span>
            ) : (
              <span
                key={`w-${i}`}
                className={`inline-block overflow-hidden pb-[0.12em] align-top ${wordClassName ?? ''}`}
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: '105%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once, amount: 0.7 }}
                  transition={{
                    duration: 0.85,
                    delay: delay + i * stagger,
                    ease: EASE_SWIFT,
                  }}
                >
                  {word}
                </motion.span>
              </span>
            )
          // A real breakable space, rendered as its own sibling rather than
          // packed inside the word's box, so long text always wraps.
          return i < words.length - 1 ? [wordNode, <span key={`s-${i}`}> </span>] : [wordNode]
        })}
      </span>
    </Tag>
  )
}