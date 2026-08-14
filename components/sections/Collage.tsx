'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'

const PRESETS = [
  { top: '2%', left: '42%', w: 148, h: 112, rotate: -6, fromX: -30, fromY: -90 },
  { top: '4%', left: '4%', w: 118, h: 150, rotate: 6, fromX: -140, fromY: 20 },
  { top: '32%', left: '0%', w: 168, h: 118, rotate: -4, fromX: -110, fromY: 90 },
  { top: '48%', left: '32%', w: 138, h: 138, rotate: 7, fromX: 60, fromY: 110 },
  { top: '18%', left: '60%', w: 128, h: 158, rotate: -8, fromX: 150, fromY: -40 },
  { top: '58%', left: '6%', w: 148, h: 108, rotate: 4, fromX: -90, fromY: 120 },
]

function CollageImage({
  src,
  index,
  progress,
}: {
  src: string
  index: number
  progress: MotionValue<number>
}) {
  const preset = PRESETS[index % PRESETS.length]
  const opacity = useTransform(progress, [0, 0.22, 0.72, 1], [0, 1, 1, 0])
  const x = useTransform(progress, [0, 0.3, 1], [preset.fromX, 0, preset.fromX * -0.25])
  const y = useTransform(progress, [0, 0.3, 1], [preset.fromY, 0, preset.fromY * -0.25])
  const rotate = useTransform(progress, [0, 0.3, 1], [preset.rotate * 3, preset.rotate, preset.rotate * 0.5])
  const scale = useTransform(progress, [0, 0.26, 1], [0.72, 1, 0.95])

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: preset.top,
        left: preset.left,
        width: preset.w,
        height: preset.h,
        opacity,
        x,
        y,
        rotate,
        scale,
      }}
      className="overflow-hidden rounded-xl shadow-xl shadow-black/20"
    >
      <Image src={src} alt="" fill sizes="180px" className="object-cover" />
    </motion.div>
  )
}

export function Collage({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <div ref={ref} className="relative h-64 sm:h-80 md:h-96">
      {images.slice(0, 6).map((src, i) => (
        <CollageImage key={`${src}-${i}`} src={src} index={i} progress={scrollYProgress} />
      ))}
    </div>
  )
}




