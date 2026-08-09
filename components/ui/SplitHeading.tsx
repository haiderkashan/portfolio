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
   *           color. Used for the intro statement, tuned for dark text on
   *           a light section (it fades through low-opacity ink).
   */
  variant?: 'slide' | 'fade'
}) {
  const Tag = as
  const words = text.split(' ')

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) =>
          variant === 'fade' ? (
            <motion.span
              key={`${word}-${i}`}
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
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          ) : (
            <span
              key={`${word}-${i}`}
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
                {i < words.length - 1 ? '\u00A0' : ''}
              </motion.span>
            </span>
          )
        )}
      </span>
    </Tag>
  )
}