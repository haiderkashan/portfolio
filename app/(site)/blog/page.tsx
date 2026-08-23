import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POSTS_PAGE_QUERY, type Paginated, type PostCard } from '@/sanity/lib/queries'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { Pagination } from '@/components/ui/Pagination'
import { ArticleCard } from '@/components/ui/ArticleCard'

import { siteUrl } from '@/lib/utils'

const PAGE_SIZE = 9

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const canonicalUrl = page > 1 ? `/blog?page=${page}` : '/blog'
  const title = page > 1 ? `Writing (Page ${page})` : 'Writing'

  return {
    title,
    description: 'Articles, architectural breakdowns, and engineering notes.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} · Portfolio`,
      description: 'Articles, architectural breakdowns, and engineering notes.',
      type: 'website',
      url: `${siteUrl}${canonicalUrl}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · Portfolio`,
      description: 'Articles, architectural breakdowns, and engineering notes.',
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

  return (
    <div className="theme-light min-h-screen bg-paper pb-28 pt-16 sm:pb-36 sm:pt-20">
      <div className="container-page">
        <header className="mb-10 sm:mb-12">
          <Reveal>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-1.5 font-body text-sm font-medium text-[var(--on-surface-soft)] transition-colors hover:text-ink focus-visible:underline"
            >
              <ArrowLeft size={15} /> Back to main
            </Link>
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
                <ArticleCard post={post} />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
      </div>
    </div>
  )
}
