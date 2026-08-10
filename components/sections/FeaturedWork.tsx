import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { urlForImage } from '@/sanity/lib/image'
import type { ProjectCard } from '@/sanity/lib/queries'

const pillClass =
  'inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-4 py-2 font-body text-xs font-medium text-[var(--on-surface)] transition-colors hover:border-accent hover:text-accent'

export function FeaturedWork({ projects }: { projects: ProjectCard[] }) {
  if (!projects.length) return null

  return (
    <section id="work" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Featured Work"
          as="h2"
          className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
          wordClassName="[&:last-child]:text-accent"
        />

        <div className="mt-16 sm:mt-20">
          {projects.map((project, i) => {
            const thumbUrl = urlForImage(project.thumbnail)?.width(240).height(160).url()
            const coverUrl = urlForImage(project.coverImage)?.width(1200).height(800).url()

            return (
              <Reveal
                key={project._id}
                amount={0.15}
                className={`grid gap-8 border-t border-[var(--line)] py-12 sm:py-16 md:grid-cols-2 md:gap-10 lg:gap-20 ${
                  i === projects.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex flex-col justify-between gap-8">
                  <div>
                    {(project.category || project.period) && (
                      <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.14em] text-[var(--on-surface-faint)]">
                        {[project.category, project.period].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <h3 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {thumbUrl && (
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--line)]">
                        <Image src={thumbUrl} alt="" fill sizes="96px" className="object-cover" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2.5">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={pillClass}>
                          Website <ArrowUpRight size={13} />
                        </a>
                      )}
                      {project.secondaryLinkUrl && (
                        <a
                          href={project.secondaryLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={pillClass}
                        >
                          {project.secondaryLinkLabel || 'Link'} <ArrowUpRight size={13} />
                        </a>
                      )}
                      <Link href={`/work/${project.slug}`} className={pillClass}>
                        Case study <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/work/${project.slug}`}
                  className="group/card relative block overflow-hidden rounded-2xl bg-[var(--surface-raised)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
                    {coverUrl && (
                      <Image
                        src={coverUrl}
                        alt={project.tagline}
                        fill
                        sizes="(min-width: 768px) 46vw, 92vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {project.tagline}
                    </h4>
                    {project.excerpt && (
                      <p className="mt-2 line-clamp-2 font-body text-sm text-[var(--on-surface-soft)]">
                        {project.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 flex justify-center sm:mt-16">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] transition-colors hover:border-accent hover:text-accent"
          >
            View all work
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}