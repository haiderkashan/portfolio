'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Image from 'next/image'

export function CursorFollowPreview({
  src,
  alt = '',
  visible,
}: {
  src?: string
  alt?: string
  visible: boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.4 })

  useEffect(() => {
    if (!visible) return

    function handleMove(e: PointerEvent) {
      x.set(e.clientX)
      // If cursor is too close to top edge, offset image below cursor instead of above it
      if (e.clientY < 200) {
        y.set(e.clientY + 200)
      } else {
        y.set(e.clientY)
      }
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [visible, x, y])

  if (!src) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-40 w-56 overflow-hidden rounded-2xl bg-ink/10 shadow-2xl md:block"
      style={{ x: springX, y: springY, marginLeft: -112, marginTop: -180 }}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.86,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image src={src} alt={alt} fill sizes="224px" className="object-cover" />
    </motion.div>
  )
}
