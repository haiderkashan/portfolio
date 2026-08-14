import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, readToken } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The public frontend only ever reads published content, so the fast,
  // globally-cached CDN is the right choice.
  useCdn: true,
})

// A second client with a write token, used only on the server (API routes)
// to save contact form submissions. Never import this from a Client Component.
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    throw new Error(
      'Missing SANITY_API_WRITE_TOKEN — add a token with Editor access in .env.local to enable the contact form.'
    )
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })
}

// A third client, used only when Next.js Draft Mode is active (see
// sanity/lib/fetch.ts). Bypasses the CDN and reads the "drafts" perspective
// so an editor sees their unpublished edits. Requires SANITY_API_READ_TOKEN
// - if that's not set, preview mode simply won't return draft content
// (falls back to published-only), it won't error for regular visitors.
export function getPreviewClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: readToken,
    perspective: 'drafts',
  })
}
