import { notFound, redirect } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'

export const revalidate = 60

export default async function WritingRoute() {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)

  if (settings?.showWritingPage === false) {
    notFound()
  }

  redirect('/blog')
}
