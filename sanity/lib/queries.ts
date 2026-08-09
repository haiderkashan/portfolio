import { defineQuery } from 'next-sanity'
import type { Image } from 'sanity'
import type { PortableTextBlock } from '@portabletext/react'

// ── Shared field fragments ─────────────────────────────────────
const projectCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  period,
  category,
  tagline,
  excerpt,
  thumbnail,
  coverImage,
  liveUrl,
  secondaryLinkLabel,
  secondaryLinkUrl
`

// ── Queries ─────────────────────────────────────────────────────
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    name,
    handle,
    role,
    locationTag,
    email,
    resume,
    socialLinks,
    heroImage,
    ctaLabel,
    introHeadline,
    introImage,
    bio,
    aboutBio,
    stats,
    processImage,
    processIntro,
    processSteps,
    statement,
    footerImage,
    footerHeadline,
    seoDescription,
    ogImage,
    favicon
  }
`)

export const HOME_QUERY = defineQuery(`
  {
    "settings": *[_type == "siteSettings"][0]{
      name, handle, role, locationTag, email, ctaLabel,
      heroImage, introHeadline, introImage, bio, aboutBio, stats,
      processImage, processIntro, processSteps, statement,
      footerImage, footerHeadline, socialLinks
    },
    "projects": *[_type == "project" && featured != false] | order(orderRank asc){
      ${projectCardFields}
    },
    "education": *[_type == "education"] | order(orderRank asc){
      _id, institution, degree, startYear, endYear, current, description, image
    },
    "services": *[_type == "service"] | order(orderRank asc){
      _id, title, items, previewImage
    },
    "awards": *[_type == "award"] | order(orderRank asc){
      _id, awardType, date,
      "project": project->{title, "slug": slug.current, coverImage, thumbnail}
    },
    "posts": *[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0...3]{
      _id, title, "slug": slug.current, excerpt, coverImage, publishedAt
    }
  }
`)

export const ALL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(orderRank asc){
    ${projectCardFields}
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`)

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, period, category, tagline, excerpt,
    thumbnail, coverImage, liveUrl, secondaryLinkLabel, secondaryLinkUrl,
    gallery, body
  }
`)

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc){
    _id, title, "slug": slug.current, excerpt, coverImage, publishedAt, tags
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, excerpt, coverImage, publishedAt, tags, body
  }
`)

// ── Types (mirroring the GROQ projections above) ────────────────
export interface SocialLink {
  platform: string
  url: string
}

export interface Stat {
  value: string
  label: string
}

export interface ProcessStep {
  title: string
}

export interface SiteSettings {
  name: string
  handle: string
  role?: string
  locationTag?: string
  email: string
  resume?: { asset?: { url?: string } }
  ctaLabel?: string
  socialLinks?: SocialLink[]
  heroImage?: Image
  introHeadline?: string
  introImage?: Image
  bio?: string
  aboutBio?: string
  stats?: Stat[]
  processImage?: Image
  processIntro?: string
  processSteps?: ProcessStep[]
  statement?: string
  footerImage?: Image
  footerHeadline?: string
  seoDescription?: string
  ogImage?: Image
  favicon?: Image
}

export interface ProjectCard {
  _id: string
  title: string
  slug: string
  period?: string
  category?: string
  tagline: string
  excerpt?: string
  thumbnail?: Image
  coverImage?: Image
  liveUrl?: string
  secondaryLinkLabel?: string
  secondaryLinkUrl?: string
}

export interface ProjectFull extends ProjectCard {
  gallery?: Image[]
  body?: PortableTextBlock[]
}

export interface EducationEntry {
  _id: string
  institution: string
  degree: string
  startYear?: string
  endYear?: string
  current?: boolean
  description?: string
  image?: Image
}

export interface ServiceEntry {
  _id: string
  title: string
  items?: string[]
  previewImage?: Image
}

export interface AwardEntry {
  _id: string
  awardType: string
  date: string
  project: {
    title: string
    slug: string
    coverImage?: Image
    thumbnail?: Image
  }
}

export interface PostCard {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: Image
  publishedAt: string
  tags?: string[]
}

export interface PostFull extends PostCard {
  body?: PortableTextBlock[]
}

export interface HomeData {
  settings: SiteSettings | null
  projects: ProjectCard[]
  education: EducationEntry[]
  services: ServiceEntry[]
  awards: AwardEntry[]
  posts: PostCard[]
}
