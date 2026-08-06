import { client } from "@/sanity/lib/client"; 
import { urlFor } from "@/sanity/lib/image"; 
import PortfolioContent from "@/components/PortfolioContent";
import { MaintenancePage } from "@/components/MaintenancePage";
import { Metadata } from 'next'; 

// --- INTERFACES ---
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

// --- OPTIMIZED QUERY (COMBINED) ---
// Fetching everything in one go reduces network latency
const HOME_DATA_QUERY = `{
  "settings": *[_type == "siteSettings"][0]{
    siteTitle,
    siteDescription,
    siteKeywords,
    favicon,
    
    ogImage, 

    twitterHandle,
    maintenanceMode,
    maintenanceMessage,

    siteLogo,
    // Toggles & Footer are passed to PortfolioContent
    showBlog, showServices, showTestimonials, showAchievements,
    showExperience, showEducation, showSkills, showCertifications, showProjects,
    footer
  },
  "profile": *[_id == "singleton-profile"][0]{
    socialLinks
  }
}`;

// --- 1. DYNAMIC METADATA ---
export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(HOME_DATA_QUERY);
  const { settings } = data || {};
  
  const { 
    siteTitle = "Kashan Haider", 
    siteDescription = "Full Stack Developer Portfolio", 
    siteKeywords, 
    favicon, 
    // ✅ FIXED: Destructure the correct field
    ogImage, 
    twitterHandle 
  } = settings || {};
  
  const faviconUrl = favicon ? urlFor(favicon).width(32).height(32).url() : '/favicon.ico';
  
  // ✅ FIXED: Use ogImage to generate URL
  const ogImageUrl = ogImage ? urlFor(ogImage).width(1200).height(630).url() : undefined;
  
  return {
    title: siteTitle,
    description: siteDescription,
    keywords: siteKeywords || ["Software Engineer", "Next.js", "React"],
    alternates: {
      canonical: 'https://kashanhaider.com',
    },
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: 'https://kashanhaider.com',
      siteName: siteTitle,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      creator: twitterHandle ? `@${twitterHandle}` : undefined,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots: {
      index: !settings?.maintenanceMode, // Don't index if in maintenance mode
      follow: !settings?.maintenanceMode,
    },
  };
}

// --- 2. MAIN COMPONENT ---
export default async function Home() {
  // Single fetch for all data
  const data = await client.fetch(HOME_DATA_QUERY);
  
  const settings = data?.settings || {};
  const profile = data?.profile || {};
  
  const { 
    maintenanceMode, 
    maintenanceMessage, 
    siteTitle, 
    siteDescription,
    // ✅ FIXED: Destructure correct field
    ogImage
  } = settings;

  // --- MAINTENANCE MODE CHECK ---
  if (maintenanceMode) {
    return (
      <main className="min-h-screen">
        <MaintenancePage message={maintenanceMessage} />
      </main>
    );
  }

  // --- JSON-LD GENERATION ---
  // Extract valid URLs only
  const socialLinksObject = profile.socialLinks || {};
  const sameAsUrls = Object.values(socialLinksObject)
    .filter((url): url is string => typeof url === 'string' && url.length > 0);
  
  // ✅ FIXED: Use ogImage for Schema Markup
  const ogImageSchemaUrl = ogImage 
    ? urlFor(ogImage).width(800).height(800).url() 
    : undefined;

  const SCHEMA_MARKUP = {
    '@context': 'https://schema.org',
    '@type': 'Person', 
    'name': siteTitle || "Kashan Haider",
    'url': 'https://kashanhaider.com',
    'sameAs': sameAsUrls,
    'jobTitle': 'Software Engineer & Web Developer',
    'image': ogImageSchemaUrl,
    'description': siteDescription,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': 'https://kashanhaider.com'
    }
  };
  
  return (
    <main className="min-h-screen">
      {/* SEO: Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_MARKUP).replace(/</g, '\\u003c') }}
      />
      
      <PortfolioContent
        settings={settings}
        socialLinks={profile.socialLinks}
      />
    </main>
  );
}