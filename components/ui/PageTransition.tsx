'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const lenis = useLenis()
  const prefersReducedMotion = useReducedMotion()
  const prevPathname = useRef<string | null>(null)
  const isFirstMount = useRef(true)

  useEffect(() => {
    isFirstMount.current = false
  }, [])

  // Continuously record window scroll position per pathname in sessionStorage
  useEffect(() => {
    function saveScroll() {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('scroll_pos_' + window.location.pathname, window.scrollY.toString())
      }
    }
    window.addEventListener('scroll', saveScroll, { passive: true })
    return () => window.removeEventListener('scroll', saveScroll)
  }, [])

  useEffect(() => {
    if (!lenis) return

    // Store position of previous path before switching
    if (prevPathname.current && prevPathname.current !== pathname) {
      sessionStorage.setItem('scroll_pos_' + prevPathname.current, window.scrollY.toString())
    }
    prevPathname.current = pathname

    // Check if there is a hash target in URL (e.g. #work, #experience, #education, #contact)
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash) {
      const targetEl = document.querySelector(hash)
      if (targetEl) {
        lenis.scrollTo(targetEl as HTMLElement, { immediate: true })
        return
      }
    }

    // Restore exact scroll position if returning to a previously scrolled path
    const savedY = typeof window !== 'undefined' ? sessionStorage.getItem('scroll_pos_' + pathname) : null
    if (savedY !== null && !hash) {
      lenis.scrollTo(Number(savedY), { immediate: true })
    } else {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname, lenis])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={isFirstMount.current ? false : { opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
        transition={{ duration: prefersReducedMotion ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  )
}

