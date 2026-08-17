import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { PageTransition } from '@/components/ui/PageTransition'
import { PreviewBanner } from '@/components/PreviewBanner'

export default function NoNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PreviewBanner />
      <main id="main-content" className="font-body">
        <PageTransition>{children}</PageTransition>
      </main>
    </SmoothScroll>
  )
}
