import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import type { PostCard } from '@/sanity/lib/queries'

export function ArticleCard({ post }: { post: PostCard }) {
  const coverUrl = urlForImage(post.coverImage)?.width(700).height(500).url()
  return (
    <a
      href={post.mediumUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--surface-raised)]">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="font-body text-xs font-medium uppercase tracking-[0.12em] text-[var(--on-surface-faint)]">
          {formatDate(post.publishedDate)}
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2.5 py-0.5 font-body text-[11px] font-medium text-[var(--on-surface-soft)] transition-colors group-hover:border-ink group-hover:text-ink">
          Medium <ArrowUpRight size={12} />
        </span>
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl transition-colors group-hover:text-moss">
        <span>{post.title}</span>
        <span className="sr-only"> (opens in a new tab on Medium)</span>
      </h3>
      {post.excerpt && (
        <p className="mt-2 line-clamp-2 font-body text-sm text-[var(--on-surface-soft)]">
          {post.excerpt}
        </p>
      )}
    </a>
  )
}
