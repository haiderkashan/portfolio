import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import type { PostCard } from '@/sanity/lib/queries'

export function Writing({ posts }: { posts: PostCard[] }) {
  if (!posts.length) return null

  return (
    <section className="theme-light bg-paper py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitHeading
            text="Writing"
            as="h2"
            className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent sm:text-7xl md:text-8xl"
          />
          <Reveal delay={0.1}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:text-accent"
            >
              All posts
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
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
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                    {post.title}
                  </h3>
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
      </div>
    </section>
  )
}
