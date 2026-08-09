'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollY } = useScroll()
  const lenis = useLenis()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600))
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink shadow-lg shadow-black/20 sm:bottom-8 sm:right-8"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
