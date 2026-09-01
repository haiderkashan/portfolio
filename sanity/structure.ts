import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { CogIcon } from '@sanity/icons/Cog'
import { EditIcon } from '@sanity/icons/Edit'
import { EnvelopeIcon } from '@sanity/icons/Envelope'

const HIDDEN_TYPES = new Set([
  'siteSettings',
  'project',
  'experience',
  'education',
  'award',
  'curatedPost',
  'contactSubmission',
])

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.divider(),

      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'experience',
        title: 'Experience',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'education',
        title: 'Education',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'award',
        title: 'Awards',
        S,
        context,
      }),
      S.divider(),

      S.listItem()
        .title('Curated Posts')
        .icon(EditIcon)
        .child(
          S.documentTypeList('curatedPost')
            .title('Curated Posts (Medium)')
            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
        ),
      S.listItem()
        .title('Contact Submissions')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('contactSubmission')
            .title('Contact Submissions')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
        ),

      S.divider(),
      // Anything added to the schema later still shows up automatically.
      ...S.documentTypeListItems().filter(
        (item) => !HIDDEN_TYPES.has(item.getId() ?? '')
      ),
    ])