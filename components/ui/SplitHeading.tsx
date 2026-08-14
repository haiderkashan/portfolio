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
                className={`relative inline-block overflow-hidden pb-[0.12em] align-top ${wordClassName ?? ''}`}
              >
                {/* Ghost Outline Layer */}
                <motion.span
                  className="absolute inset-0 block text-transparent"
                  style={{ WebkitTextStroke: 'max(1px, 0.03em) currentColor', opacity: 0.25 }}
                  initial={{ opacity: 0, y: '10%' }}
                  whileInView={{ opacity: 0.25, y: '0%' }}
                  viewport={{ once }}
                  transition={{
                    duration: 0.7,
                    delay: delay + i * stagger,
                    ease: 'easeOut',
                  }}
                >
                  {word}
                </motion.span>

                {/* Solid Fill Layer */}
                <motion.span
                  className="relative z-10 inline-block origin-bottom-left"
                  initial={{ y: '105%', rotate: 6 }}
                  whileInView={{ y: '0%', rotate: 0 }}
                  viewport={{ once }}
                  transition={{
                    duration: 0.9,
                    delay: delay + i * stagger + 0.12,
                    ease: EASE_SWIFT,
                  }}
                >
                  {word}
                </motion.span>
              </span>
            )
          return i < words.length - 1 ? [wordNode, <span key={`s-${i}`}> </span>] : [wordNode]
        })}
      </span>
    </Tag>
  )
}