import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { urlForImage } from '@/sanity/lib/image'
import type { ProjectCard } from '@/sanity/lib/queries'

const pillClass =
  'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--line)] bg-transparent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-[var(--on-surface)] transition-all hover-desktop-bg-accent focus-visible:bg-accent focus-visible:text-ink'

export function FeaturedWork({ projects }: { projects: ProjectCard[] }) {
  if (!projects.length) return null

  return (
    <section id="work" className="theme-light bg-paper min-h-[55vh] flex flex-col justify-center py-12 sm:py-20">
      <div className="container-page">
        <SplitHeading
          text="Projects"
          as="h2"
          className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold tracking-tight text-brutalist-shadow sm:text-7xl md:text-8xl"
        />

        <div className="mt-12 sm:mt-16">
          {projects.map((project, i) => {
            const thumbUrl = urlForImage(project.thumbnail)?.width(240).height(160).url()
            const coverUrl = urlForImage(project.coverImage)?.url()
            const isOdd = i % 2 === 0 // 1st, 3rd, etc. -> Image Left (md:order-1), Text Right (md:order-2)

            return (
              <Reveal
                key={project._id}
                amount={0.15}
                className={`grid gap-8 border-t border-[var(--line)] py-8 sm:py-10 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16 ${
                  i === projects.length - 1 ? 'border-b' : ''
                }`}
              >
                {/* Floating Image Column */}
                <div
                  className={`order-1 relative flex items-center justify-center ${
                    isOdd ? 'md:order-1' : 'md:order-2'
                  }`}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    aria-label={`${project.title} — ${project.tagline}`}
                    className="group/img relative block w-full max-w-lg focus-visible:outline-none"
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={project.coverImage?.alt || `${project.title} project image`}
                        className="w-full h-auto object-contain transition-transform duration-500 ease-out group-hover-desktop-img-scale-105"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center bg-transparent text-xs font-medium text-[var(--on-surface-faint)]">
                        No preview image available
                      </div>
                    )}
                  </Link>
                </div>

                {/* Content / Text & Links Column */}
                <div
                  className={`order-2 flex flex-col justify-center gap-4 ${
                    isOdd ? 'md:order-2' : 'md:order-1'
                  }`}
                >
                  {/* Category & Period */}
                  {(project.category || project.period) && (
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-[var(--on-surface-faint)]">
                      {[project.category, project.period].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  {/* Project Heading */}
                  <h3 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                    <Link
                      href={`/work/${project.slug}`}
                      className="group/title inline-block transition-colors hover:text-moss focus-visible:underline"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  {/* Tagline & Excerpt Grouping */}
                  <div className="space-y-1.5">
                    {project.tagline && (
                      <p className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                        {project.tagline}
                      </p>
                    )}
                    {project.excerpt && (
                      <p className="line-clamp-2 font-body text-sm leading-relaxed text-[var(--on-surface-soft)]">
                        {project.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Links Grouping */}
                  <div className="mt-1 flex flex-wrap items-center gap-3 pt-1">
                    {thumbUrl && (
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-[var(--line)]">
                        <Image
                          src={thumbUrl}
                          alt={project.thumbnail?.alt || `${project.title} thumbnail`}
                          fill
                          placeholder={project.thumbnail?.lqip ? 'blur' : 'empty'}
                          blurDataURL={project.thumbnail?.lqip}
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${project.title} website`}
                          className={pillClass}
                        >
                          Website
                          <span className="sr-only"> (opens in a new tab)</span>
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      )}
                      {project.secondaryLinkUrl &&
                        project.secondaryLinkLabel?.toLowerCase().trim() !== 'case study' && (
                          <a
                            href={project.secondaryLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} on ${
                              project.secondaryLinkLabel || 'external platform'
                            }`}
                            className={pillClass}
                          >
                            {project.secondaryLinkLabel || 'Link'}
                            <span className="sr-only"> (opens in a new tab)</span>
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </a>
                        )}
                      <Link
                        href={`/work/${project.slug}`}
                        aria-label={`Read ${project.title} case study`}
                        className={pillClass}
                      >
                        Case study <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 flex justify-center sm:mt-16">
          <Link
            href="/work"
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] transition-all hover-desktop-bg-accent focus-visible:bg-accent focus-visible:text-ink"
          >
            View all work
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover-desktop-arrow"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
