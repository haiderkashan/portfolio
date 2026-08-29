import { type SchemaTypeDefinition } from 'sanity'

import siteSettings from './siteSettings'
import project from './project'
import experience from './experience'
import education from './education'
import award from './award'
import curatedPost from './curatedPost'
import contactSubmission from './contactSubmission'

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  project,
  experience,
  education,
  award,
  curatedPost,
  contactSubmission,
]