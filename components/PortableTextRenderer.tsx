import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'

interface SanityImageBlock {
  asset?: {
    _ref?: string
    _id?: string
    metadata?: {
      lqip?: string
    }
  }
  alt?: string
  lqip?: string
}

function getImageDimensions(value?: SanityImageBlock): { width: number; height: number } {
  const ref = value?.asset?._ref || value?.asset?._id || ''
  const match = /-(\d+)x(\d+)-/.exec(ref)
  if (match) {
    const width = parseInt(match[1], 10)
    const height = parseInt(match[2], 10)
    if (!Number.isNaN(width) && !Number.isNaN(height) && width > 0 && height > 0) {
      return { width, height }
    }
  }
  return { width: 1400, height: 900 }
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 font-display text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-5 font-body text-base leading-relaxed text-[var(--on-surface-soft)] sm:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-5 font-display text-xl italic text-[var(--on-surface)]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-5 list-disc space-y-2 font-body text-base text-[var(--on-surface-soft)] sm:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-5 list-decimal space-y-2 font-body text-base text-[var(--on-surface-soft)] sm:text-lg">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[var(--on-surface)]">{children}</strong>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:bg-accent/40"
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1400).url()
      if (!url) return null
      const { width, height } = getImageDimensions(value)
      const lqip = (value as SanityImageBlock)?.lqip || (value as { asset?: { metadata?: { lqip?: string } } })?.asset?.metadata?.lqip
      return (
        <span className="my-8 block overflow-hidden rounded-xl bg-[var(--surface-raised)]">
          <Image
            src={url}
            alt={value?.alt || 'Project visual'}
            width={width}
            height={height}
            placeholder={lqip ? 'blur' : 'empty'}
            blurDataURL={lqip}
            sizes="(min-width: 1024px) 800px, (min-width: 640px) 90vw, 100vw"
            className="h-auto w-full object-contain"
          />
        </span>
      )
    },
  },
}

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />
}
