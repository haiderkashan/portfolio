import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POSTS_QUERY, type PostCard } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'

export const metadata: Metadata = {
  title: 'Writing',
}

export default async function BlogPage() {
  const posts = await sanityFetch<PostCard[]>(POSTS_QUERY, {}, [])

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
              No posts published yet — add your first one in the Studio and it&rsquo;ll show up here.
            </p>
          </Reveal>
        ) : (
          <Stagger className="mt-16 grid gap-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {posts.map((post) => {
              const coverUrl = urlForImage(post.coverImage)?.width(700).height(500).url()
              return (
                <StaggerItem key={post._id}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--surface-raised)]">
                      {coverUrl && (
                        <Image
                          src={coverUrl}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p className="mt-5 font-body text-xs font-medium uppercase tracking-[0.12em] text-[var(--on-surface-faint)]">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 font-body text-sm text-[var(--on-surface-soft)]">
                        {post.excerpt}
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
