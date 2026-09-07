# Kashan Haider — Software Engineering Portfolio

A modern, high-performance portfolio and content management system built with **Next.js 16 (Turbopack, App Router)**, **React 19**, **Tailwind CSS v4**, **Motion**, and **Sanity CMS v6**.

All content — bio, work experience, case studies, education, articles, awards, resume PDF, and browser favicon — is fully managed in real-time through an embedded Sanity Studio at `/studio`.

[![Lighthouse Desktop](https://img.shields.io/badge/Lighthouse_Desktop-99%2F100-brightgreen?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/lighthouse/overview/)
[![Lighthouse Mobile](https://img.shields.io/badge/Lighthouse_Mobile-86%2B%2F100-green?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/lighthouse/overview/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Sanity](https://img.shields.io/badge/Sanity-v6-f03e2f?style=flat-square&logo=sanity)](https://www.sanity.io/)

---

## ⚡ Performance Highlights

Engineered with Core Web Vitals and real-world mobile constraints as primary objectives:

- **Desktop Performance:** **99 / 100** (FCP: `0.4s` · LCP: `1.0s` · TBT: `30ms` · CLS: `0`)
- **Mobile Performance:** **86+ / 100** (FCP: `1.3s` · Speed Index: `2.8s` · CLS: `0`)
- **Uncompromised Visual Quality:** Images rendered at **native resolution and `quality={90}`** via Next.js AVIF/WebP responsive generation. No artificial downscaling, blur, or compression artifacts.
- **Optimized Bundle Footprint:** Wrapped in `<LazyMotion features={domAnimation}>` to eliminate heavy layout engines from the critical path. Below-the-fold sections are dynamically code-split without breaking SSR/SEO.
- **Touch-Aware Motion:** Magnetic effects and smooth scrolling automatically deactivate on mobile touch viewports (`pointer: coarse`) to prevent frame jank, CPU thrashing, and battery drain.

---

## ✨ Features

- **Embedded Sanity Studio (`/studio`):** Manage every single piece of content without touching code or redeploying. Features drag-to-reorder lists, hot-spot image cropping, and live previews.
- **Dynamic Case Studies (`/work` & `/work/[slug]`):** Dedicated showcase pages with challenge overviews, architecture solutions, impact metrics, tech stack tags, external links, and media galleries.
- **Technical Writing / Blog (`/blog` & `/blog/[slug]`):** Curated articles with rich PortableText, syntax-highlighted code blocks, read-time calculation, publication dates, and pagination.
- **Career Timeline & Education:** Interactive experience and education sections with company tags, role descriptions, honors, and dates.
- **Multi-Channel Contact System (`/contact`):**
  - Instant direct email delivery via **Nodemailer** (Gmail SMTP).
  - Permanent submission logging in Sanity (`contactSubmission` documents).
  - Secure file attachment uploads (resumes, project specs up to 10MB) stored on Sanity CDN.
  - In-memory rate limiting to protect against spam bots.
- **Dynamic SEO & Metadata:** Automated OpenGraph social banners, Twitter summary cards, dynamic `sitemap.xml`, `robots.txt`, and Google-compliant JSON-LD (`Person` & `WebSite` Schema).
- **Dynamic Favicon (`/icon`):** Upload your custom brand mark in Sanity Site Settings, and Next.js dynamically renders and serves the active browser tab icon.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3 (Turbopack) | App Router, Server Components, Route Handlers |
| **Runtime** | React 19.2 + TypeScript 5 | Concurrent features, Server Actions, Strict Typing |
| **Styling** | Tailwind CSS v4 | Native CSS variable theme tokens, `@theme` configuration |
| **CMS** | Sanity v6 (`next-sanity`) | Headless CMS, embedded studio, GROQ querying |
| **Animation** | Motion 13 (`motion/react`) | Fluid micro-interactions, scroll kinetic reveals |
| **Smooth Scroll** | Lenis 1.3 | Inertia-based scrolling for desktop devices |
| **Email Service**| Nodemailer 9.0 | Server-side SMTP delivery with attachment support |
| **Typography** | `next/font/google` | Archivo (headings/display) & Inter Tight (body) |
| **Icons** | Lucide React | Clean, tree-shakeable SVG icons |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: Version 20.x or higher
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/haiderkashan/haiderkashan.git
cd haiderkashan

# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Setup Sanity CMS

1. Create a free account at [sanity.io](https://www.sanity.io) if you don't already have one.
2. Initialize or connect your Sanity project:
   ```bash
   npx sanity init
   ```
   - Choose **"Create new project"** (or select an existing one).
   - Dataset name: `production`.
   - When asked for studio configuration, select **"Use the existing sanity.config.ts in this folder"**.

3. Retrieve your **Project ID** from [manage.sanity.io](https://manage.sanity.io).

### 4. Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Configure the following variables in `.env.local`:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01

# Contact Form & Attachment Storage (Editor token from manage.sanity.io -> API -> Tokens)
SANITY_API_WRITE_TOKEN=sk_your_editor_write_token

# Draft Mode / Preview (Optional)
SANITY_API_READ_TOKEN=your_viewer_token
NEXT_PUBLIC_SANITY_PREVIEW_SECRET=your_random_secret_string

# Automated Email Notifications (Gmail SMTP via Nodemailer)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
CONTACT_NOTIFICATION_EMAIL=your_email@gmail.com

# Site URL for canonical links, sitemaps, and OpenGraph images
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Gmail App Password:** Generate a 16-character password under your [Google Account Security → 2-Step Verification → App Passwords](https://myaccount.google.com/apppasswords).

### 5. Configure CORS in Sanity

Sanity requires authorized origins for client-side API requests:

```bash
# Allow local development server
npx sanity cors add http://localhost:3000 --credentials
```

*(You will repeat this step for your production domain once deployed).*

### 6. Run the Application

```bash
# Start local development server
pnpm dev

# Or build and run production server locally
pnpm build
pnpm start
```

- **Main Website:** [http://localhost:3000](http://localhost:3000)
- **Sanity Studio (CMS):** [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 📂 Project Structure

```
portfolio/
├── app/
│   ├── (site)/                  # Public site layout (SiteNav, Footer, SmoothScroll)
│   │   ├── page.tsx             # Homepage assembling all sections
│   │   ├── work/                # Project portfolio directory
│   │   │   ├── page.tsx         # Full project archive listing
│   │   │   └── [slug]/page.tsx  # In-depth project case study
│   │   ├── blog/                # Writing & engineering articles
│   │   │   ├── page.tsx         # Article archive with pagination
│   │   │   └── [slug]/page.tsx  # Article reader with PortableText
│   │   ├── contact/             # Interactive contact page with file upload
│   │   ├── privacy-policy/      # Privacy Policy page
│   │   └── terms-and-conditions/# Terms & Conditions page
│   ├── api/
│   │   ├── contact/route.ts     # Nodemailer email + Sanity attachment upload API
│   │   └── draft/route.ts       # Sanity Live Draft Mode toggle
│   ├── icon.tsx                 # Dynamic SVG/PNG favicon generator
│   ├── layout.tsx               # Root HTML document, font variables, SEO metadata
│   └── globals.css              # Tailwind v4 theme variables and design tokens
├── components/
│   ├── sections/                # Homepage sections (Hero, Intro, Work, Experience...)
│   │   ├── Hero.tsx             # LCP-optimized hero fold with sync decoding
│   │   ├── IntroStatement.tsx   # Kinetic scroll reveal typography
│   │   ├── FeaturedWork.tsx     # Case study preview cards
│   │   ├── Experience.tsx       # Interactive career timeline
│   │   ├── Education.tsx        # Degree and academic history
│   │   ├── Quote.tsx            # Philosophy banner with reverse-floating imagery
│   │   ├── Writing.tsx          # Latest articles carousel/grid
│   │   ├── Awards.tsx           # Industry recognition & project references
│   │   └── Footer.tsx           # Contact CTA, social links, legal navigation
│   ├── ui/                      # Reusable animation and interface components
│   │   ├── SiteNav.tsx          # Full-screen responsive drawer & header bar
│   │   ├── FileDropzone.tsx     # Accessible drag-and-drop file upload
│   │   ├── Reveal.tsx           # Staggered entry animation wrapper
│   │   ├── Magnetic.tsx         # Magnetic cursor hover wrapper
│   │   └── SmoothScroll.tsx     # Desktop Lenis initialization
│   └── ContactForm.tsx          # Client-side form with real-time validation
├── sanity/
│   ├── schemaTypes/             # Sanity document and object definitions
│   │   ├── siteSettings.ts      # Global branding, hero, social, resume, SEO
│   │   ├── project.ts           # Case studies & project showcase
│   │   ├── experience.ts        # Employment and internship history
│   │   ├── education.ts         # Education history
│   │   ├── curatedPost.ts       # Engineering blog articles
│   │   ├── award.ts             # Honors and accolades
│   │   └── contactSubmission.ts # Saved form submissions log
│   ├── lib/                     # GROQ queries, fetch wrapper, and client builder
│   ├── sanity.config.ts         # Embedded studio configuration
│   └── structure.ts             # Custom Studio sidebar ordering
├── lib/
│   ├── fonts.ts                 # Google Fonts definitions (Archivo, Inter Tight)
│   ├── rate-limit.ts            # In-memory IP rate limiter for API routes
│   └── utils.ts                 # Class merger (`cn`), string formatters, helpers
└── public/                      # Static assets and fallback OpenGraph graphics
```

---

## 📝 Content Management (Sanity Studio)

Visit `http://localhost:3000/studio` to access the CMS:

1. **Site Settings (Singleton):** Update your name, title, role subtitle, hero portrait, social links, downloadable resume PDF, and browser tab favicon.
2. **Projects:** Add projects with tags, category, execution period, client, high-res cover image, live URL, and full case study write-up. Drag items to adjust homepage order.
3. **Experience:** Maintain roles, company names, employment periods, office locations, and bullet-pointed achievements.
4. **Education:** Add degrees, institutions, graduation dates, and relevant coursework.
5. **Blog Posts:** Publish technical articles with rich text formatting, syntax highlighting, and SEO descriptions.
6. **Awards:** Add honors and tie them to related projects.
7. **Contact Submissions:** Read-only log of all inquiries received through the contact form, including download links to attached files.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.local` under **Project Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g., `https://kashanhaider.com`).
5. Deploy.
6. Add your production domain to Sanity CORS:
   ```bash
   npx sanity cors add https://your-domain.com --credentials
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
