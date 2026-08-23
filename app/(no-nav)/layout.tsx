import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { PageTransition } from '@/components/ui/PageTransition'
import { PreviewBanner } from '@/components/PreviewBanner'

export default function NoNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PreviewBanner />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1} className="font-body outline-none">
        <PageTransition>{children}</PageTransition>
      </main>
    </SmoothScroll>
  )
}
