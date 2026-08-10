import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { PresentationIcon } from '@sanity/icons/Presentation'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: PresentationIcon,
  orderings: [orderRankOrdering],
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
      name: 'startYear',
      title: 'Start year',
      type: 'string',
    }),
    defineField({
      name: 'endYear',
      title: 'End year',
      type: 'string',
      description: 'Leave blank and check "Current role" if ongoing.',
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
    }),
  ],
  preview: {
    select: { title: 'company', subtitle: 'role', media: 'image' },
  },
})