import { client } from './client'

/**
 * Wraps client.fetch so a missing/unreachable Sanity project (e.g. before
 * you've run `npx sanity init`, or during the very first build) degrades to
 * `fallback` instead of crashing the page. Once your project is connected,
 * this behaves like a normal cached fetch.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  revalidateSeconds = 60
): Promise<T> {
  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate: revalidateSeconds },
    })
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
