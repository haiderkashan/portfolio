import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { SparklesIcon } from '@sanity/icons/Sparkles'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: SparklesIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'service' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "UI/UX Design".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Specialties',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short bullet list, e.g. "User Experience", "Prototyping".',
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'title', media: 'previewImage' },
  },
})
