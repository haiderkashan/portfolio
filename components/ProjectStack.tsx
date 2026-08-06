"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IconBrandGithub, IconCode, IconArrowUpRight } from "@tabler/icons-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ZoomToFullscreen } from "@/components/animations/ZoomToFullscreen";

interface Technology {
  name: string;
  category?: string;
  color?: string;
}

interface Project {
  title: string;
  slug: { current: string };
  tagline?: string;
  category?: string;
  liveUrl?: string;
  githubUrl?: string;
  coverImage?: SanityImageSource;
  technologies?: Technology[];
}

export function ProjectStack({ data }: { data: Project[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-24 md:pb-40">
      {/* Added gap-16 for mobile so cards have space between them when not stacked */}
      <div className="flex flex-col gap-16 md:gap-24 relative">
        {data.map((project, index) => {

          return (
            <div
              key={project.slug.current}
              // 1. MOBILE: 'relative top-0' (Normal scroll flow)
              // 2. DESKTOP: 'md:sticky' (Stacking effect)
              // 3. OFFSET: 'md:top-[var(--sticky-top)]' applies the calc only on desktop
              className="relative top-0 md:sticky transition-all duration-500"
              style={{
                '--sticky-top': `calc(${80 + index * 10}px + 5vh)`,
                zIndex: index + 1
              } as React.CSSProperties}
            >
              {/* Wrapper with zoom animation */}
              <ZoomToFullscreen className="w-full" triggerPoint={0.5}>
                <div className="md:top-[var(--sticky-top)]">

                  <div
                    className="relative bg-card/90 backdrop-blur-3xl border border-white/10 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden min-h-[450px] flex flex-col md:flex-row group hover:shadow-[0_0_40px_-10px_var(--color-primary)]/30 transition-all duration-500"
                  >

                    {/* Watermark Number */}
                    <div
                      className="absolute -top-2 -right-2 text-[6rem] md:text-[9rem] font-black leading-none select-none z-0 pointer-events-none opacity-[0.03]"
                      style={{ WebkitTextStroke: '2px currentColor' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Left Side: Content */}
                    <div className="flex-1 p-6 md:p-10 pb-10 flex flex-col justify-center relative z-10 order-2 md:order-1">

                      {/* Category Badge */}
                      <div className="flex items-center gap-3 mb-4">
                        {project.category && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-[0_0_10px_var(--color-primary)]/20">
                            {project.category}
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-md">
                        {project.tagline}
                      </p>

                      {/* Tech Stack Pills */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-8">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 5).map((tech, idx) => (
                              <span
                                key={idx}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/50 border border-white/5 text-xs font-semibold text-muted-foreground hover:border-[var(--color-primary)]/30 hover:text-foreground transition-colors cursor-default"
                              >
                                {tech.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4 mt-auto">
                        {project.liveUrl && (
                          <Link
                            href={project.liveUrl}
                            target="_blank"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-[var(--color-primary)]/90 transition-all hover:scale-105 shadow-[0_0_20px_var(--color-primary)]/40 hover:shadow-[0_0_30px_var(--color-primary)]/60"
                          >
                            Live Demo <IconArrowUpRight className="w-4 h-4" />
                          </Link>
                        )}
                        {project.githubUrl && (
                          <Link
                            href={project.githubUrl}
                            target="_blank"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-muted/40 border border-white/10 text-foreground font-bold text-sm hover:bg-foreground hover:text-background transition-colors"
                          >
                            Source Code <IconBrandGithub className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Image Cover */}
                    <div className="md:w-[50%] relative h-[220px] md:h-auto overflow-hidden bg-muted order-1 md:order-2">
                      {project.coverImage ? (
                        <div className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                          <Image
                            src={urlFor(project.coverImage).url()}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-l md:from-background md:via-transparent md:to-transparent opacity-90" />
                          <div className="absolute inset-0 bg-[var(--color-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconCode className="w-24 h-24 text-muted-foreground/10" />
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </ZoomToFullscreen>
            </div>
          );
        })}
      </div>
    </div>
  );
}