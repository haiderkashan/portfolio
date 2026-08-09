import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons/Envelope'

export default defineType({
  name: 'contactSubmission',
  title: 'Contact Submission',
  type: 'document',
  icon: EnvelopeIcon,
  // Editors shouldn't hand-write these — they're created by the /api/contact
  // route when someone submits the contact form.
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 5, readOnly: true }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'handled',
      title: 'Handled',
      type: 'boolean',
      description: 'Tick once you\u2019ve replied, so your inbox of submissions stays tidy.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', handled: 'handled' },
    prepare({ title, subtitle, handled }) {
      return {
        title: `${handled ? '✓ ' : ''}${title}`,
        subtitle,
      }
    },
  },
})
