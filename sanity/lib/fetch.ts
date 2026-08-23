import { cache } from 'react'
import { draftMode } from 'next/headers'
import { client, getPreviewClient } from './client'

/**
 * Wraps client.fetch so a missing/unreachable Sanity project (e.g. before
 * you've run `npx sanity init`, or during the very first build) degrades to
 * `fallback` instead of crashing the page. Once your project is connected,
 * this behaves like a normal cached fetch.
 *
 * Also Draft Mode-aware: when an editor has entered preview (via
 * /api/draft), this automatically switches to the uncached preview client
 * so they see unpublished edits. Everyone else gets the exact same cached,
 * published-only behavior as before - this only branches when Draft Mode's
 * cookie is actually present on the request.
 */
async function sanityFetchRaw<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  tags: string[] = [],
  revalidateSeconds = process.env.NODE_ENV === 'development' ? 0 : 60
): Promise<T> {
  try {
    const { isEnabled: isDraftMode } = await draftMode()

    const result = isDraftMode
      ? await getPreviewClient().fetch<T>(query, params, { cache: 'no-store' })
      : await client.fetch<T>(
          query,
          params,
          revalidateSeconds === 0
            ? { cache: 'no-store' }
            : {
                next: {
                  revalidate: revalidateSeconds,
                  tags: [...tags, 'sanity'],
                },
              }
        )

    return result ?? fallback
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[sanityFetch] Falling back to default data — is your Sanity project connected yet?',
        error instanceof Error ? error.message : error
      )
    }
    return fallback
  }
}

export const sanityFetch = cache(sanityFetchRaw)

