/**
 * Central place for every Sanity-related environment variable.
 *
 * Nothing in here is secret except SANITY_API_WRITE_TOKEN, so the rest are
 * safe to expose to the browser via the NEXT_PUBLIC_ prefix.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-01'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

// Used only in the /studio route (client-side) so editors can preview drafts.
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio'

// Server-only token with "Editor" or "Write" rights, used by the contact
// form API route to save submissions. Never exposed to the browser.
export const writeToken = process.env.SANITY_API_WRITE_TOKEN

// Server-only token with "Viewer" rights, used only when Draft Mode is on
// so editors can preview unpublished content. Deliberately separate from
// writeToken above - preview only ever needs to *read* drafts, never write.
export const readToken = process.env.SANITY_API_READ_TOKEN

// Arbitrary shared string you generate yourself, used only to authorize
// requests to /api/draft. Not a Sanity credential - just a password so
// random visitors can't flip your site into draft mode.
//
// This one is intentionally NEXT_PUBLIC_ (unlike the tokens above) so the
// Studio - which runs client-side in the browser - can build the "Preview"
// button's URL. That's fine: anyone who can already see the Studio's bundle
// is someone who logged into Sanity and has full read/write access to your
// content anyway, so this secret is only ever gatekeeping random public
// visitors from toggling draft mode on the live site, not gatekeeping your
// own editors.
export const previewSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    // We throw lazily (at call time, not import time) almost everywhere this
    // is used, so a missing .env.local doesn't crash `next build` — it just
    // means the relevant fetch returns empty data until it's configured.
    throw new Error(errorMessage)
  }
  return v
}
