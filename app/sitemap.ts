import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { SITEMAP_DATA_QUERY, type SitemapData } from '@/sanity/lib/queries'
import { siteUrl } from '@/lib/utils'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<SitemapData>(
    SITEMAP_DATA_QUERY,
    {},
    { settings: null, projects: [], latestPost: null, latestProject: null },
    ['sitemap']
  )

  const now = new Date()
  const settingsDate = data.settings?._updatedAt ? new Date(data.settings._updatedAt) : now
  const projectLatestDate = data.latestProject?._updatedAt ? new Date(data.latestProject._updatedAt) : settingsDate
  const postLatestDate = data.latestPost?._updatedAt
    ? new Date(data.latestPost._updatedAt)
    : data.latestPost?.publishedDate
      ? new Date(data.latestPost.publishedDate)
      : settingsDate

  const homeLastMod = new Date(
    Math.max(settingsDate.getTime(), projectLatestDate.getTime(), postLatestDate.getTime())
  )

  // Legal pages have dedicated revision dates reflecting actual document modification
  const legalPolicyDate = new Date('2026-08-01T00:00:00.000Z')

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: homeLastMod,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: projectLatestDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: postLatestDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: settingsDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: legalPolicyDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: legalPolicyDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = data.projects.map(({ slug, _updatedAt }) => ({
    url: `${siteUrl}/work/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : settingsDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}



