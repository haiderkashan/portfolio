import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { StarFilledIcon } from '@sanity/icons/StarFilled'

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  icon: StarFilledIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'award' }),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Which project this award/recognition is for.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'awardType',
      title: 'Award / recognition',
      type: 'string',
      description: 'e.g. "Site of the Day", "SOTD", "Honorable Mention".',
      initialValue: 'Site of the Day',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'MMM YYYY' },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'project.title', subtitle: 'awardType', media: 'project.thumbnail' },
  },
})
