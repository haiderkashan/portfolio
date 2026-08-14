'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '@/components/ui/Magnetic'

function FadeWord({
  word,
  start,
  end,
  progress,
  prefersReducedMotion,
}: {
  word: string
  start: number
  end: number
  progress: MotionValue<number>
  prefersReducedMotion: boolean | null
}) {
  const opacity = useTransform(progress, [start, end], prefersReducedMotion ? [1, 1] : [0, 1])
  const color = useTransform(
    progress,
    [start, end],
    prefersReducedMotion ? ['rgba(10,10,8,1)', 'rgba(10,10,8,1)'] : ['rgba(10,10,8,0.16)', 'rgba(10,10,8,1)']
  )
  return (
    <motion.span style={{ opacity, color }} className="inline-block">
      {word}
    </motion.span>
  )
}

export function IntroStatement({
  headline,
  bio,
  introImageUrl,
}: {
  headline: string
  bio?: string
  introImageUrl?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // One shared progress value drives the heading, the image, and the body
  // block together, so they read as one coordinated move instead of three
  // separate animations. 0 = section just entering from the bottom of the
  // viewport, 1 = fully settled in view.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.2'],
  })

  const words = headline.split(' ')
  const staggerStep = Math.min(0.05, 0.5 / words.length)

  // Image: starts small, faded, and shifted up toward the heading — then
  // grows and settles down into its resting spot in the column below.
  const imageScale = useTransform(scrollYProgress, [0.05, 0.6], prefersReducedMotion ? [1, 1] : [0.4, 1])
  const imageY = useTransform(scrollYProgress, [0.05, 0.65], prefersReducedMotion ? ['0%', '0%'] : ['-130%', '0%'])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])

  // Body copy + button: slide up and fade in after the image and heading
  // are mostly settled.
  const bodyOpacity = useTransform(scrollYProgress, [0.5, 0.85], [0, 1])
  const bodyY = useTransform(scrollYProgress, [0.5, 0.9], prefersReducedMotion ? [0, 0] : [50, 0])

  return (
    <section className="theme-light bg-paper py-24 sm:py-32">
      <div ref={ref} className="container-page">
        <h2 className="text-balance mx-auto max-w-5xl text-center font-display text-[10.5vw] font-bold uppercase leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
          <span className="sr-only">{headline}</span>
          <span aria-hidden="true">
            {words.flatMap((word, i) => {
              const start = i * staggerStep
              const end = Math.min(1, start + 0.3)
              const nodes = [
                <FadeWord
                  key={`w-${i}`}
                  word={word}
                  start={start}
                  end={end}
                  progress={scrollYProgress}
                  prefersReducedMotion={prefersReducedMotion}
                />,
              ]
              if (i < words.length - 1) nodes.push(<span key={`s-${i}`}> </span>)
              return nodes
            })}
          </span>
        </h2>

        <div className="mt-14 flex flex-col items-center gap-8 sm:mt-20 md:flex-row md:items-center md:justify-center md:gap-12">
          {introImageUrl && (
            <motion.div
              style={{ scale: imageScale, y: imageY, opacity: imageOpacity }}
              className="relative aspect-[4/5] w-40 shrink-0 overflow-hidden rounded-2xl shadow-2xl sm:w-48 md:w-56"
            >
              <Image src={introImageUrl} alt="" fill sizes="240px" className="object-cover" />
            </motion.div>
          )}

          {bio && (
            <motion.div
              style={{ opacity: bodyOpacity, y: bodyY }}
              className="max-w-sm text-center md:text-left"
            >
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)] sm:text-lg">
                {bio}
              </p>
              <Magnetic className="mt-6 inline-block">
                <Link
                  href="/#about"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink"
                >
                  About me
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Magnetic>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}




