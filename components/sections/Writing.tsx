import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { ArticleCard } from '@/components/ui/ArticleCard'
import type { PostCard } from '@/sanity/lib/queries'

export function Writing({ posts }: { posts: PostCard[] }) {
  if (!posts.length) return null

  return (
    <section className="theme-light bg-paper min-h-[50vh] flex flex-col justify-center py-12 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitHeading
            text="Writing"
            as="h2"
            className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold tracking-tight text-brutalist-shadow sm:text-7xl md:text-8xl"
          />
          <Reveal delay={0.1}>
            <Link
              href="/blog"
              className="group inline-flex min-h-[44px] items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:text-moss hover:underline decoration-2 underline-offset-4 focus-visible:underline"
            >
              All posts
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {posts.map((post) => (
            <StaggerItem key={post._id}>
              <ArticleCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}




