"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconBriefcase, 
  IconMapPin,
  IconExternalLink,
  IconCode
} from "@tabler/icons-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { PortableTextBlock } from "next-sanity";

interface Technology {
  name: string;
  category?: string;
}

interface Experience {
  company: string;
  position: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: PortableTextBlock[];
  responsibilities?: string[];
  achievements?: string[];
  technologies?: Technology[];
  companyLogo?: SanityImageSource;
  companyWebsite?: string;
}

export function ExperienceCarousel({ data }: { data: Experience[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const currentExp = data[currentIndex];
  if (!currentExp) return null; 

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  // Safe year extraction
  const dateObj = new Date(currentExp.startDate);
  const startYear = isNaN(dateObj.getTime()) ? "" : dateObj.getFullYear();

  return (
    <div 
        className="relative w-full max-w-6xl mx-auto px-4 md:px-12 py-16"
        role="region"
        aria-label="Work History Carousel"
    >
      
      {/* 1. Ambient Background Glow - Hidden from A11y */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-[var(--color-primary)]/20 via-transparent to-[var(--color-accent)]/10 blur-[90px] rounded-full -z-10 opacity-50 pointer-events-none" 
        aria-hidden="true"
      />

      {/* --- The Glass Card --- */}
      {/* SEMANTIC TAG: Using <article> for the job card */}
      <article 
        className="relative bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col md:flex-row group"
        aria-live="polite" // Announces content changes to screen readers
        aria-atomic="true"
      >
        
        {/* 2. Watermark - Decorative */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] font-black text-foreground/5 leading-none select-none z-0 pointer-events-none transition-transform duration-700 group-hover:scale-110"
            aria-hidden="true"
        >
          {startYear}
        </div>

        {/* Left Side: Logo/Visual */}
        <div className="md:w-[30%] bg-muted/40 border-r border-white/10 dark:border-white/5 flex flex-col items-center justify-center p-8 text-center relative z-10">
          
          {/* ICON CONTAINER */}
          <div className="relative w-28 h-28 bg-background/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            {currentExp.companyLogo ? (
              <div className="relative w-full h-full">
                <Image 
                  src={urlFor(currentExp.companyLogo).url()} 
                  alt={`${currentExp.company} logo`} 
                  fill 
                  className="object-contain" 
                />
              </div>
            ) : (
              <IconBriefcase className="w-12 h-12 text-muted-foreground/50" aria-hidden="true" />
            )}
          </div>
          
          <h3 className="text-xl font-bold text-foreground">{currentExp.company}</h3>
          
          {currentExp.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <IconMapPin className="w-4 h-4" aria-hidden="true" />
                <span>{currentExp.location}</span>
            </div>
          )}
          
          {currentExp.companyWebsite && (
            <Link 
              href={currentExp.companyWebsite}
              target="_blank"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:text-foreground transition-colors"
              aria-label={`Visit ${currentExp.company} website`}
            >
              Visit Website <IconExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
          
          {/* Top Meta Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
               currentExp.current 
               ? "bg-green-500/10 text-green-500 border-green-500/20" 
               : "bg-foreground/5 text-muted-foreground border-foreground/10"
            }`}>
               {/* SEMANTIC DATE: Using <time> tag */}
               <time dateTime={currentExp.startDate}>{formatDate(currentExp.startDate)}</time> 
               — 
               {currentExp.current ? "Present" : <time dateTime={currentExp.endDate || ""}>{formatDate(currentExp.endDate || "")}</time>}
            </div>
            
            {currentExp.employmentType && (
              <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                {currentExp.employmentType}
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            {currentExp.position}
          </h2>

          {/* Responsibilities */}
          <div className="flex-1 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent mb-8">
            {currentExp.responsibilities && currentExp.responsibilities.length > 0 ? (
                <ul className="space-y-3">
                    {currentExp.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span 
                            className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 shadow-[0_0_8px_var(--color-primary)]" 
                            aria-hidden="true"
                        />
                        {item}
                    </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground italic">No detailed responsibilities listed.</p>
            )}
          </div>

          {/* Technologies Footer */}
          {currentExp.technologies && currentExp.technologies.length > 0 && (
            <div className="mt-auto border-t border-border/50 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-3 flex items-center gap-2">
                <IconCode className="w-4 h-4" aria-hidden="true" /> Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentExp.technologies.map((tech) => (
                  <span 
                    key={tech.name} 
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-foreground/5 text-muted-foreground border border-foreground/10"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* 3. Floating Control Deck */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-background/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-full px-4 py-2 z-30">
        
        {/* PREV BUTTON */}
        <button 
          type="button" 
          onClick={prevSlide}
          className="p-3 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors group"
          aria-label="Previous Experience"
        >
          <IconChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>

        {/* DOTS */}
        <div className="flex gap-2.5" role="tablist">
          {data.map((exp, idx) => (
            <button
              key={exp.company + idx}
              type="button" 
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex 
                ? "w-8 bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" 
                : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
              }`}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`View experience at ${exp.company}`}
            />
          ))}
        </div>

        {/* NEXT BUTTON */}
        <button 
          type="button" 
          onClick={nextSlide}
          className="p-3 rounded-full hover:bg-foreground/10 hover:text-[var(--color-primary)] transition-colors group"
          aria-label="Next Experience"
        >
          <IconChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>

      </div>

    </div>
  );
}