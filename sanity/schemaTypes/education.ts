import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { BookIcon } from '@sanity/icons/Book'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: BookIcon,
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
    orderRankField({ type: 'education' }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree',
      type: 'string',
      description: 'e.g. "BFA, Graphic Design".',
      validation: (Rule) => Rule.required(),
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
      description: 'End date. Leave blank if currently studying.',
      options: { dateFormat: 'YYYY-MM' },
      hidden: ({ parent }) => parent?.current === true,
    }),
    defineField({
      name: 'startYear',
      title: 'Start year / display date',
      type: 'string',
      description: 'Display label, e.g. "2022".',
    }),
    defineField({
      name: 'endYear',
      title: 'End year / display date',
      type: 'string',
      description: 'Display label, e.g. "2026". Leave blank if currently studying.',
    }),
    defineField({
      name: 'current',
      title: 'Currently studying',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Shown in the hover preview — a campus photo or institution mark works well.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'institution', subtitle: 'degree', media: 'image' },
  },
})
