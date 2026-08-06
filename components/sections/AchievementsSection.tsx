import { 
  IconExternalLink, 
  IconTrophy, 
  IconCalendar, 
  IconAward, 
  IconMicrophone, 
  IconBook, 
  IconCode
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// 1. Import Animation
import { ScrollAnimation } from "@/components/ScrollAnimation";

interface Achievement {
  title: string;
  type?: "award" | "hackathon" | "publication" | "speaking" | "open-source" | "milestone" | "recognition" | "other";
  issuer?: string;
  date: string;
  description?: string;
  image?: SanityImageSource;
  url?: string;
  featured: boolean;
  order?: number;
}

const ACHIEVEMENTS_QUERY = defineQuery(`
  *[_type == "achievement"] | order(date desc){
    title,
    type,
    issuer,
    date,
    description,
    image,
    url,
    featured,
    order
  }
`);

export async function AchievementsSection() {
  const { data: achievements } = (await sanityFetch({ query: ACHIEVEMENTS_QUERY })) as { data: Achievement[] };

  if (!achievements || achievements.length === 0) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const getTypeIcon = (type: string | undefined) => {
    switch (type) {
      case "hackathon": return <IconCode className="w-4 h-4" aria-hidden="true" />;
      case "speaking": return <IconMicrophone className="w-4 h-4" aria-hidden="true" />;
      case "publication": return <IconBook className="w-4 h-4" aria-hidden="true" />;
      case "award": return <IconTrophy className="w-4 h-4" aria-hidden="true" />;
      default: return <IconAward className="w-4 h-4" aria-hidden="true" />;
    }
  };

  const featured = achievements.filter((a) => a.featured);
  const regular = achievements.filter((a) => !a.featured);

  return (
    <section 
      id="achievements" 
      // FIX: Consistent Spacing (Mobile 48px / Desktop 96px)
      className="py-12 md:py-24 px-6 relative bg-background"
      aria-labelledby="achievements-heading"
    >
      
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-5xl">
        
        {/* Main Header */}
        <header className="text-center mb-10 md:mb-16 space-y-4">
          <ScrollAnimation variant="blurIn">
            <h2 
                id="achievements-heading" 
                className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
            >
                Achievements & <span className="text-[var(--color-primary)]">Awards</span>
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation variant="scaleUp" delay={0.2}>
            <div className="h-1.5 w-20 bg-[var(--color-accent)] mx-auto rounded-full" role="presentation" />
          </ScrollAnimation>
          
          <ScrollAnimation variant="fadeUp" delay={0.3}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto pt-2">
                Key milestones, hackathon wins, and recognitions.
            </p>
          </ScrollAnimation>
        </header>

        {/* --- 1. FEATURED SECTION --- */}
        {featured.length > 0 && (
          <div className="mb-20">
            <ScrollAnimation variant="fadeUp" delay={0.2}>
                <div className="flex items-center gap-3 mb-8 border-b border-border/40 pb-4">
                    <div className="p-2 bg-yellow-500/10 rounded-full">
                        <IconTrophy className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Featured Highlights</h3>
                </div>
            </ScrollAnimation>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 list-none m-0 p-0">
              {featured.map((achievement, index) => (
                <li key={achievement.title} className="h-full">
                  {/* Wrapper Animation: Staggered Scale Up */}
                  <ScrollAnimation 
                    variant="scaleUp" 
                    delay={index * 0.1}
                    className="h-full"
                  >
                      <article 
                        className="group relative flex flex-col p-8 rounded-3xl border border-[var(--color-primary)]/20 bg-card/40 backdrop-blur-xl shadow-xl shadow-[var(--color-primary)]/5 hover:shadow-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
                        itemScope 
                        itemType="http://schema.org/Award"
                      >
                        {/* Subtle Top Gradient Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />

                        {/* Image Area */}
                        {achievement.image && (
                          <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden shadow-md">
                              <Image 
                                src={urlFor(achievement.image).width(600).height(300).url()} 
                                alt={`Award badge for ${achievement.title}`} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              {/* Floating Type Badge */}
                              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-foreground border border-white/10 shadow-sm flex items-center gap-1.5">
                                {getTypeIcon(achievement.type)}
                                {achievement.type}
                              </div>
                          </div>
                        )}

                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)]">
                                <IconCalendar className="w-3.5 h-3.5" aria-hidden="true" />
                                <time dateTime={achievement.date}>{formatDate(achievement.date)}</time>
                            </div>

                            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-[var(--color-primary)] transition-colors" itemProp="name">
                              {achievement.title}
                            </h3>

                            {achievement.issuer && (
                              <p className="text-sm font-medium text-muted-foreground mb-4" itemProp="publisher">
                                Issued by <span className="text-foreground">{achievement.issuer}</span>
                              </p>
                            )}

                            {achievement.description && (
                              <p className="text-base text-muted-foreground leading-relaxed line-clamp-3 mb-6" itemProp="description">
                                {achievement.description}
                              </p>
                            )}

                            {achievement.url && (
                              <div className="mt-auto">
                                <Link
                                  href={achievement.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all"
                                  aria-label={`View details for ${achievement.title}`}
                                >
                                  View Details <IconExternalLink className="w-4 h-4" aria-hidden="true" />
                                </Link>
                              </div>
                            )}
                        </div>
                      </article>
                  </ScrollAnimation>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- 2. REGULAR SECTION --- */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
                <ScrollAnimation variant="fadeUp" delay={0.2}>
                    <div className="flex items-center gap-3 mb-8 border-b border-border/40 pb-4">
                        <div className="p-2 bg-muted rounded-full">
                            <IconAward className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">More Achievements</h3>
                    </div>
                </ScrollAnimation>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none m-0 p-0">
              {regular.map((achievement, index) => (
                <li key={achievement.title} className="h-full">
                  {/* Wrapper Animation: Staggered Fade Up */}
                  <ScrollAnimation 
                    variant="fadeUp" 
                    delay={index * 0.1}
                    className="h-full"
                  >
                      <article 
                        className="group relative flex flex-col p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-card/50 hover:border-[var(--color-primary)]/30 transition-all duration-300 h-full"
                        itemScope 
                        itemType="http://schema.org/Award"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-colors">
                            {getTypeIcon(achievement.type)}
                          </div>
                          <time className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded" dateTime={achievement.date}>
                            {formatDate(achievement.date)}
                          </time>
                        </div>

                        <h4 className="text-lg font-bold text-foreground mb-1 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors" itemProp="name">
                          {achievement.title}
                        </h4>

                        {achievement.issuer && (
                          <p className="text-xs font-medium text-[var(--color-secondary)] mb-3" itemProp="publisher">
                            {achievement.issuer}
                          </p>
                        )}

                        {achievement.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4" itemProp="description">
                            {achievement.description}
                          </p>
                        )}

                        {achievement.url && (
                          <div className="mt-auto pt-3 border-t border-border/30">
                            <Link
                              href={achievement.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-[var(--color-primary)] transition-colors"
                              aria-label={`Verify achievement: ${achievement.title}`}
                            >
                              Verify <IconExternalLink className="w-3 h-3" aria-hidden="true" />
                            </Link>
                          </div>
                        )}
                      </article>
                  </ScrollAnimation>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </section>
  );
}