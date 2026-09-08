import { SplitHeading } from '@/components/ui/SplitHeading'
import { TimelineList, type TimelineItem } from '@/components/ui/TimelineList'
import { urlForImage } from '@/sanity/lib/image'
import type { ExperienceEntry } from '@/sanity/lib/queries'

/**
 * Parses dates or year strings into a comparable epoch millisecond timestamp.
 * Handles ISO strings ('2024-05-01'), month-year strings ('Jan 2024'), or plain years ('2024').
 */
function parseDateScore(dateStr?: string, yearStr?: string, isEnd = false): number {
  if (dateStr) {
    const t = new Date(dateStr).getTime()
    if (!isNaN(t)) return t
  }
  if (yearStr) {
    const normalized = yearStr.replace(/Sept\b/i, 'Sep')
    const t = new Date(normalized).getTime()
    if (!isNaN(t)) return t
    const match = yearStr.match(/\d{4}/)
    if (match) return new Date(`${match[0]}-${isEnd ? '12-31' : '01-01'}`).getTime()
  }
  return 0
}

/** Formats an ISO date (e.g. "2024-05") to readable display text (e.g. "May 2024") */
function formatDisplayDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  } catch {
    return dateStr
  }
}

export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  if (!experience.length) return null

  // Ensure chronological sorting: newest at the top, oldest at the bottom.
  // Ongoing/current roles always appear first, followed by newest end/start dates.
  const sorted = [...experience].sort((a, b) => {
    if (a.current && !b.current) return -1
    if (!a.current && b.current) return 1
    const endA = parseDateScore(a.endDate, a.endYear, true)
    const endB = parseDateScore(b.endDate, b.endYear, true)
    if (endA !== endB) return endB - endA
    const startA = parseDateScore(a.startDate, a.startYear, false)
    const startB = parseDateScore(b.startDate, b.startYear, false)
    return startB - startA
  })

  const items: TimelineItem[] = sorted.map((entry) => {
    const startDisplay = entry.startYear || formatDisplayDate(entry.startDate)
    const endDisplay = entry.endYear || formatDisplayDate(entry.endDate)

    return {
      id: entry._id,
      title: entry.company,
      subtitle: [entry.role, entry.location].filter(Boolean).join(' · '),
      date: entry.current
        ? `${startDisplay ?? ''} — Present`
        : [startDisplay, endDisplay].filter(Boolean).join(' — '),
      description: entry.description,
      imageUrl: urlForImage(entry.image)?.width(840).height(600).quality(90).url(),
      imageAlt: entry.image?.alt || `${entry.company} logo`,
      imageLqip: entry.image?.lqip,
    }
  })

  return (
    <section id="experience" className="theme-light bg-paper min-h-[50vh] flex flex-col justify-center py-12 sm:py-20">
      <div className="container-page">
        <SplitHeading
          text="Experience"
          as="h2"
          className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold tracking-tight text-brutalist-shadow sm:text-7xl md:text-8xl"
        />
        <TimelineList items={items} />
      </div>
    </section>
  )
}






