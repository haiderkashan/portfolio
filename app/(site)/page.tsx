import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOME_QUERY, type HomeData, type ExperienceEntry } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import { siteUrl } from '@/lib/utils'
import { JsonLd } from '@/components/JsonLd'

import { Hero } from '@/components/sections/Hero'
import { IntroStatement } from '@/components/sections/IntroStatement'
import { Stats } from '@/components/sections/Stats'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { Quote } from '@/components/sections/Quote'
import { Writing } from '@/components/sections/Writing'
import { Experience } from '@/components/sections/Experience'
import { Education } from '@/components/sections/Education'
import { Awards } from '@/components/sections/Awards'
import { Footer } from '@/components/sections/Footer'

const FALLBACK_EXPERIENCE: ExperienceEntry[] = [
  {
    _id: 'exp-1',
    company: 'Stripe',
    role: 'Software Engineering Intern',
    location: 'San Francisco, CA',
    startYear: 'May 2024',
    endYear: 'Aug 2024',
    current: false,
    description: 'Developed high-throughput API endpoints in Go and TypeScript. Reduced database query latency by 35% using Redis caching and SQL indexing.',
  },
  {
    _id: 'exp-2',
    company: 'UC Berkeley Distributed Systems Lab',
    role: 'Undergraduate Systems Researcher',
    location: 'Berkeley, CA',
    startYear: 'Jan 2024',
    current: true,
    description: 'Researched fault-tolerant consensus storage algorithms. Implemented a Raft-based key-value store in Rust with automatic leader election.',
  },
  {
    _id: 'exp-3',
    company: 'Vercel / EdTech Accelerator',
    role: 'Full Stack Developer Intern',
    location: 'Remote',
    startYear: 'Jun 2023',
    endYear: 'Sept 2023',
    current: false,
    description: 'Architected interactive student learning dashboards using Next.js, Tailwind CSS, and PostgreSQL, serving 10,000+ daily active student users.',
  },
  {
    _id: 'exp-4',
    company: 'Cal Hacks / CS Developer Club',
    role: 'Lead Web Developer & Mentor',
    location: 'Berkeley, CA',
    startYear: 'Sept 2023',
    current: true,
    description: 'Led a team of 6 student developers building the official hackathon portal handling 1,200+ hacker registrations and live project submissions.',
  },
]

const FALLBACK: HomeData = {
  settings: null,
  projects: [],
  experience: FALLBACK_EXPERIENCE,
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
  const title = settings?.siteTitle || (settings?.name ? `${settings.name} — ${settings.role || 'Portfolio'}` : 'Portfolio')
  const description = settings?.seoDescription || settings?.bio || 'Portfolio, powered by Next.js and Sanity.'
  const fallbackOgUrl = `${siteUrl}/og-fallback.png`
  const ogImageUrl = urlForImage(settings?.ogImage)?.width(1200).height(630).url() || fallbackOgUrl
  const ogImageAlt = settings?.ogImage?.alt || title
  const twitterHandle = settings?.twitterHandle
    ? (settings.twitterHandle.startsWith('@') ? settings.twitterHandle : `@${settings.twitterHandle}`)
    : settings?.handle
      ? `@${settings.handle.replace(/^@/, '')}`
      : undefined

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}/`,
      siteName: settings?.name || 'Portfolio',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: twitterHandle,
      site: twitterHandle,
    },
  }
}

export default async function HomePage() {
  const { settings, projects, experience, education, awards, posts } = await getHomeData()

  const finalExperience = experience.length > 0 ? experience : FALLBACK_EXPERIENCE
  const name = settings?.name || 'Your Name'
  const handle = settings?.handle || 'yourname'
  const email = settings?.email || 'you@example.com'
  const description = settings?.seoDescription || settings?.bio || 'Portfolio, powered by Next.js and Sanity.'

  const heroImageUrl = urlForImage(settings?.heroImage)?.width(1920).height(1200).url()
  const introImageUrl = urlForImage(settings?.introImage)?.width(480).height(320).url()
  const footerImageUrl = urlForImage(settings?.footerImage)?.width(320).height(240).url()

  const projectImageUrls = projects
    .map((p) => urlForImage(p.coverImage)?.width(500).height(500).url())
    .filter((url): url is string => Boolean(url))

  const validSocialUrls = (settings?.socialLinks ?? [])
    .map((s) => s.url)
    .filter((url) => /^https?:\/\//i.test(url))

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: settings?.siteTitle || `${name} — Portfolio`,
        description,
        publisher: { '@id': `${siteUrl}/#person` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#profilepage`,
        url: `${siteUrl}/`,
        name: `${name} — Portfolio`,
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntity: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name,
        jobTitle: settings?.role,
        url: `${siteUrl}/`,
        ...(heroImageUrl ? { image: heroImageUrl } : {}),
        email: settings?.email,
        description,
        sameAs: validSocialUrls,
        ...(settings?.knowsAbout && settings.knowsAbout.length > 0
          ? { knowsAbout: settings.knowsAbout }
          : {}),
        ...(settings?.alumniOf ? { alumniOf: { '@type': 'EducationalOrganization', name: settings.alumniOf } } : {}),
      },
    ],
  }

  return (
    <>
      <JsonLd data={structuredData} />

      <Hero name={name} role={settings?.role} ctaLabel={settings?.ctaLabel} heroImageUrl={heroImageUrl} />

      <IntroStatement
        headline={settings?.introHeadline || `A designer who loves the craft`}
        bio={settings?.bio}
        introImageUrl={introImageUrl}
        introImageAlt={settings?.introImage?.alt || `${name} portrait`}
      />

      <Stats bio={settings?.aboutBio || settings?.bio} stats={settings?.stats || []} collageImages={projectImageUrls} />

      <FeaturedWork projects={projects} />

      <Experience experience={finalExperience} />

      <Education education={education} />


      <Quote
        statement={settings?.statement || 'Building high-performance software with clean code and modern architecture.'}
        signature={name}
        floatingImages={[...projectImageUrls].reverse()}
      />

      <Writing posts={posts} />

      <Awards awards={awards} />
    </>
  )
}