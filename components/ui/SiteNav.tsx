'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { EASE_SWIFT } from './Reveal'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Education', href: '/#education' },
  { label: 'Services', href: '/#services' },
  { label: 'Writing', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SiteNav({
  locationTag,
  email,
  socialLinks,
}: {
  locationTag?: string
  email?: string
  socialLinks?: { platform: string; url: string }[]
}) {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open, lenis])

  // Close automatically if the viewport grows back to desktop while open.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Focus management: move focus into the overlay when it opens, trap Tab
  // inside it while open, restore focus to the toggle button on close, and
  // let Escape close it — standard expectations for a full-screen dialog.
  useEffect(() => {
    if (!open) return

    const overlay = overlayRef.current
    const toggleButton = toggleRef.current
    const focusables = overlay
      ? Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : []
    focusables[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      toggleButton?.focus()
    }
  }, [open])

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="container-page flex items-center justify-between py-6 sm:py-8">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="pointer-events-auto flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-ink/90 px-3 py-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-accent backdrop-blur-sm transition-opacity hover:opacity-80 sm:px-4 sm:text-sm sm:tracking-[0.14em]"
          >
            {open ? 'Close' : 'Menu'}
            {open ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
          </button>

          <span className="pointer-events-auto ml-3 max-w-[55vw] shrink truncate whitespace-nowrap rounded-full bg-ink/90 px-3 py-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-accent backdrop-blur-sm sm:ml-0 sm:max-w-none sm:px-4 sm:text-sm sm:tracking-[0.14em]">
            /{locationTag ? locationTag.replace(/San Francisco, CA/i, 'Pakistan') : 'Based in Pakistan'}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="theme-dark fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-ink px-6 pb-10 pt-28 sm:px-12"
            style={{ transformOrigin: 'top' }}
            initial={{ scaleY: 0, opacity: 0.4 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_SWIFT }}
          >
            <motion.nav
              className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            >
              {LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SWIFT } },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 py-2 font-display text-[11vw] font-semibold uppercase leading-[1.05] tracking-tight text-paper transition-colors hover:text-accent sm:text-5xl md:text-6xl"
                  >
                    {link.label}
                    <ArrowUpRight
                      className="hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
                      size={34}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.6 } }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6 border-t border-[var(--line)] pt-6 text-paper sm:flex-row sm:items-center sm:justify-between"
            >
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="font-body text-sm text-paper/80 transition-colors hover:text-accent"
                >
                  {email}
                </a>
              ) : (
                <span />
              )}
              {socialLinks?.length ? (
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {socialLinks.map((s) => (
                    <li key={s.platform}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-xs font-medium uppercase tracking-[0.12em] text-paper/70 transition-colors hover:text-accent"
                      >
                        {s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
