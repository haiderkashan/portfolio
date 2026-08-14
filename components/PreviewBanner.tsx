import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

async function exitPreview() {
  'use server'
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[70] flex items-center justify-center gap-3 bg-accent px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink"
    >
      <span>Preview mode — showing unpublished drafts</span>
      <form action={exitPreview}>
        <button type="submit" className="underline underline-offset-2 hover:no-underline">
          Exit preview
        </button>
      </form>
    </div>
  )
}
