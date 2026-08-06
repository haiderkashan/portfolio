import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";

import "../globals.css";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SanityLive } from "@/sanity/lib/live";

import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingDock } from "@/components/FloatingDock";
import { ModeToggle } from "@/components/DarkModeToggle";
import { DisableDraftMode } from "@/components/DisableDraftMode";

import { VisualEditing } from "next-sanity/visual-editing";

/* -------------------------------------------------------------------------- */
/* QUERIES                                                                    */
/* -------------------------------------------------------------------------- */

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  primaryColor,
  secondaryColor,
  accentColor,
  googleAnalyticsId,
  facebookPixelId,
  maintenanceMode,
  siteTitle,        
  siteDescription,  
  siteKeywords,     
  favicon,
  ogImage    
}`;

const PROFILE_QUERY = `*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  socialLinks 
}`;

/* -------------------------------------------------------------------------- */
/* FONTS                                                                      */
/* -------------------------------------------------------------------------- */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* -------------------------------------------------------------------------- */
/* VIEWPORT                                                                   */
/* -------------------------------------------------------------------------- */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

/* -------------------------------------------------------------------------- */
/* METADATA GENERATION                                                        */
/* -------------------------------------------------------------------------- */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(SETTINGS_QUERY);

  const title = settings?.siteTitle ?? "Kashan Haider";
  const description =
    settings?.siteDescription ??
    "Full Stack Developer specializing in Next.js and Sanity.";

  const favicon = settings?.favicon
    ? urlFor(settings.favicon).width(32).height(32).url()
    : "/favicon.ico";

  // ✅ FIXED: Updated logic to use 'ogImage'
  const ogImageUrl = settings?.ogImage
    ? urlFor(settings.ogImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .url()
    : null;

  return {
    metadataBase: new URL("https://kashanhaider.com"),

    title: {
      default: title,
      template: `%s | ${title}`,
    },

    description,
    keywords:
      settings?.siteKeywords ??
      ["Software Engineer", "Next.js", "React", "Kashan Haider"],

    icons: {
      icon: favicon,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://kashanhaider.com",
      title,
      description,
      siteName: title,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },

    robots: {
      index: !settings?.maintenanceMode,
      follow: !settings?.maintenanceMode,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                                                */
/* -------------------------------------------------------------------------- */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, profile] = await Promise.all([
    client.fetch(SETTINGS_QUERY),
    client.fetch(PROFILE_QUERY),
  ]);

  const {
    primaryColor = "#000000",
    secondaryColor = "#4b5563",
    accentColor = "#3b82f6",
    googleAnalyticsId,
    maintenanceMode,
  } = settings || {};

  const socialData = profile?.socialLinks || {};
  const sameAsUrls = Object.values(socialData).filter(
    (url): url is string => typeof url === "string" && url.length > 0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteTitle || "Kashan Haider Portfolio",
    url: "https://kashanhaider.com",
    sameAs: sameAsUrls, 
    author: {
      "@type": "Person",
      name: profile?.firstName
        ? `${profile.firstName} ${profile.lastName}`
        : "Kashan Haider",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>

      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            "--color-primary": primaryColor,
            "--color-secondary": secondaryColor,
            "--color-accent": accentColor,
          } as React.CSSProperties
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {!maintenanceMode && <FloatingDock />}

          <div className="fixed top-4 right-4 md:bottom-6 md:right-6 md:top-auto z-50">
            <div className="w-10 h-10 md:w-12 md:h-12">
              <ModeToggle />
            </div>
          </div>

          <SanityLive />

          {googleAnalyticsId && (
            <GoogleAnalytics gaId={googleAnalyticsId} />
          )}

          {(await draftMode()).isEnabled && (
            <>
              <VisualEditing />
              <DisableDraftMode />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}