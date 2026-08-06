import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { EducationCarousel } from "@/components/EducationCarousel";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// 1. Import the animation component
import { ScrollAnimation } from "@/components/ScrollAnimation"; 

// Define Interface
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

const EDUCATION_QUERY = defineQuery(`
  *[_type == "education"] | order(endDate desc, startDate desc){
    institution,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    current,
    gpa,
    description,
    achievements,
    logo,
    website,
    order
  }
`);

export async function EducationSection() {
  const { data: educationData } = await sanityFetch({ query: EDUCATION_QUERY });
  const education = educationData as Education[];

  if (!education || education.length === 0) return null;

  return (
    <section 
      id="education" 
      aria-labelledby="education-heading"
      // FIX: Consistent Spacing (Mobile 48px / Desktop 96px)
      // Changed px-4 to px-6 to match other sections
      className="relative py-12 md:py-24 px-6 bg-background/50"
    >
      <div className="container mx-auto">
        
        {/* SEMANTIC HEADER */}
        {/* FIX: Consistent bottom margin (mb-10 mobile / mb-16 desktop) */}
        <header className="text-center mb-10 md:mb-16 space-y-4">
          
          {/* 1. Title: Blur In */}
          <ScrollAnimation variant="blurIn">
            <h2 
                id="education-heading"
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
                My <span className="text-[var(--color-primary)]">Education</span>
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
                The academic foundation behind my technical skills.
            </p>
          </ScrollAnimation>
        </header>

        {/* 4. Carousel Component: Fade Up */}
        <ScrollAnimation variant="fadeUp" delay={0.4}>
            <EducationCarousel data={education} />
        </ScrollAnimation>
        
      </div>
    </section>
  );
}