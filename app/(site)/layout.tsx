import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { SiteNav } from '@/components/ui/SiteNav'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'

async function getSettings() {
  return sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <SmoothScroll>
      <SiteNav
        locationTag={settings?.locationTag}
        email={settings?.email}
        socialLinks={settings?.socialLinks}
      />
      <main className="font-body">{children}</main>
      <ScrollToTop />
    </SmoothScroll>
  )
}
