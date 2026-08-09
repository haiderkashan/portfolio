import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY, type ProjectFull } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'

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
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.excerpt || project.tagline,
  }
}

export default async function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const coverUrl = urlForImage(project.coverImage)?.width(2000).height(1250).url()

  return (
    <article className="theme-light bg-paper">
      <header className="pt-32 sm:pt-40">
        <div className="container-page">
          <Reveal>
            <Link
              href="/#work"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-[var(--on-surface-soft)] transition-colors hover:text-accent"
            >
              <ArrowLeft size={15} /> Back to work
            </Link>
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
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink"
              >
                Visit live site <ArrowUpRight size={14} />
              </a>
            )}
            {project.secondaryLinkUrl && (
              <a
                href={project.secondaryLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {project.secondaryLinkLabel || 'Link'} <ArrowUpRight size={14} />
              </a>
            )}
          </Reveal>
        </div>
      </header>

      {coverUrl && (
        <Reveal delay={0.1} className="container-page mt-14 sm:mt-20">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
            <Image src={coverUrl} alt={project.tagline} fill sizes="90vw" priority className="object-cover" />
          </div>
        </Reveal>
      )}

      <div className="container-page mt-16 grid gap-10 pb-28 sm:mt-20 sm:pb-36 md:grid-cols-[1fr_2fr] md:gap-16">
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
                const url = urlForImage(image)?.width(1400).url()
                if (!url) return null
                return (
                  <Reveal key={i} className="overflow-hidden rounded-2xl">
                    <Image
                      src={url}
                      alt=""
                      width={1400}
                      height={1000}
                      className="h-auto w-full object-cover"
                    />
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
