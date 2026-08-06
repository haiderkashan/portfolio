import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// 1. Import the animation component
import { ScrollAnimation } from "@/components/ScrollAnimation";

// Define Interface matching schema
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

const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && featured == true] | order(order asc){
    name,
    position,
    company,
    testimonial,
    rating,
    date,
    avatar,
    companyLogo,
    linkedinUrl
  }
`);

export async function TestimonialsSection() {
  const { data: testimonialsData } = await sanityFetch({
    query: TESTIMONIALS_QUERY,
  });

  const testimonials = testimonialsData as Testimonial[];

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section 
      id="testimonials" 
      aria-labelledby="testimonials-heading"
      // FIX APPLIED HERE:
      // Mobile: py-12 (48px)
      // Desktop: md:py-24 (96px)
      className="py-12 md:py-24 px-6 relative bg-background"
    >
      <div className="container mx-auto">
        
        {/* SEMANTIC HEADER */}
        <header className="text-center mb-10 md:mb-16 space-y-4">
          
          {/* 1. Title: Blur In */}
          <ScrollAnimation variant="blurIn">
            <h2 
                id="testimonials-heading"
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
                Client <span className="text-[var(--color-primary)]">Testimonials</span>
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
                Feedback from teams and clients I&apos;ve collaborated with.
            </p>
          </ScrollAnimation>
        </header>

        {/* 4. Carousel: Fade Up */}
        <ScrollAnimation variant="fadeUp" delay={0.4}>
            <TestimonialCarousel data={testimonials} />
        </ScrollAnimation>
        
      </div>
    </section>
  );
}