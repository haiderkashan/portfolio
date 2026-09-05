'use client'

import { m } from 'motion/react'
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const ghostVariants = {
    hidden: { opacity: 0, y: '10%' },
    visible: {
      opacity: 0.25,
      y: '0%',
      transition: {
        duration: 0.7,
        ease: 'easeOut' as const,
      },
    },
  }

  const wordSlideVariants = {
    hidden: { y: '105%', rotate: 6 },
    visible: {
      y: '0%',
      rotate: 0,
      transition: {
        duration: 0.9,
        ease: EASE_SWIFT,
      },
    },
  }

  const wordFadeVariants = {
    hidden: { opacity: 0, color: 'rgba(10,10,8,0.2)' },
    visible: {
      opacity: 1,
      color: 'rgba(10,10,8,1)',
      transition: {
        duration: 0.7,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <m.span
        aria-hidden="true"
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '50px' }}
        variants={containerVariants}
      >
        {words.flatMap((word, i) => {
          const wordNode =
            variant === 'fade' ? (
              <m.span
                key={`w-${i}`}
                className={`inline-block ${wordClassName ?? ''}`}
                variants={wordFadeVariants}
              >
                {word}
              </m.span>
            ) : (
              <span
                key={`w-${i}`}
                className={`relative inline-block overflow-hidden pb-[0.12em] align-top ${wordClassName ?? ''}`}
              >
                {/* Ghost Outline Layer */}
                <m.span
                  aria-hidden="true"
                  className="absolute inset-0 block text-transparent"
                  style={{ WebkitTextStroke: 'max(1px, 0.03em) currentColor' }}
                  variants={ghostVariants}
                >
                  {word}
                </m.span>

                {/* Solid Fill Layer */}
                <m.span
                  className="relative z-10 inline-block origin-bottom-left"
                  variants={wordSlideVariants}
                >
                  {word}
                </m.span>
              </span>
            )
          return i < words.length - 1 ? [wordNode, <span key={`s-${i}`}> </span>] : [wordNode]
        })}
      </m.span>
    </Tag>
  )
}