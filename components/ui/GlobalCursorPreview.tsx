'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Image from 'next/image'

export function GlobalCursorPreview() {
  const [preview, setPreview] = useState<{ src: string; alt: string; visible: boolean }>({
    src: '',
    alt: '',
    visible: false,
  })

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.4 })

  useEffect(() => {
    // Show event handler
    function handleShow(e: Event) {
      const customEvent = e as CustomEvent<{ src: string; alt: string }>
      setPreview({
        src: customEvent.detail.src,
        alt: customEvent.detail.alt,
        visible: true,
      })
    }

    // Hide event handler
    function handleHide() {
      setPreview((prev) => ({ ...prev, visible: false }))
    }

    window.addEventListener('cursor-preview:show', handleShow)
    window.addEventListener('cursor-preview:hide', handleHide)

    // Single global pointermove listener for tracking cursor coordinates
    function handleMove(e: PointerEvent) {
      x.set(e.clientX)
      if (e.clientY < 200) {
        y.set(e.clientY + 200)
      } else {
        y.set(e.clientY)
      }
    }

    window.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('cursor-preview:show', handleShow)
      window.removeEventListener('cursor-preview:hide', handleHide)
      window.removeEventListener('pointermove', handleMove)
    }
  }, [x, y])

  if (!preview.src) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-40 w-56 overflow-hidden rounded-2xl bg-ink/10 shadow-2xl md:block"
      style={{ x: springX, y: springY, marginLeft: -112, marginTop: -180 }}
      initial={false}
      animate={{
        opacity: preview.visible ? 1 : 0,
        scale: preview.visible ? 1 : 0.86,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image src={preview.src} alt={preview.alt} fill sizes="224px" className="object-cover" />
    </motion.div>
  )
}
