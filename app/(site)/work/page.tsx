import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { PROJECTS_PAGE_QUERY, SITE_SETTINGS_QUERY, type Paginated, type ProjectCard, type SiteSettings } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { Pagination } from '@/components/ui/Pagination'
import { siteUrl } from '@/lib/utils'
import { JsonLd } from '@/components/JsonLd'
import { BackButton } from '@/components/ui/BackButton'

export const revalidate = 60

const PAGE_SIZE = 9

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const [{ page: pageParam }, settings] = await Promise.all([
    searchParams,
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null),
  ])
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const title = page > 1 ? `Work (Page ${page})` : 'Work'
  const description = settings?.workSeoDescription || settings?.seoDescription || 'Featured case studies, engineering projects, and design systems.'
  const fallbackOgUrl = `${siteUrl}/og-fallback.png`
  const ogImageUrl = urlForImage(settings?.ogImage)?.width(1200).height(630).url() || fallbackOgUrl
  const canonicalUrl = page > 1 ? `/work?page=${page}` : '/work'
  const twitterHandle = settings?.twitterHandle
    ? (settings.twitterHandle.startsWith('@') ? settings.twitterHandle : `@${settings.twitterHandle}`)
    : settings?.handle
      ? `@${settings.handle.replace(/^@/, '')}`
      : undefined

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} · ${settings?.name || 'Portfolio'}`,
      description,
      type: 'website',
      url: `${siteUrl}${canonicalUrl}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${settings?.name || 'Portfolio'}`,
      description,
      images: [ogImageUrl],
      creator: twitterHandle,
      site: twitterHandle,
    },
  }
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

  const workJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Work',
            item: `${siteUrl}/work`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/work#webpage`,
        url: `${siteUrl}/work`,
        name: 'All Work',
        description: 'Featured case studies, engineering projects, and design systems.',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: total,
          itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: start + index + 1,
            name: project.title,
            url: `${siteUrl}/work/${project.slug}`,
          })),
        },
      },
    ],
  }

  return (
    <div className="theme-light min-h-screen bg-paper pb-28 pt-24 sm:pb-36 sm:pt-28">
      <JsonLd data={workJsonLd} />
      <div className="container-page">
        <header className="mb-10 sm:mb-12">
          <Reveal>
            <BackButton fallbackHref="/" label="Back to main" />
          </Reveal>
        </header>

        <SplitHeading
          text="All Work"
          as="h1"
          className="font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight sm:text-8xl"
          wordClassName="[&:last-child]:text-brutalist-shadow"
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
              const coverUrl = urlForImage(project.coverImage)?.width(1200).height(800).quality(90).url()
              return (
                <StaggerItem key={project._id}>
                  <Link
                    href={`/work/${project.slug}`}
                    aria-label={`View ${project.title} case study`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--surface-raised)]">
                      {coverUrl && (
                        <Image
                          src={coverUrl}
                          alt={project.coverImage?.alt || `${project.title} project showcase mockup`}
                          fill
                          placeholder={project.coverImage?.lqip ? 'blur' : 'empty'}
                          blurDataURL={project.coverImage?.lqip}
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