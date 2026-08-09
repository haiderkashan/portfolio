import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POST_QUERY, POST_SLUGS_QUERY, type PostFull } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'

async function getPost(slug: string) {
  return sanityFetch<PostFull | null>(POST_QUERY, { slug }, null)
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(POST_SLUGS_QUERY, {}, [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const coverUrl = urlForImage(post.coverImage)?.width(1800).height(1100).url()

  return (
    <article className="theme-light min-h-screen bg-paper pb-28 pt-32 sm:pb-36 sm:pt-40">
      <div className="container-page max-w-3xl">
        <Reveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-[var(--on-surface-soft)] transition-colors hover:text-accent"
          >
            <ArrowLeft size={15} /> All posts
          </Link>
        </Reveal>

        <p className="mt-8 font-body text-xs font-medium uppercase tracking-[0.14em] text-[var(--on-surface-faint)]">
          {formatDate(post.publishedAt)}
        </p>

        <SplitHeading
          text={post.title}
          as="h1"
          className="mt-3 text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl"
        />

        {post.tags && post.tags.length > 0 && (
          <Reveal delay={0.15} className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--line)] px-3 py-1 font-body text-xs font-medium text-[var(--on-surface-soft)]"
              >
                {tag}
              </span>
            ))}
          </Reveal>
        )}
      </div>

      {coverUrl && (
        <Reveal delay={0.1} className="container-page mt-12 max-w-4xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
            <Image src={coverUrl} alt="" fill sizes="90vw" priority className="object-cover" />
          </div>
        </Reveal>
      )}

      <div className="container-page mt-12 max-w-2xl">
        {post.body && post.body.length > 0 ? (
          <PortableTextRenderer value={post.body} />
        ) : (
          <p className="font-body text-lg text-[var(--on-surface-soft)]">
            This post doesn&rsquo;t have a body yet — add one in the Studio.
          </p>
        )}
      </div>
    </article>
  )
}
