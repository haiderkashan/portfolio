import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { splitBrandName } from '@/lib/utils'

export function Hero({
  name,
  role,
  ctaLabel,
  heroImageUrl,
}: {
  name: string
  role?: string
  ctaLabel?: string
  heroImageUrl?: string
}) {
  const [first, last] = splitBrandName(name.toUpperCase())


  return (
    <section
      id="top"
      className="theme-light relative h-[100svh] min-h-[36rem] w-full overflow-hidden bg-paper"
    >
      {/* Background Image/Gradient Layer (Instant LCP Paint) */}
      <div className="absolute inset-x-0 top-0 bottom-[1px] z-0">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={`${name} — ${role || 'Software Engineer'}`}
            fill
            priority={true}
            fetchPriority="high"
            decoding="sync"
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-moss-light to-moss" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
      </div>

      {/* Hero Content Container (Pure Flexbox Layout without hardcoded bottom offsets) */}
      <div className="relative z-10 flex h-full w-full flex-col justify-end px-5 pb-8 sm:px-8 sm:pb-12 md:px-12">
        {/* Role & CTA Header Bar */}
        <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
          {role ? (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-sm md:text-base">
              {role}
            </p>
          ) : (
            <span />
          )}
          <div className="pointer-events-auto">
            <Link
              href="/contact"
              prefetch={false}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold tracking-wide text-ink transition-transform hover:scale-[1.03] active:scale-[0.98] sm:px-6 sm:py-3 sm:text-sm"
            >
              {ctaLabel || 'Talk with me'}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Semantic H1 & Brand Name Grid */}
        <h1 className="flex w-full items-end justify-between gap-4 pb-12 sm:pb-14">
          <span className="font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] text-[clamp(2.75rem,9.5vw,7.25rem)]">
            /{first || last}
          </span>
          {first && (
            <span className="text-right font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] text-[clamp(2.75rem,9.5vw,7.25rem)]">
              {last}/
            </span>
          )}
        </h1>

        {/* Scroll Indicator */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-20 flex flex-col items-center gap-1.5 sm:bottom-6">
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-md shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-paper">
              Scroll
            </span>
            <ChevronDown size={14} className="text-accent" />
          </a>
        </div>
      </div>
    </section>
  )
}

