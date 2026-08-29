import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { BookIcon } from '@sanity/icons/Book'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: BookIcon,
  orderings: [orderRankOrdering],
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
      name: 'startYear',
      title: 'Start year',
      type: 'string',
    }),
    defineField({
      name: 'endYear',
      title: 'End year',
      type: 'string',
      description: 'Leave blank and check "Currently studying" if ongoing.',
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
