import Image from 'next/image'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Marquee } from '@/components/ui/Marquee'
import { SplitHeading } from '@/components/ui/SplitHeading'
import type { ProcessStep } from '@/sanity/lib/queries'

export function Process({
  steps,
  intro,
  portraitUrl,
  portraitAlt = '',
}: {
  steps: ProcessStep[]
  intro?: string
  portraitUrl?: string
  portraitAlt?: string
}) {
  if (!steps.length) return null
  const titles = steps.map((s) => s.title)

  return (
    <section className="theme-dark bg-ink min-h-[50vh] flex flex-col justify-center py-12 sm:py-20">
      <div className="container-page pb-10 pt-4 sm:pt-8">
        <SplitHeading
          text="Process"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent sm:text-7xl md:text-8xl"
        />
      </div>

      <Marquee
        items={titles}
        duration={Math.max(16, titles.join(' ').length / 2.2)}
        className="border-y border-[var(--line)] py-6 font-display text-[9vw] font-semibold uppercase leading-none text-paper sm:text-6xl"
      />

      <div className="container-page mt-16 grid gap-12 sm:mt-20 md:grid-cols-2 md:gap-16">
        {portraitUrl && (
          <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[5/4]">
            <Image
              src={portraitUrl}
              alt={portraitAlt}
              fill
              sizes="(min-width: 768px) 46vw, 92vw"
              className="object-cover"
            />
          </Reveal>
        )}

        <div>
          {intro && (
            <Reveal>
              <p className="max-w-md font-body text-lg leading-relaxed text-[var(--on-surface-soft)] sm:text-xl">
                {intro}
              </p>
            </Reveal>
          )}

          <Stagger className="mt-10 flex flex-col">
            {steps.map((step, i) => (
              <StaggerItem
                key={step.title}
                className={`flex items-baseline gap-4 border-t border-[var(--line)] py-5 first:border-t-0 ${
                  i === steps.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="font-body text-xs font-medium text-[var(--on-surface-faint)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
                  {step.title}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}




