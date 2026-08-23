import { SplitHeading } from '@/components/ui/SplitHeading'
import { TimelineList, type TimelineItem } from '@/components/ui/TimelineList'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import type { AwardEntry } from '@/sanity/lib/queries'

export function Awards({ awards }: { awards: AwardEntry[] }) {
  if (!awards.length) return null

  const items: TimelineItem[] = awards.map((award) => ({
    id: award._id,
    title: award.project?.title || 'Award Project',
    subtitle: award.awardType,
    date: formatDate(award.date),
    isUppercaseSubtitle: true,
    href: award.project?.slug ? `/work/${award.project.slug}` : undefined,
    imageUrl: urlForImage(award.project?.coverImage ?? award.project?.thumbnail)
      ?.width(420)
      .height(300)
      .url(),
  }))

  return (
    <section id="awards" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Awards"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent-stroke sm:text-7xl md:text-8xl"
        />
        <TimelineList items={items} />
      </div>
    </section>
  )
}






