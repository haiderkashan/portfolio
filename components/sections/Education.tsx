import { SplitHeading } from '@/components/ui/SplitHeading'
import { TimelineList, type TimelineItem } from '@/components/ui/TimelineList'
import { urlForImage } from '@/sanity/lib/image'
import type { EducationEntry } from '@/sanity/lib/queries'

export function Education({ education }: { education: EducationEntry[] }) {
  if (!education.length) return null

  const items: TimelineItem[] = education.map((entry) => ({
    id: entry._id,
    title: entry.institution,
    subtitle: entry.degree,
    date: entry.current
      ? `${entry.startYear ?? ''} — Present`
      : [entry.startYear, entry.endYear].filter(Boolean).join(' — '),
    description: entry.description,
    imageUrl: urlForImage(entry.image)?.width(420).height(300).url(),
    imageAlt: entry.image?.alt || `${entry.institution} mark`,
    imageLqip: entry.image?.lqip,
  }))

  return (
    <section id="education" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Education"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent-stroke sm:text-7xl md:text-8xl"
        />
        <TimelineList items={items} />
      </div>
    </section>
  )
}






