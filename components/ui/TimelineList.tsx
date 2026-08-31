import Image from 'next/image'
import Link from 'next/link'
import { Stagger } from '@/components/ui/Reveal'
import { InteractiveRow } from '@/components/ui/InteractiveRow'

export interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  date?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  imageLqip?: string
  href?: string
  isUppercaseSubtitle?: boolean
}

export function TimelineList({ items }: { items: TimelineItem[] }) {
  if (!items.length) return null

  const gridClass =
    'grid grid-cols-1 gap-1.5 px-1 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:gap-6 sm:px-2'

  return (
    <Stagger className="mt-14 flex flex-col sm:mt-16">
      {items.map((item, i) => {
        const isLast = i === items.length - 1

        const innerContent = (
          <>
            <div className="flex items-center gap-3">
              {item.imageUrl && (
                <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--line)] md:hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    placeholder={item.imageLqip ? 'blur' : 'empty'}
                    blurDataURL={item.imageLqip}
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {item.title}
              </h3>
            </div>
            {item.subtitle && (
              <p
                className={`font-body text-sm text-[var(--on-surface-soft)] sm:text-base ${
                  item.isUppercaseSubtitle ? 'uppercase tracking-[0.1em]' : ''
                }`}
              >
                {item.subtitle}
              </p>
            )}
            {item.date && (
              <p className="font-body text-sm font-medium text-[var(--on-surface-soft)] sm:text-right">
                {item.date}
              </p>
            )}
          </>
        )

        return (
          <InteractiveRow
            key={item.id}
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt || item.title}
            className={`border-t border-[var(--line)] py-6 transition-colors focus-within:bg-[var(--surface-raised)] sm:py-7 ${
              isLast ? 'border-b' : ''
            }`}
          >
            {item.href ? (
              <Link href={item.href} className={gridClass}>
                {innerContent}
              </Link>
            ) : (
              <div className={gridClass}>
                {innerContent}
              </div>
            )}
            {item.description && (
              <p className="mt-2 max-w-2xl px-1 font-body text-sm leading-relaxed text-[var(--on-surface-soft)] sm:px-2">
                {item.description}
              </p>
            )}
          </InteractiveRow>
        )
      })}
    </Stagger>
  )
}
