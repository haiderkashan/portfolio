import Image from 'next/image'
import { Stagger } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { InteractiveRow } from '@/components/ui/InteractiveRow'
import { urlForImage } from '@/sanity/lib/image'
import type { ExperienceEntry } from '@/sanity/lib/queries'

export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  if (!experience.length) return null

  return (
    <section id="experience" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Experience"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent-stroke sm:text-7xl md:text-8xl"
        />

        <Stagger className="mt-14 flex flex-col sm:mt-16">
          {experience.map((entry, i) => {
            const imageUrl = urlForImage(entry.image)?.width(420).height(300).url()
            const subtitle = [entry.role, entry.location].filter(Boolean).join(' · ')
            const isLast = i === experience.length - 1

            return (
              <InteractiveRow
                key={entry._id}
                imageUrl={imageUrl}
                imageAlt={entry.company}
                className={`group border-t border-[var(--line)] py-6 transition-colors focus-within:bg-[var(--surface-raised)] sm:py-7 ${
                  isLast ? 'border-b' : ''
                }`}
              >
                <div className="grid cursor-default grid-cols-1 gap-1.5 px-1 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:gap-6 sm:px-2">
                  <div className="flex items-center gap-3">
                    {imageUrl && (
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--line)] md:hidden">
                        <Image src={imageUrl} alt={`${entry.company} workplace`} fill sizes="56px" className="object-cover" />
                      </div>
                    )}
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {entry.company}
                    </h3>
                  </div>
                  <p className="font-body text-sm text-[var(--on-surface-soft)] sm:text-base">
                    {subtitle}
                  </p>
                  <p className="font-body text-sm font-medium text-[var(--on-surface-soft)] sm:text-right">
                    {entry.current
                      ? `${entry.startYear ?? ''} — Present`
                      : [entry.startYear, entry.endYear].filter(Boolean).join(' — ')}
                  </p>
                </div>
                {entry.description && (
                  <p className="mt-2 max-w-2xl px-1 font-body text-sm leading-relaxed text-[var(--on-surface-soft)] sm:px-2">
                    {entry.description}
                  </p>
                )}
              </InteractiveRow>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}





