'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Magnetic } from '@/components/ui/Magnetic'
import { splitBrandName } from '@/lib/utils'

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
  const [first, last] = splitBrandName(name.toUpperCase())

  // Core entry animation parameters: simple, high-performance, and under 400ms.
  const transitionConfig = {
    duration: prefersReducedMotion ? 0.1 : 0.38,
    ease: [0.25, 1, 0.5, 1] as [number, number, number, number], // easeOutQuart for smooth deceleration
  }

  return (
    <section
      id="top"
      className="theme-light relative h-[100svh] min-h-[36rem] w-full overflow-hidden bg-paper"
    >
      {/* Background Image/Gradient Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-moss-light to-moss" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />
      </motion.div>

      {/* Semantic H1 & Brand Name Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 pb-6 sm:px-8 sm:pb-10 md:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionConfig}
          className="flex w-full items-end justify-between gap-4"
        >
          <span className="font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] text-[clamp(2.75rem,9.5vw,7.25rem)]">
            /{first || last}
          </span>
          {first && (
            <span className="text-right font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] text-[clamp(2.75rem,9.5vw,7.25rem)]">
              {last}/
            </span>
          )}
        </motion.h1>
      </div>

      {/* Chrome Overlay: Role Landmark & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitionConfig, delay: prefersReducedMotion ? 0 : 0.08 }}
        className="absolute inset-x-0 z-20 px-5 sm:px-8 md:px-12"
        style={{ bottom: 'clamp(7rem, 17vw, 10.5rem)' }}
      >
        <div className="flex items-end justify-between gap-4">
          {role ? (
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-sm">
              {role}
            </p>
          ) : (
            <span />
          )}
          <div className="pointer-events-auto">
            <Magnetic>
              <Link
                href="/contact"
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-transform hover:scale-[1.03] active:scale-[0.98] sm:px-6 sm:py-3 sm:text-sm"
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transitionConfig, delay: prefersReducedMotion ? 0 : 0.16 }}
        className="pointer-events-auto absolute inset-x-0 bottom-5 z-20 flex flex-col items-center gap-1.5 sm:bottom-7"
      >
        <a
          href="#about"
          aria-label="Scroll to about section"
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-md shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-paper">
            Scroll
          </span>
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={14} className="text-accent" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}
