import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { defineQuery } from 'next-sanity'
import { getPreviewClient } from '@/sanity/lib/client'
import { previewSecret, readToken } from '@/sanity/env'

const SLUG_EXISTS_QUERY = defineQuery(
  `*[_type == $type && slug.current == $slug][0]{ "slug": slug.current }`
)

function pathForType(type: string, slug?: string): string | null {
  switch (type) {
    case 'project':
      return slug ? `/work/${slug}` : null
    case 'post':
      return slug ? `/blog/${slug}` : null
    case 'home':
    case 'siteSettings':
      return '/'
    default:
      return null
  }
}

export async function GET(request: Request) {
  if (!previewSecret) {
    return new Response(
      'Preview mode is not configured — set NEXT_PUBLIC_SANITY_PREVIEW_SECRET (and SANITY_API_READ_TOKEN) in your environment.',
      { status: 501 }
    )
  }

  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const type = searchParams.get('type')
  const slug = searchParams.get('slug') ?? undefined

  if (secret !== previewSecret || !type) {
    return new Response('Invalid preview token or request.', { status: 401 })
  }

  if (!readToken) {
    return new Response(
      'SANITY_API_READ_TOKEN is not set — preview mode needs a token with Viewer access to read drafts.',
      { status: 501 }
    )
  }

  let target: string | null

  if (type === 'home' || type === 'siteSettings') {
    target = '/'
  } else if (slug) {
    try {
      // Verified against the *preview* client so a draft that has never
      // been published (no live version yet) can still be found.
      const found = await getPreviewClient().fetch<{ slug: string } | null>(SLUG_EXISTS_QUERY, {
        type,
        slug,
      })
      target = found ? pathForType(type, found.slug) : null
    } catch (error) {
      console.error('[preview] Could not reach Sanity to verify the document:', error)
      return new Response('Could not reach Sanity to verify that document.', { status: 502 })
    }
  } else {
    target = null
  }

  if (!target) {
    return new Response('Could not find that document to preview.', { status: 404 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(target)
}
