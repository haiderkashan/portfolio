import Link from 'next/link'
import Image from 'next/image'
import { Stagger } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { InteractiveRow } from '@/components/ui/InteractiveRow'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import type { AwardEntry } from '@/sanity/lib/queries'

export function Awards({ awards }: { awards: AwardEntry[] }) {
  if (!awards.length) return null

  return (
    <section id="awards" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Awards"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent-stroke sm:text-7xl md:text-8xl"
        />

        <Stagger className="mt-14 flex flex-col sm:mt-16">
          {awards.map((award, i) => {
            const imageUrl = urlForImage(award.project?.coverImage ?? award.project?.thumbnail)
              ?.width(420)
              .height(300)
              .url()
            const innerContent = (
              <>
                <div className="flex items-center gap-3">
                  {imageUrl && (
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--line)] md:hidden">
                      <Image src={imageUrl} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                  )}
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    {award.project?.title || 'Award Project'}
                  </h3>
                </div>
                <p className="font-body text-sm uppercase tracking-[0.1em] text-[var(--on-surface-soft)] sm:text-base">
                  {award.awardType}
                </p>
                <p className="font-body text-sm font-medium text-[var(--on-surface-soft)] sm:text-right">
                  {formatDate(award.date)}
                </p>
              </>
            )

            const gridClass =
              'grid grid-cols-1 gap-1.5 px-1 py-6 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:gap-6 sm:px-2 sm:py-7'
            const isLast = i === awards.length - 1

            return (
              <InteractiveRow
                key={award._id}
                imageUrl={imageUrl}
                imageAlt={award.project?.title}
                className={`border-t border-[var(--line)] transition-colors focus-within:bg-[var(--surface-raised)] sm:py-1 ${
                  isLast ? 'border-b' : ''
                }`}
              >
                {award.project?.slug ? (
                  <Link
                    href={`/work/${award.project.slug}`}
                    className={gridClass}
                  >
                    {innerContent}
                  </Link>
                ) : (
                  <div
                    className={gridClass}
                  >
                    {innerContent}
                  </div>
                )}
              </InteractiveRow>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}





