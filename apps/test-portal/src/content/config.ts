import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import { pagesSchema, techItemSchema } from '@shared/types';

const pages = defineCollection({
  loader: file("src/content/pages.json"), 
  schema: ({ image }) => pagesSchema.extend({
    techStack: z.array(
      techItemSchema.extend({
        coverImage: image().optional(),
      })
    )
  })
});

export const collections = { pages };