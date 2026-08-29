import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY, ALL_PROJECTS_QUERY, SITE_SETTINGS_QUERY, type ProjectFull, type ProjectCard, type SiteSettings } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { BackButton } from '@/components/ui/BackButton'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'

import { JsonLd } from '@/components/JsonLd'
import { siteUrl } from '@/lib/utils'

async function getProject(slug: string) {
  return sanityFetch<ProjectFull | null>(PROJECT_QUERY, { slug }, null)
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(PROJECT_SLUGS_QUERY, {}, [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const [project, settings] = await Promise.all([
    getProject(slug),
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null),
  ])
  if (!project) return {}

  const authorName = settings?.name || 'Portfolio'
  const title = project.seoTitle || `${project.title} — Case Study`
  const description = project.seoDescription || project.excerpt || project.tagline
  const ogImageSource = project.ogImage || project.coverImage || project.thumbnail
  const fallbackOgUrl = `${siteUrl}/og-fallback.png`
  const ogImageUrl =
    urlForImage(ogImageSource)
      ?.width(1200)
      .height(630)
      .fit('crop')
      .url() || fallbackOgUrl
  const ogImageAlt = ogImageSource?.alt || project.title
  const twitterHandle = settings?.twitterHandle
    ? (settings.twitterHandle.startsWith('@') ? settings.twitterHandle : `@${settings.twitterHandle}`)
    : settings?.handle
      ? `@${settings.handle.replace(/^@/, '')}`
      : undefined

  return {
    title,
    description,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: `${title} · ${authorName}`,
      description,
      type: 'article',
      url: `${siteUrl}/work/${slug}`,
      section: project.category || 'Case Study',
      publishedTime: project._createdAt || project._updatedAt,
      modifiedTime: project._updatedAt || project._createdAt,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${authorName}`,
      description,
      images: [ogImageUrl],
      creator: twitterHandle,
      site: twitterHandle,
    },
  }
}

export default async function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const [project, allProjects, settings] = await Promise.all([
    getProject(slug),
    sanityFetch<ProjectCard[]>(ALL_PROJECTS_QUERY, {}, []),
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null),
  ])

  if (!project) notFound()

  const currentIndex = allProjects.findIndex((p) => p.slug === slug)
  const nextProject =
    allProjects.length > 1 && currentIndex !== -1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null

  const coverUrl = urlForImage(project.coverImage)?.url()

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Work',
            item: `${siteUrl}/work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: `${siteUrl}/work/${project.slug}`,
          },
        ],
      },
      {
        '@type': 'CreativeWork',
        '@id': `${siteUrl}/work/${project.slug}#work`,
        name: project.title,
        headline: project.title,
        description: project.seoDescription || project.excerpt || project.tagline,
        url: `${siteUrl}/work/${project.slug}`,
        mainEntityOfPage: `${siteUrl}/work/${project.slug}`,
        ...(coverUrl ? { image: coverUrl } : {}),
        ...(project.category ? { genre: project.category } : {}),
        ...(project._createdAt ? { datePublished: project._createdAt } : {}),
        ...(project._updatedAt ? { dateModified: project._updatedAt } : {}),
        author: {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: settings?.name || 'Portfolio',
          url: `${siteUrl}/`,
          ...(settings?.role ? { jobTitle: settings.role } : {}),
          ...(settings?.email ? { email: settings.email } : {}),
        },
      },
    ],
  }

  return (
    <article className="theme-light bg-paper">
      <JsonLd data={projectJsonLd} />
      <header className="pt-16 sm:pt-20">
        <div className="container-page">
          <Reveal>
            <BackButton fallbackHref="/#work" label="Back to work" />
          </Reveal>

          {(project.category || project.period) && (
            <p className="mt-8 font-body text-xs font-medium uppercase tracking-[0.14em] text-[var(--on-surface-faint)]">
              {[project.category, project.period].filter(Boolean).join(' · ')}
            </p>
          )}

          <SplitHeading
            text={project.title}
            as="h1"
            className="mt-3 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
          />

          <Reveal delay={0.15} className="mt-6 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.title} live website`}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-md transition-transform hover:scale-[1.03]"
              >
                Visit live site
                <span className="sr-only"> (opens in a new tab)</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
            {project.secondaryLinkUrl && (
              <a
                href={project.secondaryLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} on ${project.secondaryLinkLabel || 'external platform'}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--line)] px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-accent hover:border-accent"
              >
                {project.secondaryLinkLabel || 'Link'}
                <span className="sr-only"> (opens in a new tab)</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </Reveal>
        </div>
      </header>

      {coverUrl && (
        <Reveal delay={0.1} className="container-page mt-14 sm:mt-20 flex justify-center">
          <img
            src={coverUrl}
            alt={project.coverImage?.alt || `${project.title} case study showcase mockup`}
            className="w-full h-auto object-contain max-w-5xl"
          />
        </Reveal>
      )}

      <div className="container-page mt-16 grid gap-10 pb-24 sm:mt-20 sm:pb-32 md:grid-cols-[1fr_2fr] md:gap-16">
        <Reveal>
          <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.tagline}
          </p>
        </Reveal>
        <div className="max-w-2xl">
          {project.excerpt && (
            <Reveal>
              <p className="font-body text-lg leading-relaxed text-[var(--on-surface-soft)] sm:text-xl">
                {project.excerpt}
              </p>
            </Reveal>
          )}
          {project.body && project.body.length > 0 && (
            <div className="mt-8">
              <PortableTextRenderer value={project.body} />
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-12 flex flex-col gap-8">
              {project.gallery.map((image, i) => {
                const url = urlForImage(image)?.url()
                if (!url) return null
                return (
                  <Reveal key={i} className="flex justify-center bg-transparent">
                    <img
                      src={url}
                      alt={image.alt || `${project.title} visual gallery item ${i + 1}`}
                      className="h-auto w-full object-contain"
                    />
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {nextProject && (
        <section className="border-t border-[var(--line)] bg-[var(--surface-raised)]/60 py-16 sm:py-24">
          <div className="container-page flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-[var(--on-surface-faint)]">
                Next Case Study
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">
                {nextProject.title}
              </h2>
              {nextProject.tagline && (
                <p className="mt-2 max-w-lg font-body text-sm text-[var(--on-surface-soft)] sm:text-base">
                  {nextProject.tagline}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <Link
                href={`/work/${nextProject.slug}`}
                aria-label={`View next case study: ${nextProject.title}`}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98] sm:text-sm"
              >
                View next project
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
