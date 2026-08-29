'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { EASE_SWIFT } from './Reveal'

const MOBILE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Education', href: '/#education' },
  { label: 'Writing', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SiteNav({
  locationTag,
  email,
  socialLinks,
  resumeUrl,
}: {
  locationTag?: string
  email?: string
  socialLinks?: { platform: string; url: string }[]
  resumeUrl?: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const lenis = useLenis()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const shouldRestoreFocusRef = useRef(true)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('menuToggle', { detail: { open } }))
    if (open) {
      document.documentElement.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.documentElement.style.overflow = ''
      lenis?.start()
    }

    return () => {
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [open, lenis])

  // Desktop anchor navigation smooth scroll
  function handleDesktopLinkClick(href: string) {
    if (href.startsWith('/#') || href.startsWith('#')) {
      const selector = href.replace(/^\//, '')
      if (pathname === '/') {
        const target = document.querySelector<HTMLElement>(selector)
        if (target) {
          lenis?.scrollTo(target, { immediate: false })
          if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1')
          }
          target.focus()
        }
      }
    }
  }

  // Mobile anchor navigation smooth scroll
  function handleLinkClick(href: string) {
    setOpen(false)
    if (href.startsWith('/#') || href.startsWith('#')) {
      shouldRestoreFocusRef.current = false
      const selector = href.replace(/^\//, '')
      if (pathname === '/') {
        setTimeout(() => {
          const target = document.querySelector<HTMLElement>(selector)
          if (target) {
            lenis?.scrollTo(target, { immediate: false })
            if (!target.hasAttribute('tabindex')) {
              target.setAttribute('tabindex', '-1')
            }
            target.focus()
          }
        }, 150)
      }
    }
  }

  // Focus management for Mobile Menu Overlay
  useEffect(() => {
    if (!open) return

    const overlay = overlayRef.current
    const toggleButton = toggleRef.current
    const internalFocusables = overlay
      ? Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : []
    const focusables = toggleButton
      ? [toggleButton, ...internalFocusables]
      : internalFocusables

    if (focusables.length > 0) {
      focusables[0].focus()
    }

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
      if (shouldRestoreFocusRef.current) {
        toggleButton?.focus()
      }
      shouldRestoreFocusRef.current = true
    }
  }, [open])

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="container-page flex items-center justify-between py-6 sm:py-8">
          
          {/* Mobile hamburger toggle (Hidden on Desktop) */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls="site-menu-dialog"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="pointer-events-auto flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-ink shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98] md:hidden sm:text-sm"
          >
            {open ? 'Close' : 'Menu'}
            {open ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
          </button>

          {/* Desktop Persistent Navbar (Hidden on Mobile) */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-1 rounded-full bg-accent p-1.5 shadow-md">
            <Link
              href="/"
              className="px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-ink rounded-full transition-colors hover:bg-ink/10 focus-visible:bg-ink/15 focus-visible:outline-none"
            >
              Home
            </Link>
            <Link
              href="/#work"
              onClick={() => handleDesktopLinkClick('/#work')}
              className="px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-ink rounded-full transition-colors hover:bg-ink/10 focus-visible:bg-ink/15 focus-visible:outline-none"
            >
              Work
            </Link>
            <Link
              href="/#experience"
              onClick={() => handleDesktopLinkClick('/#experience')}
              className="px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-ink rounded-full transition-colors hover:bg-ink/10 focus-visible:bg-ink/15 focus-visible:outline-none"
            >
              Experience
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-ink rounded-full transition-colors hover:bg-ink/10 focus-visible:bg-ink/15 focus-visible:outline-none"
            >
              Writing
            </Link>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-ink rounded-full transition-colors hover:bg-ink/10 focus-visible:bg-ink/15 focus-visible:outline-none"
              >
                Resume
              </a>
            )}
            <Link
              href="/contact"
              className="px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] text-ink rounded-full transition-colors hover:bg-ink/10 focus-visible:bg-ink/15 focus-visible:outline-none"
            >
              Contact
            </Link>
          </nav>

          {/* Location Tag */}
          {locationTag ? (
            <span className="pointer-events-auto ml-3 hidden min-h-[44px] max-w-[55vw] shrink items-center truncate whitespace-nowrap rounded-full bg-accent px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-ink shadow-md sm:flex sm:ml-0 sm:max-w-none sm:text-sm sm:tracking-[0.14em]">
              /{locationTag}
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Mobile navigation overlay (Unchanged on mobile, hidden on desktop) */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            id="site-menu-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="theme-dark fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-ink px-6 pb-10 pt-28 sm:px-12 md:hidden landscape:pt-16 landscape:pb-6"
            style={{ transformOrigin: 'top' }}
            initial={{ scaleY: 0, opacity: 0.4 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_SWIFT }}
          >
            <motion.nav
              aria-label="Modal site navigation"
              className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-4 landscape:grid-cols-2 landscape:gap-x-8 landscape:gap-y-2"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            >
              {MOBILE_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SWIFT } },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className="group flex items-center gap-4 py-2 font-display text-[11vw] font-semibold uppercase leading-[1.05] tracking-tight text-paper transition-colors hover:text-accent sm:text-5xl md:text-6xl landscape:text-2xl landscape:py-1 sm:landscape:text-3xl"
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
                        <span className="sr-only"> (opens in a new tab)</span>
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
