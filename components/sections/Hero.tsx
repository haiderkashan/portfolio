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

  useEffect(() => {
    // Guaranteed beat on the collapsed rounded card before expanding into full-screen hero.
    const t = setTimeout(() => setStarted(true), prefersReducedMotion ? 0 : 350)
    return () => clearTimeout(t)
  }, [prefersReducedMotion])

  // Tracks scroll progress as the hero section exits the viewport.
  // Drives the 7-column slice split, angled skew, and alternating vertical shift.
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ['end end', 'end start'],
  })

  const exitSkewY = useTransform(
    exitProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -10]
  )
  const exitYOdd = useTransform(
    exitProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -260]
  )
  const exitYEven = useTransform(
    exitProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 260]
  )
  const exitOpacity = useTransform(
    exitProgress,
    [0, 0.65, 1],
    prefersReducedMotion ? [1, 1, 1] : [1, 0.8, 0]
  )
  const exitChromeOpacity = useTransform(
    exitProgress,
    [0, 0.22],
    prefersReducedMotion ? [1, 1] : [1, 0]
  )

  const NUM_SLICES = 7
  const slices = Array.from({ length: NUM_SLICES })

  return (
    <section
      ref={sectionRef}
      id="top"
      className="theme-light relative h-[100svh] min-h-[36rem] w-full overflow-hidden bg-paper"
    >
      {/* Semantic H1 & role landmark for Screen Readers & SEO */}
      <div className="sr-only">
        <h1>{name}</h1>
        {role && <p>{role}</p>}
      </div>

      {/* Centered container driving initial card expansion + 3D scroll exit */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: 1400 }}
        aria-hidden="true"
      >
        <motion.div
          initial={{ width: 'min(88vw, 720px)', height: 'min(55vw, 450px)', borderRadius: '28px' }}
          animate={
            started
              ? { width: '100%', height: '100%', borderRadius: '0px' }
              : { width: 'min(88vw, 720px)', height: 'min(55vw, 450px)', borderRadius: '28px' }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.2 }
              : { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative overflow-hidden bg-paper"
        >
          {/* Sliced container for 7 vertical columns during scroll exit on ALL devices */}
          <motion.div
            style={{
              skewY: exitSkewY,
              opacity: exitOpacity,
              transformOrigin: 'center center',
            }}
            className="flex h-full w-full overflow-hidden"
          >
            {slices.map((_, i) => {
              const isOdd = i % 2 === 0
              const sliceY = isOdd ? exitYOdd : exitYEven
              const isPriority = i === 3

              return (
                <motion.div
                  key={i}
                  style={{
                    y: sliceY,
                    width: `${100 / NUM_SLICES}%`,
                    willChange: 'transform',
                  }}
                  className="relative h-full overflow-hidden"
                >
                  {/* Inner container shifted left to reconstruct 100% of the unified hero image at rest */}
                  <div
                    style={{
                      width: `${NUM_SLICES * 100}%`,
                      left: `-${i * 100}%`,
                    }}
                    className="absolute inset-y-0"
                  >
                    {heroImageUrl ? (
                      <Image
                        src={heroImageUrl}
                        alt=""
                        fill
                        priority={isPriority}
                        sizes="100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-moss-light to-moss" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

                    {/* Wordmark overlay */}
                    <div
                      className={cn(
                        'absolute px-5 sm:px-8 md:px-12',
                        started
                          ? 'inset-x-0 bottom-6 flex items-end justify-between gap-4 sm:bottom-10'
                          : 'inset-0 flex flex-col items-center justify-center gap-0.5'
                      )}
                    >
                      <motion.span
                        className="font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                        style={{
                          fontSize: started
                            ? 'clamp(2.75rem,9.5vw,7.25rem)'
                            : 'clamp(1.4rem,5.2vw,2.4rem)',
                        }}
                      >
                        /{first || last}
                      </motion.span>
                      {first && (
                        <motion.span
                          className="text-right font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                          style={{
                            fontSize: started
                              ? 'clamp(2.75rem,9.5vw,7.25rem)'
                              : 'clamp(1.4rem,5.2vw,2.4rem)',
                          }}
                        >
                          {last}/
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: started ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="pointer-events-auto absolute inset-x-0 bottom-5 flex flex-col items-center gap-1.5 sm:bottom-7"
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
      </motion.div>
    </section>
  )
}
