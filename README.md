# Portfolio

A one-page animated portfolio (Next.js 16 + Tailwind v4 + Motion + Lenis) with
every piece of content — name, bio, links, projects, education, services,
awards, blog posts, and even the favicon — served from an embedded Sanity
Studio at `/studio`. Upload as many projects, education entries, services,
or blog posts as you like; the Studio has drag-to-reorder lists for
everything repeatable.

## 1. Install dependencies

```bash
npm install
```

Requires Node 20+.

## 2. Create your free Sanity project

You need a [sanity.io](https://www.sanity.io) account (free tier is plenty).
From the project folder, run:

```bash
npx sanity init
```

- Log in (or create an account) when prompted.
- Choose **"Create new project"**.
- Name it anything you like.
- Use the **default dataset name `production`**.
- When asked to link to a studio config, choose **"Use the existing
  sanity.config.ts in this folder"** (this project already has one) —
  do **not** let it scaffold a new/separate studio folder.

When it finishes, the CLI prints a **Project ID**. Copy it.

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste in your project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Enable the contact form (optional but recommended)

The contact form saves messages straight into Sanity as
`Contact Submission` documents (no third-party email service needed).
To enable it:

1. Go to [manage.sanity.io](https://manage.sanity.io) → your project → **API** → **Tokens**.
2. Click **Add API token**, name it `write-token`, and give it **Editor** permissions.
3. Copy the token into `.env.local`:

```
SANITY_API_WRITE_TOKEN=sk_your_token_here
```

Until this is set, the rest of the site works fine — only the contact
form will show a friendly error asking people to email you directly.

## 4. Allow your dev server to talk to Sanity (CORS)

Sanity blocks browser requests from origins it doesn't know about.

```bash
npx sanity cors add http://localhost:3000 --credentials
```

(Repeat this with your production URL once you deploy — see step 7.)

## 5. Run it

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Studio (content editor): [http://localhost:3000/studio](http://localhost:3000/studio)

The site renders immediately with sensible placeholder copy even before
you've added anything in the Studio — nothing crashes on an empty dataset.

## 6. Add your content

Open `/studio` and you'll see, top to bottom:

- **Site Settings** (singleton) — your name, handle, bio, hero/about/process/
  footer images, stats, process steps, social links, resume PDF, favicon, SEO.
- **Projects** — click **New**, drag the ⠿ handle in the list to reorder.
  Turn off "Show on homepage" to keep a project in the archive without it
  appearing in the featured list.
- **Education**, **Services**, **Awards** — same drag-to-reorder pattern.
  Awards reference a Project, so add your projects first.
- **Blog Posts** — standard title/body posts, sorted by publish date.
- **Contact Submissions** — read-only log filled in by the contact form.

Every image field has a hotspot editor (drag the circle to control cropping),
and the **Favicon** field under Site Settings → SEO & Favicon controls the
actual browser tab icon — no code changes needed for any of this.

## 7. Deploy

This is a standard Next.js app, so it deploys anywhere Next.js does —
[Vercel](https://vercel.com/new) is the path of least resistance:

1. Push this folder to a GitHub repo and import it in Vercel (or run `vercel`
   from the CLI).
2. Add the same environment variables from `.env.local` in the Vercel
   project's **Settings → Environment Variables**, plus set
   `NEXT_PUBLIC_SITE_URL` to your real domain.
3. Once deployed, run `npx sanity cors add https://your-domain.com --credentials`
   so the live Studio can save data from your production URL too.
4. Your Studio ships at `https://your-domain.com/studio` — you can invite
   collaborators to it from manage.sanity.io without giving them code access.

## Project structure

```
app/
  (site)/            The public site (shares nav, smooth scroll, footer)
    page.tsx          Homepage — assembles every section
    work/[slug]/       Project case study pages
    blog/, blog/[slug]/  Blog listing + post pages
    contact/           Contact page + form
  studio/[[...tool]]/ Embedded Sanity Studio (/studio)
  api/contact/        Saves contact form submissions to Sanity
  icon.tsx            Dynamic favicon, sourced from Sanity
sanity/
  schemaTypes/        Every content model
  lib/                Client, image URL builder, GROQ queries, resilient fetch
  structure.ts         Studio's left-hand navigation
components/
  sections/            One file per homepage section (Hero, Stats, Awards...)
  ui/                  Animation primitives (Reveal, Marquee, Magnetic, ...)
```

## Customizing the look

Colors, fonts, and spacing tokens all live in `app/globals.css` under the
`@theme` block — change `--color-accent` for a different brand color, or
swap the font imports at the top of the file for a different typeface
(anything on [Fontsource](https://fontsource.org) drops in as a straight
`npm install` + import swap, no external font CDN required).

## Notes

- Animations use [Motion](https://motion.dev) for scroll reveals, the
  staggered lists, and the hero's intro sequence, plus
  [Lenis](https://lenis.dev) for the smooth-scroll feel — both respect
  `prefers-reduced-motion` automatically.
- Images are served through Next.js's image optimizer directly from
  Sanity's CDN — no need to re-upload images anywhere else.
- The placeholder name, bio, and photography referenced anywhere in this
  starter are generic stand-ins, not the design's original reference
  content — replace them from the Studio whenever you're ready.
