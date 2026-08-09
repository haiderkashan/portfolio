import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { IntroHeadline } from './IntroHeadline'
import { Magnetic } from '@/components/ui/Magnetic'

export function IntroStatement({
  headline,
  bio,
  introImageUrl,
}: {
  headline: string
  bio?: string
  introImageUrl?: string
}) {
  return (
    <section className="theme-light relative bg-paper py-24 sm:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-5xl">
          <IntroHeadline
            text={headline}
            introImageUrl={introImageUrl}
            className="text-balance text-center font-display text-[10.5vw] font-bold uppercase leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl"
          />
        </div>

        {bio && (
          <Reveal delay={0.1} className="mt-14 flex justify-center sm:mt-20">
            <div className="max-w-md text-center sm:text-right">
              <p className="font-body text-base leading-relaxed text-[var(--on-surface-soft)] sm:text-lg">
                {bio}
              </p>
              <Magnetic className="mt-6 inline-block">
                <Link
                  href="/#about"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink"
                >
                  About me
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}