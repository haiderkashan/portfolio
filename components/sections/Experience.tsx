import { SplitHeading } from '@/components/ui/SplitHeading'
import { TimelineList, type TimelineItem } from '@/components/ui/TimelineList'
import { urlForImage } from '@/sanity/lib/image'
import type { ExperienceEntry } from '@/sanity/lib/queries'

export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  if (!experience.length) return null

  const items: TimelineItem[] = experience.map((entry) => ({
    id: entry._id,
    title: entry.company,
    subtitle: [entry.role, entry.location].filter(Boolean).join(' · '),
    date: entry.current
      ? `${entry.startYear ?? ''} — Present`
      : [entry.startYear, entry.endYear].filter(Boolean).join(' — '),
    description: entry.description,
    imageUrl: urlForImage(entry.image)?.width(420).height(300).url(),
    imageAlt: entry.image?.alt || `${entry.company} logo`,
    imageLqip: entry.image?.lqip,
  }))

  return (
    <section id="experience" className="theme-light bg-paper min-h-[50vh] flex flex-col justify-center py-12 sm:py-20">
      <div className="container-page">
        <SplitHeading
          text="Experience"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-brutalist-shadow sm:text-7xl md:text-8xl"
        />
        <TimelineList items={items} />
      </div>
    </section>
  )
}






