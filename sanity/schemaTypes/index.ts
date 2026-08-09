import { type SchemaTypeDefinition } from 'sanity'

import siteSettings from './siteSettings'
import project from './project'
import education from './education'
import service from './service'
import award from './award'
import post from './post'
import contactSubmission from './contactSubmission'

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  project,
  education,
  service,
  award,
  post,
  contactSubmission,
]
