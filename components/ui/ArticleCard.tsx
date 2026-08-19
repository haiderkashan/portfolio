import Image from 'next/image'
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
      <p className="mt-5 font-body text-xs font-medium uppercase tracking-[0.12em] text-[var(--on-surface-faint)]">
        {formatDate(post.publishedDate)}
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl text-ink">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 line-clamp-2 font-body text-sm text-[var(--on-surface-soft)]">
          {post.excerpt}
        </p>
      )}
    </a>
  )
}
