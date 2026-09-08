import { defineQuery } from 'next-sanity'
import type { Image } from 'sanity'
import type { PortableTextBlock } from '@portabletext/react'

export interface ImageWithAlt extends Image {
  alt?: string
  lqip?: string
}

// ── Shared field fragments ─────────────────────────────────────
const projectCardFields = /* groq */ `
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  priority,
  period,
  category,
  tagline,
  excerpt,
  "thumbnail": thumbnail{
    ...,
    "alt": alt,
    "lqip": asset->metadata.lqip
  },
  "coverImage": coverImage{
    ...,
    "alt": alt,
    "lqip": asset->metadata.lqip
  },
  liveUrl,
  secondaryLinkLabel,
  secondaryLinkUrl,
  seoTitle,
  seoDescription,
  "ogImage": ogImage{
    ...,
    "alt": alt,
    "lqip": asset->metadata.lqip
  }
`

// ── Queries ─────────────────────────────────────────────────────
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    _createdAt,
    _updatedAt,
    name,
    handle,
    role,
    locationTag,
    email,
    "resume": resume{
      asset-> {
        url
      }
    },
    socialLinks,
    "heroImage": heroImage{
      ...,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    ctaLabel,
    introHeadline,
    "introImage": introImage{
      ...,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    bio,
    aboutBio,
    stats,
    statement,
    "footerImage": footerImage{
      ...,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    footerHeadline,
    siteTitle,
    seoDescription,
    workSeoDescription,
    blogSeoDescription,
    contactSeoDescription,
    knowsAbout,
    alumniOf,
    twitterHandle,
    "ogImage": ogImage{
      ...,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    favicon,
    maintenanceMode,
    maintenanceTitle,
    maintenanceSubtitle,
    maintenanceExpectedReturn
  }
`)

export const HOME_QUERY = defineQuery(`
  {
    "settings": *[_type == "siteSettings"][0]{
      _createdAt,
      _updatedAt,
      name, handle, role, locationTag, email, ctaLabel,
      "heroImage": heroImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
      introHeadline,
      "introImage": introImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
      bio, aboutBio, stats,
      statement,
      "footerImage": footerImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
      footerHeadline, socialLinks,
      siteTitle, seoDescription, workSeoDescription, blogSeoDescription, contactSeoDescription,
      knowsAbout, alumniOf, twitterHandle,
      "ogImage": ogImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
      favicon,
      maintenanceMode,
      maintenanceTitle,
      maintenanceSubtitle,
      maintenanceExpectedReturn
    },
    // Sort projects in ascending order based on priority (1 at top, 2 second, etc.), fallback to orderRank
    "projects": *[_type == "project" && featured != false] | order(coalesce(priority, 9999) asc, orderRank asc){
      ${projectCardFields}
    },
    // Sort education chronologically in descending order (newest/current at top, oldest at bottom)
    "education": *[_type == "education"] | order(current desc, coalesce(endDate, "0000") desc, coalesce(startDate, "0000") desc, coalesce(endYear, "0000") desc, coalesce(startYear, "0000") desc){
      _id, institution, degree, startDate, endDate, startYear, endYear, current, description,
      "image": image{ ..., "alt": alt, "lqip": asset->metadata.lqip }
    },
    // Sort experience chronologically in descending order (newest/current at top, oldest at bottom)
    "experience": *[_type == "experience"] | order(current desc, coalesce(endDate, "0000") desc, coalesce(startDate, "0000") desc, coalesce(endYear, "0000") desc, coalesce(startYear, "0000") desc){
      _id, company, role, location, startDate, endDate, startYear, endYear, current, description,
      "image": image{ ..., "alt": alt, "lqip": asset->metadata.lqip }
    },

    // Sort awards in ascending order based on priority (1 at top, 2 second, etc.), fallback to orderRank
    "awards": *[_type == "award"] | order(coalesce(priority, 9999) asc, orderRank asc){
      _id, priority, awardType, date,
      "project": project->{
        title, "slug": slug.current,
        "coverImage": coverImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
        "thumbnail": thumbnail{ ..., "alt": alt, "lqip": asset->metadata.lqip }
      }
    },
    "posts": *[_type == "curatedPost" && isHidden != true] | order(displayOrder asc, publishedDate desc)[0...3]{
      _id, _updatedAt, title, mediumUrl, excerpt,
      "coverImage": coverImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
      publishedDate
    }
  }
`)

export const ALL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(coalesce(priority, 9999) asc, orderRank asc){
    ${projectCardFields}
  }
`)

export const PROJECTS_PAGE_QUERY = defineQuery(`
  {
    "items": *[_type == "project"] | order(coalesce(priority, 9999) asc, orderRank asc) [$start...$end]{
      ${projectCardFields}
    },
    "total": count(*[_type == "project"])
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`)

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    period,
    category,
    tagline,
    excerpt,
    "thumbnail": thumbnail{ ..., "alt": alt, "lqip": asset->metadata.lqip },
    "coverImage": coverImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
    liveUrl,
    secondaryLinkLabel,
    secondaryLinkUrl,
    gallery[]{ ..., "alt": alt, "lqip": asset->metadata.lqip },
    body,
    seoTitle,
    seoDescription,
    "ogImage": ogImage{ ..., "alt": alt, "lqip": asset->metadata.lqip }
  }
`)

export const POSTS_QUERY = defineQuery(`
  *[_type == "curatedPost" && isHidden != true] | order(displayOrder asc, publishedDate desc){
    _id, _updatedAt, title, mediumUrl, excerpt,
    "coverImage": coverImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
    publishedDate
  }
`)

export const POSTS_PAGE_QUERY = defineQuery(`
  {
    "items": *[_type == "curatedPost" && isHidden != true] | order(displayOrder asc, publishedDate desc) [$start...$end]{
      _id, _updatedAt, title, mediumUrl, excerpt,
      "coverImage": coverImage{ ..., "alt": alt, "lqip": asset->metadata.lqip },
      publishedDate
    },
    "total": count(*[_type == "curatedPost" && isHidden != true])
  }
`)

export const SITEMAP_DATA_QUERY = defineQuery(`
  {
    "settings": *[_type == "siteSettings"][0]{ _updatedAt },
    "projects": *[_type == "project" && defined(slug.current)]{
      "slug": slug.current,
      "_createdAt": _createdAt,
      "_updatedAt": _updatedAt
    },
    "latestPost": *[_type == "curatedPost" && isHidden != true] | order(publishedDate desc)[0]{
      publishedDate,
      _updatedAt
    },
    "latestProject": *[_type == "project"] | order(_updatedAt desc)[0]{
      _createdAt,
      _updatedAt
    }
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

export interface SiteSettings {
  _createdAt?: string
  _updatedAt?: string
  name: string
  handle: string
  role?: string
  locationTag?: string
  email: string
  resume?: { asset?: { url?: string } }
  ctaLabel?: string
  socialLinks?: SocialLink[]
  heroImage?: ImageWithAlt
  introHeadline?: string
  introImage?: ImageWithAlt
  bio?: string
  aboutBio?: string
  stats?: Stat[]
  statement?: string
  footerImage?: ImageWithAlt
  footerHeadline?: string
  siteTitle?: string
  seoDescription?: string
  workSeoDescription?: string
  blogSeoDescription?: string
  contactSeoDescription?: string
  knowsAbout?: string[]
  alumniOf?: string
  twitterHandle?: string
  ogImage?: ImageWithAlt
  favicon?: Image
  maintenanceMode?: boolean
  maintenanceTitle?: string
  maintenanceSubtitle?: string
  maintenanceExpectedReturn?: string
}

export interface ProjectCard {
  _id: string
  _createdAt?: string
  _updatedAt?: string
  title: string
  slug: string
  priority?: number
  period?: string
  category?: string
  tagline: string
  excerpt?: string
  thumbnail?: ImageWithAlt
  coverImage?: ImageWithAlt
  liveUrl?: string
  secondaryLinkLabel?: string
  secondaryLinkUrl?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: ImageWithAlt
}

export interface GalleryImage extends ImageWithAlt {
  alt?: string
}

export interface ProjectFull extends ProjectCard {
  gallery?: GalleryImage[]
  body?: PortableTextBlock[]
}

export interface EducationEntry {
  _id: string
  institution: string
  degree: string
  startDate?: string
  endDate?: string
  startYear?: string
  endYear?: string
  current?: boolean
  description?: string
  image?: ImageWithAlt
}

export interface ExperienceEntry {
  _id: string
  company: string
  role: string
  location?: string
  startDate?: string
  endDate?: string
  startYear?: string
  endYear?: string
  current?: boolean
  description?: string
  image?: ImageWithAlt
}

export interface AwardEntry {
  _id: string
  priority?: number
  awardType: string
  date: string
  project: {
    title: string
    slug: string
    coverImage?: ImageWithAlt
    thumbnail?: ImageWithAlt
  }
}

export interface PostCard {
  _id: string
  _updatedAt?: string
  title: string
  mediumUrl: string
  excerpt?: string
  coverImage?: ImageWithAlt
  publishedDate: string
}

export interface Paginated<T> {
  items: T[]
  total: number
}

export interface HomeData {
  settings: SiteSettings | null
  projects: ProjectCard[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  awards: AwardEntry[]
  posts: PostCard[]
}

export interface SitemapData {
  settings: { _updatedAt?: string } | null
  projects: { slug: string; _updatedAt?: string }[]
  latestPost: { publishedDate?: string; _updatedAt?: string } | null
  latestProject: { _updatedAt?: string } | null
}
