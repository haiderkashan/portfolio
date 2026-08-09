import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { PROJECT_SLUGS_QUERY, POST_SLUGS_QUERY } from '@/sanity/lib/queries'
import { siteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([
    sanityFetch<{ slug: string }[]>(PROJECT_SLUGS_QUERY, {}, []),
    sanityFetch<{ slug: string }[]>(POST_SLUGS_QUERY, {}, []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map(({ slug }) => ({
    url: `${siteUrl}/work/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = postSlugs.map(({ slug }) => ({
    url: `${siteUrl}/blog/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
