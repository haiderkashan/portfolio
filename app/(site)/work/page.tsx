import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ALL_PROJECTS_QUERY, type ProjectCard } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'

export const metadata: Metadata = {
  title: 'Work',
}

export default async function WorkPage() {
  const projects = await sanityFetch<ProjectCard[]>(ALL_PROJECTS_QUERY, {}, [])

  return (
    <div className="theme-light min-h-screen bg-paper pb-28 pt-32 sm:pb-36 sm:pt-40">
      <div className="container-page">
        <SplitHeading
          text="All Work"
          as="h1"
          className="font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight sm:text-8xl"
          wordClassName="[&:last-child]:text-accent"
        />

        {projects.length === 0 ? (
          <Reveal className="mt-16">
            <p className="max-w-md font-body text-lg text-[var(--on-surface-soft)]">
              No projects yet — add your first one in the Studio and it&rsquo;ll show up here.
            </p>
          </Reveal>
        ) : (
          <Stagger className="mt-16 grid gap-x-8 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const coverUrl = urlForImage(project.coverImage)?.width(700).height(500).url()
              return (
                <StaggerItem key={project._id}>
                  <Link href={`/work/${project.slug}`} className="group block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--surface-raised)]">
                      {coverUrl && (
                        <Image
                          src={coverUrl}
                          alt={project.tagline}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}
                    </div>
                    {(project.category || project.period) && (
                      <p className="mt-5 font-body text-xs font-medium uppercase tracking-[0.12em] text-[var(--on-surface-faint)]">
                        {[project.category, project.period].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {project.title}
                    </h2>
                    {project.tagline && (
                      <p className="mt-1 line-clamp-2 font-body text-sm text-[var(--on-surface-soft)]">
                        {project.tagline}
                      </p>
                    )}
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
      </div>
    </div>
  )
}