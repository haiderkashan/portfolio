import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { SiteNav } from '@/components/ui/SiteNav'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { PageTransition } from '@/components/ui/PageTransition'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'

async function getSettings() {
  return sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <SmoothScroll>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteNav
        locationTag={settings?.locationTag}
        email={settings?.email}
        socialLinks={settings?.socialLinks}
      />
      <main id="main-content" className="font-body">
        <PageTransition>{children}</PageTransition>
      </main>
      <ScrollToTop />
    </SmoothScroll>
  )
}
