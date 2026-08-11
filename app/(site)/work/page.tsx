import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { PROJECTS_PAGE_QUERY, type Paginated, type ProjectCard } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { Pagination } from '@/components/ui/Pagination'

const PAGE_SIZE = 9

export const metadata: Metadata = {
  title: 'Work',
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const start = (page - 1) * PAGE_SIZE

  const { items: projects, total } = await sanityFetch<Paginated<ProjectCard>>(
    PROJECTS_PAGE_QUERY,
    { start, end: start + PAGE_SIZE },
    { items: [], total: 0 }
  )
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

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
              {page > 1
                ? "That page doesn't exist."
                : 'No projects yet — add your first one in the Studio and it\u2019ll show up here.'}
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
                          alt={project.tagline || project.title}
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

        <Pagination currentPage={page} totalPages={totalPages} basePath="/work" />
      </div>
    </div>
  )
}