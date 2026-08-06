import { PortableText } from "@portabletext/react";
import { IconCheck, IconStarFilled, IconClock, IconBriefcase, IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { HorizontalSlide } from "@/components/animations/HorizontalSlide";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { PortableTextBlock } from "next-sanity";

// --- INTERFACES ---
interface Technology {
  name: string;
  category?: string;
}

interface Pricing {
  startingPrice?: number;
  priceType?: "hourly" | "project" | "monthly" | "custom";
  description?: string;
}

interface Service {
  title: string;
  slug: { current: string };
  icon?: SanityImageSource;
  shortDescription?: string;
  fullDescription?: PortableTextBlock[];
  features?: string[];
  technologies?: Technology[];
  deliverables?: string;
  pricing?: Pricing;
  timeline?: string;
  featured: boolean;
  order?: number;
}

const SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(order asc, _createdAt desc){
    title,
    slug,
    icon,
    shortDescription,
    fullDescription,
    features,
    technologies[]->{name, category},
    deliverables,
    pricing,
    timeline,
    featured,
    order
  }
`);

export async function ServicesSection() {
  const { data: servicesData } = await sanityFetch({ query: SERVICES_QUERY });
  const services = servicesData as Service[];

  if (!services || services.length === 0) return null;

  // Helper: Format Price with SEO Schema
  const formatPrice = (pricing: Pricing) => {
    if (!pricing) return null;
    const { startingPrice, priceType } = pricing;

    const priceTypeLabels: Record<string, string> = {
      hourly: "/hr",
      project: " start",
      monthly: "/mo",
      custom: "",
    };

    if (priceType === "custom") {
      return <span className="text-[var(--color-primary)] font-bold text-base">Custom Quote</span>;
    }

    return (
      <div
        className="flex flex-col items-end"
        itemProp="offers"
        itemScope
        itemType="http://schema.org/Offer"
      >
        <meta itemProp="priceCurrency" content="USD" />
        {startingPrice && (
          <span className="text-xl font-bold text-[var(--color-primary)]">
            $<span itemProp="price">{startingPrice.toLocaleString()}</span>
            <span className="text-xs font-medium text-muted-foreground ml-1">
              {priceType && priceTypeLabels[priceType]}
            </span>
          </span>
        )}
      </div>
    );
  };

  const featured = services.filter((s) => s.featured);
  const regular = services.filter((s) => !s.featured);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      // FIX: Consistent Spacing (Mobile 48px / Desktop 96px)
      className="py-12 md:py-24 px-6 relative bg-background overflow-hidden"
    >

      {/* Ambient Glow - Hidden from A11y */}
      <div
        className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] -z-10 rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl">

        {/* SEMANTIC HEADER */}
        <header className="text-center mb-10 md:mb-16 space-y-4">
          <ScrollAnimation variant="blurIn">
            <h2
              id="services-heading"
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              My <span className="text-[var(--color-primary)]">Services</span>
            </h2>
          </ScrollAnimation>

          <ScrollAnimation variant="scaleUp" delay={0.2}>
            <div className="h-1.5 w-20 bg-[var(--color-accent)] mx-auto rounded-full" role="presentation" />
          </ScrollAnimation>

          <ScrollAnimation variant="fadeUp" delay={0.3}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto pt-4">
              Professional solutions tailored to your specific needs.
            </p>
          </ScrollAnimation>
        </header>

        {/* --- 1. FEATURED SERVICES (Compact) --- */}
        {featured.length > 0 && (
          <div className="mb-20">
            {/* Label Animation */}
            <ScrollAnimation variant="fadeUp" delay={0.2}>
              <div className="flex items-center gap-3 mb-8 border-b border-border/40 pb-4">
                <div className="p-2 bg-yellow-500/10 rounded-full">
                  <IconStarFilled className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Featured Packages</h3>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((service, index) => (
                // Wrapper Animation: Horizontal Slide with alternating directions
                <HorizontalSlide
                  key={service.slug?.current || service.title}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.1}
                  className="h-full"
                >
                  <article
                    className="group relative flex flex-col h-full p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl hover:shadow-[0_0_40px_-10px_var(--color-primary)]/20 transition-all duration-500 overflow-hidden"
                    itemScope
                    itemType="http://schema.org/Service"
                  >
                    {/* Gradient Glow - Hidden */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/10 blur-[40px] rounded-full pointer-events-none" aria-hidden="true" />

                    <div className="relative z-10 flex flex-col h-full">

                      {/* Header Row */}
                      <div className="flex justify-between items-start mb-5">
                        {service.icon && (
                          <div className="relative w-12 h-12 p-2.5 bg-background/50 backdrop-blur-md rounded-xl border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                            <Image
                              src={urlFor(service.icon).width(48).height(48).url()}
                              alt=""
                              fill
                              className="object-contain"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        {service.pricing && (
                          <div className="text-right bg-background/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                            {formatPrice(service.pricing)}
                          </div>
                        )}
                      </div>

                      {/* TITLE */}
                      <h3
                        className="text-2xl font-bold mb-2 text-foreground group-hover:text-[var(--color-primary)] transition-colors"
                        itemProp="name"
                      >
                        {service.title}
                      </h3>

                      {/* DESCRIPTION */}
                      {service.shortDescription && (
                        <p
                          className="text-muted-foreground text-base mb-6 leading-relaxed line-clamp-3"
                          itemProp="description"
                        >
                          {service.shortDescription}
                        </p>
                      )}

                      {/* Features List (Compact) */}
                      {service.features && service.features.length > 0 && (
                        <div className="mb-6 p-4 bg-background/40 rounded-xl border border-white/5">
                          <h4 className="font-bold text-[10px] uppercase tracking-widest text-foreground/70 mb-3">
                            Includes:
                          </h4>
                          <ul className="space-y-2">
                            {service.features.slice(0, 4).map((feature) => (
                              <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <IconCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" stroke={2.5} aria-hidden="true" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Metadata Grid (Compact) */}
                      <div className="grid grid-cols-2 gap-3 mb-5 pt-5 border-t border-white/5">
                        {service.timeline && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Timeline</p>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                              <IconClock className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                              {service.timeline}
                            </div>
                          </div>
                        )}
                        {service.deliverables && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Deliverables</p>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground line-clamp-1">
                              <IconBriefcase className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                              {service.deliverables}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tech Stack */}
                      {service.technologies && service.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {service.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech.name}
                              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  </article>
                </HorizontalSlide>
              ))}
            </div>
          </div>
        )}

        {/* --- 2. REGULAR SERVICES --- */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <ScrollAnimation variant="fadeUp" delay={0.3}>
                <div className="flex items-center gap-3 mb-8 border-b border-border/40 pb-4">
                  <div className="p-2 bg-muted rounded-full">
                    <IconBriefcase className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Additional Services</h3>
                </div>
              </ScrollAnimation>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((service, index) => (
                // Wrapper Animation: Staggered Fade Up
                <ScrollAnimation
                  key={service.slug?.current || service.title}
                  variant="fadeUp"
                  delay={index * 0.1}
                  className="h-full"
                >
                  <article
                    className="group relative flex flex-col h-full p-5 rounded-2xl border border-border/50 bg-background/50 hover:bg-card/60 hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-300"
                    itemScope
                    itemType="http://schema.org/Service"
                  >
                    <div className="flex justify-between items-start mb-3">
                      {service.icon && (
                        <div className="relative w-10 h-10 p-2 bg-muted/50 rounded-lg border border-border/50">
                          <Image
                            src={urlFor(service.icon).width(48).height(48).url()}
                            alt=""
                            fill
                            className="object-contain"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <IconArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[var(--color-primary)] group-hover:-rotate-45 transition-all duration-300" aria-hidden="true" />
                    </div>

                    <h3
                      className="text-lg font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors"
                      itemProp="name"
                    >
                      {service.title}
                    </h3>

                    {service.shortDescription && (
                      <p
                        className="text-muted-foreground text-xs mb-4 line-clamp-3 leading-relaxed"
                        itemProp="description"
                      >
                        {service.shortDescription}
                      </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-border/40 flex justify-between items-center">
                      {service.pricing && (
                        <div className="text-xs font-semibold text-foreground">
                          {service.pricing.startingPrice && (
                            <span itemProp="offers" itemScope itemType="http://schema.org/Offer">
                              <meta itemProp="priceCurrency" content="USD" />
                              $<span itemProp="price">{service.pricing.startingPrice.toLocaleString()}</span>+
                            </span>
                          )}
                          {service.pricing.priceType === 'custom' && 'Custom Quote'}
                        </div>
                      )}
                      {service.timeline && (
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <IconClock className="w-3 h-3" aria-hidden="true" />
                          {service.timeline}
                        </div>
                      )}
                    </div>
                  </article>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}