import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { CaseIcon } from '@sanity/icons/Case'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'links', title: 'Links' },
    { name: 'caseStudy', title: 'Case study page' },
  ],
  fields: [
    orderRankField({ type: 'project' }),
    defineField({
      name: 'title',
      title: 'Project name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'e.g. "2024 — 2025" or just "2025".',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. "Branding", "UI/UX Design", "Web Design".',
      group: 'content',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short punchy line, e.g. "A new era of payment".',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown on the featured-work preview card.',
      group: 'content',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail (small mockup)',
      type: 'image',
      description: 'Small browser-style preview next to the project name.',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image (large preview)',
      type: 'image',
      description: 'The bigger showcase image used on the featured-work card and case study header.',
      group: 'content',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Show on homepage',
      type: 'boolean',
      description: 'Turn off to keep a project in the full archive without it appearing on the homepage list.',
      initialValue: true,
      group: 'content',
    }),

    // Links
    defineField({
      name: 'liveUrl',
      title: 'Live site URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'secondaryLinkLabel',
      title: 'Secondary link label',
      type: 'string',
      description:
        'e.g. "Framer", "GitHub", "Behance". Don\'t use "Case study" here — that button is already shown automatically and links to this project\'s page on your site, so using the same label twice will look like a duplicate.',
      group: 'links',
      initialValue: 'Live demo',
    }),
    defineField({
      name: 'secondaryLinkUrl',
      title: 'Secondary link URL',
      type: 'url',
      group: 'links',
    }),

    // Case study page
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'caseStudy',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe the image for screen readers and SEO. Falls back to the project tagline if left blank.',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Case study body',
      type: 'array',
      group: 'caseStudy',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'thumbnail' },
  },
})
