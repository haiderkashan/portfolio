import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { StarFilledIcon } from '@sanity/icons/StarFilled'

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  icon: StarFilledIcon,
  orderings: [
    orderRankOrdering,
    {
      title: 'Priority (Ascending)',
      name: 'priorityAsc',
      by: [{ field: 'priority', direction: 'asc' }],
    },
  ],
  fields: [
    orderRankField({ type: 'award' }),
    defineField({
      name: 'priority',
      title: 'Priority (Sort Order)',
      type: 'number',
      description:
        'Display priority order: 1 = top/first, 2 = second, etc. Lower numbers appear first. Falls back to manual orderRank if unset.',
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: 'title',
      title: 'Award Title / Honor',
      type: 'string',
      description: 'e.g. "Dean\'s Honor List", "CalHacks 2024", "Awwwards Site of the Day".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'awardType',
      title: 'Recognition / Subtitle / Organization',
      type: 'string',
      description: 'e.g. "6 Consecutive Semesters", "1st Place Overall Winner", "UC Berkeley".',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'MMM YYYY' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'proofPdf',
      title: 'Proof / Certificate (PDF)',
      type: 'file',
      options: {
        accept: '.pdf,application/pdf',
      },
      description: 'Upload a PDF document as proof or certificate for this award.',
    }),
    defineField({
      name: 'proofUrl',
      title: 'Proof Link / Verification URL',
      type: 'url',
      description: 'Optional web link to certificate or verification page (used if no PDF is uploaded).',
    }),
    defineField({
      name: 'image',
      title: 'Badge / Image (Optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      description: 'Optional badge or preview image shown on desktop cursor hover.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'awardType',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || subtitle || 'Award',
        subtitle,
        media,
      }
    },
  },
})
