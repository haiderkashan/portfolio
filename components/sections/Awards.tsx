import { SplitHeading } from '@/components/ui/SplitHeading'
import { TimelineList, type TimelineItem } from '@/components/ui/TimelineList'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import type { AwardEntry } from '@/sanity/lib/queries'

export function Awards({ awards }: { awards: AwardEntry[] }) {
  if (!awards.length) return null

  const items: TimelineItem[] = awards.map((award) => {
    const title = award.title || award.awardType || 'Award'
    const subtitle =
      award.title && award.awardType && award.title !== award.awardType
        ? award.awardType
        : undefined

    const href = award.proofPdfUrl || award.proofUrl

    return {
      id: award._id,
      title,
      subtitle,
      date: formatDate(award.date),
      isUppercaseSubtitle: true,
      href: href || undefined,
      imageUrl: urlForImage(award.image)?.width(420).height(300).url(),
      imageAlt: award.image?.alt || `${title} visual`,
      imageLqip: award.image?.lqip,
    }
  })

  return (
    <section id="awards" className="theme-light bg-paper min-h-[50vh] flex flex-col justify-center py-12 sm:py-20">
      <div className="container-page">
        <SplitHeading
          text="Awards"
          as="h2"
          className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold tracking-tight text-brutalist-shadow sm:text-7xl md:text-8xl"
        />
        <TimelineList items={items} />
      </div>
    </section>
  )
}






