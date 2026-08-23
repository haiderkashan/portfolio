import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'
import { siteUrl } from '@/lib/utils'

const SITEMAP_CONTENT_QUERY = defineQuery(`
  {
    "projects": *[_type == "project" && defined(slug.current)]{
      "slug": slug.current,
      "_updatedAt": _updatedAt
    },
    "posts": *[_type == "post" && defined(slug.current)]{
      "slug": slug.current,
      "_updatedAt": _updatedAt
    }
  }
`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<{
    projects: { slug: string; _updatedAt?: string }[]
    posts: { slug: string; _updatedAt?: string }[]
  }>(SITEMAP_CONTENT_QUERY, {}, { projects: [], posts: [] }, ['sitemap'])

  const buildDate = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: buildDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = data.projects.map(({ slug, _updatedAt }) => ({
    url: `${siteUrl}/work/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : buildDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = data.posts.map(({ slug, _updatedAt }) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : buildDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}

