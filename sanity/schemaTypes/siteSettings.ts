import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro / Stats' },
    { name: 'process', title: 'Process' },
    { name: 'statement', title: 'Statement' },
    { name: 'footer', title: 'Footer' },
    { name: 'seo', title: 'SEO & Favicon' },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      description: 'Shown everywhere your name appears in full.',
      group: 'identity',
      validation: (Rule) => Rule.required(),
      initialValue: 'Your Name',
    }),
    defineField({
      name: 'handle',
      title: 'Brand handle',
      type: 'string',
      description:
        'Short version used for the big "/HANDLE/" wordmarks, e.g. "yourname". No spaces or slashes needed — those are added automatically.',
      group: 'identity',
      validation: (Rule) => Rule.required(),
      initialValue: 'yourname',
    }),
    defineField({
      name: 'role',
      title: 'Role / tagline',
      type: 'string',
      description: 'Short line under the hero name, e.g. "Product & Visual Designer".',
      group: 'identity',
      initialValue: 'Product & Visual Designer',
    }),
    defineField({
      name: 'locationTag',
      title: 'Location tag',
      type: 'string',
      description: 'Shown top-right as "/ {this}". e.g. "Based in California".',
      group: 'identity',
      initialValue: 'Based in your city',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      group: 'identity',
      validation: (Rule) =>
        Rule.required().regex(/^\S+@\S+\.\S+$/, { name: 'email' }),
      initialValue: 'you@example.com',
    }),
    defineField({
      name: 'resume',
      title: 'Resume / CV (PDF)',
      type: 'file',
      description: 'Optional. If set, a "Download resume" link appears on the Contact page.',
      group: 'identity',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'identity',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),

    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      description: 'The full-bleed image behind your name on load.',
      group: 'hero',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Primary CTA label',
      type: 'string',
      group: 'hero',
      initialValue: 'Talk with me',
    }),

    // ── Intro / Stats ─────────────────────────────────────────
    defineField({
      name: 'introHeadline',
      title: 'Intro headline',
      type: 'string',
      description: 'The big statement under the hero, e.g. "California based designer, love skate & photography".',
      group: 'intro',
      initialValue: 'A designer who loves the craft, the outdoors & the details',
    }),
    defineField({
      name: 'introImage',
      title: 'Intro inline image',
      type: 'image',
      description: 'Small portrait shown inline inside the intro headline.',
      group: 'intro',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Your short bio. Reused in the intro card and the stats section.',
      group: 'intro',
      initialValue:
        'Passion for branding, UI/UX, and visual storytelling. I strive to create designs that are not only visually appealing but also meaningful and user-centered.',
    }),
    defineField({
      name: 'aboutBio',
      title: 'About Bio',
      type: 'text',
      rows: 5,
      description: 'longer version for the Stats section',
      group: 'intro',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'intro',
      description: 'The animated counter list, e.g. "40+ / Projects shipped".',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Description', type: 'text', rows: 2, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // ── Process ───────────────────────────────────────────────
    defineField({
      name: 'processImage',
      title: 'Process portrait',
      type: 'image',
      group: 'process',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'processIntro',
      title: 'Process intro line',
      type: 'text',
      rows: 3,
      group: 'process',
      initialValue:
        'No fluff, just results. Thoughtful design and tools that make your work easier.',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process steps',
      type: 'array',
      group: 'process',
      description: 'Also powers the scrolling marquee text above this section.',
      of: [
        {
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
      validation: (Rule) => Rule.min(2),
    }),

    // ── Statement ─────────────────────────────────────────────
    defineField({
      name: 'statement',
      title: 'Statement / quote',
      type: 'text',
      rows: 3,
      group: 'statement',
      description: 'The big centered quote near the end of the page.',
      initialValue:
        'Independent designer helping individuals and brands bring their ideas to life through thoughtful design.',
    }),

    // ── Footer ────────────────────────────────────────────────
    defineField({
      name: 'footerImage',
      title: 'Footer image',
      type: 'image',
      group: 'footer',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'footerHeadline',
      title: 'Footer headline',
      type: 'string',
      group: 'footer',
      initialValue: "Let's do great things!",
    }),

    // ── SEO & Favicon ─────────────────────────────────────────
    defineField({
      name: 'siteTitle',
      title: 'Site meta title',
      type: 'string',
      description: 'Default title for search engines and social sharing (e.g. "Kashan Haider — Software Engineer & Designer").',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO description',
      type: 'text',
      rows: 3,
      description: 'Default meta description for search engines across the site.',
      group: 'seo',
    }),
    defineField({
      name: 'workSeoDescription',
      title: 'Work archive SEO description',
      type: 'text',
      rows: 2,
      description: 'Meta description for the /work archive page.',
      group: 'seo',
    }),
    defineField({
      name: 'blogSeoDescription',
      title: 'Writing / Blog SEO description',
      type: 'text',
      rows: 2,
      description: 'Meta description for the /blog archive page.',
      group: 'seo',
    }),
    defineField({
      name: 'contactSeoDescription',
      title: 'Contact page SEO description',
      type: 'text',
      rows: 2,
      description: 'Meta description for the /contact page.',
      group: 'seo',
    }),
    defineField({
      name: 'knowsAbout',
      title: 'Skills & Specialties (JSON-LD knowsAbout)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords and skills for Google Knowledge Graph structured data (e.g. Next.js, Distributed Systems, UI/UX Design).',
      group: 'seo',
    }),
    defineField({
      name: 'alumniOf',
      title: 'Alumni of (JSON-LD alumniOf)',
      type: 'string',
      description: 'Educational institution for Google Knowledge Graph (e.g. UC Berkeley).',
      group: 'seo',
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter / X Handle',
      type: 'string',
      description: 'Your Twitter/X handle for Twitter Cards (e.g. @yourname or yourname).',
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image (Default OpenGraph)',
      type: 'image',
      description: 'Default 1200×630 image displayed when pages on this site are shared on social media.',
      group: 'seo',
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Square image, ideally 512×512 PNG or SVG. Used as the browser tab icon.',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
