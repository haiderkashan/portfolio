'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'

function FadeWord({
    word,
    isLast,
    start,
    end,
    progress,
}: {
    word: string
    isLast: boolean
    start: number
    end: number
    progress: MotionValue<number>
}) {
    // Ghost-gray (low-opacity ink) -> solid ink, scrubbed by scroll position
    // rather than fired once on view — this is what makes it feel tied to
    // your scroll speed instead of playing at a fixed pace.
    const opacity = useTransform(progress, [start, end], [0, 1])
    const color = useTransform(progress, [start, end], ['rgba(10,10,8,0.16)', 'rgba(10,10,8,1)'])

    return (
        <motion.span style={{ opacity, color }} className="inline">
            {word}
            {!isLast ? '\u00A0' : ''}
        </motion.span>
    )
}

export function IntroHeadline({
    text,
    introImageUrl,
    className,
}: {
    text: string
    introImageUrl?: string
    className?: string
}) {
    const ref = useRef<HTMLHeadingElement>(null)

    // progress 0: heading has just started entering from the bottom of the
    // viewport. progress 1: it has settled into the upper third of the
    // screen. Scrolling faster or slower speeds up or slows down the reveal,
    // same as the Hero's exit.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.92', 'start 0.28'],
    })

    const words = text.split(' ')
    // Roughly matches where the reference places it — a little before the
    // midpoint of the sentence — and adapts to headlines of any length.
    const insertAt = Math.min(words.length - 1, Math.max(1, Math.round(words.length * 0.42)))
    const staggerStep = Math.min(0.055, 0.55 / words.length)

    const imageOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1])
    const imageScale = useTransform(scrollYProgress, [0.15, 0.5], [0.7, 1])

    return (
        <h2 ref={ref} className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {words.map((word, i) => {
                    const start = i * staggerStep
                    const end = Math.min(1, start + 0.35)
                    return (
                        <span key={`${word}-${i}`}>
                            <FadeWord
                                word={word}
                                isLast={i === words.length - 1}
                                start={start}
                                end={end}
                                progress={scrollYProgress}
                            />
                            {i === insertAt - 1 && introImageUrl && (
                                <motion.span
                                    style={{ opacity: imageOpacity, scale: imageScale }}
                                    className="relative mx-2 inline-block h-[1.1em] w-[1.9em] overflow-hidden rounded-xl align-middle shadow-2xl sm:mx-3"
                                >
                                    <Image src={introImageUrl} alt="" fill sizes="220px" className="object-cover" />
                                </motion.span>
                            )}
                        </span>
                    )
                })}
            </span>
        </h2>
    )
}