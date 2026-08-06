import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { CometCard } from "@/components/ui/comet-card";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// 1. Import Animation
import { ScrollAnimation } from "@/components/ScrollAnimation";

// --- INTERFACES ---
interface Skill {
  name: string;
  category?: string;
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  logo?: SanityImageSource;
  description?: string;
  skills?: Skill[];
  order?: number;
}

// --- QUERY ---
const CERTIFICATIONS_QUERY = defineQuery(`
  *[_type == "certification"] | order(issueDate desc){
    name,
    issuer,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    logo,
    description,
    skills[]->{name, category},
    order
  }
`);

export async function CertificationsSection() {
  const { data: certificationsData } = await sanityFetch({
    query: CERTIFICATIONS_QUERY,
  });

  const certifications = certificationsData as Certification[];

  if (!certifications || certifications.length === 0) {
    return null;
  }

  // Helper: Format Date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper: Check Expiry
  const isExpired = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <section
      id="certifications"
      aria-labelledby="certs-heading"
      // FIX: Consistent Spacing (Mobile 48px / Desktop 96px)
      className="py-12 md:py-24 px-6 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="container mx-auto max-w-6xl">
        
        {/* SEMANTIC HEADER */}
        <header className="text-center mb-10 md:mb-16">
          <ScrollAnimation variant="blurIn">
            <h2 
                id="certs-heading" 
                className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]"
            >
                Certifications
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation variant="scaleUp" delay={0.2}>
            <div className="h-1 w-20 bg-[var(--color-accent)] mx-auto rounded-full mb-6" role="presentation" />
          </ScrollAnimation>
          
          <ScrollAnimation variant="fadeUp" delay={0.3}>
            <p className="text-xl text-muted-foreground">
                Professional credentials and certifications
            </p>
          </ScrollAnimation>
        </header>

        <div className="@container">
          {/* SEMANTIC LIST */}
          <ul className="grid grid-cols-1 @2xl:grid-cols-2 gap-10 list-none p-0 m-0">
            {certifications.map((cert: Certification, index: number) => (
              <li key={`${cert.issuer}-${cert.name}-${cert.issueDate}`} className="h-full">
                {/* Wrapper Animation: Staggered Scale Up */}
                <ScrollAnimation 
                    variant="scaleUp" 
                    delay={index * 0.1} // Stagger: 0s, 0.1s, 0.2s...
                    className="h-full w-full"
                >
                    <CometCard
                    rotateDepth={8}
                    translateDepth={10}
                    className="w-full h-full"
                    >
                    <article
                        className="relative bg-card border-8 border-card/80 rounded-sm shadow-2xl p-4 h-full"
                        style={{ transformStyle: "preserve-3d" }}
                        // SCHEMA.ORG: EducationalOccupationalCredential
                        itemScope
                        itemType="http://schema.org/EducationalOccupationalCredential"
                    >
                        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border-2 border-yellow-600/40 p-8 flex flex-col min-h-[450px] h-full">
                        
                        {/* Decorative Corners - Hidden from Screen Readers */}
                        <div className="absolute top-0 left-0 w-20 h-20" aria-hidden="true">
                            <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-yellow-600/60" />
                        </div>
                        <div className="absolute top-0 right-0 w-20 h-20" aria-hidden="true">
                            <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-yellow-600/60" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-20 h-20" aria-hidden="true">
                            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-yellow-600/60" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-20 h-20" aria-hidden="true">
                            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-yellow-600/60" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center flex-1">
                            
                            {/* Issue Date */}
                            <div className="mb-4">
                            <time 
                                dateTime={cert.issueDate} 
                                className="text-xs text-zinc-400"
                                itemProp="dateCreated"
                            >
                                {cert.issueDate && formatDate(cert.issueDate)}
                            </time>
                            </div>

                            {/* Certificate Label */}
                            <div className="mb-5">
                            <p className="text-lg font-bold text-yellow-600/80 mb-1 uppercase tracking-wide" aria-hidden="true">
                                CERTIFICATE
                            </p>
                            <p className="text-xs text-yellow-600/80 italic" aria-hidden="true">for</p>
                            <span className="sr-only">Certificate for</span>
                            </div>

                            {/* Title */}
                            <h3 
                            className="text-3xl font-bold text-white mb-6 leading-tight px-4"
                            itemProp="name"
                            >
                            {cert.name}
                            </h3>

                            {/* Description */}
                            {cert.description && (
                            <p 
                                className="text-sm text-zinc-300/80 mb-5 line-clamp-3 px-8 leading-relaxed"
                                itemProp="description"
                            >
                                {cert.description}
                            </p>
                            )}

                            {/* Logo */}
                            {cert.logo && (
                            <div className="relative mb-5 flex items-center justify-center">
                                <div className="relative w-16 h-16 p-2 bg-white/10 rounded-full border border-yellow-600/30">
                                <div className="relative w-full h-full">
                                    <Image
                                    src={urlFor(cert.logo).width(64).height(64).url()}
                                    alt={`${cert.issuer} logo`}
                                    fill
                                    className="object-contain"
                                    />
                                </div>
                                </div>
                            </div>
                            )}

                            {/* Issuer */}
                            <div 
                            className="mb-4" 
                            itemProp="recognizedBy" 
                            itemScope 
                            itemType="http://schema.org/Organization"
                            >
                            <p className="text-lg font-semibold text-white" itemProp="name">
                                {cert.issuer}
                            </p>
                            </div>

                            <div className="flex-1 flex flex-col justify-end w-full mt-auto">
                            
                            {/* Skills List */}
                            {cert.skills && cert.skills.length > 0 && (
                                <div className="mb-4">
                                <ul className="flex flex-wrap justify-center gap-1.5 list-none p-0">
                                    {cert.skills.slice(0, 4).map((skill: Skill, idx: number) => (
                                    <li key={`${cert.name}-skill-${idx}`}>
                                        <span className="px-2.5 py-1 text-[10px] bg-yellow-600/20 text-yellow-500 font-medium border border-yellow-600/30 rounded-sm">
                                        {skill.name}
                                        </span>
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            )}

                            {/* Metadata: Expiry & ID */}
                            <div className="space-y-2 text-xs mb-4">
                                {cert.expiryDate && (
                                <div className="text-center">
                                    <span className="text-zinc-400">Valid Until: </span>
                                    <time 
                                    dateTime={cert.expiryDate}
                                    className={
                                        isExpired(cert.expiryDate)
                                        ? "text-red-400 font-semibold"
                                        : "text-zinc-300 font-semibold"
                                    }
                                    >
                                    {formatDate(cert.expiryDate)}
                                    {isExpired(cert.expiryDate) && " (Expired)"}
                                    </time>
                                </div>
                                )}
                                {cert.credentialId && (
                                <div className="text-center">
                                    <p className="text-[9px] text-zinc-500 mb-1">
                                    Credential ID:
                                    </p>
                                    <p 
                                    className="text-[9px] font-mono text-zinc-400 break-all px-4"
                                    itemProp="identifier"
                                    >
                                    {cert.credentialId}
                                    </p>
                                </div>
                                )}
                            </div>

                            {/* Verify Link */}
                            {cert.credentialUrl && (
                                <div className="w-full pt-4 border-t border-yellow-600/20">
                                <Link
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-zinc-900 bg-yellow-600/90 hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg rounded-sm"
                                    aria-label={`Verify ${cert.name} credential from ${cert.issuer}`}
                                    itemProp="url"
                                >
                                    Verify Credential
                                    <IconExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                                </Link>
                                </div>
                            )}
                            </div>
                        </div>
                        </div>
                    </article>
                    </CometCard>
                </ScrollAnimation>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}