import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { PresentationIcon } from '@sanity/icons/Presentation'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: PresentationIcon,
  orderings: [
    {
      title: 'Chronological (Newest First)',
      name: 'chronologicalDesc',
      by: [
        { field: 'current', direction: 'desc' },
        { field: 'startDate', direction: 'desc' },
        { field: 'startYear', direction: 'desc' },
      ],
    },
    orderRankOrdering,
  ],
  fields: [
    orderRankField({ type: 'experience' }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. "Senior Software Engineer".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "San Francisco, CA" or "Remote". Optional.',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      description: 'Date used for chronological sorting (newest first).',
      options: { dateFormat: 'YYYY-MM' },
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      description: 'End date. Leave blank if this is a current role.',
      options: { dateFormat: 'YYYY-MM' },
      hidden: ({ parent }) => parent?.current === true,
    }),
    defineField({
      name: 'startYear',
      title: 'Start year / display date',
      type: 'string',
      description: 'Display label, e.g. "Jan 2024" or "2024".',
    }),
    defineField({
      name: 'endYear',
      title: 'End year / display date',
      type: 'string',
      description: 'Display label, e.g. "Aug 2024" or "2024". Leave blank if current role.',
    }),
    defineField({
      name: 'current',
      title: 'Current role',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'What you did / shipped there. Keep it tight — one or two sentences.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Shown in the hover preview — a company logo or workplace photo works well.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'company', subtitle: 'role', media: 'image' },
  },
})