import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
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
  // Hide collage images if the bio is long (over 300 characters) so long bios get clean focus
  const showCollage = collageImages.length > 0 && (!bio || bio.length <= 300)

  return (
    <section id="about" className="theme-light bg-paper min-h-[50vh] flex flex-col justify-center py-12 sm:py-20">
      <div className="container-page">
        <SplitHeading
          text="About"
          as="h2"
          className="mb-10 text-center font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-brutalist-shadow sm:mb-14 sm:text-7xl md:text-8xl"
        />

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-8">
            {bio && (
              <Reveal>
                <div className="space-y-4 font-body text-lg leading-relaxed text-[var(--on-surface-soft)] sm:text-xl">
                  {bio.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            )}
            {showCollage && <Collage images={collageImages} />}
          </div>

          {stats.length > 0 && (
            <Stagger className="flex flex-col items-center text-center">
              {stats.map((stat, i) => (
                <StaggerItem
                  key={`${stat.value}-${i}`}
                  className={`w-full flex flex-col items-center justify-center text-center border-t border-[var(--line)] py-7 first:pt-0 sm:py-8 ${
                    i === stats.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <p className="font-display text-5xl font-bold tracking-tight text-ink text-center sm:text-6xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-[var(--on-surface-soft)] text-center sm:text-base">
                    {stat.label}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </section>
  )
}




