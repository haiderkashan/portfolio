"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconExternalLink,
  IconAward,
  IconSchool
} from "@tabler/icons-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  gpa?: string;
  description?: string;
  achievements?: string[];
  logo?: SanityImageSource;
  website?: string;
  order?: number;
}

export function EducationCarousel({ data }: { data: Education[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const currentEdu = data[currentIndex];
  if (!currentEdu) return null; 

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? dateString 
      : date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const startYear = new Date(currentEdu.startDate).getFullYear();
  const displayYear = isNaN(startYear) ? "" : startYear;

  return (
    <div 
        className="relative w-full max-w-5xl mx-auto px-4 md:px-12 py-10 md:py-16"
        role="region"
        aria-label="Education History Carousel"
    >
      
      {/* 1. Ambient Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-[var(--color-primary)]/20 via-transparent to-[var(--color-accent)]/10 blur-[90px] rounded-full -z-10 opacity-50 pointer-events-none" 
        aria-hidden="true"
      />

      {/* --- The Glass Card --- */}
      {/* RESPONSIVE FIXES: 
          - min-h-[500px] on mobile (stacks vertically, needs height)
          - md:min-h-[400px] on desktop (side-by-side, can be shorter/sleeker)
      */}
      <article 
        className="relative bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden min-h-[500px] md:min-h-[400px] flex flex-col md:flex-row group"
        aria-live="polite" 
        aria-atomic="true"
      >
        
        {/* 2. Watermark (Responsive Text Size) */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6rem] md:text-[12rem] font-black text-foreground/5 leading-none select-none z-0 pointer-events-none transition-transform duration-700 group-hover:scale-110"
            aria-hidden="true"
        >
          {displayYear}
        </div>

        {/* Left Side: Logo/Visual (Top on Mobile, Left on Desktop) */}
        <div className="w-full md:w-[35%] bg-muted/40 border-b md:border-b-0 md:border-r border-white/10 dark:border-white/5 flex flex-col items-center justify-center p-6 md:p-8 text-center relative z-10">
          
          {/* Logo Container - Smaller on mobile (w-20) */}
          <div className="relative w-20 h-20 md:w-28 md:h-28 bg-background/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 mb-4 md:mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            {currentEdu.logo ? (
              <div className="relative w-full h-full">
                <Image 
                  src={urlFor(currentEdu.logo).url()} 
                  alt={`${currentEdu.institution} logo`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-contain" 
                />
              </div>
            ) : (
              <IconSchool className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/50" aria-hidden="true" />
            )}
          </div>
          
          <h3 className="text-lg md:text-xl font-bold text-foreground">{currentEdu.institution}</h3>
          
          {currentEdu.website && (
            <Link 
              href={currentEdu.website}
              target="_blank"
              className="mt-2 md:mt-4 inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:text-foreground transition-colors"
              aria-label={`Visit ${currentEdu.institution} website`}
            >
              Visit Website <IconExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-6 md:p-12 flex flex-col justify-center relative z-10">
          
          {/* Top Meta Tags */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
               currentEdu.current 
               ? "bg-green-500/10 text-green-500 border-green-500/20" 
               : "bg-foreground/5 text-muted-foreground border-foreground/10"
            }`}>
               <time dateTime={currentEdu.startDate}>{formatDate(currentEdu.startDate)}</time> 
               — 
               {currentEdu.current ? "Present" : <time dateTime={currentEdu.endDate || ""}>{formatDate(currentEdu.endDate || "")}</time>}
            </div>
            
            {currentEdu.gpa && (
              <div className="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                GPA: {currentEdu.gpa}
              </div>
            )}
          </div>

          {/* Title - Responsive Text */}
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            {currentEdu.degree}
          </h2>

          {/* Description */}
          {currentEdu.description && (
            <p className="text-muted-foreground leading-relaxed mb-6 md:mb-8 text-sm md:text-base max-w-lg">
              {currentEdu.description}
            </p>
          )}

          {/* Highlights */}
          {currentEdu.achievements && currentEdu.achievements.length > 0 && (
            <div className="mt-2">
              <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/50 mb-3 flex items-center gap-2">
                <IconAward className="w-4 h-4" aria-hidden="true" /> Highlights
              </h4>
              <ul className="space-y-2">
                {currentEdu.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span 
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 shadow-[0_0_8px_var(--color-primary)]" 
                        aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      {/* 3. Floating Control Deck - Mobile Optimized */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-6 bg-background/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-full px-4 py-2 z-30 w-[90%] md:w-auto justify-between md:justify-center">
        <button 
          type="button" 
          onClick={prevSlide}
          className="p-2 md:p-3 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors group"
          aria-label="Previous Education"
        >
          <IconChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>

        {/* Hide dots on very small screens if needed, or keep them compact */}
        <div className="flex gap-2" role="tablist">
          {data.map((edu, idx) => (
            <button
              key={idx} 
              type="button" 
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex 
                ? "w-6 md:w-8 bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" 
                : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
              }`}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`View ${edu.degree} at ${edu.institution}`}
            />
          ))}
        </div>

        <button 
          type="button" 
          onClick={nextSlide}
          className="p-2 md:p-3 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors group"
          aria-label="Next Education"
        >
          <IconChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>

    </div>
  );
}