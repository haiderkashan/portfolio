import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POSTS_PAGE_QUERY, SITE_SETTINGS_QUERY, type Paginated, type PostCard, type SiteSettings } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { Pagination } from '@/components/ui/Pagination'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { BackButton } from '@/components/ui/BackButton'

import { siteUrl } from '@/lib/utils'

import { JsonLd } from '@/components/JsonLd'

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
  const title = page > 1 ? `Writing (Page ${page})` : 'Writing'
  const description = settings?.blogSeoDescription || settings?.seoDescription || 'Articles, architectural breakdowns, and engineering notes.'
  const fallbackOgUrl = `${siteUrl}/og-fallback.png`
  const ogImageUrl = urlForImage(settings?.ogImage)?.width(1200).height(630).url() || fallbackOgUrl
  const canonicalUrl = page > 1 ? `/blog?page=${page}` : '/blog'
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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const start = (page - 1) * PAGE_SIZE

  const { items: posts, total } = await sanityFetch<Paginated<PostCard>>(
    POSTS_PAGE_QUERY,
    { start, end: start + PAGE_SIZE },
    { items: [], total: 0 }
  )
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const blogJsonLd = {
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
            name: 'Writing',
            item: `${siteUrl}/blog`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/blog#webpage`,
        url: `${siteUrl}/blog`,
        name: 'Writing',
        description: 'Articles, architectural breakdowns, and engineering notes.',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: total,
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: start + index + 1,
            name: post.title,
            url: post.mediumUrl,
          })),
        },
      },
    ],
  }

  return (
    <div className="theme-light min-h-screen bg-paper pb-28 pt-24 sm:pb-36 sm:pt-28">
      <JsonLd data={blogJsonLd} />
      <div className="container-page">
        <header className="mb-10 sm:mb-12">
          <Reveal>
            <BackButton fallbackHref="/" label="Back to main" />
          </Reveal>
        </header>

        <SplitHeading
          text="Writing"
          as="h1"
          className="font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight sm:text-8xl"
        />

        {posts.length === 0 ? (
          <Reveal className="mt-16">
            <p className="max-w-md font-body text-lg text-[var(--on-surface-soft)]">
              {page > 1
                ? "That page doesn't exist."
                : 'No posts published yet — add your first one in the Studio and it\u2019ll show up here.'}
            </p>
          </Reveal>
        ) : (
          <Stagger className="mt-16 grid gap-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {posts.map((post) => (
              <StaggerItem key={post._id}>
                <ArticleCard post={post} headingAs="h2" />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
      </div>
    </div>
  )
}
