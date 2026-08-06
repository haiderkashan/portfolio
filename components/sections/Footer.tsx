import Link from "next/link";
import Image from "next/image";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandStackoverflow,
  IconBrandMedium,
  IconCode,
  IconWorld,
  IconArrowUp,
  IconArrowUpRight
} from "@tabler/icons-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/sanity/lib/image";

interface FooterLink {
  title: string;
  url: string;
  _key: string;
}

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  medium?: string;
  devto?: string;
  youtube?: string;
  stackoverflow?: string;
}

interface FooterProps {
  footerData?: {
    text?: string;
    copyrightText?: string;
    links?: FooterLink[];
  };
  socialLinks?: SocialLinks;
  logo?: SanityImageSource;
}

export function Footer({ footerData, socialLinks, logo }: FooterProps) {
  const { copyrightText, links } = footerData || {};

  const renderSocials = () => {
    if (!socialLinks) return null;

    const socialMap = [
      { key: "github", label: "GitHub", icon: IconBrandGithub, url: socialLinks.github },
      { key: "linkedin", label: "LinkedIn", icon: IconBrandLinkedin, url: socialLinks.linkedin },
      { key: "twitter", label: "Twitter", icon: IconBrandTwitter, url: socialLinks.twitter },
      { key: "instagram", label: "Instagram", icon: IconBrandInstagram, url: socialLinks.instagram },
      { key: "youtube", label: "YouTube", icon: IconBrandYoutube, url: socialLinks.youtube },
      { key: "stackoverflow", label: "Stack Overflow", icon: IconBrandStackoverflow, url: socialLinks.stackoverflow },
      { key: "medium", label: "Medium", icon: IconBrandMedium, url: socialLinks.medium },
      { key: "devto", label: "Dev.to", icon: IconCode, url: socialLinks.devto },
      { key: "website", label: "Personal Website", icon: IconWorld, url: socialLinks.website },
    ];

    return (
      <div className="flex items-center gap-4">
        {socialMap.map((item) => {
          if (!item.url) return null;

          const IconComponent = item.icon;
          return (
            <Link
              key={item.key}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[var(--color-primary)] transition-colors duration-200 hover:scale-110 transform"
              aria-label={`Follow on ${item.label}`}
            >
              <IconComponent className="w-5 h-5" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    // FIX: Reduced padding from pb-28 to pb-12.
    // Use pb-24 ONLY on mobile if the dock covers content, but on desktop pb-12 is usually enough.
    <footer className="w-full pt-6 pb-12 md:pb-12 border-t border-border/40 bg-background relative z-10">
      <div className="container mx-auto max-w-6xl px-6">
        
        {/* TOP SECTION: Logo & Sanity Links */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          
          {/* LOGO & NAME */}
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex items-center justify-center gap-2 group" aria-label="Back to Homepage">
              
              {logo && (
                <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-105">
                  <Image
                    src={urlFor(logo).url()} 
                    alt="Kashan Haider Logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 32px, 40px"
                  />
                </div>
              )}

              <span className="text-lg font-bold tracking-tight text-foreground">
                Kashan<span className="text-[var(--color-accent)]"> Haider</span>
              </span>
            </Link>

            {/* DYNAMIC LINKS FROM SANITY */}
            {links && links.length > 0 && (
              <nav 
                className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-1"
                aria-label="Legal"
              >
                {links.map((link, index) => (
                  <div key={link._key} className="flex items-center">
                    <Link
                      href={link.url || "#"}
                      className="text-xs font-medium text-muted-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4"
                    >
                      {link.title}
                    </Link>
                    {index < links.length - 1 && (
                      <span className="ml-4 w-1 h-1 rounded-full bg-muted-foreground/30" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border/40 mb-6" role="presentation" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            {copyrightText || `© ${new Date().getFullYear()} Kashan. All rights reserved.`}
          </p>

          {renderSocials()}
        </div>
      </div>
    </footer>
  );
}