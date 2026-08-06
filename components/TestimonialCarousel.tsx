"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconQuote,
  IconBrandLinkedin,
  IconBuildingSkyscraper
} from "@tabler/icons-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  name: string;
  position?: string;
  company?: string;
  testimonial: string;
  rating?: number;
  date?: string;
  avatar?: SanityImageSource;
  companyLogo?: SanityImageSource;
  linkedinUrl?: string;
}

export function TestimonialCarousel({ data }: { data: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const len = data ? data.length : 0;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % len);
  }, [len]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + len) % len);
  };

  // Auto-slide logic
  useEffect(() => {
    if (isHovering || len === 0) return;
    const interval = setInterval(nextSlide, 5000); 
    return () => clearInterval(interval);
  }, [isHovering, nextSlide, len]);

  if (!data || data.length === 0) return null;

  const currentTestimonial = data[currentIndex];
  if (!currentTestimonial) return null; 

  const testimonialWords = (currentTestimonial.testimonial || "").split(" ");

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto px-4 md:px-6 py-12"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client Testimonials"
    >
      
      {/* Ambient Glow - Hidden from A11y */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-[var(--color-primary)]/20 via-transparent to-[var(--color-accent)]/10 blur-[90px] rounded-full -z-10 opacity-50 pointer-events-none" 
        aria-hidden="true"
      />

      {/* --- The Glass Card --- */}
      {/* SEMANTIC TAG: Using figure to link quote with author */}
      <figure className="relative bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden min-h-[450px] flex flex-col md:flex-row group transition-all duration-500">
        
        {/* Background Icon - Decorative */}
        <div className="absolute -top-6 -right-6 z-0 opacity-5 pointer-events-none rotate-12" aria-hidden="true">
           <IconQuote className="w-64 h-64 text-foreground" stroke={1} />
        </div>

        {/* Left Side: Profile (Figcaption - The Author) */}
        <figcaption className="md:w-[35%] bg-muted/30 border-r border-white/10 dark:border-white/5 flex flex-col items-center justify-center p-8 text-center relative z-10">
          
          <div className="relative w-32 h-32 mb-6 group-hover:scale-105 transition-transform duration-500">
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-xl">
              {currentTestimonial.avatar ? (
                <Image 
                  src={urlFor(currentTestimonial.avatar).width(256).height(256).url()} 
                  alt={currentTestimonial.name} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-4xl" role="img" aria-label="Default avatar">👤</span>
                </div>
              )}
            </div>
            {currentTestimonial.companyLogo && (
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-background rounded-full p-2 shadow-lg border border-border flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image 
                    src={urlFor(currentTestimonial.companyLogo).url()} 
                    alt={`${currentTestimonial.company} logo`} 
                    fill 
                    className="object-contain" 
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="font-bold text-xl text-foreground mb-1">
             {currentTestimonial.name}
          </div>
          <div className="text-sm font-medium text-[var(--color-primary)] mb-1">
            {currentTestimonial.position}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
             <IconBuildingSkyscraper className="w-3 h-3" aria-hidden="true" />
             {currentTestimonial.company}
          </div>

          {currentTestimonial.linkedinUrl && (
            <Link 
              href={currentTestimonial.linkedinUrl}
              target="_blank"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077b5]/10 text-[#0077b5] text-xs font-bold hover:bg-[#0077b5] hover:text-white transition-all"
              aria-label={`Connect with ${currentTestimonial.name} on LinkedIn`}
            >
              <IconBrandLinkedin className="w-4 h-4" aria-hidden="true" /> Connect
            </Link>
          )}
        </figcaption>

        {/* Right Side: Content (Blockquote) */}
        {/* ARIA-LIVE: Announcements for screen readers */}
        <div 
            className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10"
            aria-live="polite"
            aria-atomic="true"
        >
          
          <div className="relative min-h-[120px] flex items-center">
             <IconQuote className="w-8 h-8 text-[var(--color-primary)]/40 absolute -top-6 -left-6 -scale-x-100" aria-hidden="true" />
             
             <blockquote 
               key={currentIndex} 
               className="text-lg md:text-xl text-muted-foreground leading-relaxed italic relative z-10"
             >
               {testimonialWords.map((word, index) => (
                 <motion.span
                   key={`${currentIndex}-${index}`}
                   initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                   animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                   transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
                   className="inline-block"
                 >
                   {word}&nbsp;
                 </motion.span>
               ))}
             </blockquote>

             <IconQuote className="w-8 h-8 text-[var(--color-primary)]/40 absolute -bottom-6 -right-0" aria-hidden="true" />
          </div>

          {currentTestimonial.date && (
            <div className="mt-8 pt-6 border-t border-white/5 text-xs font-bold uppercase tracking-widest text-foreground/30 text-right">
              <time dateTime={currentTestimonial.date}>
                  {new Date(currentTestimonial.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </time>
            </div>
          )}
        </div>
      </figure>

      {/* Floating Control Deck */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-md border border-white/10 shadow-xl rounded-full px-4 py-1.5 z-30">
        
        <button
          type="button" 
          onClick={prevSlide}
          className="p-2 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors group"
          aria-label="Previous Testimonial"
        >
          <IconChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>

        <div className="flex gap-2" role="tablist">
          {data.map((t, i) => (
            <button
              type="button"
              key={t.name} // FIXED: Used unique name instead of index
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex 
                ? "w-6 bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" 
                : "w-1 bg-foreground/20 hover:bg-foreground/40"
              }`}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to testimonial by ${t.name}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="p-2 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors group"
          aria-label="Next Testimonial"
        >
          <IconChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>

      </div>
    </div>
  );
}