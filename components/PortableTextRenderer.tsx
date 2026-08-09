import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'

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
        className="underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-accent"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1400).url()
      if (!url) return null
      return (
        <span className="my-8 block overflow-hidden rounded-xl">
          <Image
            src={url}
            alt={value?.alt || ''}
            width={1400}
            height={900}
            className="h-auto w-full object-cover"
          />
        </span>
      )
    },
  },
}

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />
}
