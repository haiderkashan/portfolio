'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { EASE_SWIFT } from './Reveal'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Education', href: '/#education' },
  { label: 'Writing', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

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

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="container-page flex items-center justify-between py-6 sm:py-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="pointer-events-auto flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent transition-opacity hover:opacity-70"
          >
            {open ? 'Close' : 'Menu'}
            {open ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
          </button>

          {locationTag ? (
            <span className="pointer-events-auto font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              /{locationTag}
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="theme-dark fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-ink px-6 pb-10 pt-28 sm:px-12"
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
