import React from "react";
import Link from "next/link";
import { IconArrowLeft, IconMail } from "@tabler/icons-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";

const PRIVACY_DATA_QUERY = `{
  "profile": *[_id == "singleton-profile"][0]{ email, firstName, lastName },
  "settings": *[_type == "siteSettings"][0]{ favicon, siteName }
}`;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await client.fetch(PRIVACY_DATA_QUERY);
  const faviconUrl = settings?.favicon 
    ? urlFor(settings.favicon).width(32).height(32).url() 
    : '/favicon.ico';
  const siteName = settings?.siteName || "Kashan Haider";

  return {
    title: "Privacy Policy | Kashan Haider",
    description: "Transparency about how we collect, use, and protect your data.",
    icons: {
      icon: faviconUrl,
    },
    // SEO: Prevents duplicate content issues
    alternates: {
      canonical: "/privacy-policy",
    },
    // Social Sharing
    openGraph: {
      title: "Privacy Policy",
      description: "Read about our data protection practices.",
      type: "website",
      siteName: siteName,
    },
  };
}

// …all your imports and metadata logic stay the same…

export default async function PrivacyPolicyPage() {
  const { profile } = await client.fetch(PRIVACY_DATA_QUERY);

  const contactEmail = profile?.email || "kashanhaider0209@gmail.com";
  const fullName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName}`
    : "Kashan Haider";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Privacy Policy",
    url: "https://kashanhaider.com/privacy-policy",
    publisher: {
      "@type": "Person",
      name: fullName,
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="container mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-primary)] transition-colors mb-8 group"
          aria-label="Return to homepage"
        >
          <IconArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          Back to Home
        </Link>

        <header className="mb-12 border-b border-border/50 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Privacy <span className="text-[var(--color-primary)]">Policy</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Transparency about how we handle your data.
          </p>
        </header>

        <article className="space-y-12 text-muted-foreground leading-relaxed">
          <section aria-labelledby="intro-heading">
            <h2
              id="intro-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>{fullName}&apos;s Portfolio</strong> (“we,” “our,”
              or “us”). We are committed to protecting your personal information and
              your right to privacy. If you have any questions or concerns about this
              policy, please contact us using the details below.
            </p>
            <p className="mt-4">
              This Privacy Policy explains how we collect, use, and protect your
              information when you visit our website.
            </p>
          </section>

          <section aria-labelledby="collection-heading">
            <h2
              id="collection-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We collect personal information that you voluntarily provide when you
              contact us through the website, such as via the contact form or email.
            </p>
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                A. Personal Data Provided by You
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong>Contact Data:</strong> Your name and email address when you
                  submit the contact form.
                </li>
                <li>
                  <strong>Message Content:</strong> Any information you choose to
                  include in your message.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="usage-heading">
            <h2
              id="usage-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              3. How We Use Your Information
            </h2>
            <p>
              We use the personal information collected through this website only
              for legitimate purposes, including:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 ml-2">
              <li>To respond to your inquiries and messages.</li>
              <li>To provide support or information you request.</li>
              <li>To improve the content and usability of the website.</li>
            </ul>
          </section>

          <section aria-labelledby="technology-heading">
            <h2
              id="technology-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              4. Technology & Third-Party Services
            </h2>
            <p className="mb-4">
              We may use third-party tools to help operate and improve the website:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-5 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                <h4 className="font-semibold text-foreground mb-2">
                  Google Analytics
                </h4>
                <p className="text-sm">
                  We use Google Analytics to understand how visitors use our
                  website. Google Analytics collects data using cookies. This data
                  is used to generate reports about website usage.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/10">
                <h4 className="font-semibold text-foreground mb-2">Sanity.io</h4>
                <p className="text-sm">
                  Our content is managed using Sanity.io. They host website content
                  but do not access personal data submitted through the contact
                  form.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10">
                <h4 className="font-semibold text-foreground mb-2">Vercel</h4>
                <p className="text-sm">
                  This website is hosted on Vercel. Vercel may collect anonymous
                  usage data for performance and security purposes.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="cookies-heading">
            <h2
              id="cookies-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              5. Cookies and Tracking Technologies
            </h2>
            <p>
              We may use cookies and similar technologies to analyze website
              traffic and improve user experience. You can control cookies through
              your browser settings.
            </p>
          </section>

          <section aria-labelledby="rights-heading">
            <h2
              id="rights-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              6. Your Privacy Rights
            </h2>
            <p>
              Depending on your location, you may have rights under applicable data
              protection laws, including the right to access, correct, or delete
              your personal data, and to request restrictions on how it is used.
            </p>
          </section>

          <section aria-labelledby="retention-heading">
            <h2
              id="retention-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              7. Data Retention
            </h2>
            <p>
              We retain personal data only as long as necessary to respond to your
              inquiry or fulfill the purpose for which it was collected, unless a
              longer retention period is required by law.
            </p>
          </section>

          <section aria-labelledby="contact-heading">
            <h2
              id="contact-heading"
              className="text-2xl font-semibold text-foreground mb-4"
            >
              8. Contact Us
            </h2>
            <p className="mb-6">
              If you have questions or concerns about this Privacy Policy, feel
              free to reach out.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-muted/30 border border-border/50 hover:border-[var(--color-primary)]/50 transition-all duration-300 group"
              aria-label={`Email us at ${contactEmail}`}
            >
              <div className="p-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                <IconMail className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {contactEmail}
              </span>
            </a>
          </section>
        </article>
      </div>
    </main>
  );
}
