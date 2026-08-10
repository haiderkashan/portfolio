'use client'

import { useState } from 'react'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { CursorFollowPreview } from '@/components/ui/CursorFollowPreview'
import { urlForImage } from '@/sanity/lib/image'
import type { ExperienceEntry } from '@/sanity/lib/queries'

export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  if (!experience.length) return null

  return (
    <section id="experience" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Experience"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent sm:text-7xl md:text-8xl"
        />

        <Stagger className="mt-14 flex flex-col sm:mt-16">
          {experience.map((entry, i) => {
            const imageUrl = urlForImage(entry.image)?.width(420).height(300).url()
            const subtitle = [entry.role, entry.location].filter(Boolean).join(' · ')
            return (
              <StaggerItem
                key={entry._id}
                as="div"
                className={`group border-t border-[var(--line)] py-6 transition-colors sm:py-7 ${
                  i === experience.length - 1 ? 'border-b' : ''
                } ${hovered === i ? 'bg-[var(--surface-raised)]' : ''}`}
              >
                <div
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="grid cursor-default grid-cols-1 gap-1.5 px-1 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:gap-6 sm:px-2"
                >
                  <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {entry.company}
                  </h3>
                  <p className="font-body text-sm text-[var(--on-surface-soft)] sm:text-base">
                    {subtitle}
                  </p>
                  <p className="font-body text-sm text-[var(--on-surface-faint)] sm:text-right">
                    {entry.current
                      ? `${entry.startYear ?? ''} — Present`
                      : [entry.startYear, entry.endYear].filter(Boolean).join(' — ')}
                  </p>
                </div>
                {entry.description && (
                  <p className="mt-2 max-w-2xl px-1 font-body text-sm leading-relaxed text-[var(--on-surface-faint)] sm:px-2">
                    {entry.description}
                  </p>
                )}
                {imageUrl && (
                  <CursorFollowPreview src={imageUrl} alt={entry.company} visible={hovered === i} />
                )}
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}