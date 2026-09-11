import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { SiteNav } from '@/components/ui/SiteNav'
import { PreviewBanner } from '@/components/PreviewBanner'
import { Footer } from '@/components/sections/Footer'
import { MaintenancePage } from '@/components/MaintenancePage'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/lib/queries'

const GlobalCursorPreview = dynamic(
  () => import('@/components/ui/GlobalCursorPreview').then((mod) => mod.GlobalCursorPreview)
)

const ScrollToTop = dynamic(
  () => import('@/components/ui/ScrollToTop').then((mod) => mod.ScrollToTop)
)

async function getSettings() {
  return sanityFetch<SiteSettings | null>(
    SITE_SETTINGS_QUERY,
    {},
    null,
    ['siteSettings'],
    process.env.NODE_ENV === 'development' ? 0 : 10
  )
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, draft] = await Promise.all([
    getSettings(),
    draftMode(),
  ])

  const name = settings?.name || 'Your Name'
  const handle = settings?.handle || 'yourname'
  const email = settings?.email || 'you@example.com'

  // If maintenance mode is turned ON in Sanity Studio, show the maintenance screen
  // unless the visitor is an editor browsing in Sanity Draft Mode.
  if (settings?.maintenanceMode && !draft.isEnabled) {
    return (
      <>
        <PreviewBanner />
        <MaintenancePage
          title={settings.maintenanceTitle}
          subtitle={settings.maintenanceSubtitle}
          expectedReturn={settings.maintenanceExpectedReturn}
          email={email}
          name={name}
          handle={handle}
          locationTag={settings.locationTag}
          socialLinks={settings.socialLinks}
        />
      </>
    )
  }

  return (
    <>
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
        showWritingPage={settings?.showWritingPage}
        showAwardsPage={settings?.showAwardsPage}
      />
      <main id="main-content" tabIndex={-1} className="focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4">
        {children}
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
      <SmoothScroll />
    </>
  )
}
