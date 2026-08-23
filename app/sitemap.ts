import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITEMAP_PROJECTS_QUERY } from '@/sanity/lib/queries'
import { siteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sanityFetch<{ slug: string; _updatedAt?: string }[]>(
    SITEMAP_PROJECTS_QUERY,
    {},
    [],
    ['sitemap']
  )

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

  const projectRoutes: MetadataRoute.Sitemap = projects.map(({ slug, _updatedAt }) => ({
    url: `${siteUrl}/work/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : buildDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}


