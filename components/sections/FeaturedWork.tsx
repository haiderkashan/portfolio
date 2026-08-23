import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { urlForImage } from '@/sanity/lib/image'
import type { ProjectCard } from '@/sanity/lib/queries'

const pillClass =
  'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--line)] px-4 py-2 font-body text-xs font-medium text-[var(--on-surface)] transition-all hover:bg-accent hover:border-accent hover:text-ink focus-visible:bg-accent focus-visible:text-ink'

export function FeaturedWork({ projects }: { projects: ProjectCard[] }) {
  if (!projects.length) return null

  return (
    <section id="work" className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Projects"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent-stroke sm:text-7xl md:text-8xl"
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
                      <Link
                        href={`/work/${project.slug}`}
                        className="group/title inline-block transition-colors hover:text-moss hover:underline decoration-2 underline-offset-4 focus-visible:underline"
                      >
                        {project.title}
                      </Link>
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
                          Website
                          <span className="sr-only"> (opens in a new tab)</span>
                          <ArrowUpRight size={13} />
                        </a>
                      )}
                      {project.secondaryLinkUrl && project.secondaryLinkLabel?.toLowerCase().trim() !== 'case study' && (
                        <a
                          href={project.secondaryLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={pillClass}
                        >
                          {project.secondaryLinkLabel || 'Link'}
                          <span className="sr-only"> (opens in a new tab)</span>
                          <ArrowUpRight size={13} />
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
                  aria-label={`${project.title} — ${project.tagline}`}
                  className="group/card relative block overflow-hidden rounded-2xl bg-[var(--surface-raised)] transition-all hover:ring-2 hover:ring-accent"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
                    {coverUrl && (
                      <Image
                        src={coverUrl}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 46vw, 92vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                      {project.tagline}
                    </p>
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
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] transition-all hover:bg-accent hover:border-accent hover:text-ink focus-visible:bg-accent focus-visible:text-ink"
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




