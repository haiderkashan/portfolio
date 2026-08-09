import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOME_QUERY, type HomeData } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'

import { Hero } from '@/components/sections/Hero'
import { IntroStatement } from '@/components/sections/IntroStatement'
import { Stats } from '@/components/sections/Stats'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { Services } from '@/components/sections/Services'
import { Process } from '@/components/sections/Process'
import { Quote } from '@/components/sections/Quote'
import { Writing } from '@/components/sections/Writing'
import { Education } from '@/components/sections/Education'
import { Awards } from '@/components/sections/Awards'
import { Footer } from '@/components/sections/Footer'

const FALLBACK: HomeData = {
  settings: null,
  projects: [],
  education: [],
  services: [],
  awards: [],
  posts: [],
}

async function getHomeData() {
  return sanityFetch<HomeData>(HOME_QUERY, {}, FALLBACK)
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getHomeData()
  const title = settings?.name ? `${settings.name} — ${settings.role || 'Portfolio'}` : 'Portfolio'
  return {
    title: { absolute: title },
    description: settings?.seoDescription || settings?.bio,
  }
}

export default async function HomePage() {
  const { settings, projects, education, services, awards, posts } = await getHomeData()

  const name = settings?.name || 'Your Name'
  const handle = settings?.handle || 'yourname'
  const email = settings?.email || 'you@example.com'

  const heroImageUrl = urlForImage(settings?.heroImage)?.width(1920).height(1200).url()
  const introImageUrl = urlForImage(settings?.introImage)?.width(480).height(320).url()
  const processImageUrl = urlForImage(settings?.processImage)?.width(900).height(720).url()
  const footerImageUrl = urlForImage(settings?.footerImage)?.width(320).height(240).url()

  const projectImageUrls = projects
    .map((p) => urlForImage(p.coverImage)?.width(500).height(500).url())
    .filter((url): url is string => Boolean(url))

  return (
    <>
      <Hero name={name} role={settings?.role} ctaLabel={settings?.ctaLabel} heroImageUrl={heroImageUrl} />

      <IntroStatement
        headline={settings?.introHeadline || `A designer who loves the craft`}
        bio={settings?.bio}
        introImageUrl={introImageUrl}
      />

      <Stats bio={settings?.aboutBio || settings?.bio} stats={settings?.stats || []} collageImages={projectImageUrls} />

      <FeaturedWork projects={projects} />

      <Services services={services} />

      <Process
        steps={settings?.processSteps || []}
        intro={settings?.processIntro}
        portraitUrl={processImageUrl}
      />

      <Quote
        statement={settings?.statement || 'Independent designer helping brands bring ideas to life.'}
        signature={name}
        floatingImages={[...projectImageUrls].reverse()}
      />

      <Writing posts={posts} />

      <Education education={education} />

      <Awards awards={awards} />

      <Footer
        headline={settings?.footerHeadline}
        email={email}
        ctaLabel={settings?.ctaLabel}
        footerImageUrl={footerImageUrl}
        handle={handle}
        socialLinks={settings?.socialLinks}
      />
    </>
  )
}
