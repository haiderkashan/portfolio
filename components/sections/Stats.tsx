import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Collage } from './Collage'
import type { Stat } from '@/sanity/lib/queries'

export function Stats({
  bio,
  stats,
  collageImages,
}: {
  bio?: string
  stats: Stat[]
  collageImages: string[]
}) {
  return (
    <section id="about" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page grid gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          {bio && (
            <Reveal>
              <p className="max-w-md font-body text-lg leading-relaxed text-[var(--on-surface-soft)] sm:text-xl">
                {bio}
              </p>
            </Reveal>
          )}
          {collageImages.length > 0 && <Collage images={collageImages} />}
        </div>

        {stats.length > 0 && (
          <Stagger className="flex flex-col">
            {stats.map((stat, i) => (
              <StaggerItem
                key={`${stat.value}-${i}`}
                className={`border-t border-[var(--line)] py-7 first:pt-0 sm:py-8 ${
                  i === stats.length - 1 ? 'border-b' : ''
                }`}
              >
                <p className="font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-[var(--on-surface-soft)] sm:text-base">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}
