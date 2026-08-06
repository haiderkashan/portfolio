import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { BlogCarousel } from "@/components/BlogCarousel"; 
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// 1. Import Animation
import { ScrollAnimation } from "@/components/ScrollAnimation";

// Interface (Matching Schema)
interface BlogPost {
  title: string;
  slug: { current: string };
  excerpt: string;
  category?: string;
  tags?: string[];
  publishedAt: string;
  readTime?: number;
  featuredImage?: SanityImageSource;
}

const BLOG_QUERY = defineQuery(`
  *[_type == "blog"] | order(publishedAt desc){
    title,
    slug,
    excerpt,
    category,
    tags,
    publishedAt,
    readTime,
    featuredImage
  }
`);

export async function BlogSection() {
  // Fetch Data
  const { data: posts } = await sanityFetch({ query: BLOG_QUERY });
  const blogPosts = posts as unknown as BlogPost[];

  if (!blogPosts || blogPosts.length === 0) {
    return null;
  }

  return (
    <section 
      id="blog" 
      aria-labelledby="blog-heading"
      // FIX: Consistent Spacing (Mobile 48px / Desktop 96px)
      className="py-12 md:py-24 px-6 relative bg-background"
      itemScope
      itemType="http://schema.org/Blog"
    >
      <div className="container mx-auto">
        
        {/* SEMANTIC HEADER */}
        {/* FIX: Consistent bottom margin (mb-10 mobile / mb-16 desktop) */}
        <header className="text-center mb-10 md:mb-16 space-y-4">
          
          {/* 1. Title: Blur In */}
          <ScrollAnimation variant="blurIn">
            <h2 
                id="blog-heading"
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
                itemProp="name"
            >
                Latest <span className="text-[var(--color-primary)]">Insights</span>
            </h2>
          </ScrollAnimation>
          
          {/* 2. Decoration: Scale Up */}
          <ScrollAnimation variant="scaleUp" delay={0.2}>
            <div 
                className="h-1 w-20 bg-[var(--color-accent)] mx-auto rounded-full" 
                role="presentation"
            />
          </ScrollAnimation>
          
          {/* 3. Subtitle: Fade Up */}
          <ScrollAnimation variant="fadeUp" delay={0.3}>
            <p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto pt-4"
                itemProp="description"
            >
                Thoughts, tutorials, and deep dives into technology.
            </p>
          </ScrollAnimation>
        </header>

        {/* Carousel Component: Fade Up */}
        <ScrollAnimation variant="fadeUp" delay={0.4}>
            <div itemProp="blogPosts">
                <BlogCarousel data={blogPosts} />
            </div>
        </ScrollAnimation>
        
      </div>
    </section>
  );
}