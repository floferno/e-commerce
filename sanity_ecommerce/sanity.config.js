// import { defineConfig } from 'sanity'
import { defineConfig } from 'sanity/lib/exports'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'ecommerce',

  projectId: 'tunsie8m',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
