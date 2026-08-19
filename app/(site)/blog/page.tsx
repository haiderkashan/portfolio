import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POSTS_PAGE_QUERY, type Paginated, type PostCard } from '@/sanity/lib/queries'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { Pagination } from '@/components/ui/Pagination'
import { ArticleCard } from '@/components/ui/ArticleCard'

const PAGE_SIZE = 9

export const metadata: Metadata = {
  title: 'Writing',
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
    <div className="theme-light min-h-screen bg-paper pb-28 pt-32 sm:pb-36 sm:pt-40">
      <div className="container-page">
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
