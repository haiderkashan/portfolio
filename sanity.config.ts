'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

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
})
