import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { ExperienceCarousel } from "@/components/ExperienceCarousel";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { PortableTextBlock } from "next-sanity";
// 1. Import the animation component
import { ScrollAnimation } from "@/components/ScrollAnimation";

// Define Interfaces (Used for Fetching)
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

const EXPERIENCE_QUERY = defineQuery(`
  *[_type == "experience"] | order(startDate desc){
    company,
    position,
    employmentType,
    location,
    startDate,
    endDate,
    current,
    description,
    responsibilities,
    achievements,
    technologies[]->{name, category},
    companyLogo,
    companyWebsite
  }
`);

export async function ExperienceSection() {
  // Fetch Data
  const { data: experiencesData } = await sanityFetch({ query: EXPERIENCE_QUERY });
  const experiences = experiencesData as Experience[];

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section 
      id="experience" 
      aria-labelledby="experience-heading"
      // FIX: Consistent Spacing (Mobile 48px / Desktop 96px)
      className="py-12 md:py-24 px-6 relative bg-background/50"
    >
      <div className="container mx-auto">
        
        {/* HEADER WRAPPER */}
        {/* FIX: Consistent bottom margin */}
        <div className="text-center mb-10 md:mb-16 space-y-4">
          
          {/* 1. Title: Blur In */}
          <ScrollAnimation variant="blurIn">
            <h2 
                id="experience-heading"
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
                Work <span className="text-[var(--color-primary)]">Experience</span>
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto pt-4">
                My professional journey and career milestones.
            </p>
          </ScrollAnimation>
        </div>

        {/* The New Interactive Carousel: Fade Up */}
        <ScrollAnimation variant="fadeUp" delay={0.4}>
            <ExperienceCarousel data={experiences} />
        </ScrollAnimation>
        
      </div>
    </section>
  );
}