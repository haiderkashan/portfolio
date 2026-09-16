import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { splitBrandName } from '@/lib/utils'
import { Magnetic } from '@/components/ui/Magnetic'

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

      {/* Hero Content Container (Push name, role, CTA down closer to bottom) */}
      <div className="relative z-10 flex h-full w-full flex-col justify-end px-5 pb-5 sm:px-8 sm:pb-8 md:px-12">
        {/* Role & CTA Header Bar */}
        <div className="mb-3 flex items-end justify-between gap-4 sm:mb-4">
          {role ? (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-sm md:text-base">
              {role}
            </p>
          ) : (
            <span />
          )}
          <div className="pointer-events-auto">
            <Magnetic>
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
            </Magnetic>
          </div>
        </div>

        {/* Semantic H1 & Brand Name Grid */}
        <h1 className="flex w-full items-end justify-between gap-4 pb-3 sm:pb-8">
          <span className="font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] text-[clamp(2.75rem,9.5vw,7.25rem)]">
            /{first || last}
          </span>
          {first && (
            <span className="text-right font-display font-bold uppercase leading-[0.86] tracking-tight text-accent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] text-[clamp(2.75rem,9.5vw,7.25rem)]">
              {last}/
            </span>
          )}
        </h1>

        {/* Scroll Indicator (Hidden on mobile, desktop only, no button container, scroll text on top of icon) */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-2.5 z-20 hidden flex-col items-center sm:flex">
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="group flex flex-col items-center gap-1 text-paper/85 transition-opacity hover:opacity-100 focus-visible:outline-none"
          >
            <span className="font-display text-[9px] font-semibold uppercase tracking-[0.25em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Scroll
            </span>
            <div className="relative flex h-6 w-3.5 items-start justify-center rounded-full border-[1.5px] border-paper/70 pt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="h-1.5 w-0.5 animate-bounce rounded-full bg-accent" />
            </div>
            <ChevronDown size={12} className="-mt-1 animate-bounce text-accent drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" />
          </a>
        </div>
      </div>
    </section>
  )
}

