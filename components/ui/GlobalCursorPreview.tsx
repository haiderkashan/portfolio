'use client'
 
import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'
import Image from 'next/image'

function subscribeMatchMedia(callback: () => void) {
  const mql = window.matchMedia('(min-width: 768px) and (pointer: fine)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getDesktopSnapshot() {
  return window.matchMedia('(min-width: 768px) and (pointer: fine)').matches
}

function getServerSnapshot() {
  return false
}

function DesktopCursorPreview() {
  const [preview, setPreview] = useState<{ src: string; alt: string; visible: boolean }>({
    src: '',
    alt: '',
    visible: false,
  })

  // Track last known pointer and scroll coordinates
  const lastCoords = useRef<{
    clientX: number
    clientY: number
    scrollX: number
    scrollY: number
  } | null>(null)

  const previewVisibleRef = useRef(false)
  useEffect(() => {
    previewVisibleRef.current = preview.visible
  }, [preview.visible])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.4 })

  const calculateTarget = useCallback((clientX: number, clientY: number) => {
    const width = 224
    const height = 160
    const padding = 16
    const vw = window.innerWidth
    const vh = window.innerHeight

    let targetX = clientX - width / 2
    targetX = Math.max(padding, Math.min(targetX, vw - width - padding))

    let targetY = clientY - height - 20
    if (targetY < padding) {
      targetY = clientY + 24
    }
    targetY = Math.max(padding, Math.min(targetY, vh - height - padding))

    return { targetX, targetY }
  }, [])

  const updatePosition = useCallback(
    (clientX: number, clientY: number, immediate = false) => {
      const { targetX, targetY } = calculateTarget(clientX, clientY)
      if (immediate) {
        x.jump(targetX)
        y.jump(targetY)
        springX.jump(targetX)
        springY.jump(targetY)
      } else {
        x.set(targetX)
        y.set(targetY)
      }
    },
    [calculateTarget, x, y, springX, springY]
  )

  // Listen to custom show / move / hide events
  useEffect(() => {
    function handleShow(e: Event) {
      const customEvent = e as CustomEvent<{
        src: string
        alt: string
        clientX?: number
        clientY?: number
        scrollX?: number
        scrollY?: number
      }>

      let clientX = customEvent.detail?.clientX
      let clientY = customEvent.detail?.clientY

      // If clientX/clientY are not in the event detail, fall back to last tracked pointer or viewport center
      if (clientX === undefined || clientY === undefined) {
        if (lastCoords.current) {
          clientX = lastCoords.current.clientX
          clientY = lastCoords.current.clientY
        } else {
          clientX = window.innerWidth / 2
          clientY = window.innerHeight / 2
        }
      }

      const scrollX = customEvent.detail?.scrollX ?? window.scrollX
      const scrollY = customEvent.detail?.scrollY ?? window.scrollY

      lastCoords.current = { clientX, clientY, scrollX, scrollY }

      // Jump immediately if opening from hidden so it never animates from (0, 0)
      const wasHidden = !previewVisibleRef.current
      updatePosition(clientX, clientY, wasHidden)

      setPreview({
        src: customEvent.detail.src,
        alt: customEvent.detail.alt || '',
        visible: true,
      })
    }

    function handleMoveEvent(e: Event) {
      const customEvent = e as CustomEvent<{
        clientX: number
        clientY: number
        scrollX?: number
        scrollY?: number
      }>
      const clientX = customEvent.detail.clientX
      const clientY = customEvent.detail.clientY
      const scrollX = customEvent.detail.scrollX ?? window.scrollX
      const scrollY = customEvent.detail.scrollY ?? window.scrollY

      lastCoords.current = { clientX, clientY, scrollX, scrollY }
      updatePosition(clientX, clientY)
    }

    function handleHide() {
      setPreview((prev) => (prev.visible ? { ...prev, visible: false } : prev))
    }

    window.addEventListener('cursor-preview:show', handleShow)
    window.addEventListener('cursor-preview:move', handleMoveEvent)
    window.addEventListener('cursor-preview:hide', handleHide)

    return () => {
      window.removeEventListener('cursor-preview:show', handleShow)
      window.removeEventListener('cursor-preview:move', handleMoveEvent)
      window.removeEventListener('cursor-preview:hide', handleHide)
    }
  }, [updatePosition])

  // Track pointer movements globally on window so we always have the cursor position
  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      lastCoords.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      }

      if (previewVisibleRef.current) {
        updatePosition(e.clientX, e.clientY)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [updatePosition])

  // Handle scroll events: recalculate hover image position during scroll without mouse movement
  useEffect(() => {
    let scrollRafId: number | null = null

    function processScrollUpdate() {
      scrollRafId = null
      if (!lastCoords.current) return

      const { clientX, clientY } = lastCoords.current

      // Update position for current viewport coordinates
      updatePosition(clientX, clientY)

      // Check which element is currently under the cursor while scrolling
      const el = document.elementFromPoint(clientX, clientY)
      const interactiveRow = el?.closest('[data-interactive-row]') as HTMLElement | null

      if (interactiveRow) {
        const imageUrl = interactiveRow.dataset.imageUrl
        const imageAlt = interactiveRow.dataset.imageAlt || ''

        if (imageUrl) {
          setPreview((prev) => {
            if (prev.src === imageUrl && prev.visible) return prev
            return { src: imageUrl, alt: imageAlt, visible: true }
          })
          return
        }
      }

      // If user scrolled past the interactive row and cursor is no longer on an interactive row, hide preview
      if (previewVisibleRef.current) {
        setPreview((prev) => (prev.visible ? { ...prev, visible: false } : prev))
      }
    }

    function handleScroll() {
      if (scrollRafId === null) {
        scrollRafId = requestAnimationFrame(processScrollUpdate)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleScroll, { passive: true })

    return () => {
      if (scrollRafId !== null) {
        cancelAnimationFrame(scrollRafId)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleScroll)
    }
  }, [updatePosition])

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
  const isDesktop = useSyncExternalStore(subscribeMatchMedia, getDesktopSnapshot, getServerSnapshot)

  if (!isDesktop) return null

  return <DesktopCursorPreview />
}
