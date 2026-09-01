import dynamic from 'next/dynamic'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { SiteNav } from '@/components/ui/SiteNav'
import { PageTransition } from '@/components/ui/PageTransition'
import { PreviewBanner } from '@/components/PreviewBanner'
import { Footer } from '@/components/sections/Footer'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'

const GlobalCursorPreview = dynamic(
  () => import('@/components/ui/GlobalCursorPreview').then((mod) => mod.GlobalCursorPreview)
)

const ScrollToTop = dynamic(
  () => import('@/components/ui/ScrollToTop').then((mod) => mod.ScrollToTop)
)

async function getSettings() {
  return sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, null)
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const name = settings?.name || 'Your Name'
  const handle = settings?.handle || 'yourname'
  const email = settings?.email || 'you@example.com'

  return (
    <SmoothScroll>
      <PreviewBanner />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteNav
        locationTag={settings?.locationTag}
        email={settings?.email}
        socialLinks={settings?.socialLinks}
        resumeUrl={settings?.resume?.asset?.url}
      />
      <main id="main-content" tabIndex={-1} className="font-body focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer
        headline={settings?.footerHeadline}
        email={email}
        ctaLabel={settings?.ctaLabel}
        handle={handle}
        name={name}
        socialLinks={settings?.socialLinks}
      />
      <GlobalCursorPreview />
      <ScrollToTop />
    </SmoothScroll>
  )
}
