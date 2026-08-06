"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  IconChevronLeft, IconChevronRight, IconCalendar, IconClock, IconTag, IconArrowRight, IconArticle
} from "@tabler/icons-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ... Interface (Keep existing) ...
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

export function BlogCarousel({ data }: { data: BlogPost[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) return null;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % data.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  const currentPost = data[currentIndex];
  if (!currentPost) return null; 

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const startYear = currentPost.publishedAt ? new Date(currentPost.publishedAt).getFullYear() : new Date().getFullYear();

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto px-4 md:px-6 py-12"
      role="region"
      aria-label="Latest Articles Carousel"
    >
      
      {/* Glow - Hidden from A11y */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-tr from-[var(--color-primary)]/20 via-transparent to-[var(--color-accent)]/10 blur-[80px] rounded-full -z-10 opacity-40 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Glass Card - Semantic Article */}
      <article 
        className="relative bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden min-h-[400px] flex flex-col md:flex-row group transition-all duration-500"
        aria-live="polite"
        aria-atomic="true"
      >
        
        {/* Watermark - Decorative */}
        <div 
            className="absolute bottom-[-1rem] right-[-1rem] text-[8rem] font-black text-foreground/5 leading-none select-none z-0 pointer-events-none"
            aria-hidden="true"
        >
          {startYear}
        </div>

        {/* Sidebar Image (Narrower) */}
        <div className="md:w-[40%] relative bg-muted/20 border-r border-white/10 dark:border-white/5 min-h-[200px] md:min-h-full overflow-hidden">
          {currentPost.featuredImage ? (
             <div className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700">
               <Image 
                 src={urlFor(currentPost.featuredImage).url()} 
                 alt={`Cover image for ${currentPost.title}`} 
                 fill 
                 // PERFORMANCE: Sizes prop helps browser load correct image size
                 sizes="(max-width: 768px) 100vw, 40vw"
                 className="object-cover" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-background/10" aria-hidden="true" />
             </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <IconArticle className="w-16 h-16 text-muted-foreground/30" aria-hidden="true" />
            </div>
          )}
          {currentPost.category && (
            <div className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-md text-[var(--color-primary)] border border-white/20 shadow-lg">
              {currentPost.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
          
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted-foreground font-medium">
             <div className="flex items-center gap-1.5">
                <IconCalendar className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                {/* SEMANTIC DATE */}
                <time dateTime={currentPost.publishedAt}>{formatDate(currentPost.publishedAt)}</time>
             </div>
             {currentPost.readTime && (
               <div className="flex items-center gap-1.5 border-l border-border pl-4">
                  <IconClock className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>{currentPost.readTime} min read</span>
               </div>
             )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight line-clamp-3">
            {currentPost.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 text-sm line-clamp-3">
            {currentPost.excerpt}
          </p>

          {currentPost.tags && currentPost.tags.length > 0 && (
             <div className="flex flex-wrap gap-2 mb-6" aria-label="Tags">
               {currentPost.tags.slice(0, 3).map((tag, idx) => (
                 <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded bg-muted/50 text-[10px] font-medium text-muted-foreground">
                    <IconTag className="w-3 h-3" aria-hidden="true" /> {tag}
                 </span>
               ))}
             </div>
          )}

          <div className="mt-auto pt-4 border-t border-white/5">
            <Link 
                href={`/blog/${currentPost.slug.current}`} 
                className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:text-foreground transition-colors"
                aria-label={`Read full article: ${currentPost.title}`}
            >
              Read Full Article 
              <span className="p-1 rounded-full bg-[var(--color-primary)]/10 group-hover/btn:bg-[var(--color-primary)] group-hover/btn:text-white transition-all">
                  <IconArrowRight className="w-3 h-3" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </article>

      {/* Control Deck */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-md border border-white/10 shadow-xl rounded-full px-4 py-1.5 z-30">
        <button 
            onClick={prevSlide} 
            type="button"
            className="p-2 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors"
            aria-label="Previous Article"
        >
            <IconChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        
        <div className="flex gap-2" role="tablist">
          {data.map((post, idx) => (
            <button 
                key={post.slug.current + idx} 
                type="button"
                onClick={() => setCurrentIndex(idx)} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-[var(--color-primary)]" : "w-1 bg-foreground/20 hover:bg-foreground/40"}`} 
                aria-label={`Go to article ${idx + 1}`}
                aria-selected={idx === currentIndex}
                role="tab"
            />
          ))}
        </div>

        <button 
            onClick={nextSlide} 
            type="button"
            className="p-2 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors"
            aria-label="Next Article"
        >
            <IconChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}