import { ImageResponse } from 'next/og'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlForImage } from '@/sanity/lib/image'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default async function Icon() {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
  const faviconUrl = urlForImage(settings?.favicon)?.width(128).height(128).url()

  if (faviconUrl) {
    try {
      const res = await fetch(faviconUrl, { next: { revalidate: 3600 } })
      if (res.ok) {
        const buffer = await res.arrayBuffer()
        return new Response(buffer, {
          headers: { 'Content-Type': res.headers.get('content-type') || 'image/png' },
        })
      }
    } catch {
      // fall through to the generated placeholder below
    }
  }

  // No favicon set in Sanity yet — render a simple branded placeholder
  // instead of a broken icon, using the visitor's initial.
  const letter = (settings?.name?.trim()?.[0] || 'P').toUpperCase()
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a08',
          borderRadius: 14,
        }}
      >
        <span style={{ color: '#f4cf00', fontSize: 38, fontWeight: 700 }}>{letter}</span>
      </div>
    ),
    { ...size }
  )
}
