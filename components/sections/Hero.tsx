'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { EASE_SWIFT } from '@/components/ui/Reveal'
import { Magnetic } from '@/components/ui/Magnetic'
import { cn, splitBrandName } from '@/lib/utils'

export function Hero({
  name,
  role,
  ctaLabel,
  heroImageUrl,
}: {
  name: string
  role?: string
  ctaLabel?: string
  heroImageUrl?: string
}) {
  const prefersReducedMotion = useReducedMotion()
  const [started, setStarted] = useState(false)
  const [first, last] = splitBrandName(name.toUpperCase())
  const sectionRef = useRef<HTMLElement>(null)

  const boxTransition = prefersReducedMotion
    ? { duration: 0.2 }
    : { duration: 1.3, ease: EASE_SWIFT }

  useEffect(() => {
    // A short beat on the collapsed card before it expands, matching the
    // "load, pause, grow" rhythm of the reference. Skipped (0ms) if the
    // visitor prefers reduced motion — the hero just appears settled.
    const t = setTimeout(() => setStarted(true), prefersReducedMotion ? 0 : 450)
    return () => clearTimeout(t)
  }, [prefersReducedMotion])

  // Tracks how far the hero has scrolled out of view (0 = fully on screen,
  // 1 = fully scrolled past). Drives the shrink-and-tilt-away exit as you
  // scroll into the next section, instead of the hero just scrolling off
  // like a plain block.
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ['end end', 'end start'],
  })

  const exitScale = useTransform(exitProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 0.5])
  const exitRotateX = useTransform(exitProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 55])
  const exitY = useTransform(exitProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -70])
  const exitImageOpacity = useTransform(
    exitProgress,
    [0, 0.55, 1],
    prefersReducedMotion ? [1, 1, 1] : [1, 1, 0]
  )
  const exitChromeOpacity = useTransform(
    exitProgress,
    [0, 0.22],
    prefersReducedMotion ? [1, 1] : [1, 0]
  )

  return (
    <section
      ref={sectionRef}
      id="top"
      className="theme-dark relative h-[100svh] min-h-[36rem] w-full overflow-hidden bg-ink"
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: 1400 }}
      >
        <motion.div
          layout
          transition={boxTransition}
          style={{
            scale: exitScale,
            rotateX: exitRotateX,
            y: exitY,
            opacity: exitImageOpacity,
            transformOrigin: 'top center',
          }}
          className={cn(
            'relative overflow-hidden bg-moss',
            started
              ? 'h-full w-full rounded-none'
              : 'aspect-[16/10] w-[min(88vw,720px)] rounded-[28px]'
          )}
        >
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-moss-light to-moss" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

          <div
            className={cn(
              'absolute px-5 sm:px-8 md:px-12',
              started
                ? 'inset-x-0 bottom-6 flex items-end justify-between gap-4 sm:bottom-10'
                : 'inset-0 flex flex-col items-center justify-center gap-0.5'
            )}
          >
            <motion.span
              layout="position"
              transition={boxTransition}
              className="font-display font-bold uppercase leading-[0.86] tracking-tight text-accent"
              style={{ fontSize: started ? 'clamp(2.75rem,9.5vw,7.25rem)' : 'clamp(1.4rem,5.2vw,2.4rem)' }}
            >
              /{first || last}
            </motion.span>
            {first && (
              <motion.span
                layout="position"
                transition={boxTransition}
                className="text-right font-display font-bold uppercase leading-[0.86] tracking-tight text-accent"
                style={{ fontSize: started ? 'clamp(2.75rem,9.5vw,7.25rem)' : 'clamp(1.4rem,5.2vw,2.4rem)' }}
              >
                {last}/
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: exitChromeOpacity }}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: started ? 1 : 0, y: started ? 0 : 16 }}
          transition={{ duration: 0.7, delay: 1.05, ease: EASE_SWIFT }}
          className="absolute inset-x-0 px-5 sm:px-8 md:px-12"
          style={{ bottom: 'clamp(7rem, 17vw, 10.5rem)' }}
        >
          <div className="flex items-end justify-between gap-4">
            {role ? (
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm">
                {role}
              </p>
            ) : (
              <span />
            )}
            <div className="pointer-events-auto">
              <Magnetic>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-transform sm:px-6 sm:py-3 sm:text-sm"
                >
                  {ctaLabel || 'Talk with me'}
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Magnetic>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: started ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-1.5 sm:bottom-7"
        >
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Scroll
          </span>
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} className="text-accent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}




