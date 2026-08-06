import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

import { urlFor } from "@/sanity/lib/image";

// --- Types ---
interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

interface SettingsProps {
  showBlog?: boolean;
  showServices?: boolean;
  showTestimonials?: boolean;
  showAchievements?: boolean;
  showExperience?: boolean;
  showEducation?: boolean;
  showSkills?: boolean;
  showCertifications?: boolean;
  showProjects?: boolean;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroBackgroundImage?: SanityImage;
  mainCtaText?: string;
  mainCtaUrl?: string;
  siteLogo?: SanityImage;
  footer?: {
    text?: string;
    copyrightText?: string;
    links?: { url: string; title: string; type: string }[];
  };
}

interface PortfolioContentProps {
  settings: SettingsProps;
  socialLinks?: Record<string, string>;
}

export function PortfolioContent({ settings, socialLinks }: PortfolioContentProps) {
  const {
    showBlog,
    showServices,
    showTestimonials,
    showAchievements,
    // Defaulting to true ensures sections show up if Sanity fields are empty/new
    showExperience = true,
    showEducation = true,
    showSkills = true,
    showCertifications = true,
    showProjects = true,

    heroHeadline,
    heroSubheadline,
    heroBackgroundImage,
    mainCtaText,
    mainCtaUrl,
    siteLogo,
    footer,
  } = settings || {};

  // Cleanly derive the Background URL
  const heroBgUrl = heroBackgroundImage
    ? urlFor(heroBackgroundImage).url()
    : undefined;

  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection
        headline={heroHeadline}
        subheadline={heroSubheadline}
        ctaText={mainCtaText}
        ctaUrl={mainCtaUrl}
        bgImageUrl={heroBgUrl}
      />

      {/* 2. ABOUT SECTION */}
      <AboutSection />

      {/* 3. DYNAMIC SECTIONS (Controlled by Sanity Toggles) */}

      {showSkills && (
        <SkillsSection />
      )}

      {/* SKILLS MARQUEE - Visual break */}
      {showSkills && (
        <SkillsMarquee />
      )}

      {showExperience && (
        <ExperienceSection />
      )}

      {showProjects && (
        <ProjectsSection />
      )}

      {showServices && (
        <ServicesSection />
      )}

      {showTestimonials && (
        <TestimonialsSection />
      )}

      {showEducation && (
        <EducationSection />
      )}

      {showCertifications && (
        <CertificationsSection />
      )}

      {showAchievements && (
        <AchievementsSection />
      )}

      {showBlog && (
        <BlogSection />
      )}

      {/* 4. CONTACT & FOOTER */}
      <ContactSection />

      <Footer
        footerData={footer}
        socialLinks={socialLinks}
        logo={siteLogo} // Passed logo here in case you want to use it in the footer
      />
    </>
  );
}

export default PortfolioContent;