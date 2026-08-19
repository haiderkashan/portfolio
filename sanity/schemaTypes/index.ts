import { type SchemaTypeDefinition } from 'sanity'

import siteSettings from './siteSettings'
import project from './project'
import experience from './experience'
import education from './education'
import service from './service'
import award from './award'
import post from './post'
import curatedPost from './curatedPost'
import contactSubmission from './contactSubmission'

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  project,
  experience,
  education,
  service,
  award,
  post,
  curatedPost,
  contactSubmission,
]