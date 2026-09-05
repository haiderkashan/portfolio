'use client'

import { useEffect, useState } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'
import Image from 'next/image'

function DesktopCursorPreview() {
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
    function handleShow(e: Event) {
      const customEvent = e as CustomEvent<{ src: string; alt: string }>
      setPreview({
        src: customEvent.detail.src,
        alt: customEvent.detail.alt,
        visible: true,
      })
    }

    function handleHide() {
      setPreview((prev) => ({ ...prev, visible: false }))
    }

    window.addEventListener('cursor-preview:show', handleShow)
    window.addEventListener('cursor-preview:hide', handleHide)

    return () => {
      window.removeEventListener('cursor-preview:show', handleShow)
      window.removeEventListener('cursor-preview:hide', handleHide)
    }
  }, [])

  useEffect(() => {
    if (!preview.visible) return

    function handleMove(e: PointerEvent) {
      const width = 224
      const height = 160
      const padding = 16
      const vw = window.innerWidth
      const vh = window.innerHeight

      let targetX = e.clientX - width / 2
      targetX = Math.max(padding, Math.min(targetX, vw - width - padding))

      let targetY = e.clientY - height - 20
      if (targetY < padding) {
        targetY = e.clientY + 24
      }
      targetY = Math.max(padding, Math.min(targetY, vh - height - padding))

      x.set(targetX)
      y.set(targetY)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
    }
  }, [preview.visible, x, y])

  if (!preview.src) return null

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 h-40 w-56 overflow-hidden rounded-2xl bg-ink/10 shadow-2xl"
      style={{ x: springX, y: springY }}
      initial={false}
      animate={{
        opacity: preview.visible ? 1 : 0,
        scale: preview.visible ? 1 : 0.86,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image src={preview.src} alt={preview.alt} fill sizes="224px" className="object-cover" />
    </m.div>
  )
}

export function GlobalCursorPreview() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
      setIsDesktop(true)
    }
  }, [])

  if (!isDesktop) return null

  return <DesktopCursorPreview />
}
