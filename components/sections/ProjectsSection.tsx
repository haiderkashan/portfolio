import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { ProjectStack } from "@/components/ProjectStack";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

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

const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(order asc)[0...6]{
    title,
    slug,
    tagline,
    category,
    liveUrl,
    githubUrl,
    coverImage,
    technologies[]->{name, category, color}
  }
`);

export async function ProjectsSection() {
  const { data: projectsData } = await sanityFetch({ query: PROJECTS_QUERY });
  const projects = projectsData as Project[];

  if (!projects || projects.length === 0) {
    return null;
  }

  // --- SEO: Generate JSON-LD for Software Projects ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareSourceCode",
        "name": project.title,
        "description": project.tagline,
        "programmingLanguage": project.technologies?.map(t => t.name) || [],
        "codeRepository": project.githubUrl,
        "url": project.liveUrl
      }
    }))
  };

  return (
    <section 
      id="projects" 
      aria-labelledby="projects-heading"
      // FIX: Consistent Spacing (Mobile 48px / Desktop 96px)
      className="py-12 md:py-24 px-6 relative bg-background"
    >
      {/* SEO: Inject JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="container mx-auto">
        
        {/* SEMANTIC HEADER */}
        {/* FIX: Consistent bottom margin (mb-10 mobile / mb-16 desktop) */}
        <header className="text-center mb-10 md:mb-16 space-y-4">
          
          {/* 1. Title: Blur In */}
          <ScrollAnimation variant="blurIn">
            <h2 
                id="projects-heading"
                className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
            >
                Featured <span className="text-[var(--color-primary)]">Work</span>
            </h2>
          </ScrollAnimation>
          
          {/* 2. Decoration: Scale Up */}
          <ScrollAnimation variant="scaleUp" delay={0.2}>
            <div 
                className="h-1.5 w-24 bg-[var(--color-accent)] mx-auto rounded-full" 
                role="presentation"
            />
          </ScrollAnimation>
          
          {/* 3. Subtitle: Slide Up */}
          <ScrollAnimation variant="fadeUp" delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto pt-4">
                A selection of projects that define my technical journey.
            </p>
          </ScrollAnimation>
        </header>

        {/* 4. The Stack: Fade Up */}
        <ScrollAnimation variant="fadeUp" delay={0.4}>
            <ProjectStack data={projects} />
        </ScrollAnimation>
        
      </div>
    </section>
  );
}