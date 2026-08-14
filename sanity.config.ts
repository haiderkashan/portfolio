'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, previewSecret, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const PREVIEWABLE_TYPES: Record<string, 'project' | 'post'> = {
  project: 'project',
  post: 'post',
}

export default defineConfig({
  basePath: '/studio',
  name: 'portfolio-studio',
  title: 'Portfolio Studio',

  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({ structure }),
    // Lets editors run raw GROQ queries from the Studio — handy for
    // sanity-checking content while the frontend is being built.
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  document: {
    // Adds a "Preview" button in the document editor's dropdown, which
    // opens /api/draft?... on the live site. Only wired up for document
    // types that actually have a public page (projects, posts, and the
    // singleton site settings for the homepage). Falls back to whatever
    // Sanity would show by default (nothing) if the secret isn't set yet.
    productionUrl: async (prev, context) => {
      if (!previewSecret) return prev

      const { document } = context
      const siteUrl =
        typeof window !== 'undefined' && window.location.origin.includes('localhost')
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

      if (document._type === 'siteSettings') {
        return `${siteUrl}/api/draft?secret=${previewSecret}&type=home`
      }

      const type = PREVIEWABLE_TYPES[document._type]
      const slug = (document as { slug?: { current?: string } }).slug?.current
      if (!type || !slug) return prev

      return `${siteUrl}/api/draft?secret=${previewSecret}&type=${type}&slug=${slug}`
    },
  },
})
