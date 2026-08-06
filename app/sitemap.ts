import { MetadataRoute } from 'next'
import { client } from "@/sanity/lib/client";

// COMBINED QUERY: Fetch Projects AND Blog Posts in one go
const SITEMAP_DATA_QUERY = `
{
  "projects": *[_type == "project" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  },
  "posts": *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
}
`;

type SitemapItem = {
  slug: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kashanhaider.com'; // Your Live Domain
  
  // 1. Fetch dynamic data
  const { projects, posts } = await client.fetch(SITEMAP_DATA_QUERY);

  // 2. Define Static Pages (Home, Legal, Main Sections)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl, 
      lastModified: new Date(),
      changeFrequency: 'weekly', 
      priority: 1, // Homepage is King
    },
    // Main Sections
    {
      url: `${baseUrl}/about`, 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`, 
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Legal Pages (Important for Trust/Google)
    {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/terms-of-service`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    }
  ];

  // 3. Generate Dynamic Project Pages
  const projectUrls: MetadataRoute.Sitemap = (projects || []).map((project: SitemapItem) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 4. Generate Dynamic Blog Post Pages
  const postUrls: MetadataRoute.Sitemap = (posts || []).map((post: SitemapItem) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly', // Blogs change more often or get comments
    priority: 0.9, 
  }));

  // 5. Return Everything
  return [...staticPages, ...projectUrls, ...postUrls];
}