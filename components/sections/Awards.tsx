'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { CursorFollowPreview } from '@/components/ui/CursorFollowPreview'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import type { AwardEntry } from '@/sanity/lib/queries'

export function Awards({ awards }: { awards: AwardEntry[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  if (!awards.length) return null

  return (
    <section id="awards" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Awards"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent sm:text-7xl md:text-8xl"
        />

        <Stagger className="mt-14 flex flex-col sm:mt-16">
          {awards.map((award, i) => {
            const imageUrl = urlForImage(award.project?.coverImage ?? award.project?.thumbnail)
              ?.width(420)
              .height(300)
              .url()
            return (
              <StaggerItem
                key={award._id}
                as="div"
                className={`border-t border-[var(--line)] transition-colors sm:py-1 ${
                  i === awards.length - 1 ? 'border-b' : ''
                } ${hovered === i ? 'bg-[var(--surface-raised)]' : ''}`}
              >
                <Link
                  href={award.project?.slug ? `/work/${award.project.slug}` : '#work'}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="grid grid-cols-1 gap-1.5 px-1 py-6 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:gap-6 sm:px-2 sm:py-7"
                >
                  <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {award.project?.title}
                  </h3>
                  <p className="font-body text-sm uppercase tracking-[0.1em] text-[var(--on-surface-soft)] sm:text-base">
                    {award.awardType}
                  </p>
                  <p className="font-body text-sm text-[var(--on-surface-faint)] sm:text-right">
                    {formatDate(award.date)}
                  </p>
                </Link>
                {imageUrl && (
                  <CursorFollowPreview src={imageUrl} alt={award.project?.title} visible={hovered === i} />
                )}
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
